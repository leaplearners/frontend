import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  isAfter,
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import profileImage from "@/assets/profile-background.svg";
import algebra from "@/assets/algebra.png";
import ans from "@/assets/ans.png";
import ratio from "@/assets/ratio.png";
import measurement from "@/assets/measurement.png";
import { Course, DateRange, Quiz, VideoTopic } from "./types";

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
];

export const dummyProfiles = [
  {
    id: "1",
    name: "Jonathan",
    year: 1,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-10-01",
    duration: 30,
    subscriptionAmount: 100,
    subscriptionName: "The platform",
  },
  {
    id: "2",
    name: "John",
    year: 1,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-09-15",
    duration: 60,
    subscriptionAmount: 400,
    subscriptionName: "Tuition",
  },
  {
    id: "3",
    name: "Doku",
    year: 1,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-08-20",
    duration: 30,
    subscriptionAmount: 200,
    subscriptionName: "The platform",
  },
  {
    id: "4",
    name: "Deku",
    year: 1,
    image: profileImage,
    status: "inactive",
    subscriptionDate: "2023-07-10",
    duration: 60,
    subscriptionAmount: 400,
    subscriptionName: "Tuition",
  },
  {
    id: "5",
    name: "Midoriyama",
    year: 3,
    image: profileImage,
    status: "inactive",
    subscriptionDate: "2023-06-05",
    duration: 30,
    subscriptionAmount: 100,
    subscriptionName: "The platform",
  },
  {
    id: "6",
    name: "Midoriyama",
    year: 3,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-05-01",
    duration: 60,
    subscriptionAmount: 400,
    subscriptionName: "Tuition",
  },
  {
    id: "7",
    name: "Midoriyama",
    year: 3,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-04-15",
    duration: 30,
    subscriptionAmount: 200,
    subscriptionName: "The platform",
  },
  {
    id: "8",
    name: "Midoriyama",
    year: 3,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-03-10",
    duration: 60,
    subscriptionAmount: 400,
    subscriptionName: "Tuition",
  },
  {
    id: "9",
    name: "Midoriyama",
    year: 3,
    image: profileImage,
    status: "active",
    subscriptionDate: "2023-02-01",
    duration: 30,
    subscriptionAmount: 100,
    subscriptionName: "The platform",
  },
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

function makeQuestions(n: number): Quiz["questions"] {
  return Array.from({ length: n }, (_, i) => {
    // For demonstration, mark every 3rd question as fill-in-blank:
    const idx = i + 1;
    const isBlank = idx % 3 === 0;

    if (isBlank) {
      return {
        question: `Sample FILL-IN question ${idx}: Type the answer for ${idx}.`,
        isFillInBlank: true,
      };
    } else {
      return {
        question: `Sample MCQ question ${idx}: What is the answer to question ${idx}?`,
        options: [
          `Option ${idx}.A`,
          `Option ${idx}.B`,
          `Option ${idx}.C`,
          `Option ${idx}.D`,
        ],
      };
    }
  });
}

// helper to pick the “A” option as correct for each
function makeAnswers(n: number): Array<string> {
  return Array.from({ length: n }, (_, i) => {
    const idx = i + 1;
    if (idx % 3 === 0) {
      return "test answer";
    } else {
      return `Option ${i + 1}.A`;
    }
  });
}

// lib/utils.ts
// lib/utils.ts
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
    questions: makeQuestions(10),
    correctAnswers: makeAnswers(10),
  },
  {
    title: "Quiz 2",
    attempts: [
      { label: "Attempt 1", date: "20-10-2025", score: 62 },
      { label: "Attempt 2", date: "20-10-2025", score: 78 },
      { label: "Attempt 3", date: "20-10-2025", score: 85 },
    ],
    questions: makeQuestions(12),
    correctAnswers: makeAnswers(12),
  },
  {
    title: "Quiz 3",
    attempts: [],
    questions: makeQuestions(8),
    correctAnswers: makeAnswers(8),
  },
];

export const dummyVideoTopics: VideoTopic[] = [
  {
    title: "Mathematics",
    image: algebra,
    description: "Learn the basics of addition and subtraction.",
    subtopics: [
      { name: "Algebra Basics", status: "complete" },
      { name: "Simple Subtraction", status: "current" },
      { name: "Word Problems", status: "incomplete" },
    ],
  },
  {
    title: "Multiplication & Division",
    image: measurement,
    description: "Master multiplication and division techniques.",
    subtopics: [
      { name: "Times Tables", status: "complete" },
      { name: "Long Division", status: "complete" },
      { name: "Word Problems", status: "incomplete" },
    ],
  },
  {
    title: "Fractions",
    image: ratio,
    description: "Understand fractions and their applications.",
    subtopics: [
      { name: "Simplifying Fractions", status: "complete" },
      { name: "Adding Fractions", status: "current" },
      { name: "Mixed Numbers", status: "incomplete" },
    ],
  },
  {
    title: "Decimals",
    image: ans,
    description: "Work with decimals in various contexts.",
    subtopics: [
      { name: "Decimal Addition", status: "current" },
      { name: "Decimal Multiplication", status: "incomplete" },
      { name: "Rounding Decimals", status: "incomplete" },
    ],
  },
  {
    title: "Geometry",
    image: algebra,
    description: "Explore shapes, angles, and measurements.",
    subtopics: [
      { name: "Triangles", status: "incomplete" },
      { name: "Circles", status: "incomplete" },
      { name: "Perimeter & Area", status: "current" },
    ],
  },
  {
    title: "Angles",
    image: algebra,
    description: "Dive deep into the world of angles and their properties.",
    subtopics: [
      { name: "Acute Angles", status: "incomplete" },
      { name: "Obtuse Angles", status: "incomplete" },
      { name: "Right Angles", status: "incomplete" },
      { name: "Straight Angles", status: "incomplete" },
      { name: "Reflex Angles", status: "incomplete" },
      { name: "Complementary Angles", status: "incomplete" },
      { name: "Supplementary Angles", status: "incomplete" },
      { name: "Angles in a Triangle", status: "incomplete" },
      { name: "Angles in a Quadrilateral", status: "incomplete" },
      { name: "Angles on Parallel Lines", status: "incomplete" },
    ],
  },
];

export function generateHomeworkWithStatus(
  statuses: readonly ["TO-DO", "SUBMITTED", "DONE AND MARKED"]
): {
  title: string;
  due: string;
  course: string;
  topic: string;
  href: string;
  status: (typeof statuses)[number];
}[] {
  const today = new Date();
  const getRandomOffset = () => Math.floor(Math.random() * 14 - 7); // -7 to +6 days
  const getRandomStatus = (): (typeof statuses)[number] =>
    statuses[Math.floor(Math.random() * statuses.length)];

  return courses.flatMap((course) =>
    course.topics.map((topic, index) => {
      const offset = getRandomOffset();
      const due = new Date();
      due.setDate(today.getDate() + offset);
      return {
        title: `Homework ${index + 1}`,
        course: course.course,
        topic: topic.title,
        due: due.toISOString(),
        href: `/dashboard/${slugify(course.course)}/${slugify(topic.title)}`,
        status: getRandomStatus(),
      };
    })
  );
}

export function generateHomeworkWithDates() {
  const today = new Date();
  const getRandomOffset = () => Math.floor(Math.random() * 14 - 7);
  return courses.flatMap((course) =>
    course.topics.map((topic, index) => {
      const offset = getRandomOffset();
      const due = new Date();
      due.setDate(today.getDate() + offset);
      return {
        title: `Homework ${index + 1}`,
        course: course.course,
        topic: topic.title,
        due: due.toISOString(),
        href: `/dashboard/${slugify(course.course)}/${slugify(topic.title)}`,
      };
    })
  );
}

export function isWithinDateRange(date: Date, range: DateRange): boolean {
  const now = new Date();
  const start = (d: Date) => startOfDay(d);
  const end = (d: Date) => endOfDay(d);

  switch (range) {
    case "ALL":
      return true;
    case "TODAY":
      return date >= start(now) && date <= end(now);
    case "LAST_3_DAYS":
      return isAfter(date, subDays(now, 3));
    case "LAST_WEEK":
      return isAfter(date, subWeeks(now, 1));
    case "LAST_TWO_WEEKS":
      return isAfter(date, subWeeks(now, 2));
    case "LAST_MONTH":
      return isAfter(date, subMonths(now, 1));
    case "LAST_3_MONTHS":
      return isAfter(date, subMonths(now, 3));
    default:
      return true;
  }
}

export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return {
    date: `${months[date.getMonth()]} ${date.getDate()}`,
    day: days[date.getDay()],
  };
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];

export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const chats = [
  {
    id: "tutor",
    name: "Mr. Prosper Awoniyi",
    role: "Math Tutor",
    avatar: "/api/placeholder/50/50",
    lastMessage: "I've shared the study materials",
    lastTime: "10:32 AM",
    unread: 2,
    online: true,
  },
  {
    id: "student1",
    name: "Sarah Johnson",
    role: "Biology Student",
    avatar: "/api/placeholder/50/50",
    lastMessage: "Thank you for the lesson!",
    lastTime: "9:45 AM",
    unread: 0,
    online: false,
  },
  {
    id: "student2",
    name: "Michael Chen",
    role: "Physics Student",
    avatar: "/api/placeholder/50/50",
    lastMessage: "When is our next session?",
    lastTime: "Yesterday",
    unread: 1,
    online: true,
  },
];

export const defaultMessages = [
  {
    id: 1,
    sender: "tutor",
    text: "Hello! I noticed you're working on calculus. How can I help you today?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    sender: "tutor",
    text: "I've prepared some materials on derivatives that might help with your current assignment.",
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: 3,
    sender: "user",
    text: "Thanks! Could you explain the chain rule with some practical examples?",
    timestamp: "10:35 AM",
    type: "text",
  },
];
