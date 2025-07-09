import React from 'react';
import { Question } from '../types/Question';

type Props = {
  question: Question;
  answer?: string;
  onAnswer: (id: number, value: string) => void;
};

const QuestionCard: React.FC<Props> = ({ question, answer, onAnswer }) => {
  return (
    <div className="flex items-center gap-4 my-1">
      <span className="w-6 text-right">{question.id}.</span>
      {(['a', 'b', 'c', 'd'] as const).map((opt) => (
        <label key={opt} className="inline-flex items-center gap-1">
          <input
            type="radio"
            name={`q-${question.id}`}
            value={opt}
            checked={answer === opt}
            onChange={() => onAnswer(question.id, opt)}
          />
          <span className="uppercase">{opt}.</span>
        </label>
      ))}
    </div>
  );
};

export default QuestionCard;
