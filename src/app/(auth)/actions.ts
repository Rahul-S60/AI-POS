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

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/register?error=Email and password are required')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup error', error.message)
    return redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  // Supabase returns an empty identities array on a "fake" successful signup 
  // if the email already exists and email enumeration protection is enabled.
  if (data?.user?.identities && data.user.identities.length === 0) {
    return redirect('/register?error=An account with this email already exists. Please sign in instead.')
  }

  // Next.js redirect doesn't work inside try/catch if we aren't careful, but we are clean here
  return redirect('/login?message=Registration successful. Please sign in (and check your email to verify if required).')
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?error=Email and password are required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Signin error', error.message)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  return redirect('/dashboard')
}
