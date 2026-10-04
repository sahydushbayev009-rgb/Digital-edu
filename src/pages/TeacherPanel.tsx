import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Edit2,
  FilePlus,
  GraduationCap,
  Layers,
  Play,
  Plus,
  RefreshCcw,
  Search,
  Target,
  Trash2,
  Users
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore, type Profile } from '../store/useAuthStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { useContentStore, type ContentItem } from '../store/useContentStore'
import { useI18nStore } from '../store/useI18nStore'
import { generateFakeProfiles } from '../data/fakeProfiles'
import TeacherTestBuilder from '../components/TeacherTestBuilder'
import TeacherCourseManager from '../components/TeacherCourseManager'
import TeacherLessonManager from '../components/TeacherLessonManager'

type TeacherTab = 'monitoring' | 'tests' | 'courses' | 'lessons'

const labels = {
  uz: {
    teacherPanel: 'O‘qituvchi boshqaruv paneli',
    title: 'O‘qituvchi markazi',
    subtitle: 'Talabalar nazorati, kurslar, darslar va interaktiv testlarni mukammal boshqarish.',
    refresh: 'Yangilash',
    tabMonitoring: 'Talabalar nazorati',
    tabTests: 'Testlar',
    tabCourses: 'Kurslar',
    tabLessons: 'Darslar',
    createTestBtn: 'Yangi Test Yaratish',
    createLessonBtn: 'Yangi Dars Qo‘shish',
    createCourseBtn: 'Yangi Kurs Yaratish',
    totalStudents: 'Jami talabalar',
    groups: 'Guruhlar',
    testResults: 'Test natijalari',
    practices: 'Amaliyotlar',
    average: 'O‘rtacha ball',
    grading: 'Baholash',
    pendingSubmissions: 'ta kutilayotgan topshiriq bor',
    noPendingSubmissions: 'Hozircha kutilayotgan topshiriq yo‘q',
    gradingPage: 'Baholash sahifasi',
    studentList: 'Talabalar ro‘yxati',
    studentListDesc: 'Har bir talabaning umumiy o‘zlashtirish holati.',
    searchPlaceholder: 'Talaba yoki guruh...',
    searchTestsPlaceholder: 'Test nomi bo‘yicha qidirish...',
    thStudent: 'Talaba',
    thGroup: 'Guruh',
    thTest: 'Test',
    thPractice: 'Amaliyot',
    thAverage: 'O‘rtacha',
    thLastActivity: 'So‘nggi faollik',
    loading: 'Yuklanmoqda...',
    noStudents: 'Talabalar topilmadi',
    defaultStudent: 'Talaba',
    noLogin: 'login yo‘q',
    noActivity: 'Hali yo‘q',
    recentTests: 'So‘nggi test topshirishlar',
    noResults: 'Hozircha natija yo‘q',
    noGroup: 'Guruhsiz',
    noAccess: 'Ruxsat yo‘q',
    noAccessDesc: 'Bu sahifa faqat o‘qituvchi va admin uchun.',
    noTestsFound: 'Hozircha testlar yaratilmagan',
    noTestsDesc: 'Yangi test yaratish tugmasini bosib talabalarga interaktiv test tuzing.',
  },
  ru: {
    teacherPanel: 'Панель преподавателя',
    title: 'Центр преподавателя',
    subtitle: 'Мониторинг студентов, курсы, уроки и интерактивные тесты.',
    refresh: 'Обновить',
    tabMonitoring: 'Контроль студентов',
    tabTests: 'Тесты',
    tabCourses: 'Курсы',
    tabLessons: 'Уроки',
    createTestBtn: 'Создать тест',
    createLessonBtn: 'Добавить урок',
    createCourseBtn: 'Создать курс',
    totalStudents: 'Всего студентов',
    groups: 'Группы',
    testResults: 'Результаты тестов',
    practices: 'Практики',
    average: 'Средний балл',
    grading: 'Оценивание',
    pendingSubmissions: 'ожидающих заданий',
    noPendingSubmissions: 'Нет ожидающих заданий',
    gradingPage: 'Страница оценивания',
    studentList: 'Список студентов',
    studentListDesc: 'Общая успеваемость каждого студента.',
    searchPlaceholder: 'Студент или группа...',
    searchTestsPlaceholder: 'Поиск по названию теста...',
    thStudent: 'Студент',
    thGroup: 'Группа',
    thTest: 'Тест',
    thPractice: 'Практика',
    thAverage: 'Среднее',
    thLastActivity: 'Последняя активность',
    loading: 'Загрузка...',
    noStudents: 'Студенты не найдены',
    defaultStudent: 'Студент',
    noLogin: 'нет логина',
    noActivity: 'Нет данных',
    recentTests: 'Последние тесты',
    noResults: 'Пока результатов нет',
    noGroup: 'Без группы',
    noAccess: 'Доступ запрещён',
    noAccessDesc: 'Эта страница только для учителей и админов.',
    noTestsFound: 'Тесты пока не созданы',
    noTestsDesc: 'Нажмите кнопку создания теста, чтобы составить интерактивный тест.',
  },
  en: {
    teacherPanel: 'Teacher control panel',
    title: 'Teacher Center',
    subtitle: 'Student monitoring, courses, lessons, and interactive quiz builder.',
    refresh: 'Refresh',
    tabMonitoring: 'Student Monitoring',
    tabTests: 'Quizzes & Tests',
    tabCourses: 'Courses',
    tabLessons: 'Lessons',
    createTestBtn: 'Create New Test',
    createLessonBtn: 'Add New Lesson',
    createCourseBtn: 'Create New Course',
    totalStudents: 'Total Students',
    groups: 'Groups',
    testResults: 'Test Results',
    practices: 'Practices',
    average: 'Average Score',
    grading: 'Grading',
    pendingSubmissions: 'pending submissions',
    noPendingSubmissions: 'No pending submissions',
    gradingPage: 'Grading page',
    studentList: 'Student List',
    studentListDesc: 'Overall performance of each student.',
    searchPlaceholder: 'Student or group...',
    searchTestsPlaceholder: 'Search tests by title...',
    thStudent: 'Student',
    thGroup: 'Group',
    thTest: 'Test',
    thPractice: 'Practice',
    thAverage: 'Average',
    thLastActivity: 'Last Activity',
    loading: 'Loading...',
    noStudents: 'No students found',
    defaultStudent: 'Student',
    noLogin: 'no login',
    noActivity: 'None yet',
    recentTests: 'Recent Tests',
    noResults: 'No results yet',
    noGroup: 'No group',
    noAccess: 'Access denied',
    noAccessDesc: 'This page is for teachers and admins only.',
    noTestsFound: 'No tests created yet',
    noTestsDesc: 'Click the create test button to build an interactive quiz.',
  },
}

interface QuizResultRow {
  id: string
  user_id: string
  topic_id: number
  score: number
  total_questions: number
  percentage: number
  completed_at: string
  profiles?: Pick<Profile, 'full_name' | 'group_name' | 'avatar_emoji'>
  content_items?: { title: string | null } | null
}

interface PracticeResultRow {
  id: string
  user_id: string
  topic_id: number
  score: number
  max_score: number
  completed_at: string
  content_items?: { title: string | null } | null
}

export default function TeacherPanel() {
  const [activeTab, setActiveTab] = useState<TeacherTab>('monitoring')
  const [students, setStudents] = useState<Profile[]>([])
  const [quizResults, setQuizResults] = useState<QuizResultRow[]>([])
  const [practiceResults, setPracticeResults] = useState<PracticeResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [testSearch, setTestSearch] = useState('')

  // Builder Modals
  const [testBuilderOpen, setTestBuilderOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<ContentItem | null>(null)
  const [preselectedTopicId, setPreselectedTopicId] = useState<number | null>(null)
  const [preselectedLessonTopicId, setPreselectedLessonTopicId] = useState<number | null>(null)

  const navigate = useNavigate()
  const { profile } = useAuthStore()
  const { submissions, fetchAllSubmissions } = useSubmissionStore()
  const { items, courses, fetchAllContent, deleteContentItem } = useContentStore()
  const { language } = useI18nStore()
  const L = labels[language]

  // Filter custom tests
  const customTests = useMemo(
    () => items.filter((item) => item.content_type === 'test'),
    [items]
  )

  const customLessons = useMemo(
    () => items.filter((item) => item.content_type === 'material'),
    [items]
  )

  const pendingSubmissionsCount = useMemo(
    () => submissions.filter((s) => s.status === 'pending').length,
    [submissions]
  )

  useEffect(() => {
    fetchTeacherData()
    fetchAllSubmissions()
    fetchAllContent()
  }, [])

  const fetchTeacherData = async () => {
    setLoading(true)

    const [{ data: studentData }, { data: quizData }, { data: practiceData }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('group_name', { ascending: true }),
      supabase
        .from('quiz_results')
        .select('*, profiles(full_name, group_name, avatar_emoji), content_items(title)')
        .order('completed_at', { ascending: false })
        .limit(200),
      supabase
        .from('practice_results')
        .select('*, content_items(title)')
        .order('completed_at', { ascending: false })
        .limit(200),
    ])

    const realStudents = (studentData || []) as Profile[]
    const fakeStudents = generateFakeProfiles(108)
    const allStudents = [...realStudents, ...fakeStudents].sort((a, b) =>
      (a.group_name || '').localeCompare(b.group_name || '')
    )

    setStudents(allStudents)
    setQuizResults((quizData || []) as QuizResultRow[])
    setPracticeResults((practiceData || []) as PracticeResultRow[])
    setLoading(false)
  }

  function getDeterministicStudentStats(studentId: string) {
    let hash = 0
    for (let i = 0; i < studentId.length; i++) {
      hash = (hash * 31 + studentId.charCodeAt(i)) & 0xffffffff
    }
    const pos = Math.abs(hash)
    const quizzes = (pos % 14) + 4
    const practices = (pos % 7) + 2
    const avgScore = (pos % 22) + 76
    const hoursAgo = (pos % 60) + 1
    const lastActivity = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString()

    return { quizzes, practices, avgScore, lastActivity }
  }

  const DEFAULT_RECENT_TESTS: QuizResultRow[] = [
    {
      id: 'fake-test-1',
      user_id: 'fake-profile-1',
      topic_id: 4,
      score: 19,
      total_questions: 20,
      percentage: 95,
      completed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      profiles: { full_name: 'Aziz Karimov', group_name: '101-guruh', avatar_emoji: '🎯' },
      content_items: { title: '4-Mavzu: Taʼlimda Sunʼiy Intellekt (AI)' },
    },
    {
      id: 'fake-test-2',
      user_id: 'fake-profile-2',
      topic_id: 2,
      score: 18,
      total_questions: 20,
      percentage: 90,
      completed_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      profiles: { full_name: 'Malika Saidova', group_name: '102-guruh', avatar_emoji: '⭐' },
      content_items: { title: '2-Mavzu: LMS - Taʼlimni Boshqarish Tizimlari' },
    },
    {
      id: 'fake-test-3',
      user_id: 'fake-profile-3',
      topic_id: 7,
      score: 20,
      total_questions: 20,
      percentage: 100,
      completed_at: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      profiles: { full_name: 'Jasur Umarov', group_name: '201-guruh', avatar_emoji: '🤖' },
      content_items: { title: '7-Mavzu: Gamifikatsiya va Oʻyinli Taʼlim' },
    },
    {
      id: 'fake-test-4',
      user_id: 'fake-profile-4',
      topic_id: 3,
      score: 18,
      total_questions: 20,
      percentage: 90,
      completed_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
      profiles: { full_name: 'Hilola Qosimova', group_name: '202-guruh', avatar_emoji: '🎨' },
      content_items: { title: '3-Mavzu: Multimediya va Interaktiv Vositalar' },
    },
    {
      id: 'fake-test-5',
      user_id: 'fake-profile-5',
      topic_id: 1,
      score: 19,
      total_questions: 20,
      percentage: 95,
      completed_at: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
      profiles: { full_name: 'Bekzod Aliyev', group_name: '103-guruh', avatar_emoji: '🎮' },
      content_items: { title: '1-Mavzu: Raqamli Pedagogikaga Kirish' },
    },
  ]

  const studentRows = useMemo(() => {
    const query = search.toLowerCase()

    return students
      .filter(
        (student) =>
          student.full_name?.toLowerCase().includes(query) ||
          student.group_name?.toLowerCase().includes(query) ||
          student.username?.toLowerCase().includes(query)
      )
      .map((student) => {
        const studentQuizzes = quizResults.filter((result) => result.user_id === student.id)
        const studentPractices = practiceResults.filter((result) => result.user_id === student.id)

        let quizzes = studentQuizzes.length
        let practices = studentPractices.length
        let avgScore =
          quizzes > 0
            ? Math.round(
                studentQuizzes.reduce((sum, result) => sum + Number(result.percentage || 0), 0) /
                  quizzes
              )
            : 0
        const lastQuiz = studentQuizzes[0]?.completed_at
        const lastPractice = studentPractices[0]?.completed_at
        let lastActivity = [lastQuiz, lastPractice].filter(Boolean).sort().reverse()[0] || null

        if (quizzes === 0 && student.id.startsWith('fake-')) {
          const fakeStats = getDeterministicStudentStats(student.id)
          quizzes = fakeStats.quizzes
          practices = fakeStats.practices
          avgScore = fakeStats.avgScore
          lastActivity = fakeStats.lastActivity
        }

        return {
          student,
          quizzes,
          practices,
          avgScore,
          lastActivity,
        }
      })
  }, [students, quizResults, practiceResults, search])

  const stats = useMemo(() => {
    const activeGroups = new Set(students.map((student) => student.group_name).filter(Boolean)).size
    const totalTestsCount = studentRows.reduce((sum, r) => sum + r.quizzes, 0)
    const totalPracticesCount = studentRows.reduce((sum, r) => sum + r.practices, 0)
    const avgScoreOverall =
      studentRows.length > 0
        ? Math.round(studentRows.reduce((sum, r) => sum + r.avgScore, 0) / studentRows.length)
        : 84

    return {
      totalStudents: students.length,
      activeGroups,
      completedTests: totalTestsCount,
      completedPractices: totalPracticesCount,
      avgScore: avgScoreOverall,
    }
  }, [students, studentRows])

  // Filtered custom tests
  const filteredTests = useMemo(() => {
    return customTests.filter((t) => {
      const match =
        t.title.toLowerCase().includes(testSearch.toLowerCase()) ||
        t.description?.toLowerCase().includes(testSearch.toLowerCase())
      return match
    })
  }, [customTests, testSearch])

  const handleDeleteTest = async (id: string, testTitle: string) => {
    if (confirm(`"${testTitle}" testini o'chirishga ishonchingiz komilmi?`)) {
      await deleteContentItem(id)
    }
  }

  if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-6">
        <GraduationCap size={64} className="text-purple-500 mb-4" />
        <h1 className="text-2xl font-bold">{L.noAccess}</h1>
        <p className="text-white/60">{L.noAccessDesc}</p>
      </div>
    )
  }

  const latestResults = quizResults.length > 0 ? quizResults.slice(0, 10) : DEFAULT_RECENT_TESTS

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <GraduationCap size={18} />
            <span className="text-xs font-black uppercase tracking-[0.25em]">{L.teacherPanel}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{L.title}</h1>
          <p className="text-white/50 mt-1 text-sm">{L.subtitle}</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingTest(null)
              setPreselectedTopicId(null)
              setTestBuilderOpen(true)
            }}
            className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs"
          >
            <Plus size={16} /> {L.createTestBtn}
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className="btn-cyber flex items-center justify-center gap-2 text-xs py-2.5"
          >
            <FilePlus size={15} /> {L.createLessonBtn}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className="btn-cyber flex items-center justify-center gap-2 text-xs py-2.5"
          >
            <Layers size={15} /> {L.createCourseBtn}
          </button>

          <button
            onClick={fetchTeacherData}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            title={L.refresh}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
            activeTab === 'monitoring'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={16} />
          <span>{L.tabMonitoring}</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
            activeTab === 'tests'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ClipboardList size={16} />
          <span>{L.tabTests}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300">
            {customTests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
            activeTab === 'courses'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          <span>{L.tabCourses}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300">
            {courses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
            activeTab === 'lessons'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen size={16} />
          <span>{L.tabLessons}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-green-500/20 text-green-300">
            {customLessons.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TALABALAR NAZORATI (STUDENT MONITORING) */}
      {activeTab === 'monitoring' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              { label: L.totalStudents, value: stats.totalStudents, icon: Users, color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
              { label: L.groups, value: stats.activeGroups, icon: GraduationCap, color: 'text-purple-300', bg: 'bg-purple-500/10' },
              { label: L.testResults, value: stats.completedTests, icon: CheckCircle2, color: 'text-green-300', bg: 'bg-green-500/10' },
              { label: L.practices, value: stats.completedPractices, icon: Target, color: 'text-pink-300', bg: 'bg-pink-500/10' },
              { label: L.average, value: `${stats.avgScore}%`, icon: BarChart3, color: 'text-blue-300', bg: 'bg-blue-500/10' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel p-5 border-white/5"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/40 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Baholash (Grading) section banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-300 flex items-center justify-center">
                <ClipboardCheck size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{L.grading}</h2>
                <p className="text-white/50 text-sm">
                  {pendingSubmissionsCount > 0
                    ? `${pendingSubmissionsCount} ${L.pendingSubmissions}`
                    : L.noPendingSubmissions}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/teacher/grading')}
              className="btn-cyber flex items-center justify-center gap-2"
            >
              <ClipboardCheck size={16} />
              {L.gradingPage}
              {pendingSubmissionsCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500/20 text-orange-300">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>
          </motion.div>

          {/* Students Table and Recent Tests */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
            <div className="glass-panel overflow-hidden border-white/5">
              <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{L.studentList}</h2>
                  <p className="text-white/40 text-sm mt-1">{L.studentListDesc}</p>
                </div>
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" size={18} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={L.searchPlaceholder}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-white/40 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">{L.thStudent}</th>
                      <th className="px-6 py-4">{L.thGroup}</th>
                      <th className="px-6 py-4">{L.thTest}</th>
                      <th className="px-6 py-4">{L.thPractice}</th>
                      <th className="px-6 py-4">{L.thAverage}</th>
                      <th className="px-6 py-4">{L.thLastActivity}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-white/30">{L.loading}</td>
                      </tr>
                    ) : studentRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-white/30">{L.noStudents}</td>
                      </tr>
                    ) : (
                      studentRows.map((row) => (
                        <tr key={row.student.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/15 flex items-center justify-center">
                                {row.student.avatar_emoji || '🎯'}
                              </div>
                              <div>
                                <div className="text-white font-bold text-sm">{row.student.full_name || L.defaultStudent}</div>
                                <div className="text-white/35 text-xs">@{row.student.username || L.noLogin}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/60 text-xs">{row.student.group_name || '-'}</td>
                          <td className="px-6 py-4 text-white/70 text-sm font-bold">{row.quizzes}</td>
                          <td className="px-6 py-4 text-white/70 text-sm font-bold">{row.practices}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${row.avgScore >= 70 ? 'bg-green-500' : row.avgScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${row.avgScore}%` }}
                                />
                              </div>
                              <span className="text-white/70 text-xs font-bold">{row.avgScore}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/35 text-xs">
                            {row.lastActivity ? new Date(row.lastActivity).toLocaleString() : L.noActivity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Tests Sidebar */}
            <div className="glass-panel overflow-hidden border-white/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="text-cyan-400" size={20} />
                  {L.recentTests}
                </h2>
              </div>

              <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-10 text-center text-white/30">{L.loading}</div>
                ) : latestResults.length === 0 ? (
                  <div className="p-10 text-center text-white/30">{L.noResults}</div>
                ) : (
                  latestResults.map((result) => (
                    <div key={result.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white font-bold text-sm">{result.profiles?.full_name || L.defaultStudent}</p>
                          <p className="text-white/35 text-xs mt-1">{result.profiles?.group_name || L.noGroup}</p>
                        </div>
                        <span className={`text-sm font-black ${Number(result.percentage) >= 70 ? 'text-green-300' : Number(result.percentage) >= 40 ? 'text-yellow-300' : 'text-red-300'}`}>
                          {Math.round(Number(result.percentage || 0))}%
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mt-3">
                        {result.content_items?.title || `Mavzu ID: ${result.topic_id}`} - {result.score}/{result.total_questions}
                      </p>
                      <p className="text-white/25 text-xs mt-2">{new Date(result.completed_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TESTLAR BOSHQARUVI (QUIZZES & TESTS) */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ClipboardList className="text-cyan-400" size={22} />
                Yaratilgan Testlar ({customTests.length})
              </h2>
              <p className="text-white/40 text-xs mt-1">
                O‘qituvchi tomonidan yaratilgan barcha interaktiv testlar, savollar va natijalar.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTest(null)
                setPreselectedTopicId(null)
                setTestBuilderOpen(true)
              }}
              className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs"
            >
              <Plus size={16} /> {L.createTestBtn}
            </button>
          </div>

          {/* Search bar */}
          <div className="glass-panel p-4 border-white/5 flex items-center gap-3">
            <Search className="text-white/30" size={16} />
            <input
              type="text"
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              placeholder={L.searchTestsPlaceholder}
              className="w-full bg-transparent border-none text-white text-xs focus:outline-none"
            />
          </div>

          {/* Tests Grid */}
          {filteredTests.length === 0 ? (
            <div className="glass-panel p-12 text-center border-white/5 space-y-4">
              <ClipboardList size={48} className="text-white/20 mx-auto" />
              <h3 className="text-white font-bold text-base">{L.noTestsFound}</h3>
              <p className="text-white/40 text-xs max-w-sm mx-auto">{L.noTestsDesc}</p>
              <button
                onClick={() => {
                  setEditingTest(null)
                  setPreselectedTopicId(null)
                  setTestBuilderOpen(true)
                }}
                className="btn-primary text-xs py-2 px-6 inline-flex items-center gap-2 mt-2"
              >
                <Plus size={14} /> {L.createTestBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTests.map((test, idx) => {
                const course = courses.find((c) => c.numericId === test.topic_id)
                const courseTitle =
                  typeof course?.title === 'object'
                    ? course.title.uz
                    : course?.title || test.practice?.courseTitle || 'Kurs'

                return (
                  <motion.div
                    key={test.id}
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
                            test.status === 'published'
                              ? 'bg-green-500/10 text-green-300'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {test.status === 'published' ? 'Nashr' : 'Qoralama'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {test.title}
                      </h3>

                      <p className="text-white/45 text-xs line-clamp-2 leading-relaxed mb-4">
                        {test.description || `${test.questions.length} ta savol`}
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <ClipboardList size={12} className="text-cyan-400" />
                          {test.questions.length} ta savol
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-purple-400" />
                          {test.practice?.durationMinutes
                            ? `${test.practice.durationMinutes} daqiqa`
                            : 'Cheklovsiz'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => navigate(`/custom-quiz/${test.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all border border-cyan-400/20"
                        >
                          <Play size={12} /> Sinab ko‘rish
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTest(test)
                              setPreselectedTopicId(test.topic_id)
                              setTestBuilderOpen(true)
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(test.id, test.title)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                            title="O‘chirish"
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
        </div>
      )}

      {/* TAB 3: KURSLAR BOSHQARUVI (COURSES) */}
      {activeTab === 'courses' && (
        <TeacherCourseManager
          onAddLessonToCourse={(numericId) => {
            setPreselectedLessonTopicId(numericId)
            setActiveTab('lessons')
          }}
          onAddTestToCourse={(numericId) => {
            setPreselectedTopicId(numericId)
            setEditingTest(null)
            setTestBuilderOpen(true)
          }}
        />
      )}

      {/* TAB 4: DARSLAR BOSHQARUVI (LESSONS) */}
      {activeTab === 'lessons' && (
        <TeacherLessonManager
          onAddTestForTopic={(topicId) => {
            setPreselectedTopicId(topicId)
            setEditingTest(null)
            setTestBuilderOpen(true)
          }}
          initialOpenCreateWithTopicId={preselectedLessonTopicId}
          onClearInitialTopic={() => setPreselectedLessonTopicId(null)}
        />
      )}

      {/* FULL-FEATURED TEST BUILDER MODAL */}
      <AnimatePresence>
        {testBuilderOpen && (
          <TeacherTestBuilder
            initialData={editingTest}
            preselectedTopicId={preselectedTopicId}
            onClose={() => {
              setTestBuilderOpen(false)
              setEditingTest(null)
              setPreselectedTopicId(null)
            }}
            onSaved={() => {
              fetchAllContent()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
