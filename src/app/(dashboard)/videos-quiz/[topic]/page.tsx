"use client";

import Image from "next/image";
import { Layers } from "lucide-react";
import { notFound } from "next/navigation";
import videoLine from "@/assets/video-line.svg";
import { dummyVideoTopics, slugify } from "@/lib/utils";
import groupLines from "@/assets/grouplines.svg";
import completedStep from "@/assets/completedStep.svg";
import incompletedStep from "@/assets/incompleteStep.svg";
import currentStep from "@/assets/currentStep.svg";
import { useEffect, useState } from "react";

interface PageProps {
  params: { topic: string };
}

// export function generateStaticParams() {
//   return dummyVideoTopics.map((t) => ({
//     topic: slugify(t.title),
//   }));
// }

export default function VideoTopicPage({ params }: PageProps) {
  const topic = dummyVideoTopics.find((t) => slugify(t.title) === params.topic);
  if (!topic) notFound();
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    const currentIndex = topic.subtopics.findIndex(
      (st) => st.status === "current"
    );
    let startIndex = currentIndex === -1 ? 0 : Math.max(0, currentIndex - 1);
    setCurrentStartIndex(startIndex);
    setTotalSteps(topic.subtopics.length);
  }, [topic]);

  const getStatusTiles = () => {
    const positions = [
      "absolute w-fit -top-8",
      "absolute w-fit top-24 left-40",
      "absolute w-fit top-56",
      "absolute w-fit bottom-44",
      "absolute w-fit bottom-[310px] right-40",
    ];

    const visibleSubtopic = topic.subtopics
      .slice(currentStartIndex, currentStartIndex + 5)
      .concat(Array(5).fill({ status: "incomplete", name: "" }))
      .slice(0, 5);

    return visibleSubtopic.map((subtopic, index) => {
      let src;
      switch (subtopic.status) {
        case "complete":
          src = completedStep;
          break;
        case "current":
          src = currentStep;
          break;
        default:
          src = incompletedStep;
      }

      return (
        <div
          key={index}
          className={`${positions[index]} flex flex-col items-center`}
        >
          <Image
            src={src}
            alt={subtopic.name || `step-${index}`}
            width={80}
            height={80}
            className="w-24"
          />
          {subtopic.name && (
            <div className="mt-2 text-center">
              <p className="text-xs uppercase font-semibold text-gray-600">
                {subtopic.name}
              </p>
            </div>
          )}
        </div>
      );
    });
  };

  const canGoPrev = currentStartIndex > 0;
  const canGoNext = currentStartIndex + 5 < totalSteps;

  return (
    <div className="max-w-screen-2xl mx-auto h-screen grid grid-cols-2 relative py-6">
      <span className="cursor-pointer absolute top-4 left-4 text-xl text-[#141B34]">
        &larr;
      </span>

      {/* video placeholder */}
      <div className="flex flex-col items-center h-full -translate-y-24">
        <Image src={videoLine} alt="" className="w-fit" />
        <div className="bg-bgOffwhite rounded-[40px] max-w-[600px] min-h-[320px] w-full border flex items-center p-8 relative">
          <span className="w-16 h-2 rounded-full bg-borderGray absolute top-3 left-[45%]" />
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-medium">
                {topic.subtopics.length} SUB-TOPICS
              </span>
            </div>

            <h1 className="text-lg md:text-xl lg:text-2xl font-bold max-w-[420px]">
              {topic.title.toUpperCase()}
            </h1>

            <p className="text-gray-600 leading-relaxed">{topic.description}</p>
            <Image
              src={topic.image}
              alt={topic.title}
              width={0}
              height={0}
              className="object-contain absolute w-[120px] top-12 right-4"
            />
          </div>
        </div>
      </div>

      {/* topic card */}
      <div className="flex flex-col justify-center items-center space-y-6 max-h-[780px] px-12 relative h-full">
        <Image
          src={groupLines}
          alt=""
          width={0}
          height={0}
          className="h-[750px]"
        />
        {getStatusTiles()}
        <div className="flex gap-4 mt-8 z-10">
          <button
            onClick={() =>
              setCurrentStartIndex(Math.max(0, currentStartIndex - 1))
            }
            disabled={!canGoPrev}
            className={`px-4 py-2 rounded-lg ${
              canGoPrev ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentStartIndex(
                Math.min(totalSteps - 5, currentStartIndex + 1)
              )
            }
            disabled={!canGoNext}
            className={`px-4 py-2 rounded-lg ${
              canGoNext ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
