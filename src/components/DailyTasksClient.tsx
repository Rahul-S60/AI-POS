'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, Loader2 } from 'lucide-react'
import { createDailyTask, toggleDailyTask, deleteDailyTask } from '@/app/actions/daily-tasks'

type DailyTask = {
  id: string
  title: string
  is_completed: boolean
}

export function DailyTasksClient({ 
  initialTodayTasks, 
  initialTomorrowTasks,
  todayDate,
  tomorrowDate
}: { 
  initialTodayTasks: DailyTask[]
  initialTomorrowTasks: DailyTask[]
  todayDate: string 
  tomorrowDate: string
}) {
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today')
  const [todayTasks, setTodayTasks] = useState(initialTodayTasks)
  const [tomorrowTasks, setTomorrowTasks] = useState(initialTomorrowTasks)

  const tasks = activeTab === 'today' ? todayTasks : tomorrowTasks
  const setTasks = activeTab === 'today' ? setTodayTasks : setTomorrowTasks
  const currentDate = activeTab === 'today' ? todayDate : tomorrowDate

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const completedCount = tasks.filter(t => t.is_completed).length
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || isSubmitting || tasks.length >= 10) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', newTaskTitle.trim())
    formData.append('date', currentDate)

    // Optimistic UI
    const tempId = Date.now().toString()
    setTasks([...tasks, { id: tempId, title: newTaskTitle.trim(), is_completed: false }])
    setNewTaskTitle('')

    try {
      const res = await createDailyTask(formData)
      if (res?.error) {
        alert(res.error)
        setTasks(tasks) // Revert optimistic UI
      }
      // We don't need to reload the page. Next.js server actions with revalidatePath 
      // automatically update the server-supplied props (initialTasks) in the background.
    } catch (err) {
      console.error(err)
      alert('An unexpected error occurred while saving the task.')
      setTasks(tasks)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = async (id: string, is_completed: boolean) => {
    // Optimistic UI
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t))
    await toggleDailyTask(id, !is_completed)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    setTasks(tasks.filter(t => t.id !== id))
    await deleteDailyTask(id)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Progress */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-2 bg-secondary/50 w-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Top 10</h1>
            <p className="text-muted-foreground">Plan and focus on what truly matters.</p>
          </div>
          
          <div className="flex bg-secondary/50 p-1 rounded-2xl border border-border/50 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('today')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'today' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setActiveTab('tomorrow')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'tomorrow' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
            >
              Tomorrow
            </button>
          </div>
          
          <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/50">
            <div className="text-center">
              <span className="block text-2xl font-bold">{completedCount}/{tasks.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Completed</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="block text-2xl font-bold">{progressPercentage}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-card p-2 rounded-2xl">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={tasks.length >= 10 || isSubmitting}
            placeholder={tasks.length >= 10 ? `You've reached your 10 task limit for ${activeTab}.` : `Add a highly important task for ${activeTab}...`}
            className="flex-1 bg-transparent px-4 py-3 text-lg focus:outline-none disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!newTaskTitle.trim() || tasks.length >= 10 || isSubmitting}
            className="bg-primary text-primary-foreground px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Add
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="glass-card rounded-3xl p-4 min-h-[400px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg">Your top 10 list is empty for {activeTab}.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                  task.is_completed 
                    ? 'bg-secondary/20 border-transparent opacity-50' 
                    : 'bg-secondary/40 border-border/50 hover:border-primary/50'
                }`}
              >
                <button 
                  onClick={() => handleToggle(task.id, task.is_completed)}
                  className="flex items-center gap-4 flex-1 text-left"
                >
                  {task.is_completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 hover:text-primary transition-colors" />
                  )}
                  <span className={`text-lg font-medium transition-all ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </button>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="text-muted-foreground hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}
