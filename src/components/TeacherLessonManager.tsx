import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Languages,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Video,
  X
} from 'lucide-react'
import { useContentStore, type ContentItem } from '../store/useContentStore'
import { useAuthStore } from '../store/useAuthStore'
import { translateToAll } from '../utils/translate'

interface TeacherLessonManagerProps {
  onAddTestForTopic: (topicId: number) => void
  initialOpenCreateWithTopicId?: number | null
  onClearInitialTopic?: () => void
}

// Convert normal YouTube URL into embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
  } catch {
    return null
  }
  return null
}

export default function TeacherLessonManager({
  onAddTestForTopic,
  initialOpenCreateWithTopicId,
  onClearInitialTopic,
}: TeacherLessonManagerProps) {
  const { items, courses, createContentItem, updateContentItem, deleteContentItem } =
    useContentStore()
  const { user } = useAuthStore()

  // Lessons are content_items with content_type === 'material'
  const lessons = useMemo(
    () => items.filter((item) => item.content_type === 'material'),
    [items]
  )

  const [search, setSearch] = useState('')
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all')

  // Modal states
  const [modalOpen, setModalOpen] = useState(Boolean(initialOpenCreateWithTopicId))
  const [editingLesson, setEditingLesson] = useState<ContentItem | null>(null)
  const [previewLesson, setPreviewLesson] = useState<ContentItem | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [topicId, setTopicId] = useState<number>(
    initialOpenCreateWithTopicId || courses[0]?.numericId || 1
  )
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [resourceLink, setResourceLink] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number>(20)
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [autoTranslate, setAutoTranslate] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const openCreateModal = (preselectedId?: number) => {
    setEditingLesson(null)
    setTitle('')
    setTopicId(preselectedId ?? courses[0]?.numericId ?? 1)
    setDescription('')
    setBody('')
    setVideoUrl('')
    setResourceLink('')
    setDurationMinutes(20)
    setStatus('published')
    setError(null)
    setModalOpen(true)
  }

  const openEditModal = (lesson: ContentItem) => {
    setEditingLesson(lesson)
    setTitle(lesson.title)
    setTopicId(lesson.topic_id || courses[0]?.numericId || 1)
    setDescription(lesson.description || '')
    setBody(lesson.body || '')
    setVideoUrl(lesson.practice?.videoUrl || '')
    setResourceLink(lesson.practice?.resources?.[0] || '')
    setDurationMinutes(lesson.practice?.durationMinutes || 20)
    setStatus(lesson.status || 'published')
    setError(null)
    setModalOpen(true)
  }

  const handleSaveLesson = async () => {
    if (!title.trim()) {
      setError('Dars sarlavhasini kiriting.')
      return
    }

    if (!body.trim() && !description.trim()) {
      setError("Dars ma'ruzasi matnini kiriting.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const selectedCourse = courses.find((c) => c.numericId === topicId)
      const courseTitle =
        typeof selectedCourse?.title === 'object'
          ? selectedCourse.title.uz
          : selectedCourse?.title || "Umumiy o'quv dasturi"

      const payload = {
        content_type: 'material' as const,
        title,
        description: description || body.slice(0, 150) + '...',
        body,
        topic_id: topicId,
        practice: {
          courseTitle,
          courseId: selectedCourse?.id,
          videoUrl: videoUrl.trim() || undefined,
          durationMinutes,
          resources: resourceLink.trim() ? [resourceLink.trim()] : [],
        },
        status,
        created_by: user?.id || null,
      }

      let res
      if (editingLesson) {
        res = await updateContentItem(editingLesson.id, payload)
      } else {
        res = await createContentItem(payload)
      }

      if (!res.success) {
        throw new Error(res.error || 'Saqlashda xatolik yuz berdi.')
      }

      setSuccess('Dars muvaffaqiyatli saqlandi!')
      setTimeout(() => {
        setSuccess(null)
        setModalOpen(false)
        if (onClearInitialTopic) onClearInitialTopic()
      }, 700)
    } catch (e: any) {
      setError(e?.message || 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLesson = async (id: string, lessonTitle: string) => {
    if (confirm(`"${lessonTitle}" darsini o'chirishga ishonchingiz komilmi?`)) {
      await deleteContentItem(id)
    }
  }

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase()) ||
        l.body?.toLowerCase().includes(search.toLowerCase())

      const matchesCourse =
        selectedCourseFilter === 'all' || l.topic_id === Number(selectedCourseFilter)

      return matchesSearch && matchesCourse
    })
  }, [lessons, search, selectedCourseFilter])

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="text-cyan-400" size={22} />
            Darslar va O'quv Materiallari ({lessons.length})
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Ma'ruzalar, nazariy materiallar, video darsliklar va topshiriqlarni boshqarish.
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs"
        >
          <Plus size={16} /> Yangi Dars Qo'shish
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dars sarlavhasi yoki matni..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-white/50 text-xs font-bold shrink-0">Kurs:</label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 w-full sm:w-auto"
          >
            <option value="all">Barcha kurslar</option>
            {courses.map((c) => (
              <option key={c.id} value={c.numericId || 1}>
                {c.icon} {typeof c.title === 'object' ? c.title.uz : c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="glass-panel p-12 text-center border-white/5 space-y-3">
          <BookOpen size={40} className="text-white/20 mx-auto" />
          <h3 className="text-white font-bold text-sm">Hozircha darslar topilmadi</h3>
          <p className="text-white/40 text-xs max-w-sm mx-auto">
            Ushbu kurs bo'yicha hali dars qo'shilmagan. Yangi dars qo'shish tugmasini bosib birinchi
            darsni yarating.
          </p>
          <button
            onClick={() => openCreateModal()}
            className="btn-primary text-xs py-2 px-4 mt-2 inline-flex items-center gap-2"
          >
            <Plus size={14} /> Birinchi Darsni Qo'shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLessons.map((lesson, idx) => {
            const course = courses.find((c) => c.numericId === lesson.topic_id)
            const courseTitle =
              typeof course?.title === 'object'
                ? course.title.uz
                : course?.title || lesson.practice?.courseTitle || 'Kurs'
            const hasVideo = Boolean(lesson.practice?.videoUrl)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="glass-panel p-5 border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 truncate max-w-[180px]">
                      {course?.icon || '📚'} {courseTitle}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        lesson.status === 'published'
                          ? 'bg-green-500/10 text-green-300'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {lesson.status === 'published' ? 'Nashr' : 'Qoralama'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {lesson.title}
                  </h3>

                  <p className="text-white/45 text-xs line-clamp-3 leading-relaxed mb-4">
                    {lesson.description || lesson.body}
                  </p>
                </div>

                {/* Footer and Actions */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      {lesson.practice?.durationMinutes || 20} daqiqa
                    </span>

                    {hasVideo && (
                      <span className="flex items-center gap-1 text-red-400 font-bold">
                        <Video size={12} /> Video dars
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setPreviewLesson(lesson)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Eye size={13} /> Ko'rish
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* CREATE / EDIT LESSON MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 sm:p-8 max-w-2xl w-full border-white/10 space-y-6 relative my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {editingLesson ? 'Darsni Tahrirlash' : 'Yangi Dars Qo‘shish'}
                    </h3>
                    <p className="text-white/40 text-xs">
                      Ma'ruza matni, video va qo'shimcha resurslarni kiriting
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs">
                  {success}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* Title */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Dars Mavzusi (Sarlavha) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Raqamli ta'limda interaktiv metodikalar"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Course selector & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                      Qaysi Kursga Tegishli?
                    </label>
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.numericId || 1}>
                          {course.icon}{' '}
                          {typeof course.title === 'object' ? course.title.uz : course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <Clock size={12} /> O'qish Vaqti (Daqiqada)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Qisqa Tavsif / Annotatsiya
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ushbu dars nima haqida qisqacha..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Video size={13} className="text-red-400" /> Video Darslik Havolasi (YouTube /
                    Video URL)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {getYouTubeEmbedUrl(videoUrl) && (
                    <div className="mt-2 rounded-xl overflow-hidden aspect-video max-h-40 border border-white/10">
                      <iframe
                        src={getYouTubeEmbedUrl(videoUrl)!}
                        className="w-full h-full"
                        title="Video preview"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                {/* Main Theory / Lecture Notes */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Nazariy Ma'ruza Matni <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Darsning to'liq ma'ruza matnini yozing. Paragraflar orasida bitta bo'sh qator qoldiring..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Resource / External Link */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <ExternalLink size={13} className="text-cyan-400" /> Qo'shimcha Resurs / Material
                    Havolasi (Ixtiyoriy)
                  </label>
                  <input
                    type="url"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    placeholder="Masalan: Google Drive yoki kitob havolasi..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Status toggle */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === 'published'}
                      onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                      className="w-4 h-4 accent-green-400 rounded"
                    />
                    <span className="text-xs text-white/70 font-semibold">
                      {status === 'published' ? '🟢 Darhol nashr qilish' : '⚪ Qoralama saqlash'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-cyber text-xs py-2 px-4"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveLesson}
                  className="btn-primary text-xs py-2 px-6 flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
                >
                  {saving ? (
                    'Saqlanmoqda...'
                  ) : (
                    <>
                      <Check size={14} /> Darsni Saqlash
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LESSON PREVIEW MODAL */}
      <AnimatePresence>
        {previewLesson && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-panel p-6 sm:p-10 max-w-3xl w-full border-white/10 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                    Dars Ko'rinishi
                  </span>
                  <h1 className="text-2xl font-black text-white mt-2 leading-tight">
                    {previewLesson.title}
                  </h1>
                  {previewLesson.description && (
                    <p className="text-white/50 text-xs mt-1">{previewLesson.description}</p>
                  )}
                </div>

                <button
                  onClick={() => setPreviewLesson(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player if present */}
              {previewLesson.practice?.videoUrl &&
                getYouTubeEmbedUrl(previewLesson.practice.videoUrl) && (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(previewLesson.practice.videoUrl)!}
                      className="w-full h-full"
                      title={previewLesson.title}
                      allowFullScreen
                    />
                  </div>
                )}

              {/* Lecture Theory */}
              <div className="prose prose-invert max-w-none text-white/80 space-y-4 text-sm leading-relaxed">
                {(previewLesson.body || previewLesson.description)
                  .split('\n')
                  .filter((p) => p.trim())
                  .map((paragraph, i) => (
                    <p key={i} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Resources if present */}
              {previewLesson.practice?.resources &&
                previewLesson.practice.resources.length > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLink size={13} className="text-cyan-400" /> Qo'shimcha Resurslar
                    </h4>
                    {previewLesson.practice.resources.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 underline"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}

              {/* Close & Test button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button onClick={() => setPreviewLesson(null)} className="btn-cyber text-xs py-2 px-4">
                  Yopish
                </button>

                <button
                  onClick={() => {
                    const tid = previewLesson.topic_id || 1
                    setPreviewLesson(null)
                    onAddTestForTopic(tid)
                  }}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
                >
                  <Plus size={14} /> Ushbu Darsga Test Qo'shish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
