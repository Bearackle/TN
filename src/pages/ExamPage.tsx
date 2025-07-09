import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import { listingQuestions } from '../data/questionsListing';
import { readingQuestions } from '../data/questionsReading';
import { useNavigate } from 'react-router-dom';

const ExamPage: React.FC = () => {
  const navigate = useNavigate();

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : prefersDark;
  });

  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const storedL = localStorage.getItem('answers-listening');
    const storedR = localStorage.getItem('answers-reading');
    return {
      ...JSON.parse(storedL || '{}'),
      ...JSON.parse(storedR || '{}')
    };
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const listening: Record<number, string> = {};
    const reading: Record<number, string> = {};
    Object.entries(answers).forEach(([k, v]) => {
      const id = parseInt(k);
      if (id <= 100) listening[id] = v;
      else reading[id] = v;
    });
    localStorage.setItem('answers-listening', JSON.stringify(listening));
    localStorage.setItem('answers-reading', JSON.stringify(reading));
  }, [answers]);

  const handleAnswer = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleClear = () => {
    localStorage.clear();
    setAnswers({});
  };

  const handleSubmit = () => {
    navigate('/result');
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white w-full min-h-screen px-2 py-8 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Listening 1–50</h2>
            {listingQuestions.slice(0, 50).map((q) => (
              <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Listening 51–100</h2>
            {listingQuestions.slice(50).map((q) => (
              <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Reading 101–150</h2>
            {readingQuestions.slice(0, 50).map((q) => (
              <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Reading 151–200</h2>
            {readingQuestions.slice(50).map((q) => (
              <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} />
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 text-white bg-blue-600 rounded" onClick={handleSubmit}>Submit</button>
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
          <button className="bg-gray-700 text-white px-3 py-2 rounded shadow" onClick={handleClear}>Clear All</button>
          <button className="bg-yellow-500 text-black px-3 py-2 rounded shadow" onClick={() => setDark(!dark)}>Toggle Dark Mode</button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;