import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Voeg '/quiz' toe aan publieke routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/faq', 
  '/contact',
  '/quiz(.*)' // alle quiz routes publiek
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Als ingelogd en op hoofdpagina → redirect naar dashboard
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Bescherm alles behalve de publieke routes
  if (!isPublicRoute(req)) {
    await auth.protect() // vereist login
  }
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'], // past op alle normale routes
}