import { createClient } from '@/lib/supabase/server'
import { CreateGoalModal } from '@/components/CreateGoalModal'
import { Target, Calendar } from 'lucide-react'

export default async function GoalsPage() {
  const supabase = await createClient()
  
  const { data: goals, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Manage your long-term objectives and track your progress.
          </p>
        </div>
        <CreateGoalModal />
      </div>

      {!goals || goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Start by defining a meaningful long-term goal you want to achieve. We'll help you break it down into habits and tasks.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <div key={goal.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4 relative group">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-semibold leading-tight text-foreground line-clamp-2">
                  {goal.title}
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  goal.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 
                  goal.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  'bg-secondary text-muted-foreground border-border'
                }`}>
                  {goal.status}
                </span>
              </div>
              
              {goal.description && (
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {goal.description}
                </p>
              )}

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {goal.target_date 
                    ? new Date(goal.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                    : 'No target date'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
