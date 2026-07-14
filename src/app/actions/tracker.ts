'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const trackerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  category: z.string().min(1, 'Category is required').max(50),
  status: z.enum(['not_started', 'ongoing', 'completed']),
  rating: z.coerce.number().min(1).max(5).optional().nullable(),
  progress: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

export async function createTrackerItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const rawData = {
    title: formData.get('title'),
    category: formData.get('category'),
    status: formData.get('status'),
    rating: formData.get('rating') ? Number(formData.get('rating')) : null,
    progress: formData.get('progress') || null,
    notes: formData.get('notes') || null,
  }

  const validatedData = trackerSchema.safeParse(rawData)
  if (!validatedData.success) {
    return { error: 'Invalid tracker data' }
  }

  // Auto-set start/completion dates based on initial status
  const today = new Date().toISOString().split('T')[0]
  let start_date = null
  let completion_date = null
  
  if (validatedData.data.status === 'ongoing') start_date = today
  if (validatedData.data.status === 'completed') {
    start_date = today // assume started today if instantly completed
    completion_date = today
  }

  const { error } = await supabase
    .from('personal_tracker')
    .insert({
      user_id: user.id,
      ...validatedData.data,
      start_date,
      completion_date,
    })

  if (error) {
    console.error('Error creating tracker item:', error)
    return { error: 'Failed to create item' }
  }

  revalidatePath('/personal-tracker')
  return { success: true }
}

export async function updateTrackerStatus(id: string, status: 'not_started' | 'ongoing' | 'completed', progress?: string, rating?: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
    
  const today = new Date().toISOString().split('T')[0]
  let updates: any = { status }
  
  if (status === 'ongoing') updates.start_date = today
  if (status === 'completed') updates.completion_date = today
  if (progress !== undefined) updates.progress = progress
  if (rating !== undefined) updates.rating = rating

  const { error } = await supabase
    .from('personal_tracker')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating tracker item:', error)
    return { error: 'Failed to update item' }
  }

  revalidatePath('/personal-tracker')
  return { success: true }
}

export async function updateTrackerNotes(id: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('personal_tracker')
    .update({ notes })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating tracker notes:', error)
    return { error: 'Failed to update notes' }
  }

  revalidatePath('/personal-tracker')
  return { success: true }
}

export async function deleteTrackerItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('personal_tracker')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting tracker item:', error)
    return { error: 'Failed to delete item' }
  }

  revalidatePath('/personal-tracker')
  return { success: true }
}
