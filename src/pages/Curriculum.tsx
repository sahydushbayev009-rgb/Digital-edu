import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { BookOpen, CheckCircle, ChevronRight, Clock, GraduationCap, Layers, Lock, Play, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { curriculum } from '../data'
import { useAppStore } from '../store/useAppStore'
import { useContentStore } from '../store/useContentStore'
import { useI18nStore } from '../store/useI18nStore'

export default function Curriculum() {
  const navigate = useNavigate()
  const { completedTopics } = useAppStore()
  const { t, language } = useI18nStore()
  const { items, courses, fetchPublishedContent, fetchCourses } = useContentStore()

  const customMaterials = items.filter((item) => item.content_type === 'material')
  const customCourses = courses.filter((c) => !c.id.startsWith('default-course-'))

  useEffect(() => {
    fetchPublishedContent()
    fetchCourses()
  }, [fetchPublishedContent, fetchCourses])

  return (
    <div className="space-y-10 pb-20">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-8 h-[1px] bg-cyan-500" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase">Academic Path</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black tracking-tighter"
        >
          <span className="cyber-gradient-text uppercase">{t('curriculum')}</span>
        </motion.h1>
        <p className="text-white/40 text-sm mt-3 max-w-xl leading-relaxed">{t('platformDesc')}</p>
      </div>

      {/* CUSTOM COURSES SECTION */}
      {customCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">Yangi Kurslar va Modullar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customCourses.map((c, index) => {
              const title = typeof c.title === 'object' ? c.title.uz : c.title
              const desc = typeof c.description === 'object' ? c.description.uz : c.description
              const courseLessons = items.filter(
                (item) => item.content_type === 'material' && item.topic_id === c.numericId
              )

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="glass-panel p-5 border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => {
                    if (courseLessons[0]) {
                      navigate(`/content/${courseLessons[0].id}`)
                    }
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}25, ${c.color}05)`,
                          border: `1px solid ${c.color}40`,
                        }}
                      >
                        {c.icon}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70">
                        {c.level}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block mb-1">
                      {c.category}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                      {title}
                    </h3>
                    <p className="text-white/45 text-xs line-clamp-2 leading-relaxed mb-4">{desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                    <span>{courseLessons.length} ta dars</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      O‘rganish <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* TEACHER CREATED LESSONS */}
      {customMaterials.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white">O‘qituvchilar yaratgan darslar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customMaterials.map((item, index) => {
              const hasVideo = Boolean(item.practice?.videoUrl)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/content/${item.id}`)}
                  className="glass-panel-hover p-5 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                        <BookOpen size={22} />
                      </div>
                      <div className="flex items-center gap-1">
                        {hasVideo && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/20 flex items-center gap-1">
                            <Video size={11} /> Video
                          </span>
                        )}
                        {item.practice?.courseTitle && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/60 truncate max-w-[120px]">
                            {item.practice.courseTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-white/45 text-xs line-clamp-3 leading-relaxed mb-4">
                      {item.description || item.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      {item.practice?.durationMinutes || 20} daqiqa
                    </span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Boshlash <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* CORE CURRICULUM TOPICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <GraduationCap size={20} className="text-purple-400" />
          <h2 className="text-xl font-bold text-white">Raqamli Pedagogika Dasturi (12 Mavzu)</h2>
        </div>

        <div className="relative space-y-4">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent hidden sm:block" />

          {curriculum.map((topic, i) => {
            const done = completedTopics.includes(topic.id)
            const isLocked = i > 0 && !completedTopics.includes(curriculum[i - 1].id) && !done

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !isLocked && navigate(`/topic/${topic.id}`)}
                className={`relative group sm:pl-16 ${
                  isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                {/* Node Indicator */}
                <div
                  className={`absolute left-[1.125rem] top-1/2 -translate-y-1/2 w-[1.75rem] h-[1.75rem] rounded-full border-4 border-[#0a0e1a] z-10 hidden sm:flex items-center justify-center transition-all duration-500 ${
                    done
                      ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                      : isLocked
                      ? 'bg-white/10'
                      : 'bg-cyan-500 group-hover:scale-125 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  {done && <CheckCircle size={10} className="text-white" />}
                  {isLocked && <Lock size={10} className="text-white/40" />}
                </div>

                <div className="glass-panel p-5 sm:p-6 transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/10 group-hover:translate-x-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 relative group-hover:rotate-6 transition-transform shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${topic.color}20, ${topic.color}05)`,
                        border: `1px solid ${topic.color}30`,
                      }}
                    >
                      <div
                        className="absolute inset-0 blur-lg opacity-20 transition-opacity group-hover:opacity-40"
                        style={{ backgroundColor: topic.color }}
                      />
                      <span className="relative z-10">{topic.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white/5 text-white/30 tracking-tighter">
                          UNIT {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {topic.title[language]}
                        </h3>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed max-w-2xl">
                        {topic.description[language]}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: done ? '100%' : '0%' }}
                            className="h-full bg-cyan-500"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {done ? 'Completed' : isLocked ? 'Locked' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isLocked && (
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-all border border-white/5">
                          <ChevronRight size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
