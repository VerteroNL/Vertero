'use client'

import { useSignUp, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const { signUp } = useSignUp()
  const { signIn } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleResend() {
    if (!signUp) return
    setResending(true)
    try {
      await signUp.verifications.sendEmailCode()
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } finally {
      setResending(false)
    }
  }

  async function handleGoogle() {
    if (!signIn) return
    await signIn.sso({
      strategy: 'oauth_google',
      redirectUrl: `${window.location.origin}/sso-callback`,
      redirectCallbackUrl: `${window.location.origin}/dashboard`,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!signUp) return
    setLoading(true)
    setError('')
    try {
      const { error: signUpError } = await signUp.password({ emailAddress: email, password })
      if (signUpError) throw signUpError
      setVerifying(true)
    } catch (err: unknown) {
      const msg = (err as { longMessage?: string; message?: string })?.longMessage
        || (err as { longMessage?: string; message?: string })?.message
      setError(msg || 'Registreren mislukt. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!signUp) return
    setLoading(true)
    setError('')
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code })
      if (verifyError) throw verifyError
      await signUp.finalize({ navigate: ({ decorateUrl }) => router.push(decorateUrl('/dashboard')) })
    } catch (err: unknown) {
      const msg = (err as { longMessage?: string; message?: string })?.longMessage
        || (err as { longMessage?: string; message?: string })?.message
      setError(msg || 'Ongeldige code. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) return (
    <main className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-8 hover:opacity-70 transition">
        <img src="/logo.png" alt="Vertero" className="h-8" />
      </Link>

      <div className="w-full max-w-sm bg-[#0d0d1c] border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1 text-center">Code bevestigen</h1>
        <p className="text-white/40 text-sm text-center mb-6">We hebben een code gestuurd naar {email}</p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Verificatiecode</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              required
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm tracking-widest text-center"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {resent && <p className="text-green-400 text-xs">Nieuwe code verstuurd — check je inbox.</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition text-sm mt-1"
          >
            {loading ? 'Bevestigen...' : 'Bevestigen →'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full text-white/30 hover:text-white/60 disabled:opacity-40 text-xs transition text-center"
          >
            {resending ? 'Versturen...' : 'Code opnieuw sturen'}
          </button>
        </form>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-8 hover:opacity-70 transition">
        <img src="/logo.png" alt="Vertero" className="h-8" />
      </Link>

      <div className="w-full max-w-sm bg-[#0d0d1c] border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1 text-center">Account aanmaken</h1>
        <p className="text-white/40 text-sm text-center mb-6">Gratis starten met Vertero</p>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition text-sm mb-6"
        >
          <GoogleIcon />
          Doorgaan met Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">of</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jan@bedrijf.nl"
              required
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm"
            />
          </div>

          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading || !signUp}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition text-sm mt-1"
          >
            {loading ? 'Account aanmaken...' : 'Account aanmaken →'}
          </button>
        </form>

        <p className="text-white/30 text-sm text-center mt-6">
          Al een account?{' '}
          <Link href="/sign-in" className="text-[#f97316] hover:text-[#ea6c0a] transition font-medium">
            Inloggen
          </Link>
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
