"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizHeader from "@/components/platform/videos-quiz/quizHeader";
import { dummyVideoTopics, dummyQuizzes, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BackArrow from "@/assets/svgs/arrowback";
import CircleCheckmark from "@/assets/svgs/checkmark-circle";

export default function Page() {
  const params = useParams() as {
    topic: string;
    subtopic: string;
    quiz: string;
  };
  const { topic: topicSlug, subtopic: subtopicSlug, quiz: quizSlug } = params;
  const router = useRouter();

  // find topic & quiz
  const topic = dummyVideoTopics.find((t) => slugify(t.title) === topicSlug);
  if (!topic) return <div>Topic not found</div>;

  const quiz = useMemo(
    () => dummyQuizzes.find((q) => slugify(q.title) === quizSlug) ?? null,
    [quizSlug]
  );
  if (!quiz) return <div>Quiz “{quizSlug}” not found</div>;

  const total = quiz.questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // track user selections: null = unanswered, or 0-3
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(total).fill(null)
  );
  // once submitted, show results
  const [submitted, setSubmitted] = useState(false);

  // navigation helpers
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));

  const question = quiz.questions[currentIndex];
  const correctOption = quiz.correctAnswers[currentIndex];

  // handle select
  const selectOption = (optIdx: number) => {
    if (submitted) return;
    setUserAnswers((ua) => {
      const copy = [...ua];
      copy[currentIndex] = optIdx;
      return copy;
    });
  };

  // submit handler
  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6">
      <QuizHeader
        topic={topic}
        topicSlug={topicSlug}
        subtopicSlug={subtopicSlug}
        activeTab="quiz"
        setActiveTab={() =>
          router.push(`/videos-quiz/${topicSlug}/${subtopicSlug}`)
        }
      />
      <Link
        href={`/videos-quiz/${topicSlug}/${subtopicSlug}`}
        className="flex items-center gap-2 p-4 text-sm text-primaryBlue hover:underline"
      >
        <BackArrow color="#286cff" /> Back to tutorials
      </Link>
      <div className="flex gap-6 h-full max-w-screen-2xl">
        {/* Sidebar */}
        <aside className="max-w-xs w-full bg-bgOffwhite border rounded-3xl overflow-auto py-2 px-1.5 max-h-[80vh] h-full scrollbar-hide space-y-1.5">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-full text-left p-4 rounded-2xl font-medium text-sm flex justify-between items-center group
                ${
                  idx === currentIndex
                    ? "bg-primaryBlue text-white"
                    : "hover:bg-primaryBlue hover:text-white bg-bgWhiteGray text-textSubtitle"
                }
              `}
            >
              <span>Question {idx + 1}</span>
              <div
                className={`transition-transform duration-200 ease-in-out ${
                  idx === currentIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 group-hover:opacity-100 group-hover:scale-110"
                }`}
              >
                <CircleCheckmark />
              </div>
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col bg-white rounded-2xl p-6 -mt-24">
          <div className="mt-4 mb-6 flex justify-between items-center">
            <span className="text-sm font-semibold text-primaryBlue">
              QUESTION {currentIndex + 1}/{total}
            </span>
          </div>

          <p className="mb-4 font-medium text-sm text-textSubtitle">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-3 overflow-auto">
            {question.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentIndex] === optIdx;
              const isCorrect = opt === correctOption;
              let bgClass = "bg-gray-50 hover:bg-gray-100";
              if (submitted) {
                if (isCorrect) bgClass = "bg-green-100";
                else if (isSelected && !isCorrect) bgClass = "bg-red-100";
              } else if (isSelected) {
                bgClass = "bg-primaryBlue text-white";
              }

              return (
                <label
                  key={optIdx}
                  className={`block p-4 rounded-xl border ${bgClass}`}
                >
                  <input
                    type="radio"
                    name={`q${currentIndex}`}
                    checked={isSelected}
                    onChange={() => selectOption(optIdx)}
                    className="hidden"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          <Link
            href="#"
            className="mb-6 inline-block text-xs text-primaryBlue hover:underline"
          >
            Having issues with this question? Report →
          </Link>

          {/* Footer nav */}
          <div className="mt-6 flex items-center justify-between">
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="rounded-full p-2"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                onClick={goNext}
                disabled={currentIndex === total - 1}
                className="rounded-full p-2"
              >
                <ChevronRight />
              </Button>
            </div>

            {/* only on last question and not yet submitted */}
            {!submitted && currentIndex === total - 1 && (
              <Button
                onClick={handleSubmit}
                className="bg-primaryBlue text-white rounded-full px-6 py-2"
              >
                Submit
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
