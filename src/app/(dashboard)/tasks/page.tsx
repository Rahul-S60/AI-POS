import { createClient } from '@/lib/supabase/server'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { CheckSquare, Calendar, Target, AlertCircle } from 'lucide-react'

export default async function TasksPage() {
  const supabase = await createClient()
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*, goals(title)')
    .order('created_at', { ascending: false })

  // We need goals for the modal dropdown
  const { data: goals } = await supabase
    .from('goals')
    .select('id, title')
    .eq('status', 'active')

  if (error) {
    console.error('Error fetching tasks:', error)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Actionable items to move your goals forward.
          </p>
        </div>
        <CreateTaskModal goals={goals || []} />
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl border-dashed border-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">You're all caught up!</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Create a new task to stay productive today.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 group hover:bg-secondary/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                    task.status === 'done' ? 'bg-primary border-primary' : 'border-muted-foreground/50 hover:border-primary'
                  }`}>
                    {task.status === 'done' && <CheckSquare className="w-3 h-3 text-white" />}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className={`text-base font-medium leading-tight ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {task.priority === 'urgent' && (
                      <span className="flex items-center gap-1 text-red-500 font-medium">
                        <AlertCircle className="w-3 h-3" /> Urgent
                      </span>
                    )}
                    {task.priority === 'high' && (
                      <span className="text-orange-400 font-medium">High Priority</span>
                    )}
                    
                    {task.scheduled_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.scheduled_date).toLocaleDateString()}
                      </span>
                    )}

                    {task.goals?.title && (
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {task.goals.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className={`px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                task.status === 'done' ? 'bg-green-500/10 text-green-500' :
                task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                'bg-secondary text-muted-foreground'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
