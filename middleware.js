import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/about',
    '/blog',
    '/archive',
    '/author',
    '/category',
    '/privacy',
    '/terms',
    '/contact',
  
  ]

  // Define auth routes that should not be accessible when logged in
  const authRoutes = [
    '/auth/components/Login',
    '/auth/components/Register',
    '/auth/components/Forgot-password',
    '/auth/components/Reset-password'
  ]

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if current route is auth route
  const isAuthRoute = authRoutes.includes(pathname)

  // Handle protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Handle auth routes for authenticated users
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Special case for reset password token verification
  if (pathname.startsWith('/auth/reset-password')) {
    const tokenParam = request.nextUrl.searchParams.get('token')
    if (!tokenParam) {
      return NextResponse.redirect(new URL('/auth/forgot-password', request.url))
    }
  }

  return NextResponse.next()
}

// Specify which paths middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, etc.
     * - api/auth routes (NextAuth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)',
  ],
}