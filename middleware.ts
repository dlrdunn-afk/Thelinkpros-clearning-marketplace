import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const isAuthenticated = request.cookies.get('site-access')?.value === 'granted'
  
  // Allow access to sign-in page
  if (request.nextUrl.pathname === '/sign-in') {
    return NextResponse.next()
  }
  
  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
