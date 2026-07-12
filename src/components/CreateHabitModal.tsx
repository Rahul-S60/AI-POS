'use client'

import { useState } from 'react'
import { createHabit } from '@/app/actions/habits'
import { Plus, X } from 'lucide-react'

export function CreateHabitModal({ goals }: { goals: { id: string, title: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await createHabit(formData)
    setIsPending(false)
    if (result?.error) {
      alert(result.error)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Plus className="w-5 h-5" />
        New Habit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-semibold mb-6">Create New Habit</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Habit Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Read 30 minutes"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="frequency" className="text-sm font-medium text-foreground">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="weekdays">Weekdays</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="goal_id" className="text-sm font-medium text-foreground">
                  Link to Goal <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <select
                  id="goal_id"
                  name="goal_id"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="">None</option>
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>{goal.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
