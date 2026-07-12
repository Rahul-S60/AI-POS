import { createClient } from '@/lib/supabase/server'
import { CreateHabitModal } from '@/components/CreateHabitModal'
import { Activity, Target } from 'lucide-react'

export default async function HabitsPage() {
  const supabase = await createClient()
  
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*, goals(title)')
    .order('created_at', { ascending: false })

  // We also need goals for the modal dropdown
  const { data: goals } = await supabase
    .from('goals')
    .select('id, title')
    .eq('status', 'active')

  if (error) {
    console.error('Error fetching habits:', error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground">
            Build consistency through recurring daily actions.
          </p>
        </div>
        <CreateHabitModal goals={goals || []} />
      </div>

      {!habits || habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No habits tracked</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Consistency is key. Create your first habit and start building momentum towards your goals.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {habits.map((habit) => (
            <div key={habit.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-semibold leading-tight text-foreground line-clamp-2">
                  {habit.title}
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                  {habit.frequency}
                </span>
              </div>
              
              {habit.description && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {habit.description}
                </p>
              )}

              {habit.goals?.title && (
                <div className="mt-auto pt-4 flex items-center gap-1.5 border-t border-border/50 text-xs text-muted-foreground">
                  <Target className="w-4 h-4" />
                  Goal: {habit.goals.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
