# AI-POS (Personal Operating System) 🚀

AI-POS is a next-generation productivity application designed to be your Personal Operating System. Built with cutting-edge web technologies, it unifies your long-term goals, daily habits, and pending tasks, and powers them with a proactive AI Coach to keep you on track.

## 🌟 Features

- **Goal Alignment**: Define your long-term vision. Every daily task and habit you create mathematically links back to your overarching goals.
- **Habit Automation**: Track your daily, weekly, and monthly routines. Watch your completion streaks grow through real-time analytics.
- **Task Execution**: A robust task manager with priority levels and direct goal association.
- **AI Coaching**: Powered by **Gemini 3.5 Flash**, your AI coach reads your schedule, dynamically prioritizes your tasks, and pushes you to succeed right from your dashboard.
- **Daily Analytics**: Server-side aggregated metrics that show your completion percentages and active streaks at a glance.
- **Stunning UI**: Premium glassmorphism aesthetics, dynamic gradients, and smooth micro-animations built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Google OAuth)
- **AI Integration**: [Google Gemini 3.5 Flash](https://ai.google.dev/) via `@ai-sdk/google`
- **Validation**: [Zod](https://zod.dev/)
- **Markdown Parsing**: `react-markdown`
- **Icons**: `lucide-react`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase project
- A Google AI Studio (Gemini) API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rahul-S60/AI-POS.git
   cd AI-POS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Gemini API Key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

- `/src/app`: Next.js App Router pages, API routes, and global layouts.
- `/src/components`: Reusable React components (UI, Forms, AI Coach).
- `/src/lib`: Supabase client configuration and utility functions.
- `/src/app/actions`: Secure Next.js Server Actions for database mutations.

## 📝 License
This project is open-source and available under the MIT License.
