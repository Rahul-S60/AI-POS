import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ text: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    // Fetch Context
    const [
      { data: activeGoals },
      { data: pendingTasks },
      { data: habits }
    ] = await Promise.all([
      supabase.from('goals').select('title, description').eq('status', 'active'),
      supabase.from('tasks').select('title, priority, scheduled_date').in('status', ['todo', 'in_progress']),
      supabase.from('habits').select('title, frequency')
    ])

    // Build System Prompt
    const systemPrompt = `
You are AI-POS, a highly intelligent, supportive, and analytical Personal Operating System Coach. 
Your goal is to help the user achieve their long-term goals by focusing on their daily tasks and habits.

Here is the user's current state:
Active Goals: ${JSON.stringify(activeGoals)}
Pending Tasks: ${JSON.stringify(pendingTasks)}
Configured Habits: ${JSON.stringify(habits)}

When the user asks for daily advice or a daily plan, analyze their tasks and habits. 
- Prioritize "urgent" or "high" priority tasks.
- Remind them of habits that align with their goals.
- Keep your response concise, structured, and highly actionable. Do not be overly chatty.
- Format your response using markdown for readability.
    `

    const result = await generateText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      messages,
    })

    return Response.json({ text: result.text })
  } catch (error: any) {
    console.error('AI Error:', error)
    
    // Check if it's a rate limit error (429)
    if (error?.statusCode === 429 || (error?.message && error.message.includes('quota'))) {
      return Response.json({ text: 'Rate limit exceeded on your free tier API key. Please wait 30 seconds and try again.' }, { status: 429 })
    }
    
    return Response.json({ text: 'I encountered an error connecting to Gemini. ' + (error?.message || 'Please verify your API key.') }, { status: 500 })
  }
}
