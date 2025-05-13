import { StaticImageData } from "next/image";

export interface Course {
  image: StaticImageData;
  course: string;
  topics: {
    title: string;
    number_of_quizzes: number;
  }[];
  progress: number;
  duration: number;
  total_section: number;
  completed_section: number;
}

export interface Quiz {
  title: string;
  attempts: {
    label: string;
    date: string;
    score: number;
  }[];
}

export interface VideoTopic {
  title: string;
  image: StaticImageData;
  description: string;
  subtopics: { name: string; status: string }[];
}
