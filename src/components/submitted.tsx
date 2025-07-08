"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
export default function submission() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(200).fill(null)
  );
  const captureRef = useRef<HTMLDivElement>(null);
  const [formatted, setFormatted] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const stored = localStorage.getItem("#saved_aws");
    const isSubmitted = localStorage.getItem("is_submitted");
    if (stored && isSubmitted) {
      setAnswers(JSON.parse(stored));
    } else {
      router.replace("/");
    }
    const now = new Date();
    const year = now.getFullYear(); // 2025
    const month = now.getMonth() + 1; // 7 (lưu ý: tháng bắt đầu từ 0)
    const date = now.getDate(); // 8
    const hours = now.getHours(); // 21
    const minutes = now.getMinutes(); // 32
    const seconds = now.getSeconds(); // 15
    const formatted = `${date.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setFormatted(formatted);
    setIsChecking(false);
  }, []);
  const renderAnswers = () => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < 200; i++) {
      const ans = answers[i];
      let ansChar = "";
      if (ans === 0) ansChar = "A";
      else if (ans === 1) ansChar = "B";
      else if (ans === 2) ansChar = "C";
      else if (ans === 3) ansChar = "D";
      else ansChar = "-"; // Chưa trả lời

      result.push(
        <div key={i} className="w-16">
          {i + 1} ({ansChar})
        </div>
      );
    }
    return result;
  };
  const handleDownload = async () => {
    setExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: "#fff",
      });
      const link = document.createElement("a");
      link.download = "quiz_answers.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
    setExporting(false);
  };
  if (isChecking) {
    return null;
  }
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <div ref={captureRef}>
        <h1 className="text-lg font-bold mb-4">
          Submitted Answers {formatted}
        </h1>
        <div
          className={
            "grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-y-1 gap-x-2 text-sm " +
            (exporting == true ? "text-black" : "")
          }
        >
          {renderAnswers()}
        </div>
      </div>

      <div>
        <button
          onClick={handleDownload}
          className="mt-10 mb-4 px-4 py-2 bg-blue-500 text-white rounded ml-60"
        >
          📷 Download as Image
        </button>
      </div>
    </main>
  );
}
