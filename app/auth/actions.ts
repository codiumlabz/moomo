'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAvatar } from '@dicebear/core'
import { bottts } from '@dicebear/collection'

export async function login(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signup(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const avatar = createAvatar(bottts, {
    seed: email || name,
  })
  const avatarUrl = avatar.toDataUri()

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

  if (data?.user) {
    // Save the avatar URL to the profiles table
    await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', data.user.id)
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
