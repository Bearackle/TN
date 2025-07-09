// === Result.tsx: Hiển thị đáp án + kiểm tra OCR ảnh + chấm điểm + lọc sai ===

import React, { useRef, useState } from 'react';
import { listingQuestions } from '../data/questionsListing';
import { readingQuestions } from '../data/questionsReading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// @ts-ignore
import Tesseract from 'tesseract.js';

const Result: React.FC = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [ocrAnswers, setOcrAnswers] = useState<Record<number, string>>({});
  const [showComparison, setShowComparison] = useState(false);
  const [correctCount, setCorrectCount] = useState<number | null>(null);
  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  const listening = JSON.parse(localStorage.getItem('answers-listening') || '{}');
  const reading = JSON.parse(localStorage.getItem('answers-reading') || '{}');

  const exportPDF = async () => {
    const content = document.getElementById('result-content');
    if (!content) return;
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('result.pdf');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Tesseract.recognize(file, 'eng', { logger: () => {} })
      .then(({ data: { text } }: any) => {
        const regex = /(\d{1,3})\s*\(([A-D])\)/g;
        const result: Record<number, string> = {};
        let match;
        while ((match = regex.exec(text)) !== null) {
          const index = parseInt(match[1]);
          const char = match[2].toLowerCase();
          if (index >= 1 && index <= 200) {
            result[index] = char;
          }
        }
        setOcrAnswers(result);
        setShowComparison(false);
        setCorrectCount(null);
      });
  };

  const checkAnswers = () => {
    let correct = 0;
    for (let id in ocrAnswers) {
      const numId = parseInt(id);
      const userAnswer = numId <= 100 ? listening[numId] : reading[numId];
      if (userAnswer && userAnswer === ocrAnswers[numId]) correct++;
    }
    setCorrectCount(correct);
    setShowComparison(true);
  };

const renderAnswerLine = (id: number, userAns: string | undefined, ocrAns?: string) => {
  const isWrong = showComparison && ocrAns && ocrAns !== userAns;
  const isCorrect = showComparison && ocrAns && ocrAns === userAns;
  if (filterWrongOnly && !isWrong) return null;

  return (
    <div className={`flex items-center gap-4 my-1 ${isWrong ? 'text-red-600 font-semibold' : ''}`}>
      <span className="w-6 text-right">{id}.</span>
      {(['a', 'b', 'c', 'd'] as const).map((opt) => {
        const classNames = [
          'px-2', 'py-1', 'rounded', 'border',
          userAns === opt ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800',
          isWrong && opt === ocrAns ? 'border-red-500 border-2' : '',
          isCorrect && opt === userAns ? 'bg-green-600 text-white' : '',
        ].join(' ');

        return (
          <span key={opt} className={classNames}>
            {opt}
          </span>
        );
      })}
      {isWrong && ocrAns && <span className="text-red-500 ml-2 text-sm">→ Đáp án đúng: {ocrAns}</span>}
    </div>
  );
};


  return (
    <div className="dark:bg-gray-900 dark:text-white w-full min-h-screen px-2 py-8 flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="flex flex-wrap gap-4">
          <button onClick={checkAnswers} className="px-4 py-2 bg-blue-600 text-white rounded">Check Đáp Án</button>
          <button
            onClick={() => setFilterWrongOnly(!filterWrongOnly)}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            {filterWrongOnly ? 'Hiện tất cả' : 'Lọc câu sai'}
          </button>
        </div>
        {correctCount !== null && (
          <p className="text-lg text-green-500 font-semibold">
            ✅ Số câu đúng: {correctCount}/{Object.keys(ocrAnswers).length} – Điểm TOEIC ~ {correctCount * 5}
          </p>
        )}
      </div>

      <div className="w-full max-w-7xl" id="result-content" ref={resultRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Listening 1–50</h2>
            {listingQuestions.slice(0, 50).map((q) => renderAnswerLine(q.id, listening[q.id], ocrAnswers[q.id]))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Listening 51–100</h2>
            {listingQuestions.slice(50).map((q) => renderAnswerLine(q.id, listening[q.id], ocrAnswers[q.id]))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Reading 101–150</h2>
            {readingQuestions.slice(0, 50).map((q) => renderAnswerLine(q.id, reading[q.id], ocrAnswers[q.id]))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">Reading 151–200</h2>
            {readingQuestions.slice(50).map((q) => renderAnswerLine(q.id, reading[q.id], ocrAnswers[q.id]))}
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button onClick={exportPDF} className="px-6 py-3 bg-green-600 text-white rounded">Export PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Result;
