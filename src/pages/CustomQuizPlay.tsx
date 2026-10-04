import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock, RotateCcw, Sparkles, Trophy, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import { useContentStore, type ContentItem, type MultilingualQuestion } from '../store/useContentStore'
import { useI18nStore } from '../store/useI18nStore'

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

function getQuestionText(question: MultilingualQuestion, language: 'uz' | 'ru' | 'en') {
  return question.q?.[language] || question.q?.uz || ''
}

function getOptions(question: MultilingualQuestion, language: 'uz' | 'ru' | 'en') {
  return question.options?.[language] || question.options?.uz || []
}

function getExplanation(question: MultilingualQuestion, language: 'uz' | 'ru' | 'en') {
  if (!question.explanation) return null
  if (typeof question.explanation === 'string') return question.explanation
  return question.explanation?.[language] || question.explanation?.uz || null
}

export default function CustomQuizPlay() {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const { language } = useI18nStore()
  const { fetchContentItem } = useContentStore()
  const { saveQuizResult } = useAuthStore()
  const { addXp } = useAppStore()

  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState(false)

  // Countdown timer
  const durationMins = item?.practice?.durationMinutes || 0
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    let alive = true

    async function load() {
      if (!contentId) return
      const data = await fetchContentItem(contentId)
      if (alive) {
        setItem(data)
        setLoading(false)
        if (data?.practice?.durationMinutes && data.practice.durationMinutes > 0) {
          setTimeLeft(data.practice.durationMinutes * 60)
        }
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [contentId, fetchContentItem])

  // Timer interval
  useEffect(() => {
    if (timeLeft === null || finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, finished])

  const questions = useMemo(() => item?.questions || [], [item])
  const question = questions[current]
  const total = questions.length
  const totalPossiblePoints = useMemo(
    () => questions.reduce((sum, q) => sum + (q.points || 1), 0),
    [questions]
  )

  const handleConfirm = () => {
    if (selected === null || !question) return
    setConfirmed(true)
    if (selected === question.answer) {
      setScore((value) => value + (question.points || 1))
    }
  }

  const handleNext = async () => {
    if (current < total - 1) {
      setCurrent((value) => value + 1)
      setSelected(null)
      setConfirmed(false)
      return
    }

    setFinished(true)
    if (!saved && item) {
      const finalScore = score
      setSaved(true)
      addXp(finalScore * 10)
      await saveQuizResult(item.topic_id || 0, 1, finalScore, total, item.id)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
    setSaved(false)
    if (durationMins > 0) {
      setTimeLeft(durationMins * 60)
    }
  }

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const s = secs % 60
    return `${mins}:${s < 10 ? '0' : ''}${s}`
  }

  if (loading) {
    return <div className="py-20 text-center text-white/40">Yuklanmoqda...</div>
  }

  if (!item || item.content_type !== 'test' || total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white/40">Test topilmadi</p>
        <button onClick={() => navigate('/quizzes')} className="btn-cyber">Orqaga</button>
      </div>
    )
  }

  const options = question ? getOptions(question, language) : []
  const explanation = question ? getExplanation(question, language) : null
  const percentScore = totalPossiblePoints > 0 ? Math.round((score / totalPossiblePoints) * 100) : 0
  const passingScore = item.practice?.passingScore || 70
  const isPassed = percentScore >= passingScore

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/quizzes')}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Orqaga
        </button>

        <div className="flex items-center gap-3">
          {timeLeft !== null && !finished && (
            <div
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                timeLeft < 60
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                  : 'bg-white/5 text-cyan-300 border-white/10'
              }`}
            >
              <Clock size={13} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          <div className="text-sm font-bold text-white/80 truncate max-w-[200px] sm:max-w-[320px]">
            {item.title}
          </div>
        </div>
      </div>

      {finished ? (
        <div className="glass-panel p-8 sm:p-10 text-center max-w-md mx-auto space-y-4">
          <Trophy
            size={64}
            className={`mx-auto mb-2 ${isPassed ? 'text-yellow-400' : 'text-white/35'}`}
          />
          <h1 className="text-2xl font-black text-white">Test Yakunlandi</h1>

          <div className="text-5xl font-black my-3">
            <span className="text-cyan-300">{score}</span>
            <span className="text-white/20">/{totalPossiblePoints} ball</span>
          </div>

          <div
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isPassed
                ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}
          >
            {percentScore}% — {isPassed ? 'Muvaffaqiyatli topshirildi' : 'Yetarli ball to‘planmadi'}
          </div>

          <p className="text-white/40 text-xs mt-2">
            O‘tish bali: {passingScore}% • Jami savollar: {total} ta
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <button onClick={restart} className="btn-cyber flex items-center gap-2">
              <RotateCcw size={14} /> Qayta topshirish
            </button>
            <button onClick={() => navigate('/quizzes')} className="btn-primary">
              Testlarga qaytish
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-cyan-400">
              Savol {current + 1} / {total}
            </span>
            <span className="text-sm text-white/40">
              Ball: <span className="text-white font-bold">{score}</span> / {totalPossiblePoints}
            </span>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full"
              animate={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="glass-panel p-5 sm:p-8 space-y-6"
            >
              <h2 className="text-lg font-semibold text-white leading-relaxed">
                {getQuestionText(question, language)}
              </h2>

              <div className="grid gap-3">
                {options.map((option, index) => {
                  let cls =
                    'p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left w-full flex items-center gap-3 '
                  if (!confirmed) {
                    cls +=
                      selected === index
                        ? 'bg-cyan-500/10 border-cyan-400/45 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/65 hover:bg-white/[0.05]'
                  } else if (index === question.answer) {
                    cls += 'bg-green-500/10 border-green-400/45 text-green-300'
                  } else if (index === selected) {
                    cls += 'bg-red-500/10 border-red-400/45 text-red-300'
                  } else {
                    cls += 'bg-white/[0.01] border-white/[0.04] text-white/30'
                  }

                  return (
                    <button
                      key={index}
                      disabled={confirmed}
                      onClick={() => !confirmed && setSelected(index)}
                      className={cls}
                    >
                      <span className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-xs font-bold shrink-0">
                        {optionLetters[index] || index + 1}
                      </span>
                      <span className="flex-1">{option}</span>
                      {confirmed && index === question.answer && (
                        <Check size={16} className="ml-auto text-green-400 shrink-0" />
                      )}
                      {confirmed && index === selected && index !== question.answer && (
                        <X size={16} className="ml-auto text-red-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation tip when confirmed */}
              {confirmed && explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/25 text-cyan-200 text-xs leading-relaxed space-y-1"
                >
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-yellow-400" /> Tushuntirish / Izoh:
                  </div>
                  <p>{explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-end">
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={selected === null}
                className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check size={14} /> Tasdiqlash
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                {current < total - 1 ? (
                  <>
                    <ArrowRight size={14} /> Keyingisi
                  </>
                ) : (
                  <>
                    <Trophy size={14} /> Yakunlash
                  </>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
