import { signUpWithEmail, signInWithGoogle } from '../actions'
import { BrainCircuit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function RegisterPage({ searchParams }: { searchParams: { error?: string, message?: string } }) {
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

      {/* Register Card */}
      <div className="glass-card w-full max-w-md p-8 rounded-2xl flex flex-col items-center text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 p-2 overflow-hidden">
          <img src="/logo.svg" alt="AI-POS Logo" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-glow">Create Account</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Join AI-POS and supercharge your productivity.
        </p>

        {params?.error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6">
            {params.error}
          </div>
        )}

        {/* Email/Password Form */}
        <form action={signUpWithEmail} className="w-full space-y-4 mb-6 text-left">
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
              minLength={6}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity py-3 px-4 rounded-xl font-semibold mt-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
