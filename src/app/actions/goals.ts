'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  target_date: z.string().optional().nullable(),
  status: z.enum(['active', 'completed', 'archived']).default('active'),
})

export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    target_date: formData.get('target_date') || null,
  }

  const validatedData = goalSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: 'Invalid goal data' }
  }

  const { error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      ...validatedData.data,
    })

  if (error) {
    console.error('Error creating goal:', error)
    return { error: 'Failed to create goal' }
  }

  revalidatePath('/goals')
  return { success: true }
}

export async function deleteGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Extra safety check

  if (error) {
    console.error('Error deleting goal:', error)
    return { error: 'Failed to delete goal' }
  }

  revalidatePath('/goals')
  return { success: true }
}

export async function updateGoalStatus(id: string, status: 'active' | 'completed' | 'archived') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('goals')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating goal:', error)
    return { error: 'Failed to update goal' }
  }

  revalidatePath('/goals')
  return { success: true }
}
