'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('OAuth error', error.message)
    return redirect('/login?error=Could not authenticate')
  }

  if (data.url) {
    redirect(data.url) // Navigate to the OAuth provider's sign in URL
  }
}
