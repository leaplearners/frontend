import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import profileImage from "@/assets/profile-background.svg";
import algebra from "@/assets/algebra.png";
import ans from "@/assets/ans.png";
import ratio from "@/assets/ratio.png";
import measurement from "@/assets/measurement.png";
import { Course, Quiz } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dummySubscriptionFeature =
  "We have analysed thousands past paper questions for each topic, to ensure the worksheets are up to exam standard.";

export const subscriptionPlans: {
  title: string;
  price: number;
  trialDays: number;
  features: string[];
}[] = [
  {
    title: "online learning",
    price: 100,
    trialDays: 10,
    features: Array(3).fill(dummySubscriptionFeature),
  },
  {
    title: "self learning",
    price: 400,
    trialDays: 20,
    features: Array(6).fill(dummySubscriptionFeature),
  },
  {
    title: "group tuition",
    price: 200,
    trialDays: 12,
    features: Array(4).fill(dummySubscriptionFeature),
  },
  {
    title: "One-to-one tuition",
    price: 400,
    trialDays: 40,
    features: Array(6).fill(dummySubscriptionFeature),
  },
];

export const dummyProfiles = [
  { name: "Jonathan", year: 1, image: profileImage, status: "active" },
  { name: "John", year: 1, image: profileImage, status: "active" },
  { name: "Doku", year: 1, image: profileImage, status: "active" },
  { name: "Deku", year: 1, image: profileImage, status: "inactive" },
  { name: "Midoriyama", year: 3, image: profileImage, status: "inactive" },
  { name: "Midoriyama", year: 3, image: profileImage, status: "active" },
  { name: "Midoriyama", year: 3, image: profileImage, status: "active" },
  { name: "Midoriyama", year: 3, image: profileImage, status: "active" },
  { name: "Midoriyama", year: 3, image: profileImage, status: "active" },
];

export const courses: Course[] = [
  {
    image: algebra,
    course: "Mathematics",
    topics: [
      { title: "Algebra Basics", number_of_quizzes: 4 },
      { title: "Linear Equations", number_of_quizzes: 3 },
      { title: "Quadratic Functions", number_of_quizzes: 5 },
    ],
    progress: 40,
    duration: 120,
    total_section: 12,
    completed_section: 5,
  },
  {
    image: ratio,
    course: "Mathematics",
    topics: [
      { title: "Understanding Ratios", number_of_quizzes: 2 },
      { title: "Proportions", number_of_quizzes: 3 },
      { title: "Rate Problems", number_of_quizzes: 2 },
    ],
    progress: 60,
    duration: 90,
    total_section: 10,
    completed_section: 6,
  },
  {
    image: algebra,
    course: "Mathematics",
    topics: [
      { title: "Angles & Triangles", number_of_quizzes: 4 },
      { title: "Circles & Arcs", number_of_quizzes: 3 },
      { title: "Coordinate Geometry", number_of_quizzes: 4 },
    ],
    progress: 25,
    duration: 110,
    total_section: 14,
    completed_section: 3,
  },
  {
    image: measurement,
    course: "Science",
    topics: [
      { title: "Measurement Techniques", number_of_quizzes: 3 },
      { title: "Units & Conversions", number_of_quizzes: 2 },
      { title: "Precision & Accuracy", number_of_quizzes: 2 },
    ],
    progress: 20,
    duration: 150,
    total_section: 8,
    completed_section: 1,
  },
  {
    image: ratio,
    course: "Science",
    topics: [
      { title: "Atomic Structure", number_of_quizzes: 3 },
      { title: "Periodic Table", number_of_quizzes: 2 },
      { title: "Chemical Bonding", number_of_quizzes: 3 },
    ],
    progress: 55,
    duration: 130,
    total_section: 9,
    completed_section: 5,
  },
  {
    image: measurement,
    course: "Science",
    topics: [
      { title: "Newton’s Laws", number_of_quizzes: 4 },
      { title: "Work & Energy", number_of_quizzes: 3 },
      { title: "Momentum", number_of_quizzes: 3 },
    ],
    progress: 75,
    duration: 140,
    total_section: 12,
    completed_section: 9,
  },
  {
    image: ans,
    course: "Biology",
    topics: [
      { title: "Cell Structure", number_of_quizzes: 3 },
      { title: "Photosynthesis", number_of_quizzes: 2 },
      { title: "Genetics", number_of_quizzes: 3 },
    ],
    progress: 45,
    duration: 100,
    total_section: 11,
    completed_section: 5,
  },
  {
    image: ans,
    course: "Mathematics",
    topics: [
      { title: "Arithmetic & Number Systems", number_of_quizzes: 5 },
      { title: "Prime Factors", number_of_quizzes: 4 },
      { title: "Fractions & Decimals", number_of_quizzes: 4 },
    ],
    progress: 80,
    duration: 100,
    total_section: 12,
    completed_section: 10,
  },
  {
    image: ratio,
    course: "English",
    topics: [
      { title: "Parts of Speech", number_of_quizzes: 2 },
      { title: "Sentence Structure", number_of_quizzes: 3 },
      { title: "Punctuation", number_of_quizzes: 2 },
    ],
    progress: 30,
    duration: 80,
    total_section: 6,
    completed_section: 2,
  },
  {
    image: ans,
    course: "English",
    topics: [
      { title: "Roots & Affixes", number_of_quizzes: 3 },
      { title: "Context Clues", number_of_quizzes: 2 },
      { title: "Synonyms & Antonyms", number_of_quizzes: 3 },
    ],
    progress: 50,
    duration: 95,
    total_section: 7,
    completed_section: 3,
  },
];

export const convertDuration = (progress: number, duration: number) => {
  const remainingMinutes = Math.ceil(duration * (1 - progress / 100));
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
  }
};

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function getCurrentTopic(course: Course): {
  title: string;
  number_of_quizzes: number;
} {
  const idx = course.completed_section;
  const maxIdx = course.topics.length - 1;
  const safeIdx = idx > maxIdx ? maxIdx : idx;
  return course.topics[safeIdx];
}

export const dummyCurriculum = [
  { name: "UK National Curriculum", value: "uk" },
  { name: "US Common Core Standards", value: "us" },
  { name: "International Baccalaureate", value: "ib" },
  { name: "Cambridge International", value: "cambridge" },
  { name: "Australian Curriculum", value: "australia" },
  { name: "Indian CBSE Curriculum", value: "cbse" },
];

export const dummyQuizzes: Quiz[] = [
  {
    title: "Quiz 1",
    attempts: [{ label: "Attempt 1", date: "20-10-2025", score: 62 }],
  },
  {
    title: "Quiz 2",
    attempts: [
      { label: "Attempt 1", date: "20-10-2025", score: 62 },
      { label: "Attempt 2", date: "20-10-2025", score: 78 },
      { label: "Attempt 3", date: "20-10-2025", score: 85 },
    ],
  },
];
