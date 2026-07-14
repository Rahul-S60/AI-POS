import { createClient } from '@/lib/supabase/server'
import { TrackerClient } from '@/components/TrackerClient'

export default async function PersonalTrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch all items
  const { data: items } = await supabase
    .from('personal_tracker')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <TrackerClient initialItems={items || []} />
    </div>
  )
}
