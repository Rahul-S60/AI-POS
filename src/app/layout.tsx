import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider'
import { PwaRegister } from '@/components/PwaRegister'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "AI-POS | Supercharge Your Life with Intelligence",
  description: "AI-powered productivity platform to help you plan, execute, and achieve your goals with a Personal Operating System.",
  keywords: ["AI", "productivity", "goals", "habits", "task manager", "AI coach", "Gemini", "Personal Operating System"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI-POS",
  },
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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="font-sans min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
