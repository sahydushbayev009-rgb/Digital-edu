import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Clock,
  ExternalLink,
  GraduationCap,
  Play,
  Video
} from 'lucide-react'
import { useContentStore, type ContentItem } from '../store/useContentStore'

function getYouTubeEmbedUrl(url?: string): string | null {
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

export default function ContentDetails() {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const { fetchContentItem, items } = useContentStore()
  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      if (!contentId) return
      const data = await fetchContentItem(contentId)
      if (alive) {
        setItem(data)
        setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [contentId, fetchContentItem])

  if (loading) {
    return <div className="py-20 text-center text-white/40">Yuklanmoqda...</div>
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white/40">Kontent topilmadi</p>
        <button onClick={() => navigate('/curriculum')} className="btn-cyber">Orqaga</button>
      </div>
    )
  }

  const Icon = item.content_type === 'test' ? ClipboardList : item.content_type === 'practice' ? GraduationCap : BookOpen
  const videoEmbed = getYouTubeEmbedUrl(item.practice?.videoUrl)

  // Find if there is a test linked to this topic
  const linkedTest = items.find(
    (i) => i.content_type === 'test' && item.topic_id && i.topic_id === item.topic_id
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <button
        onClick={() => navigate('/curriculum')}
        className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> O'quv dasturiga qaytish
      </button>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-9 border-white/5 space-y-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Icon size={26} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
                {item.content_type === 'material'
                  ? 'Dars Materiali'
                  : item.content_type === 'test'
                  ? 'Test'
                  : 'Amaliyot'}
              </span>
              {item.practice?.courseTitle && (
                <span className="text-xs text-white/40">• {item.practice.courseTitle}</span>
              )}
              {item.practice?.durationMinutes && (
                <span className="text-xs text-white/40 flex items-center gap-1">
                  • <Clock size={11} /> {item.practice.durationMinutes} daqiqa
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-white leading-tight">{item.title}</h1>
            {item.description && (
              <p className="text-white/50 mt-2 leading-relaxed text-sm">{item.description}</p>
            )}
          </div>
        </div>

        {/* Video Player if present */}
        {videoEmbed && (
          <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl bg-black">
            <iframe
              src={videoEmbed}
              className="w-full h-full"
              title={item.title}
              allowFullScreen
            />
          </div>
        )}

        {item.content_type === 'material' ? (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none text-white/80 space-y-4 text-base leading-relaxed">
              {(item.body || item.description).split('\n').filter(Boolean).map((paragraph, index) => (
                <p key={index} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Resources link */}
            {item.practice?.resources && item.practice.resources.length > 0 && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink size={13} className="text-cyan-400" /> Qo'shimcha Resurslar
                </h4>
                {item.practice.resources.map((link, i) => (
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

            {/* Direct take test button */}
            {linkedTest ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                <div>
                  <h3 className="text-white font-bold text-sm">Dars bo‘yicha test tayyor!</h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    {linkedTest.title} ({linkedTest.questions?.length || 0} ta savol)
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/custom-quiz/${linkedTest.id}`)}
                  className="btn-primary flex items-center justify-center gap-2 text-xs py-2 px-5"
                >
                  <Play size={14} /> Testni Boshlash
                </button>
              </div>
            ) : item.topic_id ? (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                <div>
                  <h3 className="text-white font-bold text-sm">Ushbu mavzu bo‘yicha testlar</h3>
                  <p className="text-white/40 text-xs mt-0.5">Bilimingizni sinab ko'ring</p>
                </div>
                <button
                  onClick={() => navigate(`/quiz/${item.topic_id}`)}
                  className="btn-primary flex items-center justify-center gap-2 text-xs py-2 px-5"
                >
                  Mavzu Testiga O'tish <ArrowRight size={14} />
                </button>
              </div>
            ) : null}
          </div>
        ) : item.content_type === 'test' ? (
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg">Interaktiv Test Tayyor</h2>
              <p className="text-white/45 text-sm mt-1">
                {item.questions?.length || 0} ta savol • {item.practice?.durationMinutes || 15} daqiqa
              </p>
            </div>
            <button
              onClick={() => navigate(`/custom-quiz/${item.id}`)}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
            >
              <Play size={18} /> Testni Boshlash
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg">Amaliyot Tayyor</h2>
              <p className="text-white/45 text-sm mt-1">
                {item.practice?.phases?.length || 0} ta bosqich
              </p>
            </div>
            <button
              onClick={() => navigate(`/custom-practice/${item.id}`)}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
            >
              <Play size={18} /> Boshlash
            </button>
          </div>
        )}
      </motion.article>
    </div>
  )
}
