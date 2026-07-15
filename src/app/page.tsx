import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Brain, Target, Sparkles, Activity } from 'lucide-react'
import { InstallPWAButton } from '@/components/InstallPWAButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-[100dvh] bg-background relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen animate-blob animation-delay-4000" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 backdrop-blur-md overflow-hidden p-1.5">
            <img src="/logo.svg" alt="AI-POS Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight">AI-POS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-5 py-2.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            Sign Up
          </Link>
        </div>
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
            href="/register" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <InstallPWAButton />
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

      {/* How It Works Section */}
      <div className="relative z-10 w-full bg-secondary/10 border-t border-b border-border/50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The AI-POS Methodology</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple, structured workflow designed to keep you focused on what actually matters, while AI handles the friction.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-xl font-bold text-primary mb-6 group-hover:scale-110 group-hover:border-primary transition-all shadow-lg shadow-primary/10">1</div>
              <h4 className="text-lg font-bold mb-2">Set Your Vision</h4>
              <p className="text-sm text-muted-foreground">Define your long-term, high-impact goals that serve as your north star.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-500 mb-6 group-hover:scale-110 group-hover:border-blue-500 transition-all shadow-lg shadow-blue-500/10">2</div>
              <h4 className="text-lg font-bold mb-2">Build Habits</h4>
              <p className="text-sm text-muted-foreground">Translate goals into daily or weekly routines that compound over time.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-purple-500/30 flex items-center justify-center text-xl font-bold text-purple-500 mb-6 group-hover:scale-110 group-hover:border-purple-500 transition-all shadow-lg shadow-purple-500/10">3</div>
              <h4 className="text-lg font-bold mb-2">Daily Top 10</h4>
              <p className="text-sm text-muted-foreground">Each morning, pick exactly 10 high-priority tasks. Ignore everything else.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-green-500/30 flex items-center justify-center text-xl font-bold text-green-500 mb-6 group-hover:scale-110 group-hover:border-green-500 transition-all shadow-lg shadow-green-500/10">4</div>
              <h4 className="text-lg font-bold mb-2">Consult AI</h4>
              <p className="text-sm text-muted-foreground">Chat with your AI Coach to review progress, get unstuck, and maintain balance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-8">Ready to take control?</h2>
        <Link 
          href="/register" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-5 rounded-full text-xl font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--primary),0.3)]"
        >
          Create Free Account
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-background/50 backdrop-blur-md py-8 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="AI-POS Logo" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-foreground">AI-POS</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
