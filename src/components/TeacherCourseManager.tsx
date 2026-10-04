import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Check,
  ClipboardList,
  Edit2,
  FilePlus,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react'
import { useContentStore, type CourseItem, type ContentItem } from '../store/useContentStore'
import { useAuthStore } from '../store/useAuthStore'
import { translateToAll } from '../utils/translate'

interface TeacherCourseManagerProps {
  onAddLessonToCourse: (numericId: number) => void
  onAddTestToCourse: (numericId: number) => void
}

const AVAILABLE_ICONS = ['🚀', '💻', '🎓', '🧠', '💡', '🌐', '📊', '⚡', '📖', '🔬', '🎯', '🎨', '🤖', '📱', '🛠️', '🏆']

const AVAILABLE_COLORS = [
  '#00f0ff', // Cyan
  '#a855f7', // Purple
  '#22c55e', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
]

const COURSE_CATEGORIES = [
  'Raqamli Pedagogika',
  'Axborot Texnologiyalari',
  'Taʼlimda Sunʼiy Intellekt',
  'Zamonaviy Metodika',
  'Boshlangʻich Taʼlim',
  'Gumanitar Fanlar',
  'Aniq Fanlar',
]

const COURSE_LEVELS = ["Boshlang'ich", "O'rta", 'Yuqori']

export default function TeacherCourseManager({
  onAddLessonToCourse,
  onAddTestToCourse,
}: TeacherCourseManagerProps) {
  const { courses, items, createCourse, updateCourse, deleteCourse } = useContentStore()
  const { user } = useAuthStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null)

  // Form State
  const [titleUz, setTitleUz] = useState('')
  const [descriptionUz, setDescriptionUz] = useState('')
  const [category, setCategory] = useState(COURSE_CATEGORIES[0])
  const [level, setLevel] = useState(COURSE_LEVELS[0])
  const [icon, setIcon] = useState(AVAILABLE_ICONS[0])
  const [color, setColor] = useState(AVAILABLE_COLORS[0])
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingCourse(null)
    setTitleUz('')
    setDescriptionUz('')
    setCategory(COURSE_CATEGORIES[0])
    setLevel(COURSE_LEVELS[0])
    setIcon(AVAILABLE_ICONS[0])
    setColor(AVAILABLE_COLORS[0])
    setError(null)
    setModalOpen(true)
  }

  const openEditModal = (course: CourseItem) => {
    setEditingCourse(course)
    setTitleUz(typeof course.title === 'object' ? course.title.uz : course.title)
    setDescriptionUz(
      typeof course.description === 'object' ? course.description.uz : course.description
    )
    setCategory(course.category || COURSE_CATEGORIES[0])
    setLevel(course.level || COURSE_LEVELS[0])
    setIcon(course.icon || AVAILABLE_ICONS[0])
    setColor(course.color || AVAILABLE_COLORS[0])
    setError(null)
    setModalOpen(true)
  }

  const handleSaveCourse = async () => {
    if (!titleUz.trim()) {
      setError('Kurs sarlavhasini kiriting.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      let finalTitle: { uz: string; ru: string; en: string }
      let finalDesc: { uz: string; ru: string; en: string }

      if (autoTranslate) {
        finalTitle = await translateToAll(titleUz, 'uz')
        finalDesc = await translateToAll(descriptionUz || titleUz, 'uz')
      } else {
        finalTitle = { uz: titleUz, ru: titleUz, en: titleUz }
        finalDesc = { uz: descriptionUz, ru: descriptionUz, en: descriptionUz }
      }

      if (editingCourse) {
        updateCourse(editingCourse.id, {
          title: finalTitle,
          description: finalDesc,
          category,
          level,
          icon,
          color,
        })
      } else {
        createCourse({
          title: finalTitle,
          description: finalDesc,
          category,
          level,
          icon,
          color,
          createdBy: user?.id,
        })
      }

      setModalOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Saqlashda xatolik yuz berdi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCourse = (courseId: string, title: string) => {
    if (confirm(`"${title}" kursini o'chirishga ishonchingiz komilmi?`)) {
      deleteCourse(courseId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={22} />
            Kurslar va O'quv Modullari ({courses.length})
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Barcha fanlar, modullar va o'qituvchi tomonidan yaratilgan yangi kurslar ro'yxati.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs"
        >
          <Plus size={16} /> Yangi Kurs Yaratish
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course, idx) => {
          const isDefault = course.id.startsWith('default-course-')
          const courseLessons = items.filter(
            (item) => item.content_type === 'material' && item.topic_id === course.numericId
          )
          const courseTests = items.filter(
            (item) => item.content_type === 'test' && item.topic_id === course.numericId
          )
          const titleStr = typeof course.title === 'object' ? course.title.uz : course.title
          const descStr =
            typeof course.description === 'object' ? course.description.uz : course.description

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="glass-panel p-5 border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Background ambient glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-25"
                style={{ backgroundColor: course.color }}
              />

              <div>
                {/* Header row with icon, badge, actions */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${course.color}25, ${course.color}05)`,
                      border: `1px solid ${course.color}40`,
                    }}
                  >
                    <span>{course.icon}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70">
                      {course.level}
                    </span>

                    {!isDefault && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, titleStr)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Category */}
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block mb-1">
                  {course.category}
                </span>

                {/* Title & Desc */}
                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {titleStr}
                </h3>
                <p className="text-white/45 text-xs line-clamp-2 leading-relaxed mb-4">
                  {descStr}
                </p>
              </div>

              {/* Bottom stats and quick add buttons */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-cyan-400" />
                    {isDefault ? '12+ dars' : `${courseLessons.length} dars`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClipboardList size={13} className="text-purple-400" />
                    {isDefault ? '36+ test' : `${courseTests.length} test`}
                  </span>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onAddLessonToCourse(course.numericId || 1)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-cyan-400/20"
                  >
                    <FilePlus size={13} /> + Dars qo'shish
                  </button>
                  <button
                    onClick={() => onAddTestToCourse(course.numericId || 1)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-purple-400/20"
                  >
                    <Plus size={13} /> + Test qo'shish
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-6 sm:p-8 max-w-xl w-full border-white/10 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Yaratish'}
                    </h3>
                    <p className="text-white/40 text-xs">
                      O'quv kursi ma'lumotlarini to'ldiring
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

              {/* Title & Desc */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Kurs Nomi <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleUz}
                    onChange={(e) => setTitleUz(e.target.value)}
                    placeholder="Masalan: Sun'iy Intellekt va Raqamli Ta'lim"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Kurs Tavsifi
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionUz}
                    onChange={(e) => setDescriptionUz(e.target.value)}
                    placeholder="Ushbu kurs kimlar uchun va nimalarni o'rgatadi..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                      Yo'nalish / Kategoriya
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      {COURSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                      Darajasi
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      {COURSE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Emoji Icon Picker */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Kurs Ikonkasi (Emoji)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_ICONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setIcon(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                          icon === emoji
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110 shadow-lg'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme Picker */}
                <div>
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                    Mavzu Rangi
                  </label>
                  <div className="flex items-center gap-3">
                    {AVAILABLE_COLORS.map((clr) => (
                      <button
                        type="button"
                        key={clr}
                        onClick={() => setColor(clr)}
                        style={{ backgroundColor: clr }}
                        className={`w-8 h-8 rounded-full transition-all flex items-center justify-center shadow-lg ${
                          color === clr ? 'scale-125 ring-4 ring-white/30' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {color === clr && <Check size={14} className="text-black font-black" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto translate checkbox */}
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 rounded"
                  />
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <Sparkles size={13} className="text-yellow-400" /> Rus va Ingliz tillariga
                    avtomatik tarjima qilish
                  </span>
                </label>
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
                  onClick={handleSaveCourse}
                  className="btn-primary text-xs py-2 px-6 flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
                >
                  {saving ? (
                    'Saqlanmoqda...'
                  ) : (
                    <>
                      <Check size={14} /> Kursni Saqlash
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
