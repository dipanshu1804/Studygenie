export interface SubjectInfo {
  name: string;
  emoji: string;
  icon: string;
  color: string;       // Tailwind gradient classes for card bg
  border: string;      // Tailwind border class
  accent: string;      // Tailwind text colour class
  description: string;
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tips: string[];
  popularQuestions: string[];
}

export const SUBJECT_CONTENT: Record<string, SubjectInfo> = {
  Mathematics: {
    name: 'Mathematics',
    emoji: '📐',
    icon: '∑',
    color: 'from-blue-600/10 to-indigo-600/10',
    border: 'border-blue-500/25',
    accent: 'text-blue-400',
    description:
      'Master the language of the universe — from basic arithmetic to advanced calculus. ' +
      'Mathematics develops logical reasoning and problem-solving skills essential in every ' +
      'field of science, engineering, economics, and computing.',
    topics: [
      'Algebra',
      'Calculus',
      'Geometry',
      'Trigonometry',
      'Statistics & Probability',
      'Number Theory',
      'Matrices & Determinants',
      'Differential Equations',
      'Complex Numbers',
      'Linear Programming',
    ],
    difficulty: 'Intermediate',
    tips: [
      'Practice solving problems daily — mathematics is a skill, not a subject you memorise.',
      'Always write every working step; you find mistakes faster and score method marks in exams.',
      'Draw diagrams for geometry and word problems to visualise what the question is asking.',
    ],
    popularQuestions: [
      'How do I solve quadratic equations step by step?',
      'What is the chain rule in calculus and when do I use it?',
      'How do I find the determinant of a 3×3 matrix?',
    ],
  },

  Programming: {
    name: 'Programming',
    emoji: '💻',
    icon: '</>',
    color: 'from-emerald-600/10 to-teal-600/10',
    border: 'border-emerald-500/25',
    accent: 'text-emerald-400',
    description:
      'Learn to write instructions that computers execute. Programming covers algorithms, ' +
      'data structures, and software design across languages like Python, Java, C++, and JavaScript. ' +
      'It is the foundation of all modern technology.',
    topics: [
      'Arrays & Linked Lists',
      'Recursion',
      'Object-Oriented Programming',
      'Sorting & Searching',
      'Trees & Graphs',
      'Dynamic Programming',
      'Time & Space Complexity',
      'Database & SQL',
      'APIs & Web Basics',
      'Operating System Concepts',
    ],
    difficulty: 'Intermediate',
    tips: [
      'Code every day — even 30 minutes of deliberate practice builds strong muscle memory.',
      'Read error messages carefully before asking for help; they usually tell you exactly what broke.',
      'Understand the concept behind each structure or algorithm, not just the syntax.',
    ],
    popularQuestions: [
      'What is the difference between a stack and a queue?',
      'How does recursion work — explain with a simple example.',
      'What is Big O notation and why does it matter?',
    ],
  },

  Science: {
    name: 'Science',
    emoji: '🔬',
    icon: '⚗',
    color: 'from-cyan-600/10 to-sky-600/10',
    border: 'border-cyan-500/25',
    accent: 'text-cyan-400',
    description:
      'Explore the physical world through observation, experimentation, and reasoning. ' +
      'General science spans physics, chemistry, biology, and earth sciences at an ' +
      'introductory level, building the foundation for all specialised sciences.',
    topics: [
      'Scientific Method',
      'Matter & Its Properties',
      'Forces & Motion',
      'Waves, Sound & Light',
      'Electricity & Magnetism',
      'Atoms & Elements',
      'Mixtures & Solutions',
      'Living Systems',
      'Earth & Space Science',
      'Environmental Science',
    ],
    difficulty: 'Beginner',
    tips: [
      'Connect every concept to a real-world example — it makes abstract ideas concrete and memorable.',
      'Draw and label diagrams; visual learners retain science concepts much faster.',
      'Form your own hypothesis before looking up the answer — it trains scientific thinking.',
    ],
    popularQuestions: [
      'What is the difference between speed and velocity?',
      'How does the water cycle work step by step?',
      'What are the states of matter and how do they change?',
    ],
  },

  Physics: {
    name: 'Physics',
    emoji: '⚛️',
    icon: 'Φ',
    color: 'from-violet-600/10 to-purple-600/10',
    border: 'border-violet-500/25',
    accent: 'text-violet-400',
    description:
      'Understand the fundamental laws governing matter, energy, space, and time. ' +
      'Physics explains everything from subatomic particles to the movement of galaxies — ' +
      'it is the most fundamental of all the natural sciences.',
    topics: [
      "Newton's Laws of Motion",
      'Kinematics & Projectile Motion',
      'Work, Energy & Power',
      'Thermodynamics',
      'Waves & Optics',
      'Electrostatics & Circuits',
      'Magnetism & Electromagnetic Induction',
      'Modern Physics & Quantum Mechanics',
      'Special Theory of Relativity',
      'Nuclear Physics',
    ],
    difficulty: 'Advanced',
    tips: [
      "Master the formulas but understand what each variable physically represents — don't just memorise.",
      "Solve every numerical using 'Given → Find → Formula → Substitution → Answer' to stay organised.",
      'Check your answers using unit analysis — if units do not match, the answer is wrong.',
    ],
    popularQuestions: [
      'What is the difference between scalar and vector quantities?',
      "How do I apply Newton's second law F = ma to real problems?",
      'What is Ohm\'s law and how is it derived from basic principles?',
    ],
  },

  Chemistry: {
    name: 'Chemistry',
    emoji: '🧪',
    icon: '⬡',
    color: 'from-orange-600/10 to-amber-600/10',
    border: 'border-orange-500/25',
    accent: 'text-orange-400',
    description:
      'Study the composition, structure, properties, and reactions of matter. ' +
      'Chemistry is the central science — it bridges physics and biology and explains ' +
      'how substances interact, transform, and store energy.',
    topics: [
      'Atomic Structure',
      'Periodic Table & Periodicity',
      'Chemical Bonding',
      'Stoichiometry & Mole Concept',
      'Acids, Bases & Salts',
      'Oxidation-Reduction Reactions',
      'Thermochemistry',
      'Chemical Equilibrium',
      'Organic Chemistry Basics',
      'Electrochemistry',
    ],
    difficulty: 'Advanced',
    tips: [
      'Memorise periodic table groups and trends — patterns make reactions predictable without rote learning.',
      'Balance equations systematically: count atoms of each element on both sides before adjusting coefficients.',
      'Understand WHY a reaction happens (energy, electron transfer) — not just what products form.',
    ],
    popularQuestions: [
      'How do I balance a chemical equation step by step?',
      'What is the difference between ionic and covalent bonds?',
      'How does the pH scale work and what does it actually measure?',
    ],
  },

  Biology: {
    name: 'Biology',
    emoji: '🧬',
    icon: 'DNA',
    color: 'from-rose-600/10 to-pink-600/10',
    border: 'border-rose-500/25',
    accent: 'text-rose-400',
    description:
      'Discover the science of life — from molecular mechanisms within a single cell to ' +
      'ecosystems spanning continents. Biology explains how living things grow, reproduce, ' +
      'evolve, and interact with their environment.',
    topics: [
      'Cell Structure & Function',
      'Genetics & DNA',
      'Evolution & Natural Selection',
      'Photosynthesis',
      'Cellular Respiration',
      'Human Anatomy & Physiology',
      'Ecology & Ecosystems',
      'Microbiology',
      'Plant Biology',
      'Classification of Living Organisms',
    ],
    difficulty: 'Intermediate',
    tips: [
      'Use mnemonics for taxonomy, classification, and long lists — they are surprisingly effective.',
      'Draw and label cell diagrams and organ systems; visual memory is powerful in biology.',
      'Connect processes as pairs: photosynthesis vs respiration, mitosis vs meiosis — compare them.',
    ],
    popularQuestions: [
      'How does DNA replication work — explain the steps in order.',
      'What is the difference between mitosis and meiosis?',
      'How does the human immune system detect and fight disease?',
    ],
  },

  History: {
    name: 'History',
    emoji: '📜',
    icon: '⌛',
    color: 'from-yellow-600/10 to-amber-600/10',
    border: 'border-yellow-500/25',
    accent: 'text-yellow-400',
    description:
      'Learn from the past to understand the present. History covers civilisations, wars, ' +
      'revolutions, and cultural movements that shaped the modern world — developing critical ' +
      'thinking, empathy, and an awareness of how societies change over time.',
    topics: [
      'Ancient Civilisations (Egypt, Greece, Rome)',
      'Medieval Period',
      'Renaissance & Reformation',
      'Age of Exploration & Colonialism',
      'Industrial Revolution',
      'World War I',
      'World War II & Holocaust',
      'Cold War',
      'Independence Movements',
      'Modern Indian History',
    ],
    difficulty: 'Beginner',
    tips: [
      'Create timelines for each unit to visualise the sequence of events and spot patterns.',
      "Always ask 'Why did this happen?' — examiners reward analysis of causes, not just description.",
      'Reading brief primary-source excerpts gives you the language and perspective to write compelling answers.',
    ],
    popularQuestions: [
      'What were the main causes of World War I?',
      'How did the Industrial Revolution transform society and economy?',
      'What were the causes and consequences of the French Revolution?',
    ],
  },

  English: {
    name: 'English',
    emoji: '📝',
    icon: 'Aa',
    color: 'from-fuchsia-600/10 to-pink-600/10',
    border: 'border-fuchsia-500/25',
    accent: 'text-fuchsia-400',
    description:
      'Master language — reading, writing, grammar, and literature. Strong English skills ' +
      'are essential across all academic disciplines and professional communication, from ' +
      'writing persuasive essays to analysing complex literary texts.',
    topics: [
      'Essay Structure & Argumentation',
      'Grammar & Syntax',
      'Literary Devices & Figures of Speech',
      'Reading Comprehension',
      'Vocabulary Building',
      'Poetry Analysis',
      'Short Story & Novel Study',
      'Formal vs Informal Writing',
      'Précis & Summary Writing',
      'Speech & Debate Techniques',
    ],
    difficulty: 'Beginner',
    tips: [
      'Read widely every day — newspapers, novels, and essays improve vocabulary naturally and effortlessly.',
      'Write a rough draft first, then edit; never try to perfect sentences as you write them.',
      'Learn 5 new words daily with example sentences — context is key to remembering vocabulary.',
    ],
    popularQuestions: [
      'What is the difference between a metaphor and a simile?',
      'How do I write a strong thesis statement for an essay?',
      'What are the main literary devices and how do I identify them in a text?',
    ],
  },

  General: {
    name: 'General',
    emoji: '💡',
    icon: '◉',
    color: 'from-slate-600/10 to-slate-700/10',
    border: 'border-slate-500/25',
    accent: 'text-slate-400',
    description:
      'Ask about anything that does not fit a specific subject — technology, career advice, ' +
      'general knowledge, current events, or interdisciplinary topics. ' +
      'Perfect for curiosity-driven questions and cross-subject exploration.',
    topics: [
      'How Technology Works',
      'Career & Study Guidance',
      'Critical Thinking Skills',
      'General Science Concepts',
      'World Geography',
      'Economics & Finance Basics',
      'Environmental & Climate Issues',
      'Psychology & Human Behaviour',
      'Philosophy & Ethics',
      'Artificial Intelligence Basics',
    ],
    difficulty: 'Beginner',
    tips: [
      'Break complex topics into smaller, focused questions — you will get clearer answers.',
      'Cross-reference multiple sources; for general knowledge, scepticism is a healthy habit.',
      'Connect new information to things you already know — it dramatically improves retention.',
    ],
    popularQuestions: [
      'How does the internet actually work, from your device to a server?',
      'What is artificial intelligence and how does machine learning work?',
      'How do I build better study habits and improve long-term memory retention?',
    ],
  },
};

export const DIFFICULTY_META = {
  Beginner:     { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/25' },
  Intermediate: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/25' },
  Advanced:     { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/25' },
};

// ── Extended subject data for SubjectPage ────────────────────────
export const subjectContent = {
  Mathematics: {
    name: 'Mathematics', icon: '∑',
    color: 'text-amber-400', bgColor: 'bg-amber-400/10', borderColor: 'border-amber-400/20',
    description: 'Master numbers, equations, algebra, calculus and mathematical reasoning with step-by-step solutions.',
    longDescription: 'Mathematics is the foundation of all sciences and engineering. From basic arithmetic to advanced calculus, our AI tutor helps you understand every concept with clear explanations and worked examples.',
    topics: ['Algebra & Linear Equations','Quadratic Equations','Calculus & Derivatives','Integration','Geometry & Trigonometry','Statistics & Probability','Matrices & Determinants','Number Theory','Coordinate Geometry','Differential Equations'],
    difficulty: 'Intermediate' as const,
    studyTips: ['Practice at least 10 problems daily to build muscle memory','Always show all working steps — never skip steps','Draw diagrams for geometry problems to visualize'],
    popularQuestions: ['How do I solve quadratic equations using the formula?','Explain integration by parts with an example','What is the difference between permutation and combination?'],
    examTopics: ['CBSE Class 10-12','JEE Main','JEE Advanced','BITSAT'],
  },
  Programming: {
    name: 'Programming', icon: '</>',
    color: 'text-sage-400', bgColor: 'bg-sage-400/10', borderColor: 'border-sage-400/20',
    description: 'Learn programming concepts, data structures, algorithms and debug your code with AI assistance.',
    longDescription: 'Programming is the art of giving instructions to computers. Whether you are learning Python, Java, C++, or web development, our AI tutor explains concepts clearly with working code examples.',
    topics: ['Data Structures (Arrays, Linked Lists, Trees)','Sorting & Searching Algorithms','Object Oriented Programming','Recursion & Dynamic Programming','Database & SQL','Web Development Basics','Time & Space Complexity','Graph Algorithms','Design Patterns','Operating System Concepts'],
    difficulty: 'Intermediate' as const,
    studyTips: ['Type out code yourself — never just copy paste','Debug line by line when your code does not work','Build small projects to apply what you learn'],
    popularQuestions: ['Explain recursion with a simple example in Python','What is the difference between stack and queue?','How does binary search work step by step?'],
    examTopics: ['GATE','Placements','TCS NQT','Infosys','LeetCode'],
  },
  Science: {
    name: 'Science', icon: '⚗',
    color: 'text-blue-400', bgColor: 'bg-blue-400/10', borderColor: 'border-blue-400/20',
    description: 'Explore general science concepts covering physics, chemistry and biology fundamentals.',
    longDescription: 'General Science forms the foundation of all scientific understanding. This subject covers fundamental concepts across physics, chemistry, and biology that every student needs to know.',
    topics: ['Scientific Method','Matter and its Properties','Energy and Work','Light and Sound','Electricity and Magnetism','Chemical Reactions','Cell Biology','Ecosystems','Human Body Systems','Environmental Science'],
    difficulty: 'Beginner' as const,
    studyTips: ['Relate concepts to everyday life for better understanding','Use diagrams and flowcharts to remember processes','Understand concepts rather than memorizing facts'],
    popularQuestions: ['What is the difference between physical and chemical change?','Explain the water cycle with a diagram description','How does photosynthesis work in plants?'],
    examTopics: ['CBSE Class 6-10','NTSE','Olympiads','SSC GK'],
  },
  Physics: {
    name: 'Physics', icon: '⚛',
    color: 'text-purple-400', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400/20',
    description: 'Understand laws of motion, electricity, optics, thermodynamics and modern physics.',
    longDescription: 'Physics explains how the universe works — from the smallest subatomic particles to the largest galaxies. Master derivations, numerical problems, and conceptual questions with clear explanations.',
    topics: ['Laws of Motion (Newton)','Work, Energy and Power','Gravitation','Waves and Oscillations','Thermodynamics','Electrostatics','Current Electricity','Magnetic Effects','Optics and Light','Modern Physics'],
    difficulty: 'Advanced' as const,
    studyTips: ['Learn all formulas with their derivations not just the formula','Draw free body diagrams for every mechanics problem','Dimensional analysis helps verify your answers'],
    popularQuestions: ['Derive the equation of motion v = u + at','Explain Ohm\'s law with a numerical example','What is the difference between scalar and vector quantities?'],
    examTopics: ['JEE Main','JEE Advanced','NEET','CBSE Class 11-12'],
  },
  Chemistry: {
    name: 'Chemistry', icon: '🧪',
    color: 'text-pink-400', bgColor: 'bg-pink-400/10', borderColor: 'border-pink-400/20',
    description: 'Learn chemical reactions, bonding, periodic table, organic chemistry and more.',
    longDescription: 'Chemistry is the science of matter and its transformations. From understanding the periodic table to organic reactions, our AI helps you master chemistry with clear explanations and balanced equations.',
    topics: ['Periodic Table and Trends','Chemical Bonding','Mole Concept and Stoichiometry','Acids, Bases and Salts','Organic Chemistry Basics','Electrochemistry','Thermochemistry','Chemical Equilibrium','Coordination Compounds','Polymers and Biomolecules'],
    difficulty: 'Advanced' as const,
    studyTips: ['Balance every chemical equation step by step','Learn IUPAC naming rules for organic compounds','Make flashcards for reactions and their conditions'],
    popularQuestions: ['Balance this chemical equation: Fe + O2 → Fe2O3','Explain hybridization in organic chemistry','What is the difference between ionic and covalent bonding?'],
    examTopics: ['JEE Main','JEE Advanced','NEET','CBSE Class 11-12'],
  },
  Biology: {
    name: 'Biology', icon: '🧬',
    color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400/20',
    description: 'Study living organisms, cell biology, genetics, human physiology and ecology.',
    longDescription: 'Biology is the study of life in all its forms. From the microscopic world of cells and DNA to complex ecosystems, our AI tutor helps you understand biological concepts with clear diagrams and explanations.',
    topics: ['Cell Structure and Function','Cell Division (Mitosis and Meiosis)','Genetics and Heredity','DNA, RNA and Protein Synthesis','Human Digestive System','Human Circulatory System','Human Nervous System','Photosynthesis and Respiration','Evolution and Natural Selection','Ecology and Ecosystems'],
    difficulty: 'Intermediate' as const,
    studyTips: ['Draw and label diagrams for every biological process','Use mnemonics to remember classification and sequences','Understand the why behind every biological process'],
    popularQuestions: ['Explain the process of DNA replication step by step','What is the difference between mitosis and meiosis?','How does the human digestive system work?'],
    examTopics: ['NEET','AIIMS','CBSE Class 11-12','Biology Olympiad'],
  },
  History: {
    name: 'History', icon: '📜',
    color: 'text-orange-400', bgColor: 'bg-orange-400/10', borderColor: 'border-orange-400/20',
    description: 'Explore world history, Indian history, freedom struggle, ancient civilizations and more.',
    longDescription: 'History helps us understand how the world came to be. From ancient civilizations to modern politics, studying history develops critical thinking and helps us learn from the past.',
    topics: ['Ancient Indian Civilizations','Medieval India (Mughals, Sultans)','Indian Freedom Struggle','World War I and II','French Revolution','Industrial Revolution','Cold War Era','Ancient Greece and Rome','Indian Constitution','Post-Independence India'],
    difficulty: 'Beginner' as const,
    studyTips: ['Create timelines to remember sequence of events','Link causes and effects for better understanding','Use maps to understand geographical context of events'],
    popularQuestions: ['What were the main causes of World War I?','Explain the role of Mahatma Gandhi in India\'s freedom struggle','What were the effects of the Industrial Revolution?'],
    examTopics: ['UPSC','SSC','CBSE Class 6-12','State PSC'],
  },
  English: {
    name: 'English', icon: '✍',
    color: 'text-rose-400', bgColor: 'bg-rose-400/10', borderColor: 'border-rose-400/20',
    description: 'Improve grammar, writing skills, comprehension, literature analysis and vocabulary.',
    longDescription: 'English is the global language of communication. Whether you need help with grammar rules, essay writing, comprehension passages, or literary analysis, our AI tutor explains everything clearly.',
    topics: ['Parts of Speech','Tenses and Their Usage','Active and Passive Voice','Direct and Indirect Speech','Essay Writing','Letter and Email Writing','Reading Comprehension','Vocabulary and Idioms','Literary Devices','Paragraph Writing'],
    difficulty: 'Beginner' as const,
    studyTips: ['Read English newspapers daily to improve vocabulary','Practice writing one paragraph every day','Learn grammar rules with examples not just definitions'],
    popularQuestions: ['What is the difference between active and passive voice?','How do I write a formal letter correctly?','Explain the use of articles a, an, and the'],
    examTopics: ['CBSE','IELTS','TOEFL','Campus Placements','MBA Entrance'],
  },
  General: {
    name: 'General', icon: '💡',
    color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20',
    description: 'Ask any academic question across all subjects and get a clear AI-powered explanation.',
    longDescription: 'Not sure which subject your question belongs to? Use General for any academic query. Our AI will identify the topic and provide a comprehensive answer with examples.',
    topics: ['General Knowledge','Current Affairs','Logical Reasoning','Aptitude and Quantitative','Verbal Ability','Data Interpretation','Critical Thinking','Research Methods','Study Skills','Exam Preparation Tips'],
    difficulty: 'Beginner' as const,
    studyTips: ['Read newspapers and magazines to stay updated','Practice previous year question papers','Make a proper study schedule and stick to it'],
    popularQuestions: ['Give me tips for last minute exam preparation','How do I improve my concentration while studying?','What are the best note-taking techniques for students?'],
    examTopics: ['All Competitive Exams','Campus Placement','MBA','Bank PO'],
  },
};

export type SubjectKey = keyof typeof subjectContent;
