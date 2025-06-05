"use client";

import React, { useState } from "react";
import { courses } from "@/lib/utils";
import { TopicCard, TopicDetail } from "./TopicComponents";

const Glossary = () => {
  const [selectedTopic, setSelectedTopic] = useState<{
    title: string;
    course: string;
    number_of_quizzes: number;
    image: string;
  } | null>(null);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [step, setStep] = useState(0);

  const groupedTopics = courses
    .flatMap((course) =>
      course.topics.map((topic) => ({
        ...topic,
        course: course.course,
        image: course.image.src,
      }))
    )
    .reduce((acc, topic) => {
      const letter = topic.title.charAt(0).toUpperCase();
      acc[letter] = acc[letter] || [];
      acc[letter].push(topic);
      return acc;
    }, {} as Record<string, Array<{ title: string; course: string; number_of_quizzes: number; image: string }>>);

  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 max-w-screen-2xl mx-auto min-h-screen">
      {
        {
          0: (
            <>
              <h1 className="text-xl font-medium text-textGray">Glossary</h1>
              <p className="text-sm text-textSubtitle">
                This tab contains videos and worksheets for the entire 11+ Maths
                syllabus. We have numbered each section of the syllabus for easy
                navigation.
              </p>

              <div className="flex justify-center gap-6 my-8 overflow-x-auto scrollbar-hide border-b-2 py-6">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                  <button
                    key={letter}
                    className={`text-sm ${
                      letter === selectedLetter
                        ? "font-bold text-primaryBlue"
                        : "text-textGray"
                    }`}
                    onClick={() => setSelectedLetter(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              <div className="space-y-4 relative max-w-xl w-full mx-auto">
                {selectedLetter && (
                  <h2 className="absolute -left-[10%] top-[7%] font-medium text-xl md:text-2xl lg:text-3xl">
                    {selectedLetter}
                  </h2>
                )}
                {(groupedTopics[selectedLetter] || []).map((topic, idx) => (
                  <TopicCard
                    key={idx}
                    topic={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setStep(1);
                    }}
                  />
                ))}
              </div>
            </>
          ),
          1: selectedTopic && (
            <TopicDetail
              topic={selectedTopic}
              onClose={() => {
                setSelectedTopic(null);
                setStep(0);
              }}
            />
          ),
        }[step]
      }
    </div>
  );
};

export default Glossary;
