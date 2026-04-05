export const SUBJECTS = [
  { value: 'Mathematics', label: 'Mathematics', icon: '∑', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { value: 'Programming', label: 'Programming', icon: '</>', color: 'text-sage-400 bg-sage-400/10 border-sage-400/20' },
  { value: 'Science', label: 'Science', icon: '⚗', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { value: 'Physics', label: 'Physics', icon: '⚛', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  { value: 'Chemistry', label: 'Chemistry', icon: '🧪', color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  { value: 'Biology', label: 'Biology', icon: '🧬', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  { value: 'History', label: 'History', icon: '📜', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { value: 'English', label: 'English', icon: '✍', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  { value: 'General', label: 'General', icon: '💡', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
] as const

export type SubjectValue = typeof SUBJECTS[number]['value']

export const getSubjectMeta = (value: string) =>
  SUBJECTS.find((s) => s.value === value) ?? SUBJECTS[SUBJECTS.length - 1]
