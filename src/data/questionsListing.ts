import { Question } from '../types/Question';
export const listingQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  text: `Question ${i + 1}`,
  options: { a: 'A', b: 'B', c: 'C', d: 'D' }
}));