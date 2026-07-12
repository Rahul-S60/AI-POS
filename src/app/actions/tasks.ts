'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduled_date: z.string().optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
})

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority') || 'medium',
    scheduled_date: formData.get('scheduled_date') || null,
    goal_id: formData.get('goal_id') || null,
  }

  const validatedData = taskSchema.safeParse(rawData)

  if (!validatedData.success) {
    return { error: 'Invalid task data' }
  }

  const { error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      ...validatedData.data,
    })

  if (error) {
    console.error('Error creating task:', error)
    return { error: 'Failed to create task' }
  }

  revalidatePath('/tasks')
  return { success: true }
}

export async function updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done' | 'cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating task:', error)
    return { error: 'Failed to update task status' }
  }

  revalidatePath('/tasks')
  return { success: true }
}
