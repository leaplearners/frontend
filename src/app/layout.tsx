import type { Metadata } from "next";
import { Geist, Geist_Mono, Gorditas, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ProfileProvider } from "@/context/profileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gorditas = Gorditas({
  variable: "--gorditas",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Bold.otf", weight: "700", style: "bold" },
    { path: "./fonts/GeneralSans-Light.otf", weight: "300", style: "light" },
    { path: "./fonts/GeneralSans-Medium.otf", weight: "500", style: "medium" },
    {
      path: "./fonts/GeneralSans-Regular.otf",
      weight: "400",
      style: "regular",
    },
    {
      path: "./fonts/GeneralSans-Semibold.otf",
      weight: "600",
      style: "semibold",
    },
  ],
  variable: "--general-sans-text",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${gorditas.variable} ${generalSans.className}`}
      >
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
