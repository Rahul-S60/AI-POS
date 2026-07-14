'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteUserAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 1. Delete all user data from custom tables
  // Because we have RLS enabled, we can just delete without specifying user_id if RLS policy handles it,
  // but to be perfectly safe, we explicitly specify the user_id.

  try {
    // Delete goals
    await supabase.from('goals').delete().eq('user_id', user.id)
    
    // Delete habits
    await supabase.from('habits').delete().eq('user_id', user.id)
    
    // Delete tasks
    await supabase.from('tasks').delete().eq('user_id', user.id)
    
    // Delete daily top tasks
    await supabase.from('daily_top_tasks').delete().eq('user_id', user.id)
    
    // Delete tracker items
    await supabase.from('tracker_items').delete().eq('user_id', user.id)

    // Note: If you want to completely delete the user's login identity from Supabase Auth,
    // you would need to use the Supabase Admin API with the Service Role Key, like this:
    // 
    // import { createClient as createAdminClient } from '@supabase/supabase-js'
    // const adminAuthClient = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    // await adminAuthClient.auth.admin.deleteUser(user.id)

    // 2. Sign out the user
    await supabase.auth.signOut()

  } catch (error) {
    console.error('Error deleting account data:', error)
  }

  // Redirect to home page
  redirect('/')
}
