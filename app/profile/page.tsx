import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileDashboard from './components/ProfileDashboard'
import Header from '@/app/components/Header'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch user profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const initialProfile = {
    id: user.id,
    email: user.email || '',
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    phone_1: profile?.phone_1 || '',
    phone_2: profile?.phone_2 || '',
    address: profile?.address || '',
    city: profile?.city || '',
    district: profile?.district || '',
    province: profile?.province || '',
    country: profile?.country || '',
    zipcode: profile?.zipcode || '',
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <ProfileDashboard initialProfile={initialProfile} />
    </div>
  )
}
