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
    const today = new Date().toLocaleDateString('en-CA')
    const [
      { data: activeGoals },
      { data: habits },
      { data: dailyTop10 },
      { data: trackerItems }
    ] = await Promise.all([
      supabase.from('goals').select('title, description').eq('status', 'active'),
      supabase.from('habits').select('title, frequency'),
      supabase.from('daily_top_tasks').select('title, is_completed').eq('date', today),
      supabase.from('personal_tracker').select('title, category, status').in('status', ['ongoing', 'not_started'])
    ])

    // Build System Prompt
    const systemPrompt = `
You are AI-POS, a highly intelligent, supportive, and analytical Personal Operating System Coach. 
Your goal is to help the user achieve their long-term goals by focusing on their daily tasks and habits, while maintaining a healthy work-life balance.

Here is the user's current state:
Active Goals: ${JSON.stringify(activeGoals)}
Configured Habits: ${JSON.stringify(habits)}
Today's Top 10 Tasks: ${JSON.stringify(dailyTop10)}
Personal Tracker (Entertainment): ${JSON.stringify(trackerItems)}

When the user asks for advice or a plan, analyze this context:
- Strongly prioritize "Today's Top 10 Tasks".
- If they have completed all their Top 10 Tasks, enthusiastically recommend they relax by enjoying an "ongoing" item from their Personal Tracker (e.g. "Great job! You've finished your tasks, how about watching an episode of your ongoing Anime?").
- If they are heavily focused on their Personal Tracker but ignoring their Top 10 tasks, gently push them to finish their most important work first.
- Keep your response concise, structured, and highly actionable.
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
