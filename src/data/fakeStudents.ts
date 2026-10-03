import type { LeaderboardEntry } from '../store/useAuthStore'

// Ko'rinish (son) uchun soxta talabalar — faqat leaderboardni to'ldirish maqsadida.
// Ma'lumotlar deterministik tarzda generatsiya qilinadi, shuning uchun har "refresh"da
// reyting o'zgarmaydi (Math.random ishlatilmagan).

const FIRST_NAMES = [
  'Aziz', 'Bekzod', 'Dilshod', 'Eldor', 'Farrux', 'Jasur', 'Kamron', 'Laziz',
  'Otabek', 'Rustam', 'Temur', 'Xurshid', 'Zafar', 'Akmal', 'Bobur', 'Elyor',
  'Husan', 'Ikrom', 'Javohir', 'Komil', 'Oybek', 'Ravshan', 'Shahzod', 'Tohir',
  'Umar', 'Vohid', 'Yorqin', 'Sardor', 'Sanjar', 'Murod', 'Nodir', 'Anvar',
  'Gulnora', 'Hilola', 'Iroda', 'Kamola', 'Madina', 'Nodira', 'Sevara', 'Umida',
  'Yulduz', 'Zarina', 'Dilnoza', 'Feruza', 'Gulbahor', 'Lola', 'Munisa', 'Nargiza',
  'Parvina', 'Shahnoza', 'Malika', 'Nilufar', 'Ozoda', 'Robiya', 'Sabina', 'Zilola',
]

const LAST_NAMES = [
  'Aliyev', 'Karimov', 'Rashidov', 'Yusupov', 'Nazarov', 'Sobirov', 'Tursunov',
  'Ergashev', 'Rahimov', 'Saidov', 'Ismoilov', 'Mirzayev', 'Abdullayev', 'Xolmatov',
  'Qosimov', 'Yo\'ldoshev', 'Hasanov', 'Umarov', 'Bekmurodov', 'Tashpulatov',
  'Sharipov', 'Mahmudov', 'Olimov', 'Tojiyev', 'Qodirov', 'Sultonov', 'Yoqubov',
  'Mamatov', 'Xudoyberdiyev', 'Toshmatov',
]

const EMOJIS = ['🎯', '🚀', '🔥', '⭐', '💡', '🎓', '🧠', '📚', '🏆', '⚡', '🌟', '💎', '🦅', '🐯', '🦊']

const GROUPS = ['101-guruh', '102-guruh', '103-guruh', '201-guruh', '202-guruh', '203-guruh', '301-guruh', '302-guruh']

// Oddiy deterministik pseudo-random (LCG) — seed orqali barqaror natija beradi.
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1)
}

export function generateFakeStudents(count = 108): LeaderboardEntry[] {
  const rand = seeded(987654321)
  const entries: LeaderboardEntry[] = []

  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const emoji = EMOJIS[Math.floor(rand() * EMOJIS.length)]
    const group = GROUPS[Math.floor(rand() * GROUPS.length)]

    // Yuqori va mukammal ballar taqsimoti
    let totalQuizzes: number
    let totalPractices: number
    let totalQuizXp: number
    let totalPracticeXp: number
    let diagnosticScore: number
    let avgPercentage: number
    let topicsCompleted: number

    if (i < 5) {
      // 1-5 o'rinlar: Yetakchi a'lochi talabalar (1100 - 1500+ XP)
      totalQuizzes = Math.floor(rand() * 8) + 20        // 20-27 ta test
      totalPractices = Math.floor(rand() * 5) + 10     // 10-14 ta amaliyot
      totalQuizXp = totalQuizzes * 28 + Math.floor(rand() * 80)
      totalPracticeXp = totalPractices * 45 + Math.floor(rand() * 60)
      diagnosticScore = Math.floor(rand() * 3) + 23    // 23-25 ball
      avgPercentage = Math.floor(rand() * 6) + 94      // 94-99%
      topicsCompleted = Math.floor(rand() * 2) + 9     // 9-10 ta mavzu
    } else if (i < 18) {
      // 6-18 o'rinlar: Yuqori natijadorlar (700 - 1100 XP)
      totalQuizzes = Math.floor(rand() * 8) + 14        // 14-21 ta test
      totalPractices = Math.floor(rand() * 4) + 6       // 6-9 ta amaliyot
      totalQuizXp = totalQuizzes * 24 + Math.floor(rand() * 50)
      totalPracticeXp = totalPractices * 40 + Math.floor(rand() * 40)
      diagnosticScore = Math.floor(rand() * 4) + 20    // 20-23 ball
      avgPercentage = Math.floor(rand() * 7) + 88      // 88-94%
      topicsCompleted = Math.floor(rand() * 3) + 7     // 7-9 ta mavzu
    } else if (i < 45) {
      // 19-45 o'rinlar: O'rta-yuqori (400 - 700 XP)
      totalQuizzes = Math.floor(rand() * 6) + 8         // 8-13 ta test
      totalPractices = Math.floor(rand() * 4) + 3       // 3-6 ta amaliyot
      totalQuizXp = totalQuizzes * 20 + Math.floor(rand() * 40)
      totalPracticeXp = totalPractices * 35 + Math.floor(rand() * 30)
      diagnosticScore = Math.floor(rand() * 6) + 16    // 16-21 ball
      avgPercentage = Math.floor(rand() * 10) + 80     // 80-89%
      topicsCompleted = Math.floor(rand() * 3) + 4     // 4-6 ta mavzu
    } else if (i < 80) {
      // 46-80 o'rinlar: O'rtacha (220 - 400 XP)
      totalQuizzes = Math.floor(rand() * 5) + 5         // 5-9 ta test
      totalPractices = Math.floor(rand() * 3) + 2       // 2-4 ta amaliyot
      totalQuizXp = totalQuizzes * 16 + Math.floor(rand() * 30)
      totalPracticeXp = totalPractices * 30 + Math.floor(rand() * 20)
      diagnosticScore = Math.floor(rand() * 6) + 12    // 12-17 ball
      avgPercentage = Math.floor(rand() * 12) + 70     // 70-81%
      topicsCompleted = Math.floor(rand() * 2) + 2     // 2-3 ta mavzu
    } else {
      // 81-108 o'rinlar: Yangi boshlaganlar (100 - 220 XP)
      totalQuizzes = Math.floor(rand() * 4) + 2         // 2-5 ta test
      totalPractices = Math.floor(rand() * 2) + 1       // 1-2 ta amaliyot
      totalQuizXp = totalQuizzes * 14 + Math.floor(rand() * 20)
      totalPracticeXp = totalPractices * 25 + Math.floor(rand() * 15)
      diagnosticScore = Math.floor(rand() * 5) + 8      // 8-12 ball
      avgPercentage = Math.floor(rand() * 15) + 60     // 60-74%
      topicsCompleted = 1
    }

    const totalXp = totalQuizXp + totalPracticeXp + diagnosticScore * 4

    entries.push({
      user_id: `fake-${i + 1}`,
      full_name: `${first} ${last}`,
      avatar_emoji: emoji,
      group_name: group,
      diagnostic_score: diagnosticScore,
      total_quiz_xp: totalQuizXp,
      total_quizzes: totalQuizzes,
      avg_quiz_percentage: avgPercentage,
      total_practice_xp: totalPracticeXp,
      total_practices: totalPractices,
      total_xp: totalXp,
      topics_completed: topicsCompleted,
      level: levelFromXp(totalXp),
    })
  }

  // XP bo'yicha saralangan holda qaytaramiz
  return entries.sort((a, b) => b.total_xp - a.total_xp)
}
