import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}.
        </h1>
        <p className="text-muted-foreground">
          Here is an overview of your productivity today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards for dashboard */}
        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Today's Focus
          </h3>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-8 border border-dashed border-border/50 rounded-xl">
            No tasks scheduled yet
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground">Active Goals</h3>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-8 border border-dashed border-border/50 rounded-xl">
            0 Goals in progress
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground text-glow">AI Insights</h3>
          <div className="flex-1 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex shrink-0 items-center justify-center">
              ✨
            </div>
            <p className="text-sm text-primary-foreground leading-relaxed">
              Start adding tasks and habits! I will analyze your patterns and give you personalized advice to reach your goals faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
