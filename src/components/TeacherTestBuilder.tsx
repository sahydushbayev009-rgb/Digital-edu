import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  Languages,
  ListPlus,
  Percent,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  X
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useContentStore, type ContentItem, type MultilingualQuestion } from '../store/useContentStore'
import { useI18nStore } from '../store/useI18nStore'
import { translateToAll, translateArrayToAll } from '../utils/translate'

export interface EditableQuestion {
  id: string
  q: string
  options: string[]
  answer: number // 0-based index
  points: number
  explanation: string
}

interface TeacherTestBuilderProps {
  initialData?: ContentItem | null
  onClose: () => void
  onSaved: () => void
  preselectedTopicId?: number | null
}

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

export default function TeacherTestBuilder({
  initialData,
  onClose,
  onSaved,
  preselectedTopicId,
}: TeacherTestBuilderProps) {
  const { user } = useAuthStore()
  const { courses, createContentItem, updateContentItem } = useContentStore()
  const { language } = useI18nStore()

  // Initialize questions
  const initialQuestions: EditableQuestion[] = useMemo(() => {
    if (initialData?.questions && initialData.questions.length > 0) {
      return initialData.questions.map((q, idx) => ({
        id: `q-${idx}-${Date.now()}`,
        q: q.q?.uz || q.q?.ru || q.q?.en || '',
        options: q.options?.uz || q.options?.ru || q.options?.en || ['', '', '', ''],
        answer: q.answer ?? 0,
        points: q.points || 1,
        explanation: q.explanation?.uz || q.explanation?.ru || q.explanation?.en || '',
      }))
    }
    return [
      {
        id: `q-0-${Date.now()}`,
        q: '',
        options: ['', '', '', ''],
        answer: 0,
        points: 1,
        explanation: '',
      },
    ]
  }, [initialData])

  // Form State
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [topicId, setTopicId] = useState<number | null>(
    initialData?.topic_id ?? preselectedTopicId ?? (courses[0]?.numericId || 1)
  )
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialData?.practice?.durationMinutes ?? 15
  )
  const [passingScore, setPassingScore] = useState<number>(
    initialData?.practice?.passingScore ?? 70
  )
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialData?.status || 'published'
  )
  const [autoTranslate, setAutoTranslate] = useState(true)

  // Editor Mode: 'visual' | 'bulk' | 'preview'
  const [mode, setMode] = useState<'visual' | 'bulk' | 'preview'>('visual')
  const [questions, setQuestions] = useState<EditableQuestion[]>(initialQuestions)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)

  // Bulk Import state
  const [bulkText, setBulkText] = useState('')
  const [bulkWarning, setBulkWarning] = useState<string | null>(null)

  // Live Preview state
  const [previewIdx, setPreviewIdx] = useState(0)
  const [previewSelected, setPreviewSelected] = useState<number | null>(null)
  const [previewConfirmed, setPreviewConfirmed] = useState(false)
  const [previewScore, setPreviewScore] = useState(0)
  const [previewFinished, setPreviewFinished] = useState(false)

  // Action status
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const activeQuestion = questions[activeQuestionIdx] || questions[0]

  // Update active question field
  const updateActiveQuestion = (field: keyof EditableQuestion, value: any) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === activeQuestionIdx ? { ...q, [field]: value } : q))
    )
  }

  // Update option for active question
  const updateOptionText = (optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== activeQuestionIdx) return q
        const newOpts = [...q.options]
        newOpts[optIndex] = text
        return { ...q, options: newOpts }
      })
    )
  }

  // Add option to active question
  const addOption = () => {
    if (activeQuestion.options.length >= 6) return
    updateActiveQuestion('options', [...activeQuestion.options, ''])
  }

  // Remove option from active question
  const removeOption = (optIndex: number) => {
    if (activeQuestion.options.length <= 2) return
    const newOpts = activeQuestion.options.filter((_, i) => i !== optIndex)
    let newAnswer = activeQuestion.answer
    if (newAnswer === optIndex) newAnswer = 0
    else if (newAnswer > optIndex) newAnswer -= 1

    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === activeQuestionIdx ? { ...q, options: newOpts, answer: newAnswer } : q
      )
    )
  }

  // Add new question
  const addNewQuestion = () => {
    const newQ: EditableQuestion = {
      id: `q-${Date.now()}-${Math.random()}`,
      q: '',
      options: ['', '', '', ''],
      answer: 0,
      points: 1,
      explanation: '',
    }
    setQuestions((prev) => [...prev, newQ])
    setActiveQuestionIdx(questions.length)
  }

  // Duplicate question
  const duplicateQuestion = (index: number) => {
    const target = questions[index]
    const dup: EditableQuestion = {
      ...target,
      id: `q-${Date.now()}-${Math.random()}`,
      q: `${target.q} (nusxa)`,
    }
    const updated = [...questions]
    updated.splice(index + 1, 0, dup)
    setQuestions(updated)
    setActiveQuestionIdx(index + 1)
  }

  // Delete question
  const deleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("Kamida bitta savol bo'lishi kerak!")
      return
    }
    const updated = questions.filter((_, i) => i !== index)
    setQuestions(updated)
    if (activeQuestionIdx >= updated.length) {
      setActiveQuestionIdx(updated.length - 1)
    }
  }

  // Intelligent Bulk Question Parser
  const parseBulkText = () => {
    setBulkWarning(null)
    const raw = bulkText.trim()
    if (!raw) {
      setBulkWarning('Matn kiritilmadi.')
      return
    }

    const lines = raw.split('\n').map((l) => l.trim())
    const parsed: EditableQuestion[] = []

    // Format 1: Pipe separated: "Savol | A | B | C | D | 1"
    const isPipeFormat = lines.every((line) => !line || line.split('|').length >= 4)
    if (isPipeFormat && lines.some((l) => l.includes('|'))) {
      lines.forEach((line, idx) => {
        if (!line) return
        const parts = line.split('|').map((p) => p.trim())
        if (parts.length >= 4) {
          const qText = parts[0]
          const lastPart = parts[parts.length - 1]
          let ansNum = parseInt(lastPart, 10)
          let opts: string[] = []

          if (!isNaN(ansNum) && ansNum >= 1 && ansNum <= parts.length - 2) {
            opts = parts.slice(1, parts.length - 1)
            ansNum = ansNum - 1
          } else {
            opts = parts.slice(1)
            ansNum = 0
          }

          parsed.push({
            id: `bulk-${idx}-${Date.now()}`,
            q: qText,
            options: opts,
            answer: ansNum,
            points: 1,
            explanation: '',
          })
        }
      })
    } else {
      // Format 2: Standard structured format:
      // 1. Savol...
      // A) ...
      // B) ...
      // Javob: B
      let currentQ: Partial<EditableQuestion> | null = null
      let currentOpts: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line) continue

        // Check if question header e.g. "1. Savol" or "1) Savol" or "Savol:"
        const qMatch = line.match(/^(\d+[\.\)]\s*|\?\s*)(.+)/i)
        // Check if option e.g. "A) option", "A. option", "+A) option"
        const optMatch = line.match(/^([+*]?)([A-F])[\.\)]\s*(.+)/i)
        // Check if answer declaration e.g. "Javob: A", "To'g'ri javob: B", "Answer: C"
        const ansMatch = line.match(/^(?:to['’`]?g['’`]?ri\s+)?(?:javob|answer)\s*[:=-]\s*([A-F]|\d)/i)
        // Check explanation e.g. "Izoh: ...", "Explanation: ..."
        const expMatch = line.match(/^(?:izoh|tushuntirish|explanation)\s*[:=-]\s*(.+)/i)

        if (optMatch) {
          const isMarkedCorrect = Boolean(optMatch[1])
          const optLetter = optMatch[2].toUpperCase()
          const optText = optMatch[3]
          currentOpts.push(optText)
          if (isMarkedCorrect && currentQ) {
            currentQ.answer = currentOpts.length - 1
          }
        } else if (ansMatch && currentQ) {
          const char = ansMatch[1].toUpperCase()
          let ansIdx = 0
          if (['A', 'B', 'C', 'D', 'E', 'F'].includes(char)) {
            ansIdx = char.charCodeAt(0) - 65
          } else {
            ansIdx = Math.max(0, parseInt(char, 10) - 1)
          }
          currentQ.answer = ansIdx
        } else if (expMatch && currentQ) {
          currentQ.explanation = expMatch[1]
        } else if (qMatch) {
          // Commit previous question
          if (currentQ && currentQ.q) {
            parsed.push({
              id: `bulk-${parsed.length}-${Date.now()}`,
              q: currentQ.q,
              options: currentOpts.length >= 2 ? currentOpts : ['A', 'B', 'C', 'D'],
              answer: currentQ.answer ?? 0,
              points: 1,
              explanation: currentQ.explanation || '',
            })
          }
          currentQ = { q: qMatch[2], answer: 0 }
          currentOpts = []
        } else if (currentQ && currentOpts.length === 0) {
          // Multiline question continuation
          currentQ.q = `${currentQ.q} ${line}`
        }
      }

      // Commit last question
      if (currentQ && currentQ.q) {
        parsed.push({
          id: `bulk-${parsed.length}-${Date.now()}`,
          q: currentQ.q,
          options: currentOpts.length >= 2 ? currentOpts : ['A', 'B', 'C', 'D'],
          answer: currentQ.answer ?? 0,
          points: 1,
          explanation: currentQ.explanation || '',
        })
      }
    }

    if (parsed.length === 0) {
      setBulkWarning("Matndan savollar ajratib olinmadi. Namuna formatiga qarab tekshiring.")
      return
    }

    setQuestions(parsed)
    setActiveQuestionIdx(0)
    setMode('visual')
    setBulkText('')
    setSuccess(`${parsed.length} ta savol muvaffaqiyatli import qilindi!`)
    setTimeout(() => setSuccess(null), 3000)
  }

  // Handle Save
  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError('Test sarlavhasini kiriting.')
      return
    }

    if (questions.length === 0) {
      setError('Kamida 1 ta savol qo‘shilishi kerak.')
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.q.trim()) {
        setError(`${i + 1}-savol matni bo'sh bo'lishi mumkin emas.`)
        setActiveQuestionIdx(i)
        setMode('visual')
        return
      }
      if (q.options.some((opt) => !opt.trim())) {
        setError(`${i + 1}-savolning barcha variantlari to'ldirilgan bo'lishi kerak.`)
        setActiveQuestionIdx(i)
        setMode('visual')
        return
      }
      if (q.answer < 0 || q.answer >= q.options.length) {
        setError(`${i + 1}-savolning to'g'ri javobi tanlanmagan.`)
        setActiveQuestionIdx(i)
        setMode('visual')
        return
      }
    }

    setSaving(true)

    try {
      let finalQuestions: MultilingualQuestion[] = []

      if (autoTranslate) {
        setTranslating(true)
        finalQuestions = await Promise.all(
          questions.map(async (q) => {
            const qT = await translateToAll(q.q, 'uz')
            const optT = await translateArrayToAll(q.options, 'uz')
            const expT = q.explanation ? await translateToAll(q.explanation, 'uz') : undefined
            return {
              q: qT,
              options: optT,
              answer: q.answer,
              points: q.points,
              explanation: expT,
            }
          })
        )
        setTranslating(false)
      } else {
        finalQuestions = questions.map((q) => ({
          q: { uz: q.q, ru: q.q, en: q.q },
          options: { uz: q.options, ru: q.options, en: q.options },
          answer: q.answer,
          points: q.points,
          explanation: q.explanation
            ? { uz: q.explanation, ru: q.explanation, en: q.explanation }
            : undefined,
        }))
      }

      const selectedCourse = courses.find((c) => c.numericId === topicId)
      const courseTitle =
        typeof selectedCourse?.title === 'object'
          ? selectedCourse.title.uz
          : selectedCourse?.title || "Umumiy o'quv dasturi"

      const payload = {
        content_type: 'test' as const,
        title,
        description: description || `${questions.length} ta savoldan iborat test`,
        body: '',
        topic_id: topicId,
        questions: finalQuestions,
        practice: {
          durationMinutes,
          passingScore,
          courseTitle,
          courseId: selectedCourse?.id,
        },
        status,
        created_by: user?.id || null,
      }

      let res
      if (initialData?.id) {
        res = await updateContentItem(initialData.id, payload)
      } else {
        res = await createContentItem(payload)
      }

      if (!res.success) {
        throw new Error(res.error || 'Saqlashda xatolik yuz berdi.')
      }

      setSuccess('Test muvaffaqiyatli saqlandi!')
      setTimeout(() => {
        onSaved()
        onClose()
      }, 800)
    } catch (err: any) {
      setError(err?.message || 'Xatolik yuz berdi')
    } finally {
      setSaving(false)
      setTranslating(false)
    }
  }

  // Live Preview handlers
  const handlePreviewConfirm = () => {
    if (previewSelected === null) return
    setPreviewConfirmed(true)
    if (previewSelected === questions[previewIdx]?.answer) {
      setPreviewScore((prev) => prev + (questions[previewIdx]?.points || 1))
    }
  }

  const handlePreviewNext = () => {
    if (previewIdx < questions.length - 1) {
      setPreviewIdx((prev) => prev + 1)
      setPreviewSelected(null)
      setPreviewConfirmed(false)
    } else {
      setPreviewFinished(true)
    }
  }

  const restartPreview = () => {
    setPreviewIdx(0)
    setPreviewSelected(null)
    setPreviewConfirmed(false)
    setPreviewScore(0)
    setPreviewFinished(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-[#0d121f]/90 px-6 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                {initialData ? 'Tahrirlash' : 'Yangi Test Yaratish'}
              </span>
              <span className="text-white/40 text-xs">• {questions.length} ta savol</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight truncate max-w-md">
              {title || 'Nomsiz test'}
            </h1>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setMode('visual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'visual'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ListPlus size={15} /> Vizual Muharrir
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'bulk'
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <FileText size={15} /> Tezkor Import
          </button>
          <button
            onClick={() => {
              setMode('preview')
              restartPreview()
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'preview'
                ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye size={15} /> Sinab Ko'rish
          </button>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>{translating ? '3 tilga tarjima...' : 'Saqlanmoqda...'}</span>
              </>
            ) : (
              <>
                <Save size={16} /> Saqlash va Nashr
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-sm font-semibold">
              <AlertCircle size={18} /> {error}
            </div>
            <button onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 mt-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-sm font-semibold">
              <CheckCircle2 size={18} /> {success}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Test Metama'lumotlar Paneli */}
        <div className="glass-panel p-6 border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
              Test Nomi <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Raqamli pedagogika asoslari - 1-oraliq nazorat"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
              Kurs / Mavzuga Bog'lash
            </label>
            <select
              value={topicId ?? ''}
              onChange={(e) => setTopicId(Number(e.target.value) || null)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.numericId || 1}>
                  {course.icon}{' '}
                  {typeof course.title === 'object' ? course.title.uz : course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Clock size={12} /> Vaqt
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value={5}>5 daqiqa</option>
                <option value={10}>10 daqiqa</option>
                <option value={15}>15 daqiqa</option>
                <option value={20}>20 daqiqa</option>
                <option value={30}>30 daqiqa</option>
                <option value={45}>45 daqiqa</option>
                <option value={60}>60 daqiqa</option>
                <option value={0}>Cheklovsiz</option>
              </select>
            </div>

            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Percent size={12} /> O'tish bali
              </label>
              <select
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value={50}>50%</option>
                <option value={60}>60%</option>
                <option value={70}>70%</option>
                <option value={80}>80%</option>
                <option value={90}>90%</option>
              </select>
            </div>
          </div>

          {/* Description & Settings row */}
          <div className="lg:col-span-3">
            <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
              Qo'shimcha tavsif / Yo'riqnoma (Ixtiyoriy)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Ushbu testda har bir savol uchun 1 balldan beriladi..."
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-4 justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
              <span className="text-xs text-white/70 font-semibold flex items-center gap-1">
                <Languages size={14} className="text-cyan-400" /> 3 tilga avto-tarjima
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                className="w-4 h-4 accent-green-400 rounded cursor-pointer"
              />
              <span className="text-xs text-white/70 font-semibold">
                {status === 'published' ? '🟢 Nashr qilingan' : '⚪ Qoralama'}
              </span>
            </label>
          </div>
        </div>

        {/* MODE 1: VISUAL INTERACTIVE BUILDER */}
        {mode === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
            {/* Left Column: Questions List */}
            <div className="glass-panel p-4 border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Savollar ({questions.length})
                </span>
                <button
                  onClick={addNewQuestion}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all border border-cyan-400/20"
                >
                  <Plus size={14} /> Savol qo'shish
                </button>
              </div>

              <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
                {questions.map((q, idx) => {
                  const isFilled = q.q.trim().length > 0
                  const isAnswerSelected = q.answer !== undefined && q.answer >= 0
                  const isActive = idx === activeQuestionIdx

                  return (
                    <div
                      key={q.id || idx}
                      onClick={() => setActiveQuestionIdx(idx)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-cyan-400 text-black'
                              : isFilled && isAnswerSelected
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="truncate text-xs font-medium">
                          {q.q ? q.q : <span className="text-white/30 italic">Savol kiritilmagan</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateQuestion(idx)
                          }}
                          title="Nusxa olish"
                          className="p-1 hover:text-cyan-400 text-white/40"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteQuestion(idx)
                          }}
                          title="O'chirish"
                          className="p-1 hover:text-red-400 text-white/40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Active Question Editor */}
            <div className="glass-panel p-6 border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center font-black text-sm">
                    #{activeQuestionIdx + 1}
                  </span>
                  <span className="text-white font-bold text-base">Savolni tahrirlash</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/50 font-bold">Ball:</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={activeQuestion.points || 1}
                      onChange={(e) =>
                        updateActiveQuestion('points', Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={() => deleteQuestion(activeQuestionIdx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs transition-all border border-red-500/20"
                    title="Savolni o'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Question Textarea */}
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2">
                  Savol matni <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={activeQuestion.q}
                  onChange={(e) => updateActiveQuestion('q', e.target.value)}
                  placeholder="Savolni aniq va tushunarli qilib yozing..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
              </div>

              {/* Options Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">
                    Javob Variantlari (To'g'ri javobni tanlang) <span className="text-red-400">*</span>
                  </label>
                  {activeQuestion.options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Plus size={13} /> Variant qo'shish
                    </button>
                  )}
                </div>

                <div className="grid gap-3">
                  {activeQuestion.options.map((option, optIdx) => {
                    const isCorrect = activeQuestion.answer === optIdx
                    const letter = optionLetters[optIdx] || optIdx + 1

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                          isCorrect
                            ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Radio Selector */}
                        <button
                          type="button"
                          onClick={() => updateActiveQuestion('answer', optIdx)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                            isCorrect
                              ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)] scale-105'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                          title={isCorrect ? "To'g'ri javob" : "To'g'ri javob qilib belgilash"}
                        >
                          {isCorrect ? <Check size={16} strokeWidth={3} /> : letter}
                        </button>

                        {/* Input for option text */}
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOptionText(optIdx, e.target.value)}
                          placeholder={`${letter} varianti matnini kiriting...`}
                          className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        />

                        {/* Badge for correct */}
                        {isCorrect && (
                          <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-[10px] font-bold uppercase tracking-wider border border-green-500/30 shrink-0">
                            To'g'ri javob
                          </span>
                        )}

                        {/* Delete option if > 2 */}
                        {activeQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(optIdx)}
                            className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                            title="Variantni o'chirish"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Explanation Field */}
              <div>
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Sparkles size={13} className="text-yellow-400" /> Tushuntirish / Izoh (Talaba testni
                  yechgach ko'rsatiladi)
                </label>
                <textarea
                  rows={2}
                  value={activeQuestion.explanation || ''}
                  onChange={(e) => updateActiveQuestion('explanation', e.target.value)}
                  placeholder="Nima uchun bu variant to'g'ri ekanligini tushuntirib bering..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
              </div>

              {/* Navigation between questions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  disabled={activeQuestionIdx === 0}
                  onClick={() => setActiveQuestionIdx((prev) => Math.max(0, prev - 1))}
                  className="btn-cyber flex items-center gap-2 text-xs py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} /> Oldingi savol
                </button>

                <span className="text-xs text-white/40 font-bold">
                  {activeQuestionIdx + 1} / {questions.length}
                </span>

                {activeQuestionIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                    className="btn-primary flex items-center gap-2 text-xs py-2"
                  >
                    Keyingi savol <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={addNewQuestion}
                    className="btn-primary flex items-center gap-2 text-xs py-2 bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    <Plus size={14} /> Yangi savol qo'shish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: RAPID BULK TEXT IMPORT */}
        {mode === 'bulk' && (
          <div className="glass-panel p-6 border-white/10 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <FileText className="text-purple-400" size={20} /> Matndan Tezkor Savollar Importi
              </h2>
              <p className="text-white/50 text-xs">
                Word yoki Telegramdagi testlarni birdaniga nusxalab bu yerga tashlang. Tizim avtomatik
                tarzda savol va variantlarni ajratib oladi.
              </p>
            </div>

            {bulkWarning && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 font-semibold">
                <AlertCircle size={16} /> {bulkWarning}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <textarea
                  rows={16}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`1. Taʼlimda sunʼiy intellektdan foydalanishning asosiy maqsadi nima?
A) Oʻqituvchini toʻliq almashtirish
B) Taʼlim jarayonini personallashtirish va samaradorlikni oshirish
C) Dars vaqtini qisqartirish
D) Qogʻoz sarfini koʻpaytirish
Javob: B
Izoh: AI o'quvchining shaxsiy ehtiyojlariga moslashishga yordam beradi.

2. LMS platformasiga misol qaysi?
A) Photoshop
B) Moodle
C) Excel
D) Figma
Javob: B`}
                  className="w-full p-4 rounded-2xl bg-[#090d16] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setBulkText('')}
                    className="btn-cyber text-xs py-2 px-4"
                  >
                    Tozalash
                  </button>
                  <button
                    onClick={parseBulkText}
                    className="btn-primary text-xs py-2 px-6 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Savollarni Tahlil va Import Qilish
                  </button>
                </div>
              </div>

              {/* Supported formats guide */}
              <div className="space-y-4 bg-white/[0.02] p-5 rounded-2xl border border-white/5 text-xs text-white/70">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-400" /> Qo'llab-quvvatlanadigan formatlar:
                </h3>

                <div className="space-y-2">
                  <div className="font-bold text-cyan-300">Format 1: Standart raqamli format</div>
                  <pre className="p-3 bg-black/40 rounded-xl font-mono text-[11px] text-white/60 overflow-x-auto">
{`1. Savol matni?
A) Birinchi variant
B) Ikkinchi variant
C) Uchinchi variant
D) To'rtinchi variant
Javob: B
Izoh: Tushuntirish matni`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-purple-300">Format 2: Chiziqli (Pipe) format</div>
                  <pre className="p-3 bg-black/40 rounded-xl font-mono text-[11px] text-white/60 overflow-x-auto">
{`Savol | A | B | C | D | 1
2-Savol | A | B | C | D | 2`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-green-300">Format 3: Belgilangan to'g'ri javob (+)</div>
                  <pre className="p-3 bg-black/40 rounded-xl font-mono text-[11px] text-white/60 overflow-x-auto">
{`1. Savol matni?
+A) Bu to'g'ri javob
B) Bu noto'g'ri
C) Bu ham noto'g'ri
D) Barchasi noto'g'ri`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: LIVE PREVIEW (TALABA NIGOHI BILAN SINASH) */}
        {mode === 'preview' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass-panel p-6 border-white/10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                    Jonli Test Sinovi
                  </span>
                  <h3 className="text-lg font-bold text-white">{title || 'Nomsiz test'}</h3>
                </div>
                <button
                  onClick={restartPreview}
                  className="btn-cyber text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Boshidan
                </button>
              </div>

              {previewFinished ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto text-2xl font-black">
                    🎉
                  </div>
                  <h3 className="text-2xl font-black text-white">Sinov yakunlandi!</h3>
                  <div className="text-4xl font-black text-cyan-300">
                    {previewScore} / {questions.reduce((sum, q) => sum + (q.points || 1), 0)} ball
                  </div>
                  <p className="text-white/40 text-xs">
                    Jami savollar soni: {questions.length} ta
                  </p>
                  <button onClick={restartPreview} className="btn-primary mt-4">
                    Qaytadan sinash
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>
                      Savol {previewIdx + 1} / {questions.length}
                    </span>
                    <span>Ball: {previewScore}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${((previewIdx + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question */}
                  <h4 className="text-base font-semibold text-white leading-relaxed">
                    {questions[previewIdx]?.q}
                  </h4>

                  {/* Options */}
                  <div className="grid gap-3">
                    {questions[previewIdx]?.options.map((opt, i) => {
                      const isCorrect = i === questions[previewIdx]?.answer
                      let cls =
                        'p-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-3 '

                      if (!previewConfirmed) {
                        cls +=
                          previewSelected === i
                            ? 'bg-cyan-500/10 border-cyan-400/50 text-white'
                            : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]'
                      } else if (isCorrect) {
                        cls += 'bg-green-500/10 border-green-500/50 text-green-300'
                      } else if (previewSelected === i) {
                        cls += 'bg-red-500/10 border-red-500/50 text-red-300'
                      } else {
                        cls += 'bg-white/[0.01] border-white/5 text-white/30'
                      }

                      return (
                        <button
                          key={i}
                          disabled={previewConfirmed}
                          onClick={() => setPreviewSelected(i)}
                          className={cls}
                        >
                          <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                            {optionLetters[i]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {previewConfirmed && isCorrect && (
                            <Check size={16} className="text-green-400" />
                          )}
                          {previewConfirmed && previewSelected === i && !isCorrect && (
                            <X size={16} className="text-red-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation when confirmed */}
                  {previewConfirmed && questions[previewIdx]?.explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 text-xs leading-relaxed"
                    >
                      <strong className="block mb-1 text-cyan-300">💡 Izoh:</strong>
                      {questions[previewIdx]?.explanation}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    {!previewConfirmed ? (
                      <button
                        disabled={previewSelected === null}
                        onClick={handlePreviewConfirm}
                        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Check size={14} /> Javobni tasdiqlash
                      </button>
                    ) : (
                      <button
                        onClick={handlePreviewNext}
                        className="btn-primary flex items-center gap-2"
                      >
                        {previewIdx < questions.length - 1 ? (
                          <>
                            Keyingisi <ArrowRight size={14} />
                          </>
                        ) : (
                          'Yakunlash'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
