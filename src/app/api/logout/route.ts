import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
  res.cookies.set('vertero_auth', '', { maxAge: 0, path: '/' })
  return res
}
