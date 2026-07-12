'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const habitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  frequency: z.string().default('daily'),
  goal_id: z.string().uuid().optional().nullable(),
})

export async function createHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    frequency: formData.get('frequency') || 'daily',
    goal_id: formData.get('goal_id') || null,
  }

  const validatedData = habitSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: 'Invalid habit data' }
  }

  const { error } = await supabase
    .from('habits')
    .insert({
      user_id: user.id,
      ...validatedData.data,
    })

  if (error) {
    console.error('Error creating habit:', error)
    return { error: 'Failed to create habit' }
  }

  revalidatePath('/habits')
  return { success: true }
}

export async function deleteHabit(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting habit:', error)
    return { error: 'Failed to delete habit' }
  }

  revalidatePath('/habits')
  return { success: true }
}
