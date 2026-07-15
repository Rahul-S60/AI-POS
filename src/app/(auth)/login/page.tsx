import { signInWithGoogle, signInWithEmail } from '../actions'
import { BrainCircuit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: { error?: string, message?: string } }) {
  const params = await searchParams; // In Next.js 15, searchParams is a promise
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="glass-card w-full max-w-md p-8 rounded-2xl flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 p-2 overflow-hidden">
          <img src="/logo.svg" alt="AI-POS Logo" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow">Sign In</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Welcome back to your personal operating system.
        </p>

        {params?.error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6">
            {params.error}
          </div>
        )}

        {params?.message && (
          <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-3 rounded-lg mb-6">
            {params.message}
          </div>
        )}

        {/* Email/Password Form */}
        <form action={signInWithEmail} className="w-full space-y-4 mb-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-muted-foreground">Email</label>
            <input 
              type="email" 
              name="email" 
              required
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-muted-foreground">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity py-3 px-4 rounded-xl font-semibold mt-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
          >
            Sign In
          </button>
        </form>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form action={signInWithGoogle} className="w-full">
          <button
            type="submit"
            className="w-full relative flex items-center justify-center gap-3 bg-secondary/50 border border-border hover:bg-secondary transition-colors py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
