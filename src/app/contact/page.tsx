'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw of mail ons direct.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-75 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden sm:block text-white/40 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/probeer" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 pb-24">

        <div className="mb-12">
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4">
            Neem contact op
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-md">
            Heb je een vraag of wil je meer weten over Vertero? Stuur een bericht en we reageren binnen één werkdag.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">

          {/* Form */}
          <div className="sm:col-span-2 bg-[#0d0d1c] border border-white/10 rounded-2xl p-7 sm:p-8">
            {sent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green-400">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-bold text-base mb-1">Bericht ontvangen</p>
                <p className="text-white/40 text-sm">We reageren zo snel mogelijk, uiterlijk binnen één werkdag.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Naam</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jan Jansen"
                      required
                      className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="jan@bedrijf.nl"
                      required
                      className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 block">Bericht</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Waar kunnen we je mee helpen?"
                    required
                    rows={5}
                    className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition text-sm resize-none"
                  />
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="self-start bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-lg text-sm transition"
                >
                  {sending ? 'Versturen...' : 'Versturen →'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/faq" className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition group">
            <p className="font-semibold text-sm mb-1 group-hover:text-white transition">Veelgestelde vragen</p>
            <p className="text-white/35 text-xs">Misschien staat het antwoord al in de FAQ.</p>
          </Link>
          <Link href="/roi-calculator" className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition group">
            <p className="font-semibold text-sm mb-1 group-hover:text-white transition">ROI Calculator</p>
            <p className="text-white/35 text-xs">Bereken hoeveel Vertero jou oplevert.</p>
          </Link>
        </div>

      </div>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-70 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-6" />
          </Link>
          <div className="flex gap-6">
            <Link href="/faq" className="text-white/25 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/sign-in" className="text-white/25 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="text-white/25 text-sm hover:text-white transition">Registreren</Link>
          </div>
          <p className="text-white/15 text-xs">© 2026 Vertero</p>
        </div>
      </footer>

    </div>
  )
}
