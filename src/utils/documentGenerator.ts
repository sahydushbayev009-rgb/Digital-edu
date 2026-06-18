import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  ShadingType,
  PageBreak,
} from 'docx'

export interface DocData {
  title: string
  studentName: string
  groupName: string
  date: string
  topicId: number
}

// Topic-specific detailed content generator
export function getTopicDetails(topicId: number, lang: string = 'uz') {
  const data: Record<number, {
    keywords: string[]
    intro: string
    theory1: string
    theory2: string
    practice1: string
    practice2: string
    conclusion: string
    refs: string[]
  }> = {
    1: {
      keywords: ["Raqamli pedagogika", "Media-savodxonlik", "Fasilitatsiya", "Kognitiv yuklama", "Pedagogik texnologiyalar"],
      intro: lang === 'ru'
        ? "Введение в цифровую педагогику является ключевым шагом в реформировании современного образования. Традиционные методы обучения претерпевают кардинальные изменения под влиянием интерактивных технологий. Целью данной работы является исследование теоретических основ цифровой педагогики и разработка практических рекомендаций по интеграции цифровых инструментов в учебный процесс."
        : lang === 'en'
        ? "Introduction to digital pedagogy is a key step in reforming modern education. Traditional teaching methods are undergoing fundamental changes under the influence of interactive technologies. The purpose of this work is to study the theoretical foundations of digital pedagogy and develop practical recommendations for integrating digital tools into the educational process."
        : "Raqamli pedagogikaga kirish zamonaviy ta'limni isloh qilishda asosiy qadam hisoblanadi. An'anaviy o'qitish usullari interaktiv texnologiyalar ta'sirida tubdan o'zgarmoqda. Ushbu ishning maqsadi raqamli pedagogikaning nazariy asoslarini o'rganish va o'quv jarayoniga raqamli vositalarni integratsiya qilish bo'yicha amaliy tavsiyalar ishlab chiqishdan iborat.",
      theory1: lang === 'ru'
        ? "Цифровая педагогика исследует закономерности обучения и воспитания человека в условиях цифрового общества. Основными принципами являются персонализация, открытость, интерактивность и непрерывность образования. Важным аспектом является управление когнитивной нагрузкой учащихся."
        : lang === 'en'
        ? "Digital pedagogy studies the patterns of human learning and upbringing in a digital society. The core principles are personalization, openness, interactivity, and continuous education. Managing student cognitive load is a crucial aspect."
        : "Raqamli pedagogika raqamli jamiyat sharoitida insonni o'qitish va tarbiyalash qonuniyatlarini o'rganadi. Asosiy tamoyillar - bu ta'limni shaxsiylashtirish, ochiqlik, interaktivlik va uzluksizlikdir. Muhim jihat o'quvchilarning kognitiv yuklamasini to'g'ri boshqarish hisoblanadi.",
      theory2: lang === 'ru'
        ? "Медиаграмотность и цифровая этика становятся неотъемлемыми компетенциями современного преподавателя. Учитель больше не является единственным источником знаний; его роль смещается в сторону фасилитатора и навигатора в информационном потоке."
        : lang === 'en'
        ? "Media literacy and digital ethics are becoming essential competencies for modern teachers. The teacher is no longer the sole source of knowledge; their role is shifting toward being a facilitator and navigator in the information flow."
        : "Media-savodxonlik va raqamli etika zamonaviy o'qituvchining ajralmas kompetensiyalariga aylanmoqda. O'qituvchi endi bilimlarning yagona manbai emas, balki axborot oqimida yo'l ko'rsatuvchi fasilitator hisoblanadi.",
      practice1: lang === 'ru'
        ? "В практической части было разработано занятие по теме 'Основы цифровой гигиены' с использованием интерактивных опросов и совместной работы. Учащиеся выполняли групповые проекты в облачных средах, что позволило оценить их коммуникативные и технологические навыки."
        : lang === 'en'
        ? "In the practical part, a lesson on 'Fundamentals of Digital Hygiene' was designed using interactive quizzes and collaborative work. Students worked in cloud environments, enabling assessment of their communication and technical skills."
        : "Amaliy qismda interaktiv so'rovnomalar va hamkorlikda ishlash texnologiyasidan foydalangan holda 'Raqamli gigiyena asoslari' mavzusida dars ishlanmasi tayyorlandi. Talabalar bulutli muhitda guruh bo'lib ishladilar.",
      practice2: lang === 'ru'
        ? "Результаты анкетирования показали повышение вовлеченности учащихся на 35%. Использование цифровых платформ позволило индивидуализировать домашние задания и ускорить процесс проверки работ."
        : lang === 'en'
        ? "Survey results showed a 35% increase in student engagement. The use of digital platforms allowed individualizing homework assignments and accelerating the grading process."
        : "So'rovnoma natijalari o'quvchilar faolligining 35% ga oshganini ko'rsatdi. Raqamli platformalardan foydalanish uy vazifalarini shaxsiylashtirish va tekshirish vaqtini qisqartirish imkonini berdi.",
      conclusion: lang === 'ru'
        ? "Цифровая педагогика не заменяет традиционного учителя, но значительно расширяет его возможности. Интеграция технологий повышает эффективность усвоения материала и готовит студентов к жизни в цифровой экономике."
        : lang === 'en'
        ? "Digital pedagogy does not replace the traditional teacher but significantly expands their capabilities. Technology integration improves material retention and prepares students for life in a digital economy."
        : "Raqamli pedagogika an'anaviy o'qituvchining o'rnini bosmaydi, balki uning imkoniyatlarini kengaytiradi. Texnologiyalarni integratsiya qilish materialni o'zlashtirish samaradorligini oshiradi.",
      refs: [
        "Robert J. Marzano, 'The Art and Science of Teaching', 2017.",
        "UNESCO Digital Education Framework Guideline, 2021.",
        "O'zbekiston Respublikasi Xalq ta'limi tizimini 2030-yilgacha rivojlantirish konsepsiyasi."
      ]
    },
    2: {
      keywords: ["LMS", "Moodle", "Canvas", "SCORM", "Masofaviy ta'lim"],
      intro: lang === 'ru'
        ? "Системы управления обучением (LMS) совершили революцию в доставке контента. Использование платформ вроде Moodle и Canvas позволяет централизовать учебный процесс и сделать его доступным в любое время."
        : lang === 'en'
        ? "Learning Management Systems (LMS) have revolutionized content delivery. Using platforms like Moodle and Canvas allows centralizing the educational process and making it accessible anytime."
        : "Ta'limni boshqarish tizimlari (LMS) o'quv kontentini yetkazib berishda inqilob qildi. Moodle va Canvas kabi platformalar o'quv jarayonini markazlashtirish va uni istalgan vaqtda foydalanish imkonini beradi.",
      theory1: lang === 'ru'
        ? "Архитектура современной LMS включает модули управления пользователями, отслеживания прогресса, тестирования и отчетности. Использование стандартов SCORM и LTI обеспечивает интероперабельность курсов."
        : lang === 'en'
        ? "The architecture of a modern LMS includes user management, progress tracking, testing, and reporting modules. Using SCORM and LTI standards ensures course interoperability."
        : "Zamonaviy LMS arxitekturasi foydalanuvchilarni boshqarish, taraqqiyotni kuzatish, testlash va hisobot berish modullarini o'z ichiga oladi. SCORM va LTI standartlari kurslar almashinuvini osonlashtiradi.",
      theory2: lang === 'ru'
        ? "Важной функцией является автоматизация рутинных задач: генерация тестов, проверка дедлайнов и подсчет итоговых оценок. Это разгружает преподавателя для творческой работы с неуспевающими учениками."
        : lang === 'en'
        ? "An important function is the automation of routine tasks: test generation, deadline tracking, and calculation of final grades. This frees up the teacher for creative work with struggling students."
        : "Muhim vazifalardan biri - bu rutin ishlarni avtomatlashtirishdir (test generatsiyasi, muddatlarni nazorat qilish va yakuniy ballarni hisoblash). Bu o'qituvchini ijodiy ishlarga yo'naltiradi.",
      practice1: lang === 'ru'
        ? "Была спроектирована структура курса в системе Moodle, состоящая из 4 основных разделов. Внедрены лекционные материалы, видеоуроки, интерактивные задания H5P и тестовая база из 50 вопросов."
        : lang === 'en'
        ? "A course structure was designed in Moodle consisting of 4 main modules. Lecture materials, video lessons, H5P interactive tasks, and a test base of 50 questions were implemented."
        : "Moodle tizimida 4 ta moduldan iborat o'quv kursi loyihalashtirildi. Kursga ma'ruzalar, videodarslar, H5P interaktiv topshiriqlari va 50 ta savoldan iborat test bazasi kiritildi.",
      practice2: lang === 'ru'
        ? "Анализ логов показал высокий уровень вовлеченности: 82% студентов регулярно выполняли еженедельные задания. Форум обсуждений стал важной точкой коллаборации."
        : lang === 'en'
        ? "Log analysis showed a high level of engagement: 82% of students regularly completed weekly assignments. The discussion forum became an important collaboration point."
        : "Tizim loglari tahlili faollik yuqoriligini ko'rsatdi: 82% talabalar haftalik topshiriqlarni vaqtida bajardi. Munozara forumi hamkorlikning asosiy nuqtasiga aylandi.",
      conclusion: lang === 'ru'
        ? "Внедрение LMS является обязательным элементом смешанного и дистанционного образования, позволяющим создать гибкую и прозрачную систему оценивания."
        : lang === 'en'
        ? "Implementing an LMS is a mandatory element of blended and distance education, enabling a flexible and transparent assessment system."
        : "LMS tizimlarini joriy etish aralash va masofaviy ta'limning ajralmas qismi bo'lib, baholashning shaffof tizimini yaratishga imkon beradi.",
      refs: [
        "William Horton, 'E-Learning by Design', 2011.",
        "Moodle Official Documentation and Best Practices Guide, 2022.",
        "Ta'lim to'g'risidagi O'zbekiston Respublikasi Qonuni."
      ]
    },
    3: {
      keywords: ["Multimediya", "H5P", "Interaktiv taqdimot", "Edpuzzle", "Vizualizatsiya"],
      intro: lang === 'ru'
        ? "Использование мультимедийных средств в обучении повышает наглядность и способствует лучшему усвоению информации. Цель данной работы — изучить методику создания интерактивного контента для повышения активности учащихся."
        : lang === 'en'
        ? "The use of multimedia tools in education improves clarity and promotes better information retention. The purpose of this work is to study the creation of interactive content to increase student activity."
        : "Ta'limda multimediya vositalaridan foydalanish ko'rgazmalilikni oshiradi va ma'lumotlarni yaxshi o'zlashtirishga yordam beradi. Ishning maqsadi interaktiv o'quv materiallari yaratish metodikasini o'rganishdir.",
      theory1: lang === 'ru'
        ? "Теория двойного кодирования Майера утверждает, что человек лучше усваивает информацию, представленную словами и изображениями одновременно. Интерактивные видеоролики и инфографика вовлекают несколько каналов восприятия."
        : lang === 'en'
        ? "Mayer's cognitive theory of multimedia learning states that people learn better from words and pictures than from words alone. Interactive videos and infographics engage multiple channels of perception."
        : "Mayerning kognitiv nazariyasiga ko'ra, inson so'zlar va rasmlar birga berilgan ma'lumotni yaxshiroq o'zlashtiradi. Interaktiv videolar va infografikalar idrok qilish kanallarini faollashtiradi.",
      theory2: lang === 'ru'
        ? "Инструменты создания контента, такие как H5P, Canva и Edpuzzle, позволяют добавлять вопросы прямо в тело видео, создавать интерактивные плакаты и ветвящиеся сценарии."
        : lang === 'en'
        ? "Content creation tools like H5P, Canva, and Edpuzzle allow adding questions directly into videos, creating interactive posters, and branching scenarios."
        : "H5P, Canva va Edpuzzle kabi dasturlar videoning o'ziga savollar joylashtirish, interaktiv plakatlar va tarmoqlanuvchi ssenariylar yaratish imkonini beradi.",
      practice1: lang === 'ru'
        ? "Создано интерактивное видео длительностью 10 минут с помощью платформы Edpuzzle. В видео интегрировано 5 контрольных вопросов с автоматической проверкой ответов."
        : lang === 'en'
        ? "An interactive video of 10 minutes was created using Edpuzzle. Five checkpoints with automatic check answers were integrated into the video."
        : "Edpuzzle platformasida 10 daqiqalik interaktiv video yaratildi. Videoga 5 ta nazorat savollari va tushuntirishlar avtomatik tarzda integratsiya qilindi.",
      practice2: lang === 'ru'
        ? "Тестирование контента на фокус-группе студентов показало рост правильных ответов на 24% по сравнению с обычным просмотром лекции без интерактива."
        : lang === 'en'
        ? "Testing the content on a focus group of students showed a 24% increase in correct answers compared to watching a standard lecture video without interaction."
        : "Talabalar guruhida kontentni sinash natijasida oddiy ma'ruzaga nisbatan to'g'ri javoblar ko'rsatkichi 24% ga oshgani ma'lum bo'ldi.",
      conclusion: lang === 'ru'
        ? "Интерактивный мультимедийный контент превращает пассивного слушателя в активного участника образовательного процесса."
        : lang === 'en'
        ? "Interactive multimedia content transforms a passive listener into an active participant in the educational process."
        : "Interaktiv multimediya o'quvchini passiv tinglovchidan ta'lim jarayonining faol ishtirokchisiga aylantiradi.",
      refs: [
        "Richard E. Mayer, 'Multimedia Learning', 2nd Edition, 2009.",
        "Tony Bates, 'Teaching in a Digital Age', 2019."
      ]
    },
    4: {
      keywords: ["Sun'iy intellekt", "ChatGPT", "Prompt-injeneriya", "Neyrotarmoqlar", "Generativ AI"],
      intro: lang === 'ru'
        ? "Искусственный интеллект (ИИ) стремительно меняет образовательный ландшафт. ChatGPT и аналогичные генеративные модели предоставляют новые возможности для персонализации обучения и создания индивидуальных образовательных траекторий."
        : lang === 'en'
        ? "Artificial Intelligence (AI) is rapidly changing the educational landscape. ChatGPT and similar generative models offer new opportunities for personalizing learning and creating individual learning paths."
        : "Sun'iy intellekt (AI) ta'lim sohasini jadal o'zgartirmoqda. ChatGPT va boshqa generativ modellar ta'limni shaxsiylashtirish va individual o'quv traektoriyalarini yaratish uchun yangi imkoniyatlar beradi.",
      theory1: lang === 'ru'
        ? "Применение ИИ в образовании включает адаптивное тестирование, создание виртуальных репетиторов и автоматическое планирование уроков. Важной компетенцией педагога становится промпт-инжиниринг — искусство формулирования запросов для ИИ."
        : lang === 'en'
        ? "AI applications in education include adaptive testing, creating virtual tutors, and automated lesson planning. Prompt engineering—the art of structuring queries for AI—is becoming a key competency for educators."
        : "Sun'iy intellektni ta'limda qo'llash adaptiv testlash, virtual repetitorlar va dars rejalarini avtomatik tuzishni o'z ichiga oladi. O'qituvchi uchun prompt-injeneriya muhim mahoratdir.",
      theory2: lang === 'ru'
        ? "Однако генеративный ИИ несет риски галлюцинаций (ложных фактов), академического плагиата и снижения критического мышления. Необходимо учить студентов этике работы с ИИ и фактчекингу."
        : lang === 'en'
        ? "However, generative AI brings risks of hallucinations (false facts), academic plagiarism, and reduced critical thinking. It is necessary to teach students the ethics of AI work and fact-checking."
        : "Lekin generativ AI yolg'on ma'lumotlar berish (gallyusinatsiya), plagiat va tanqidiy fikrlashning pasayishi kabi xavflarni tug'diradi. Shuning uchun talabalarga fakt-chekingni o'rgatish zarur.",
      practice1: lang === 'ru'
        ? "Была разработана методическая библиотека из 15 промптов для ChatGPT, направленных на генерацию дифференцированных домашних заданий, планов уроков и критериев оценки."
        : lang === 'en'
        ? "A pedagogical library of 15 prompts for ChatGPT was developed, aiming to generate differentiated homework assignments, lesson plans, and grading rubrics."
        : "ChatGPT uchun diferensial topshiriqlar, dars rejalari va baholash mezonlarini ishlab chiqishga mo'ljallangan 15 ta promptdan iborat metodik kutubxona yaratildi.",
      practice2: lang === 'ru'
        ? "Апробация показала сокращение времени подготовки педагога к уроку на 60%. Студенты использовали ИИ как персонального ассистента для разбора сложных тем."
        : lang === 'en'
        ? "Testing showed a 60% reduction in teacher preparation time. Students utilized AI as a personal assistant to break down complex topics."
        : "Sinovlar natijasida o'qituvchining darsga tayyorgarlik ko'rish vaqti 60% ga qisqardi. Talabalar murakkab mavzularni tushunishda AI-dan yordamchi sifatida foydalanishdi.",
      conclusion: lang === 'ru'
        ? "ИИ должен служить инструментом усиления человеческих способностей, а не их заменой. Будущее образования за гибридным подходом: человек + искусственный интеллект."
        : lang === 'en'
        ? "AI should serve as a tool to augment human capabilities, not replace them. The future of education lies in a hybrid approach: human + artificial intelligence."
        : "AI inson o'rnini bosuvchi emas, balki uning qobiliyatlarini kuchaytiruvchi vosita bo'lishi kerak. Ta'lim kelajagi gibrid yondashuvda (inson + AI) yotadi.",
      refs: [
        "Selwyn, N. 'Should Robots Replace Teachers? AI and the Future of Education', 2019.",
        "UNESCO 'Artificial Intelligence and Education: Guidance for Policy Makers', 2021."
      ]
    }
  }

  // Fallback for other topics (5-10) using template injection
  const base = data[topicId] || data[1]
  if (!data[topicId]) {
    const extraTopics: Record<number, {
      keywords: string[]
      intro: string
      theory1: string
      theory2: string
      practice1: string
      practice2: string
      conclusion: string
      refs: string[]
    }> = {
      5: {
        keywords: ["Aralash ta'lim", "Flipped Classroom", "To'ntarilgan sinf", "Bloom taksonomiyasi", "Mustaqil ta'lim"],
        intro: lang === 'ru'
          ? "Смешанное обучение (Blended Learning) и модель перевернутого класса (Flipped Classroom) становятся стандартами инновационного образования. Целью исследования является проектирование и апробация модели смешанного обучения."
          : lang === 'en'
          ? "Blended Learning and the Flipped Classroom model are becoming standards of innovative education. The goal of the study is to design and test a blended learning model."
          : "Aralash ta'lim (Blended Learning) va Flipped Classroom (to'ntarilgan sinf) modeli innovatsion ta'lim standartlariga aylanmoqda. Tadqiqotning maqsadi aralash ta'lim modelini loyihalash va sinovdan o'tkazishdan iborat.",
        theory1: lang === 'ru'
          ? "Теоретические основы смешанного обучения базируются на интеграции очного и онлайн-обучения. Модель перевернутого класса меняет порядок усвоения знаний: ознакомление с теорией происходит дома, а практическое применение — на уроке под руководством преподавателя."
          : lang === 'en'
          ? "Theoretical foundations of blended learning are based on the integration of face-to-face and online learning. The flipped classroom model changes the knowledge acquisition sequence: theoretical familiarity happens at home, while practical application occurs in class."
          : "Aralash ta'limning nazariy asoslari bevosita va onlayn ta'lim integratsiyasiga tayanadi. Flipped Classroom modeli bilimlarni o'zlashtirish tartibini o'zgartiradi: nazariya bilan tanishish uyda, amaliy qo'llash esa sinfda o'qituvchi rahbarligida amalga oshiriladi.",
        theory2: lang === 'ru'
          ? "Важнейшим условием успешности модели является наличие качественных электронных образовательных ресурсов (видеолекций, интерактивных тестов) и готовность студентов к автономной учебной деятельности."
          : lang === 'en'
          ? "A crucial condition for the model's success is the availability of high-quality digital educational resources (video lectures, interactive tests) and students' readiness for autonomous learning."
          : "Model muvaffaqiyatining muhim sharti - bu sifatli raqamli ta'lim resurslari (videoma'ruzalar, interaktiv testlar) va talabalarning mustaqil ta'lim faoliyatiga tayyorligidir.",
        practice1: lang === 'ru'
          ? "В практической части был разработан сценарий занятия по теме 'Аралаш таълим'. Студентам за 3 дня до занятия было предоставлено короткое видео и проверочный тест на платформе."
          : lang === 'en'
          ? "In the practical part, a lesson scenario on the topic of 'Blended Learning' was developed. Students were provided with a short video and a checkpoint test on the platform 3 days before the class."
          : "Amaliy qismda 'Aralash ta'lim' mavzusi bo'yicha dars ssenariysi ishlab chiqildi. Talabalarga darsdan 3 kun oldin qisqa video va platformada nazorat testi taqdim etildi.",
        practice2: lang === 'ru'
          ? "Результаты показали, что время на практическое обсуждение кейсов увеличилось на 50%. Качество выполнения итогового задания выросло на 18% по сравнению с контрольной группой."
          : lang === 'en'
          ? "The results showed that the time for practical case discussions increased by 50%. The quality of final task completion improved by 18% compared to the control group."
          : "Natijalar shuni ko'rsatdiki, keyslarni amaliy muhokama qilish vaqti 50% ga oshdi. Yakuniy topshiriqni bajarish sifati nazorat guruhiga nisbatan 18% ga o'sdi.",
        conclusion: lang === 'ru'
          ? "Модель перевернутого класса является эффективным инструментом повышения субъектности студента и оптимизации учебного времени преподавателя."
          : lang === 'en'
          ? "The flipped classroom model is an effective tool for increasing student agency and optimizing teacher's classroom time."
          : "Flipped Classroom modeli talaba mustaqilligini oshirish va o'qituvchi dars vaqtini optimallashtirishning samarali vositasidir.",
        refs: [
          "Jonathan Bergmann, Aaron Sams, 'Flip Your Classroom', 2012.",
          "Curtis J. Bonk, Charles R. Graham, 'The Handbook of Blended Learning', 2006."
        ]
      },
      6: {
        keywords: ["Bulutli texnologiyalar", "Google Workspace", "Pedagogik hamkorlik", "Kollaboratsiya", "Birgalikda ishlash"],
        intro: lang === 'ru'
          ? "Облачные технологии трансформируют учебную среду, обеспечивая совместную работу участников в реальном времени. Цель работы — проанализировать дидактический потенциал облачных платформ в совместной проектной деятельности студентов."
          : lang === 'en'
          ? "Cloud technologies transform the educational environment by enabling real-time collaboration among participants. The goal of the work is to analyze the didactic potential of cloud platforms in joint student projects."
          : "Bulutli texnologiyalar ishtirokchilarning real vaqt rejimida hamkorlikda ishlashini ta'minlash orqali o'quv muhitini o'zgartiradi. Ishning maqsadi talabalarning hamkorlikdagi loyiha faoliyatida bulutli platformalarning didaktik salohiyatini tahlil qilishdir.",
        theory1: lang === 'ru'
          ? "Теория социального конструктивизма Выготского подчеркивает важность социального взаимодействия в обучении. Облачные инструменты (Google Docs, Miro, Trello) служат средой для коллективного конструирования знаний."
          : lang === 'en'
          ? "Vygotsky's theory of social constructivism emphasizes the importance of social interaction in learning. Cloud tools (Google Docs, Miro, Trello) serve as environments for collective knowledge construction."
          : "Vigotskiyning ijtimoiy konstruktivizm nazariyasi o'rganishda ijtimoiy muloqotning muhimligini ta'kidlaydi. Bulutli vositalar (Google Docs, Miro, Trello) bilimlarni birgalikda yaratish muhiti bo'lib xizmat qiladi.",
        theory2: lang === 'ru'
          ? "Использование облачных сервисов позволяет осуществлять формирующее оценивание и предоставлять обратную связь непосредственно в процессе работы над проектом, что повышает качество обучения."
          : lang === 'en'
          ? "The use of cloud services enables formative assessment and feedback directly during the project workflow, which increases learning quality."
          : "Bulutli xizmatlardan foydalanish shakllantiruvchi baholashni va bevosita loyiha ustida ishlash jarayonida teskari aloqa berishni ta'minlaydi, bu esa ta'lim sifatini oshiradi.",
        practice1: lang === 'ru'
          ? "В рамках практической работы была организована групповая разработка междисциплинарного проекта на Google Диск. Каждая группа вела совместный документ и планировала задачи в Trello."
          : lang === 'en'
          ? "Within the practical work, a group development of an interdisciplinary project was organized on Google Drive. Each group maintained a collaborative document and planned tasks in Trello."
          : "Amaliy ish doirasida Google Diskda guruh loyihasini ishlab chiqish tashkil etildi. Har bir guruh hamkorlikdagi hujjatni yuritdi va Trello platformasida vazifalarni rejalashtirdi.",
        practice2: lang === 'ru'
          ? "Анализ истории изменений документов показал высокую вовлеченность всех участников группы (90% активности). Студенты отметили удобство синхронного редактирования."
          : lang === 'en'
          ? "Analysis of document revision history showed high engagement of all group participants (90% activity). Students highlighted the convenience of synchronous editing."
          : "Hujjatlar tahrirlash tarixi tahlili barcha guruh a'zolarining faolligi yuqoriligini ko'rsatdi (90% faollik). Talabalar bir vaqtda tahrirlash qulayligini ta'kidladilar.",
        conclusion: lang === 'ru'
          ? "Облачные технологии являются базовым элементом современной цифровой школы, формирующим навыки командной работы и совместного решения проблем."
          : lang === 'en'
          ? "Cloud technologies are a foundational element of the modern digital school, building teamwork and collaborative problem-solving skills."
          : "Bulutli texnologiyalar jamoaviy ishlash va muammolarni birgalikda hal qilish ko'nikmalarini shakllantiruvchi zamonaviy raqamli maktabning asosiy elementi hisoblanadi.",
        refs: [
          "Michael Fullan, 'Preparing Teachers for a Changing World', 2018.",
          "Google Workspace for Education Deployment Guide, 2023."
        ]
      },
      7: {
        keywords: ["Gamifikatsiya", "O'yinli ta'lim", "Kahoot", "Quizizz", "Motivatsiya", "O'yin mexanikalari"],
        intro: lang === 'ru'
          ? "Геймификация в образовании направлена на повышение внутренней мотивации учащихся за счет использования игровых элементов в неигровом контексте. Цель исследования — изучить влияние игровых механик на успеваемость."
          : lang === 'en'
          ? "Gamification in education aims to increase students' intrinsic motivation by utilizing game elements in non-game contexts. The goal of the study is to analyze the impact of game mechanics on academic achievement."
          : "Ta'limda gamifikatsiya o'yin bo'lmagan vaziyatlarda o'yin elementlaridan foydalanish orqali o'quvchilarning ichki motivatsiyasini oshirishga qaratilgan. Tadqiqot maqsadi o'yin mexanikalarining o'zlashtirishga ta'sirini o'rganishdir.",
        theory1: lang === 'ru'
          ? "Теория самодетерминации (Деси и Райан) объясняет, как удовлетворение потребностей в автономии, компетентности и связи повышает мотивацию. Геймификация (баллы, значки, таблицы лидеров) поддерживает эти потребности."
          : lang === 'en'
          ? "Self-determination theory (Deci & Ryan) explains how satisfying needs for autonomy, competence, and relatedness increases motivation. Gamification (points, badges, leaderboards) supports these needs."
          : "O'z-o'zini anglash nazariyasi (Deci va Ryan) avtonomiya, kompetensiya va muloqot ehtiyojlarini qondirish motivatsiyani qanday oshirishini tushuntiradi. Gamifikatsiya (ballar, nishonlar, yetakchilar jadvali) ushbu ehtiyojlarni qo'llab-quvvatlaydi.",
        theory2: lang === 'ru'
          ? "Важно избегать превращения геймификации в исключительно внешнее стимулирование. Игровые механики должны быть тесно связаны с образовательными целями и способствовать глубокому обучению."
          : lang === 'en'
          ? "It is important to avoid turning gamification into purely external incentives. Game mechanics must be tightly coupled with learning objectives and foster deep learning."
          : "Gamifikatsiyani faqat tashqi rag'batlantirishga aylantirib qo'yishdan qochish lozim. O'yin mexanikalari ta'lim maqsadlari bilan chambarchas bog'liq bo'lishi va chuqur o'rganishga xizmat qilishi kerak.",
        practice1: lang === 'ru'
          ? "В практической части курса создана интерактивная викторина на платформе Quizizz для проверки знаний по итогам модуля. Внедрена система начисления баллов и виртуальных наград."
          : lang === 'en'
          ? "In the practical part, an interactive quiz was created on the Quizizz platform to test module knowledge. A system of points and virtual rewards was implemented."
          : "Amaliy qismda modul yakuni bo'yicha bilimlarni tekshirish uchun Quizizz platformasida interaktiv viktorina yaratildi. Ballar yig'ish va virtual mukofotlar tizimi joriy etildi.",
        practice2: lang === 'ru'
          ? "Использование Quizizz привело к росту успеваемости на 15%. Студенты отметили высокую вовлеченность и снижение уровня стресса при прохождении контроля."
          : lang === 'en'
          ? "The use of Quizizz led to a 15% increase in grades. Students noted high engagement and reduced test anxiety during assessment."
          : "Quizizz dasturidan foydalanish o'zlashtirish darajasini 15% ga oshirdi. Talabalar nazorat topshiriqlarini topshirishda stress darajasi pasayganini va qiziqish yuqori bo'lganini qayd etishdi.",
        conclusion: lang === 'ru'
          ? "Геймификация является мощным инструментом вовлечения поколения Z, трансформирующим традиционный контроль в увлекательный процесс самопроверки."
          : lang === 'en'
          ? "Gamification is a powerful tool for engaging Generation Z, transforming traditional assessments into an exciting process of self-evaluation."
          : "Gamifikatsiya Z avlodini jalb qilishning kuchli vositasi bo'lib, an'anaviy nazoratni qiziqarli o'z-o'zini tekshirish jarayoniga aylantiradi.",
        refs: [
          "Karl M. Kapp, 'The Gamification of Learning and Instruction', 2012.",
          "Yu-kai Chou, 'Actionable Gamification: Beyond Points, Badges, and Leaderboards', 2015."
        ]
      },
      8: {
        keywords: ["Mobil ta'lim", "M-learning", "Mikro-o'rganish", "Duolingo", "Kichik kontent", "Moslashuvchanlik"],
        intro: lang === 'ru'
          ? "Мобильное обучение (M-learning) предоставляет возможность учиться в любое время и в любом месте. Цель работы — исследовать эффективность технологий микрообучения на мобильных устройствах."
          : lang === 'en'
          ? "Mobile learning (M-learning) provides the opportunity to learn anytime and anywhere. The goal of the work is to analyze the effectiveness of microlearning technologies on mobile devices."
          : "Mobil ta'lim (M-learning) istalgan vaqtda va istalgan joyda o'qish imkoniyatini beradi. Ishning maqsadi mobil qurilmalarda mikro-o'rganish texnologiyalarining samaradorligini tadqiq qilishdir.",
        theory1: lang === 'ru'
          ? "Микрообучение предполагает разделение учебного материала на небольшие, законченные смысловые блоки (3-5 минут). Это соответствует фрагментарному характеру восприятия информации современными студентами."
          : lang === 'en'
          ? "Microlearning involves dividing educational content into small, self-contained units (3-5 minutes). This matches the fragmented nature of information perception in modern students."
          : "Mikro-o'rganish o'quv materialini kichik, tugallangan bloklarga (3-5 daqiqa) bo'lishni nazarda tutadi. Bu zamonaviy talabalarning axborotni qisqa va tez qabul qilish xususiyatiga mos keladi.",
        theory2: lang === 'ru'
          ? "Мобильные устройства позволяют использовать геолокационные задания, мгновенные пуш-уведомления для поддержания регулярности занятий и аудиовизуальные форматы (подкасты, карточки)."
          : lang === 'en'
          ? "Mobile devices enable geolocation tasks, instant push notifications to maintain study habits, and audiovisual formats (podcasts, flashcards)."
          : "Mobil qurilmalar geolokatsion topshiriqlarni bajarish, muntazam shug'ullanishni ta'minlash uchun push-xabarlar yuborish va vaqtida bajarilishini nazorat qilish imkonini beradi.",
        practice1: lang === 'ru'
          ? "Был разработан мобильный микрокурс из 10 уроков-карточек по теме 'Цифровая грамотность' с использованием платформы Telegram-ботов."
          : lang === 'en'
          ? "A mobile micro-course of 10 card-lessons on the topic of 'Digital Literacy' was designed using a Telegram bot platform."
          : "Telegram-bot platformasi yordamida 'Raqamli savodxonlik' mavzusida 10 ta qisqa darsdan iborat mobil mikro-kurs ishlab chiqildi.",
        practice2: lang === 'ru'
          ? "Показатель завершаемости курса составил 92% (что значительно выше стандартных MOOC-платформ). Студенты тратили на обучение в среднем 6 минут в день."
          : lang === 'en'
          ? "The course completion rate was 92% (significantly higher than standard MOOC platforms). Students spent an average of 6 minutes per day studying."
          : "Kursni yakunlash ko'rsatkichi 92% ni tashkil etdi (bu standart masofaviy platformalardan ancha yuqori). Talabalar o'qishga kuniga o'rtacha 6 daqiqa vaqt sarfladilar.",
        conclusion: lang === 'ru'
          ? "Мобильное микрообучение является оптимальным форматом для непрерывного образования и быстрого освоения практических навыков в условиях дефицита времени."
          : lang === 'en'
          ? "Mobile microlearning is an optimal format for lifelong learning and rapid acquisition of practical skills under time constraints."
          : "Mobil mikro-o'rganish vaqt taqchilligi sharoitida uzluksiz ta'lim va amaliy ko'nikmalarni tezda egallash uchun eng qulay format hisoblanadi.",
        refs: [
          "Ally, M. 'Mobile Learning: Transforming the Delivery of Education and Training', 2009.",
          "Hug, T. 'Didactics of Microlearning', 2007."
        ]
      },
      9: {
        keywords: ["Raqamli baholash", "Kriterial baholash", "Kahoot", "Plickers", "Shakllantiruvchi baholash", "Google Forms"],
        intro: lang === 'ru'
          ? "Цифровое оценивание позволяет сделать процесс контроля знаний быстрым, объективным и информативным. Цель работы — изучить инструменты и критерии цифрового оценивания учащихся."
          : lang === 'en'
          ? "Digital assessment makes the process of testing knowledge fast, objective, and informative. The goal of the work is to study tools and criteria of digital student assessment."
          : "Raqamli baholash bilimni nazorat qilish jarayonini tezkor, ob'ektiv va informativ qilish imkonini beradi. Ishning maqsadi talabalarni raqamli baholash vositalari va mezonlarini o'rganishdir.",
        theory1: lang === 'ru'
          ? "Переход от суммативного к формирующему оцениванию является трендом современного образования. Цифровые инструменты обеспечивают мгновенную обратную связь, помогая скорректировать траекторию обучения."
          : lang === 'en'
          ? "The transition from summative to formative assessment is a key trend in modern education. Digital tools provide instant feedback, helping adjust the learning pathway."
          : "Summativ baholashdan shakllantiruvchi (formativ) baholashga o'tish zamonaviy ta'lim tendensiyasidir. Raqamli vositalar dars jarayonida darhol teskari aloqa berishni ta'minlaydi.",
        theory2: lang === 'ru'
          ? "Аналитические панели (dashboards) в LMS позволяют педагогу визуализировать прогресс класса, выявлять типичные ошибки и проводить глубокий анализ качества тестовых заданий."
          : lang === 'en'
          ? "Analytical dashboards in LMS enable teachers to visualize class progress, identify common mistakes, and conduct deep analysis of test task quality."
          : "LMS tizimidagi tahliliy panellar (dashboard) o'qituvchiga guruh faoliyatini vizual kuzatish, umumiy xatolarni aniqlash va test sifati tahlilini o'tkazish imkonini beradi.",
        practice1: lang === 'ru'
          ? "Создан комплекс оценочных тестов в Google Forms и Plickers по предмету. Настроена автоматическая отправка результатов и развернутые пояснения к неверным ответам."
          : lang === 'en'
          ? "A set of assessment tests was created in Google Forms and Plickers. Automatic result dispatch and detailed explanations for incorrect answers were configured."
          : "Google Forms va Plickers tizimida baholash testlari majmuasi yaratildi. Natijalarni avtomatik yuborish va xato javoblar uchun batafsil tushuntirishlar berish yo'lga qo'yildi.",
        practice2: lang === 'ru'
          ? "Анализ результатов сократил время на проверку работ преподавателем на 80%. Ученики получили детальные отчеты о своих сильных и слабых сторонах."
          : lang === 'en'
          ? "Analysis of results reduced grading time for the teacher by 80%. Students received detailed reports on their strengths and weaknesses."
          : "Natijalar tahlili o'qituvchining ishlarni tekshirish vaqtini 80% ga qisqartirdi. Talabalar o'zlarining kuchli va kuchsiz tomonlari to'g'risida batafsil hisobot oldilar.",
        conclusion: lang === 'ru'
          ? "Внедрение цифрового оценивания устраняет субъективизм преподавателя и превращает оценку из приговора в инструмент развития."
          : lang === 'en'
          ? "Implementing digital assessment eliminates teacher bias and transforms grades from a final verdict into a developmental tool."
          : "Raqamli baholashni joriy etish sub'ektivlikni yo'qotadi va bahoni shunchaki jazo emas, balki rivojlanish vositasiga aylantiradi.",
        refs: [
          "Dylan Wiliam, 'Embedded Formative Assessment', 2011.",
          "Garrison, C., Ehringhaus, M. 'Formative and Summative Assessments in the Classroom', 2007."
        ]
      },
      10: {
        keywords: ["VR/AR", "Virtual borliq", "Simulyatsiyalar", "Ko'rgazmalilik", "3D modellashtirish"],
        intro: lang === 'ru'
          ? "Технологии виртуальной (VR) и дополненной (AR) реальности открывают новые горизонты для наглядности в образовании. Цель работы — разработать методику интеграции VR-симуляций в лабораторные работы."
          : lang === 'en'
          ? "Virtual (VR) and Augmented (AR) reality technologies open new horizons for visualization in education. The goal of the work is to develop a methodology for integrating VR simulations into lab activities."
          : "Virtual (VR) va to'ldirilgan (AR) borliq texnologiyalari ta'limda ko'rgazmalilikning yangi ufqlarini ochadi. Ishning maqsadi VR simulyatsiyalarini o'quv laboratoriya mashg'ulotlariga integratsiya qilish metodikasini ishlab chiqishdir.",
        theory1: lang === 'ru'
          ? "Эффект присутствия (immersion) в VR повышает эмоциональное вовлечение и улучшает пространственное понимание сложных объектов (молекулы, механизмы, анатомия)."
          : lang === 'en'
          ? "The effect of immersion in VR increases emotional engagement and improves spatial understanding of complex objects (molecules, mechanisms, anatomy)."
          : "VR tizimidagi borliq effekti (immersion) hissiy jalb etishni oshiradi va murakkab ob'ektlar (molekulalar, mexanizmlar, anatomiya) haqidagi fazoviy tasavvurni yaxshilaydi.",
        theory2: lang === 'ru'
          ? "AR позволяет накладывать цифровые слои информации на реальные объекты с помощью смартфонов, делая изучение учебников интерактивным и динамичным."
          : lang === 'en'
          ? "AR allows overlaying digital layers of information onto real objects using smartphones, making textbook study interactive and dynamic."
          : "AR texnologiyasi smartfonlar yordamida real ob'ektlar ustiga raqamli ma'lumot qatlamlarini joylashtirish imkonini beradi, bu esa darsliklarni interaktiv va dinamik qiladi.",
        practice1: lang === 'ru'
          ? "Разработан фрагмент урока физики с использованием мобильного AR-приложения для визуализации силовых полей и магнитной индукции."
          : lang === 'en'
          ? "A physics lesson segment was developed using a mobile AR application to visualize magnetic induction and force fields."
          : "Magnit induksiyasi va kuch maydonlarini vizualizatsiya qilish uchun mobil AR ilovasidan foydalangan holda fizika darsi segmenti ishlab chiqildi.",
        practice2: lang === 'ru'
          ? "Оценка на тестовой группе показала рост запоминания сложных физических концепций на 30% по сравнению с изучением только по 2D-рисункам."
          : lang === 'en'
          ? "Assessment of the test group showed a 30% increase in retaining complex physics concepts compared to studying solely with 2D drawings."
          : "Nazorat guruhida o'tkazilgan sinov murakkab fizik tushunchalarni eslab qolish darajasi 2D rasmlarga qaraganda 30% ga oshganini ko'rsatdi.",
        conclusion: lang === 'ru'
          ? "VR/AR технологии незаменимы в ситуациях, когда реальный эксперимент опасен, дорог или физически невозможен в рамках школы."
          : lang === 'en'
          ? "VR/AR technologies are indispensable when real experiments are dangerous, expensive, or physically impossible in a classroom setting."
          : "VR/AR texnologiyalari real tajribani o'tkazish xavfli, qimmat yoki maktab sharoitida imkonsiz bo'lgan hollarda juda zarurdir.",
        refs: [
          "Jeremy Bailenson, 'Experience on Demand: What Virtual Reality Is and How It Can Transform Our Lives', 2018.",
          "AR in Education Handbook, Springer, 2021."
        ]
      }
    }
    return extraTopics[topicId] || data[1]
  }
  return base
}

// Generates highly detailed, multi-page HTML content that looks like a real 4-page academic paper
export function generateAcademicHTML(data: DocData, lang: string = 'uz'): string {
  const details = getTopicDetails(data.topicId, lang)
  
  const strings = {
    uz: {
      university: "O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI",
      subject: "Fan: Raqamli pedagogika va ta'lim texnologiyalari",
      prepared: "Tayyorladi",
      checked: "Qabul qildi",
      group: "Guruh",
      tashkent: "Toshkent - 2026",
      introTitle: "I. KIRISH BO'LIMI VA DOLZARBLIGI",
      theoryTitle: "II. MAVZUNING NAZARIY-PEDAGOGIK ASOSLARI",
      practiceTitle: "III. AMALIY METODIKA VA TATBIQ ETISH",
      analysisTitle: "IV. SAMARADORLIK TAHLILI VA NATIJALAR",
      conclusionTitle: "V. XULOSA VA TAVSIYALAR",
      refsTitle: "VI. FOYDALANILGAN ADABIYOTLAR RO'YXATI",
      grade: "Baho",
      feedback: "O'qituvchi taqrizi"
    },
    ru: {
      university: "МИНИСТЕРСТВО ВЫСШЕГО ОБРАЗОВАНИЯ, НАУКИ И ИННОВАЦИЙ РЕСПУБЛИКИ УЗБЕКИСТАН",
      subject: "Предмет: Цифровая педагогика и образовательные технологии",
      prepared: "Выполнил",
      checked: "Проверил",
      group: "Группа",
      tashkent: "Ташкент - 2026",
      introTitle: "I. ВВЕДЕНИЕ И АКТУАЛЬНОСТЬ ТЕМЫ",
      theoryTitle: "II. ТЕОРЕТИКО-ПЕДАГОГИЧЕСКИЕ ОСНОВЫ ТЕМЫ",
      practiceTitle: "III. ПРАКТИЧЕСКАЯ МЕТОДОЛОГИЯ И ВНЕДРЕНИЕ",
      analysisTitle: "IV. АНАЛИЗ ЭФФЕКТИВНОСТИ И РЕЗУЛЬТАТЫ",
      conclusionTitle: "V. ЗАКЛЮЧЕНИЕ И РЕКОМЕНДАЦИИ",
      refsTitle: "VI. СПИСОК ИСПОЛЬЗОВАННОЙ ЛИТЕРАТУРЫ",
      grade: "Оценка",
      feedback: "Рецензия преподавателя"
    },
    en: {
      university: "MINISTRY OF HIGHER EDUCATION, SCIENCE AND INNOVATIONS OF THE REPUBLIC OF UZBEKISTAN",
      subject: "Subject: Digital Pedagogy and Educational Technologies",
      prepared: "Prepared by",
      checked: "Checked by",
      group: "Group",
      tashkent: "Tashkent - 2026",
      introTitle: "I. INTRODUCTION AND RELEVANCE",
      theoryTitle: "II. THEORETICAL AND PEDAGOGICAL FOUNDATIONS",
      practiceTitle: "III. PRACTICAL METHODOLOGY & IMPLEMENTATION",
      analysisTitle: "IV. EFFECTIVENESS ANALYSIS AND RESULTS",
      conclusionTitle: "V. CONCLUSION AND RECOMMENDATIONS",
      refsTitle: "VI. REFERENCES AND BIBLIOGRAPHY",
      grade: "Grade",
      feedback: "Teacher feedback"
    }
  }[lang as 'uz' | 'ru' | 'en'] || strings.uz

  const pageStyle = `
    <style>
      .academic-doc {
        font-family: 'Times New Roman', Times, serif;
        color: #1a1a1a;
        line-height: 1.6;
        background: white;
        padding: 40px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-width: 800px;
        margin: 0 auto;
        border-radius: 4px;
      }
      .academic-page {
        position: relative;
        min-height: 950px;
        padding-bottom: 60px;
        border-bottom: 2px dashed #e2e8f0;
        margin-bottom: 40px;
      }
      .academic-page:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .academic-header {
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 40px;
        border-bottom: 1px solid #1a1a1a;
        padding-bottom: 10px;
        text-transform: uppercase;
      }
      .title-page {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        height: 850px;
      }
      .title-main {
        font-size: 26px;
        font-weight: bold;
        margin-top: 100px;
        color: #1e3a8a;
        text-transform: uppercase;
      }
      .title-sub {
        font-size: 18px;
        margin-top: 20px;
        font-style: italic;
      }
      .student-info-box {
        align-self: flex-end;
        text-align: right;
        margin-top: 150px;
        font-size: 16px;
        border: 1px solid #cbd5e1;
        padding: 15px;
        background: #f8fafc;
        border-radius: 6px;
        width: 300px;
      }
      .academic-h1 {
        font-size: 18px;
        font-weight: bold;
        color: #1e3a8a;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 6px;
        margin-top: 30px;
        margin-bottom: 15px;
        text-transform: uppercase;
      }
      .academic-p {
        font-size: 15px;
        text-indent: 40px;
        text-align: justify;
        margin-bottom: 15px;
      }
      .academic-list {
        margin-left: 50px;
        margin-bottom: 15px;
        font-size: 15px;
      }
      .academic-list li {
        list-style-type: decimal;
        margin-bottom: 5px;
      }
      .page-footer {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        color: #64748b;
        border-top: 1px solid #e2e8f0;
        padding-top: 8px;
      }
    </style>
  `

  return `
    ${pageStyle}
    <div class="academic-doc">
      <!-- PAGE 1: TITLE PAGE -->
      <div class="academic-page">
        <div class="title-page">
          <div>
            <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${strings.university}
            </div>
            <div style="height: 2px; bg-color: #1e3a8a; width: 60%; margin: 15px auto;"></div>
            <div style="font-size: 14px; margin-top: 10px; font-weight: 500;">
              ${strings.subject}
            </div>
          </div>
          
          <div>
            <div style="font-size: 12px; color: #64748b; font-weight: bold; letter-spacing: 2px;">AMALIY VAZIFA / MUSTAQIL ISH</div>
            <div class="title-main">${data.title}</div>
            <div class="title-sub">${strings.subject} doirasidagi amaliy tadqiqot</div>
          </div>

          <div class="student-info-box">
            <div><strong>${strings.prepared}:</strong> ${data.studentName}</div>
            <div><strong>${strings.group}:</strong> ${data.groupName}</div>
            <div style="margin-top: 10px; height: 1px; background: #e2e8f0;"></div>
            <div style="margin-top: 5px;"><strong>${strings.checked}:</strong> O'qituvchi</div>
            <div><strong>${strings.grade}:</strong> ____________</div>
          </div>

          <div style="font-weight: bold; font-size: 14px; margin-bottom: 20px;">
            ${strings.tashkent}
          </div>
        </div>
        <div class="page-footer">1-bet</div>
      </div>

      <!-- PAGE 2: INTRODUCTION & THEORY PART 1 -->
      <div class="academic-page">
        <div class="academic-header">${data.title}</div>
        
        <h1 class="academic-h1">${strings.introTitle}</h1>
        <p class="academic-p">
          Zamonaviy axborot jamiyati sharoitida ta'lim tizimini raqamlashtirish eng dolzarb vazifalardan biri hisoblanadi. O'quv jarayonlariga yangi axborot texnologiyalarini integratsiya qilish o'qitish sifatini yangi bosqichga ko'taradi. Ushbu tadqiqot ishining maqsadi belgilangan mavzuning ta'limdagi o'rnini yoritish va uni mukammal darajada o'rganishdan iborat.
        </p>
        <p class="academic-p">
          ${details.intro}
        </p>
        <p class="academic-p">
          Ta'limda raqamli vositalarning tatbiq etilishi o'quvchilarning individual qobiliyatlarini rivojlantirishga ko'maklashadi va ularning faolligini sezilarli darajada rag'batlantiradi. Nazariy jihatdan ushbu yondashuv mustaqil ta'lim konsepsiyasiga to'la mos keladi.
        </p>

        <h1 class="academic-h1">${strings.theoryTitle}</h1>
        <p class="academic-p">
          Nazariy metodologiya zamonaviy pedagogik yondashuvlarga tayanadi. Raqamli pedagogika doirasida talabalarning kognitiv yuklamasini muvozanatlash, interfaol o'rganish muhitini shakllantirish va har bir ta'lim oluvchiga individual yondashuv tizimini joriy qilish nazariy jihatdan asoslab berilgan.
        </p>
        <p class="academic-p">
          ${details.theory1}
        </p>
        <div class="page-footer">2-bet</div>
      </div>

      <!-- PAGE 3: THEORY PART 2 & PRACTICAL METHODOLOGY -->
      <div class="academic-page">
        <div class="academic-header">${data.title}</div>
        
        <p class="academic-p">
          ${details.theory2}
        </p>
        <p class="academic-p">
          Tadqiqotning nazariy qismi shuni ko'rsatadiki, yangi tizimlar o'qituvchilarning darsga tayyorgarlik ko'rish vaqtini qisqartiradi, shuningdek, darslarni yanada jonli va tushunarli tashkil etish imkonini taqdim etadi. Bu zamonaviy dars standartlarining asosiy talabi hisoblanadi.
        </p>

        <h1 class="academic-h1">${strings.practiceTitle}</h1>
        <p class="academic-p">
          Amaliy qismda o'quv jarayonida ushbu usulning samaradorligini sinab ko'rish maqsadida maxsus tajriba darsi tashkil etildi. Dars davomida talabalarga mavzuga doir topshiriqlar berildi va ularni bajarish tezligi hamda sifati nazorat qilindi.
        </p>
        <p class="academic-p">
          ${details.practice1}
        </p>
        <p class="academic-p">
          Metodologiyaning amaliy jihatdan tatbiq etilishi har bir o'quvchining o'z tempida ishlashiga sharoit yaratdi va guruhdagi barcha o'quvchilar loyiha ishida teng faollik ko'rsatishdi.
        </p>
        <div class="page-footer">3-bet</div>
      </div>

      <!-- PAGE 4: RESULTS & CONCLUSION & REFERENCES -->
      <div class="academic-page">
        <div class="academic-header">${data.title}</div>
        
        <h1 class="academic-h1">${strings.analysisTitle}</h1>
        <p class="academic-p">
          Olingan natijalar maxsus tahlillar yordamida qayta ishlandi. Tadqiqotda ishtirok etgan o'quvchilar orasida o'tkazilgan so'rovnoma va test sinovlari quyidagi ijobiy natijalarni qayd etdi:
        </p>
        <p class="academic-p">
          ${details.practice2}
        </p>

        <h1 class="academic-h1">${strings.conclusionTitle}</h1>
        <p class="academic-p">
          Xulosa qilib aytganda, raqamli pedagogika vositalaridan tizimli foydalanish ta'lim sifati va samaradorligini oshirishda eng muhim omildir. Ushbu loyihada erishilgan natijalar kelgusida o'quv jarayonlarini yanada rivojlantirish uchun asos bo'lib xizmat qiladi.
        </p>
        <p class="academic-p">
          ${details.conclusion}
        </p>

        <h1 class="academic-h1">${strings.refsTitle}</h1>
        <ul class="academic-list">
          ${details.refs.map(ref => `<li>${ref}</li>`).join('')}
          <li>Pedagogik innovatsiyalar jurnali, 2024-yil nashri.</li>
          <li>Raqamli ta'lim resurslaridan samarali foydalanish qo'llanmasi.</li>
        </ul>
        <div class="page-footer">4-bet</div>
      </div>
    </div>
  `
}

// Generates a professional 4-page academic Word Document (.docx) as a Blob
export async function generateAcademicDocxBlob(data: DocData, lang: string = 'uz'): Promise<Blob> {
  const details = getTopicDetails(data.topicId, lang)

  const strings = {
    uz: {
      university: "O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI",
      subject: "Fan: Raqamli pedagogika va ta'lim texnologiyalari",
      prepared: "Tayyorladi",
      checked: "Qabul qildi",
      group: "Guruh",
      tashkent: "Toshkent - 2026",
      introTitle: "I. KIRISH BO'LIMI VA DOLZARBLIGI",
      theoryTitle: "II. MAVZUNING NAZARIY-PEDAGOGIK ASOSLARI",
      practiceTitle: "III. AMALIY METODIKA VA TATBIQ ETISH",
      analysisTitle: "IV. SAMARADORLIK TAHLILI VA NATIJALAR",
      conclusionTitle: "V. XULOSA VA TAVSIYALAR",
      refsTitle: "VI. FOYDALANILGAN ADABIYOTLAR RO'YXATI",
      grade: "Baho",
      date: "Sana",
      submittedDate: "Yuborilgan sana",
      practiceTitleSub: "Mustaqil ish / Amaliyot ishi",
      status: "Holat",
      feedback: "O'qituvchi taqrizi"
    },
    ru: {
      university: "МИНИСТЕРСТВО ВЫСШЕГО ОБРАЗОВАНИЯ, НАУКИ И ИННОВАЦИЙ РЕСПУБЛИКИ УЗБЕКИСТАН",
      subject: "Предмет: Цифровая педагогика и образовательные технологии",
      prepared: "Выполнил",
      checked: "Проверил",
      group: "Группа",
      tashkent: "Ташкент - 2026",
      introTitle: "I. ВВЕДЕНИЕ И АКТУАЛЬНОСТЬ ТЕМЫ",
      theoryTitle: "II. ТЕОРЕТИКО-ПЕДАГОГИЧЕСКИЕ ОСНОВЫ ТЕМЫ",
      practiceTitle: "III. ПРАКТИЧЕСКАЯ МЕТОДОЛОГИЯ И ВНЕДРЕНИЕ",
      analysisTitle: "IV. АНАЛИЗ ЭФФЕКТИВНОСТИ И РЕЗУЛЬТАТЫ",
      conclusionTitle: "V. ЗАКЛЮЧЕНИЕ И РЕКОМЕНДАЦИИ",
      refsTitle: "VI. СПИСОК ИСПОЛЬЗОВАННОЙ ЛИТЕРАТУРЫ",
      grade: "Оценка",
      date: "Дата",
      submittedDate: "Дата отправки",
      practiceTitleSub: "Самостоятельная работа / Практическая работа",
      status: "Статус",
      feedback: "Рецензия преподавателя"
    },
    en: {
      university: "MINISTRY OF HIGHER EDUCATION, SCIENCE AND INNOVATIONS OF THE REPUBLIC OF UZBEKISTAN",
      subject: "Subject: Digital Pedagogy and Educational Technologies",
      prepared: "Prepared by",
      checked: "Checked by",
      group: "Group",
      tashkent: "Tashkent - 2026",
      introTitle: "I. INTRODUCTION AND RELEVANCE",
      theoryTitle: "II. THEORETICAL AND PEDAGOGICAL FOUNDATIONS",
      practiceTitle: "III. PRACTICAL METHODOLOGY & IMPLEMENTATION",
      analysisTitle: "IV. EFFECTIVENESS ANALYSIS AND RESULTS",
      conclusionTitle: "V. CONCLUSION AND RECOMMENDATIONS",
      refsTitle: "VI. REFERENCES AND BIBLIOGRAPHY",
      grade: "Grade",
      date: "Date",
      submittedDate: "Submitted Date",
      practiceTitleSub: "Independent Work / Practice Work",
      status: "Status",
      feedback: "Teacher feedback"
    }
  }[lang as 'uz' | 'ru' | 'en'] || strings.uz

  const createInfoCell = (text: string, bold = false, shading = '') => {
    return new TableCell({
      width: { size: 4500, type: WidthType.DXA },
      shading: shading ? { type: ShadingType.SOLID, color: shading } : undefined,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold,
              font: 'Times New Roman',
              size: 24,
            }),
          ],
          spacing: { before: 80, after: 80 },
        }),
      ],
    })
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 28, // 14pt
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // PAGE 1: TITLE PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: strings.university,
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 3, color: '1E3A8A' },
            },
            children: [],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            children: [
              new TextRun({
                text: strings.subject,
                italics: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 1000 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: strings.practiceTitleSub.toUpperCase(),
                bold: true,
                size: 24,
                color: '6B7280',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 36,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 1200 }, children: [] }),

          // Info Table
          new Table({
            width: { size: 9000, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  createInfoCell(strings.prepared, true, 'F1F5F9'),
                  createInfoCell(data.studentName),
                ],
              }),
              new TableRow({
                children: [
                  createInfoCell(strings.group, true, 'F1F5F9'),
                  createInfoCell(data.groupName),
                ],
              }),
              new TableRow({
                children: [
                  createInfoCell(strings.checked, true, 'F1F5F9'),
                  createInfoCell("Fan o'qituvchisi"),
                ],
              }),
              new TableRow({
                children: [
                  createInfoCell(strings.date, true, 'F1F5F9'),
                  createInfoCell(data.date),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 1400 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: strings.tashkent,
                bold: true,
                size: 26,
              }),
            ],
          }),

          // Page Break to Page 2
          new Paragraph({ children: [new PageBreak()] }),

          // PAGE 2: INTRODUCTION & THEORY PART 1
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: strings.introTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Zamonaviy axborot jamiyati sharoitida ta'lim tizimini raqamlashtirish eng dolzarb vazifalardan biri hisoblanadi. O'quv jarayonlariga yangi axborot texnologiyalarini integratsiya qilish o'qitish sifatini yangi bosqichga ko'taradi. Ushbu tadqiqot ishining maqsadi belgilangan mavzuning ta'limdagi o'rnini yoritish va uni mukammal darajada o'rganishdan iborat."
              ),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.intro),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Ta'limda raqamli vositalarning tatbiq etilishi o'quvchilarning individual qobiliyatlarini rivojlantirishga ko'maklashadi va ularning faolligini sezilarli darajada rag'batlantiradi. Nazariy jihatdan ushbu yondashuv mustaqil ta'lim konsepsiyasiga to'la mos keladi."
              ),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: strings.theoryTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Nazariy metodologiya zamonaviy pedagogik yondashuvlarga tayanadi. Raqamli pedagogika doirasida talabalarning kognitiv yuklamasini muvozanatlash, interfaol o'rganish muhitini shakllantirish va har bir ta'lim oluvchiga individual yondashuv tizimini joriy qilish nazariy jihatdan asoslab berilgan."
              ),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.theory1),
            ],
          }),

          // Page Break to Page 3
          new Paragraph({ children: [new PageBreak()] }),

          // PAGE 3: THEORY PART 2 & PRACTICAL METHODOLOGY
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.theory2),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Tadqiqotning nazariy qismi shuni ko'rsatadiki, yangi tizimlar o'qituvchilarning darsga tayyorgarlik ko'rish vaqtini qisqartiradi, shuningdek, darslarni yanada jonli va tushunarli tashkil etish imkonini taqdim etadi. Bu zamonaviy dars standartlarining asosiy talabi hisoblanadi."
              ),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: strings.practiceTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Amaliy qismda o'quv jarayonida ushbu usulning samaradorligini sinab ko'rish maqsadida maxsus tajriba darsi tashkil etildi. Dars davomida talabalarga mavzuga doir topshiriqlar berildi va ularni bajarish tezligi hamda sifati nazorat qilindi."
              ),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.practice1),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Metodologiyaning amaliy jihatdan tatbiq etilishi har bir o'quvchining o'z tempida ishlashiga sharoit yaratdi va guruhdagi barcha o'quvchilar loyiha ishida teng faollik ko'rsatishdi."
              ),
            ],
          }),

          // Page Break to Page 4
          new Paragraph({ children: [new PageBreak()] }),

          // PAGE 4: RESULTS, CONCLUSION & REFERENCES
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: strings.analysisTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Olingan natijalar maxsus tahlillar yordamida qayta ishlandi. Tadqiqotda ishtirok etgan o'quvchilar orasida o'tkazilgan so'rovnoma va test sinovlari quyidagi ijobiy natijalarni qayd etdi:"
              ),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.practice2),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: strings.conclusionTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(
                "Xulosa qilib aytganda, raqamli pedagogika vositalaridan tizimli foydalanish ta'lim sifati va samaradorligini oshirishda eng muhim omildir. Ushbu loyihada erishilgan natijalar kelgusida o'quv jarayonlarini yanada rivojlantirish uchun asos bo'lib xizmat qiladi."
              ),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            indent: { firstLine: 720 },
            alignment: AlignmentType.JUSTIFY,
            children: [
              new TextRun(details.conclusion),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: strings.refsTitle,
                bold: true,
                color: '1E3A8A',
                size: 28,
              }),
            ],
          }),

          ...details.refs.map((ref, index) => {
            return new Paragraph({
              spacing: { after: 100 },
              indent: { left: 360 },
              children: [
                new TextRun({
                  text: `${index + 1}. ${ref}`,
                  size: 26,
                }),
              ],
            })
          }),
          new Paragraph({
            spacing: { after: 100 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `${details.refs.length + 1}. Pedagogik innovatsiyalar jurnali, 2024-yil nashri.`,
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            indent: { left: 360 },
            children: [
              new TextRun({
                text: `${details.refs.length + 2}. Raqamli ta'lim resurslaridan samarali foydalanish qo'llanmasi.`,
                size: 26,
              }),
            ],
          }),
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}
