import { Question } from '../types/Question';
export const readingQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 101,
  text: `Question ${i + 101}`,
  options: { a: 'A', b: 'B', c: 'C', d: 'D' }
}));