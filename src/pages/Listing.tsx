import React, { useEffect, useState } from 'react';
import { listingQuestions } from '../data/questionsListing';
import QuestionCard from '../components/QuestionCard';

const Listing: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('answers-listening');
    if (stored) setAnswers(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('answers-listening', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">LISTENING SECTION</h2>
      {listingQuestions.map((q) => (
        <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
      ))}
    </div>
  );
};

export default Listing;