import React, { useEffect, useState } from 'react';
import { readingQuestions } from '../data/questionsReading';
import QuestionCard from '../components/QuestionCard';

const Reading: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('answers-reading');
    if (stored) setAnswers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('answers-reading', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">READING SECTION</h2>
      {readingQuestions.map((q) => (
        <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
      ))}
    </div>
  );
};

export default Reading;