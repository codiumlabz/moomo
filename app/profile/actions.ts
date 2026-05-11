'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates = {
    full_name: formData.get('full_name') as string,
    phone_1: formData.get('phone_1') as string,
    phone_2: formData.get('phone_2') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    district: formData.get('district') as string,
    province: formData.get('province') as string,
    country: formData.get('country') as string,
    zipcode: formData.get('zipcode') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...updates })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}
