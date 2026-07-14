import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-POS | Supercharge Your Life with Intelligence",
  description: "AI-powered productivity platform to help you plan, execute, and achieve your goals with a Personal Operating System.",
  keywords: ["AI", "productivity", "goals", "habits", "task manager", "AI coach", "Gemini", "Personal Operating System"],
  openGraph: {
    title: "AI-POS | Your Personal AI Operating System",
    description: "Unify your goals, automate your daily habits, and execute tasks with a proactive AI Coach that learns from you.",
    type: "website",
    url: "https://ai-pos.example.com",
    siteName: "AI-POS",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-POS | Your Personal AI Operating System",
    description: "Supercharge your productivity with a proactive AI Coach.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col">{children}</body>
    </html>
  );
}
