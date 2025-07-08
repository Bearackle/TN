import Part1 from "@/components/part1";
import { question } from "./question";
const questions: question[] = [];
for (let i = 1; i <= 200; i++) {
  questions.push({
    id: i,
    choose: 0,
  });
}
export default function Home() {
  return <Part1 questions={questions} />;
}
