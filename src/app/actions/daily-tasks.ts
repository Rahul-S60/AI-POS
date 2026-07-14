'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const dailyTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  date: z.string(), // ISO date string YYYY-MM-DD
})

export async function createDailyTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const rawData = {
    title: formData.get('title'),
    date: formData.get('date'),
  }

  const validatedData = dailyTaskSchema.safeParse(rawData)
  if (!validatedData.success) {
    return { error: 'Invalid task data' }
  }

  // Check if they already have 10 tasks for this date
  const { count } = await supabase
    .from('daily_top_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('date', validatedData.data.date)

  if (count !== null && count >= 10) {
    return { error: 'You can only have up to 10 tasks per day in this specific list.' }
  }

  const { error } = await supabase
    .from('daily_top_tasks')
    .insert({
      user_id: user.id,
      title: validatedData.data.title,
      date: validatedData.data.date,
      is_completed: false,
    })

  if (error) {
    console.error('Error creating daily task:', error)
    return { error: 'Failed to create daily task' }
  }

  revalidatePath('/daily-top-10')
  return { success: true }
}

export async function toggleDailyTask(id: string, is_completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('daily_top_tasks')
    .update({ is_completed })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error toggling daily task:', error)
    return { error: 'Failed to update task' }
  }

  revalidatePath('/daily-top-10')
  return { success: true }
}

export async function deleteDailyTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('daily_top_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting daily task:', error)
    return { error: 'Failed to delete task' }
  }

  revalidatePath('/daily-top-10')
  return { success: true }
}
