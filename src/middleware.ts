import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/faq',
  '/contact',
  '/quiz(.*)',
  '/roi-calculator',
  '/probeer',
  '/api/quiz-temp',
  '/api/webhooks/stripe',
  '/embed(.*)',
])

const proxyHandler = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export default proxyHandler
export { proxyHandler as proxy }

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}