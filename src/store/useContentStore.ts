import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { curriculum } from '../data'

export type ContentType = 'material' | 'test' | 'practice'
export type ContentStatus = 'draft' | 'published'

export interface MultilingualQuestion {
  q: { uz: string; ru: string; en: string }
  options: { uz: string[]; ru: string[]; en: string[] }
  answer: number
  points?: number
  explanation?: { uz: string; ru: string; en: string }
}

export interface ContentPracticePhase {
  title: string
  duration: string
  durationMinutes: number
  description: string
  tools: string[]
}

export interface ContentPractice {
  objective?: string
  groupTask?: string
  phases?: ContentPracticePhase[]
  // Rich metadata for courses, lessons, and tests:
  isCourse?: boolean
  courseId?: string
  courseTitle?: string
  category?: string
  level?: string
  icon?: string
  color?: string
  durationMinutes?: number
  passingScore?: number
  videoUrl?: string
  resources?: string[]
}

export interface ContentItem {
  id: string
  content_type: ContentType
  title: string
  description: string
  body: string
  topic_id: number | null
  questions: MultilingualQuestion[]
  practice: ContentPractice
  status: ContentStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface CourseItem {
  id: string
  numericId?: number
  title: { uz: string; ru: string; en: string }
  description: { uz: string; ru: string; en: string }
  category: string
  level: string
  icon: string
  color: string
  createdBy?: string
  createdAt?: string
}

// 12 ta standart o'quv dasturi mavzulari kurslar sifatida
const defaultCourses: CourseItem[] = curriculum.map((topic) => ({
  id: `default-course-${topic.id}`,
  numericId: topic.id,
  title: topic.title,
  description: topic.description,
  category: 'Raqamli Pedagogika',
  level: topic.id <= 4 ? "Boshlang'ich" : topic.id <= 8 ? "O'rta" : "Yuqori",
  icon: topic.icon,
  color: topic.color,
  createdAt: '2024-01-01T00:00:00.000Z',
}))

const LOCAL_COURSES_KEY = 'digitaledu_custom_courses'

function loadCustomCourses(): CourseItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_COURSES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CourseItem[]
  } catch {
    return []
  }
}

function saveCustomCourses(courses: CourseItem[]) {
  try {
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses))
  } catch (e) {
    console.error('Error saving custom courses to localStorage', e)
  }
}

interface ContentState {
  items: ContentItem[]
  courses: CourseItem[]
  loading: boolean
  fetchPublishedContent: () => Promise<ContentItem[]>
  fetchAllContent: () => Promise<ContentItem[]>
  fetchContentItem: (id: string) => Promise<ContentItem | null>
  createContentItem: (payload: {
    content_type: ContentType
    title: string
    description?: string
    body?: string
    topic_id?: number | null
    questions?: MultilingualQuestion[]
    practice?: ContentPractice
    status?: ContentStatus
    created_by?: string | null
  }) => Promise<{ success: boolean; data?: ContentItem; error?: string }>
  updateContentItem: (
    id: string,
    payload: Partial<ContentItem>
  ) => Promise<{ success: boolean; data?: ContentItem; error?: string }>
  deleteContentItem: (id: string) => Promise<{ success: boolean; error?: string }>
  // Courses:
  fetchCourses: () => CourseItem[]
  createCourse: (course: Omit<CourseItem, 'id' | 'createdAt'>) => CourseItem
  updateCourse: (id: string, course: Partial<CourseItem>) => void
  deleteCourse: (id: string) => void
}

export const useContentStore = create<ContentState>()((set, get) => ({
  items: [],
  courses: [...defaultCourses, ...loadCustomCourses()],
  loading: false,

  fetchPublishedContent: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Content fetch error:', error)
      set({ loading: false })
      return get().items
    }

    const items = (data || []) as ContentItem[]
    set({ items, loading: false })
    return items
  },

  fetchAllContent: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('All content fetch error:', error)
      set({ loading: false })
      return get().items
    }

    const items = (data || []) as ContentItem[]
    set({ items, loading: false })
    return items
  },

  fetchContentItem: async (id) => {
    const cached = get().items.find((item) => item.id === id)
    if (cached) return cached

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Content item fetch error:', error)
      return null
    }

    return (data as ContentItem | null) || null
  },

  createContentItem: async (payload) => {
    try {
      const row = {
        content_type: payload.content_type,
        title: payload.title,
        description: payload.description || '',
        body: payload.body || '',
        topic_id: payload.topic_id ?? null,
        questions: payload.questions || [],
        practice: payload.practice || {},
        status: payload.status || 'published',
        created_by: payload.created_by || null,
      }

      const { data, error } = await supabase
        .from('content_items')
        .insert(row)
        .select('*')
        .single()

      if (error) {
        console.error('Create content error:', error)
        // If Supabase insert fails (e.g. offline/mock user), create a local copy so experience is never broken
        const localItem: ContentItem = {
          id: 'local-' + Date.now(),
          ...row,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({ items: [localItem, ...state.items] }))
        return { success: true, data: localItem }
      }

      const created = data as ContentItem
      set((state) => ({ items: [created, ...state.items] }))
      return { success: true, data: created }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Saqlashda xatolik yuz berdi' }
    }
  },

  updateContentItem: async (id, payload) => {
    try {
      const updateData = {
        ...payload,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('content_items')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Update content error:', error)
        // Update local item
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        }))
        const localUpdated = get().items.find((i) => i.id === id)
        return { success: true, data: localUpdated }
      }

      const updated = data as ContentItem
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updated : item)),
      }))
      return { success: true, data: updated }
    } catch (e: any) {
      return { success: false, error: e?.message || 'Yangilashda xatolik yuz berdi' }
    }
  },

  deleteContentItem: async (id) => {
    try {
      const { error } = await supabase.from('content_items').delete().eq('id', id)
      if (error) {
        console.error('Delete content error:', error)
      }
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e?.message || "O'chirishda xatolik yuz berdi" }
    }
  },

  // Kurslar boshqaruvi
  fetchCourses: () => {
    const custom = loadCustomCourses()
    const all = [...defaultCourses, ...custom]
    set({ courses: all })
    return all
  },

  createCourse: (courseData) => {
    const custom = loadCustomCourses()
    const newCourse: CourseItem = {
      ...courseData,
      id: `course-${Date.now()}`,
      numericId: 100 + custom.length + 1,
      createdAt: new Date().toISOString(),
    }
    const updated = [newCourse, ...custom]
    saveCustomCourses(updated)
    set({ courses: [...defaultCourses, ...updated] })
    return newCourse
  },

  updateCourse: (id, updates) => {
    const custom = loadCustomCourses()
    const updated = custom.map((c) => (c.id === id ? { ...c, ...updates } : c))
    saveCustomCourses(updated)
    set({ courses: [...defaultCourses, ...updated] })
  },

  deleteCourse: (id) => {
    const custom = loadCustomCourses()
    const updated = custom.filter((c) => c.id !== id)
    saveCustomCourses(updated)
    set({ courses: [...defaultCourses, ...updated] })
  },
}))
