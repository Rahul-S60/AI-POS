import { createClient } from '@/lib/supabase/server'
import { DailyTasksClient } from '@/components/DailyTasksClient'

export default async function DailyTop10Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get current date in YYYY-MM-DD, robust to timezone and locale issues
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  const tomorrowDate = new Date(now)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = tomorrowDate.toISOString().split('T')[0]

  // Fetch tasks
  const { data: tasks } = await supabase
    .from('daily_top_tasks')
    .select('*')
    .eq('user_id', user.id)
    .in('date', [today, tomorrow])
    .order('created_at', { ascending: true })

  const todayTasks = tasks?.filter(t => t.date === today) || []
  const tomorrowTasks = tasks?.filter(t => t.date === tomorrow) || []

  return (
    <div className="max-w-4xl mx-auto">
      <DailyTasksClient 
        initialTodayTasks={todayTasks} 
        initialTomorrowTasks={tomorrowTasks} 
        todayDate={today} 
        tomorrowDate={tomorrow}
      />
    </div>
  )
}
