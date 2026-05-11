import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from './utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh the session so cookies are properly managed and stale chunks are cleaned up
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (Next.js internals: static, image, webpack-hmr, etc.)
     * - api (API routes)
     * - favicon.ico (favicon file)
     * - static files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
