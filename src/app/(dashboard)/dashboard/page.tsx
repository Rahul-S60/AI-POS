import { createClient } from '@/lib/supabase/server'
import { Target, Activity, CheckSquare, AlertCircle, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch high-level stats
  const [
    { count: goalsCount },
    { count: habitsCount },
    { data: pendingTasks }
  ] = await Promise.all([
    supabase.from('goals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('habits').select('*', { count: 'exact', head: true }),
    supabase.from('tasks').select('*').in('status', ['todo', 'in_progress']).order('priority', { ascending: false }).limit(5)
  ])

  // Fetch today's habits
  const { data: habits } = await supabase.from('habits').select('*')

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Daily Overview</h1>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
            <h2 className="text-3xl font-bold">{goalsCount || 0}</h2>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tracked Habits</p>
            <h2 className="text-3xl font-bold">{habitsCount || 0}</h2>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <CheckSquare className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
            <h2 className="text-3xl font-bold">{pendingTasks?.length || 0}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Focus */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Today's Focus
          </h2>
          <div className="glass-card rounded-2xl p-2">
            {!pendingTasks || pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No pending tasks for today. You're all caught up!
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {pendingTasks.map(task => (
                  <li key={task.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-muted-foreground/50 hover:border-primary cursor-pointer transition-colors" />
                      <span className="font-medium text-foreground">{task.title}</span>
                    </div>
                    {task.priority === 'urgent' && (
                      <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-md">Urgent</span>
                    )}
                    {task.priority === 'high' && (
                      <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md">High</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Daily Habits */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Daily Habits
          </h2>
          <div className="glass-card rounded-2xl p-2">
            {!habits || habits.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No habits configured. Go to the Habits page to set some up.
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {habits.map(habit => (
                  <li key={habit.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-muted-foreground/50 hover:border-blue-500 cursor-pointer transition-colors flex items-center justify-center">
                         {/* Circle for habit completion */}
                      </div>
                      <span className="font-medium text-foreground">{habit.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
