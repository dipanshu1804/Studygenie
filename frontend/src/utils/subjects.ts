export const SUBJECTS = [
  { value: 'Mathematics', label: 'Mathematics', emoji: '📐' },
  { value: 'Programming', label: 'Programming', emoji: '💻' },
  { value: 'Science', label: 'Science', emoji: '🔬' },
  { value: 'Physics', label: 'Physics', emoji: '⚛️' },
  { value: 'Chemistry', label: 'Chemistry', emoji: '🧪' },
  { value: 'Biology', label: 'Biology', emoji: '🧬' },
  { value: 'History', label: 'History', emoji: '📜' },
  { value: 'English', label: 'English', emoji: '📝' },
  { value: 'General', label: 'General', emoji: '💡' },
] as const;

export type Subject = typeof SUBJECTS[number]['value'];
