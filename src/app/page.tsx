import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Brain, Target, Sparkles, Activity } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-4000" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 backdrop-blur-md">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI-POS</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-medium hover:text-primary transition-colors bg-secondary/50 backdrop-blur-md border border-border px-5 py-2.5 rounded-full"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>Meet Your Personal AI Operating System</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl animate-fade-in-up animation-delay-100">
          Supercharge Your Life with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Intelligence</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 animate-fade-in-up animation-delay-200">
          Unify your goals, automate your daily habits, and execute tasks with a proactive AI Coach that learns from you. It's not just a tracker; it's your personal command center.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#features" 
            className="inline-flex items-center justify-center gap-2 bg-secondary/50 backdrop-blur-md border border-border px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-all"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative z-10 container mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="group relative p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm overflow-hidden hover:bg-secondary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Goal Alignment</h3>
            <p className="text-muted-foreground leading-relaxed">
              Define your long-term vision. Every daily task and habit you create mathematically links back to your overarching goals.
            </p>
          </div>

          <div className="group relative p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm overflow-hidden hover:bg-secondary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Habit Automation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your daily, weekly, and monthly routines. Watch your completion streaks grow through real-time analytics.
            </p>
          </div>

          <div className="group relative p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm overflow-hidden hover:bg-secondary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Coaching</h3>
            <p className="text-muted-foreground leading-relaxed">
              Powered by Gemini, your AI coach reads your schedule, dynamically prioritizes your tasks, and pushes you to succeed.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
