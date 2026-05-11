'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return { error: error.message }
  }

  // Aggressively strip bloated metadata from old users to fix HTTP 431
  const user = data?.user
  if (user?.user_metadata?.avatar_url?.startsWith('data:') || user?.user_metadata?.avatar?.startsWith('data:')) {
    const seed = encodeURIComponent(user.email || user.id)
    const tinyAvatar = `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`
    
    await supabase.auth.updateUser({
      data: { 
        avatar_url: tinyAvatar,
        avatar: null // Remove the duplicate field if it exists
      }
    })

    // Re-fetch session to ensure the next request uses the cleaned JWT
    if (data.session?.refresh_token) {
      await supabase.auth.refreshSession({ refresh_token: data.session.refresh_token })
    }
  }

  if (data?.session) {
    revalidatePath('/', 'layout')
  }

  return { success: true }
}

export async function signup(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const seed = encodeURIComponent(email || name)
  const avatarUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        avatar_url: avatarUrl,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function clearAuth() {
  const cookieStore = await cookies()
  const all = cookieStore.getAll()

  for (const c of all) {
    if (c.name.includes('auth-token') || c.name.includes('sb-') || c.name.includes('supabase')) {
      cookieStore.set(c.name, '', { maxAge: 0, path: '/' })
    }
  }

  redirect('/')
}
