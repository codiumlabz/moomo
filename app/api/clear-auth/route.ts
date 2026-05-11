import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const all = cookieStore.getAll()

  for (const c of all) {
    if (c.name.includes('auth-token') || c.name.includes('sb-') || c.name.includes('supabase')) {
      cookieStore.set(c.name, '', { maxAge: 0, path: '/' })
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}
