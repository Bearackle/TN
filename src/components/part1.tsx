"use client";
import { useState, useEffect } from "react";
import type { question } from "@/app/question";
import { useRouter } from "next/navigation";
interface QuizSheetProps {
  questions: question[];
}

export default function QuizSheet({ questions }: QuizSheetProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const router = useRouter();
  useEffect(() => {
    const stored = localStorage.getItem("#saved_aws");
    if (stored) {
      setAnswers(JSON.parse(stored));
    }
  }, []);
  const handleChange = (qIdx: number, optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = optionIdx;
    setAnswers(newAnswers);
    localStorage.setItem("#saved_aws", JSON.stringify(newAnswers));
  };
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    setSubmitted(true);
    localStorage.setItem("is_submitted", "true");
    router.push("/submitted");
  };
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
  };
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
      document.body.className = "dark";
    } else {
      setTheme("light");
      document.body.className = "light";
    }
  }, []);
  const renderSection = (start: number, end: number, title: string) => (
    <div className="mb-8 mt-2 break-inside-avoid">
      <h2 className="font-bold text-lg mb-2 ml-20">{title}</h2>
      <div className="space-y-2 columns-2">
        {questions.slice(start - 1, end).map((q) => (
          <div key={q.id} className="flex items-center gap-2 text-sm">
            <span className="w-8">{q.id}.</span>
            {[0, 1, 2, 3].map((optIdx) => (
              <label
                key={optIdx}
                className="flex items-center gap-0.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={answers[q.id - 1] === optIdx}
                  onChange={() => handleChange(q.id - 1, optIdx)}
                  className="accent-red"
                />
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  const handleClear = () => {
    setAnswers([]);
    localStorage.removeItem("#saved_aws");
  };
  return (
    <main className="p-4 max-w-5xl mx-auto">
      <div className="columns-1 md:columns-2 gap-50">
        {renderSection(1, 100, "LISTENING SECTION")}
        {renderSection(101, 200, "READING SECTION")}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mx-auto"
        >
          Submit
        </button>
      ) : (
        <button className="mt-6 block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mx-auto">
          OK
        </button>
      )}
      <div className="flex flex-col gap-3 fixed top-4 right-4 z-50  text-gray-800 dark:text-gray-200  transition">
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded dark:hover:bg-gray-600 shadow hover:bg-gray-300"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded dark:hover:bg-gray-600 shadow hover:bg-gray-300"
        >
          🧹Clear all
        </button>
      </div>
    </main>
  );
}
