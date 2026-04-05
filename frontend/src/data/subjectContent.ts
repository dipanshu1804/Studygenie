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
