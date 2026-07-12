import { createClient } from '@/lib/supabase/server'
import { BarChart3, TrendingUp, CalendarDays, Award } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  const [
    { count: totalGoals },
    { count: completedGoals },
    { count: totalTasks },
    { count: completedTasks }
  ] = await Promise.all([
    supabase.from('goals').select('*', { count: 'exact', head: true }),
    supabase.from('goals').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'done')
  ])

  const taskCompletionRate = totalTasks && totalTasks > 0 
    ? Math.round(((completedTasks || 0) / totalTasks) * 100) 
    : 0

  const goalCompletionRate = totalGoals && totalGoals > 0 
    ? Math.round(((completedGoals || 0) / totalGoals) * 100) 
    : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Track your progress and identify patterns in your productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Task Completion</h3>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{taskCompletionRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${taskCompletionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Goals Completed</h3>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{completedGoals || 0}</span>
              <span className="text-sm text-muted-foreground mb-1">/ {totalGoals || 0}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${goalCompletionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Tasks Created</h3>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">{totalTasks || 0}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold">1</span>
              <span className="text-sm text-muted-foreground mb-1">day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl mt-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">More insights coming soon</h3>
        <p className="text-muted-foreground max-w-md">
          As you use AI-POS more, this page will populate with deeper AI-driven insights about your peak productivity hours and habit consistency.
        </p>
      </div>
    </div>
  )
}
