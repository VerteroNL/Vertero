'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
export default function SSOCallbackPage() {

  return (
    <>
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#f97316] rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Inloggen...</p>
        </div>
      </div>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </>
  )
}
