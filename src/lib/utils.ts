import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import profileImage from "@/assets/profile-background.svg"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const dummySubscriptionFeature = "We have analysed thousands past paper questions for each topic, to ensure the worksheets are up to exam standard."

export const subscriptionPlans: {
  title: string;
  price: number;
  trialDays: number;
  features: string[];
}[] = [
  {title: "online learning", price: 100, trialDays: 10, features: Array(3).fill(dummySubscriptionFeature)},
  {title: "self learning", price: 400, trialDays: 20, features: Array(6).fill(dummySubscriptionFeature)},
  {title: "group tuition", price: 200, trialDays: 12, features: Array(4).fill(dummySubscriptionFeature)},
  {title: "One-to-one tuition", price: 400, trialDays: 40, features: Array(6).fill(dummySubscriptionFeature)},
]

export const dummyProfiles = [
  {name: "Jonathan", year: 1, image: profileImage, status: "active"},
  {name: "John", year: 1, image: profileImage, status: "active"},
  {name: "Doku", year: 1, image: profileImage, status: "active"},
  {name: "Deku", year: 1, image: profileImage, status: "inactive"},
  {name: "Midoriyama", year: 3, image: profileImage, status: "inactive"},
  {name: "Midoriyama", year: 3, image: profileImage, status: "active"},
  {name: "Midoriyama", year: 3, image: profileImage, status: "active"},
  {name: "Midoriyama", year: 3, image: profileImage, status: "active"},
  {name: "Midoriyama", year: 3, image: profileImage, status: "active"},
]
