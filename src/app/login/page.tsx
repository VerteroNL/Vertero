'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Ongeldig wachtwoord.')
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#07070f] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vertero" className="h-7 mx-auto mb-8" />
          <h1 className="text-2xl font-extrabold">Inloggen</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-4">
          <div>
            <label className="text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 block">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-white/25 transition text-sm"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-lg text-sm transition"
          >
            {loading ? 'Bezig…' : 'Inloggen →'}
          </button>
        </form>
      </div>
    </div>
  )
}
