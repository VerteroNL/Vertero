'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SSOCallbackPage() {
  const clerk = useClerk()
  const router = useRouter()

  useEffect(() => {
    clerk.handleRedirectCallback({
      signInForceRedirectUrl: '/dashboard',
      signUpForceRedirectUrl: '/dashboard',
    }, (url) => Promise.resolve(router.push(url)))
  }, [])

  return null
}
