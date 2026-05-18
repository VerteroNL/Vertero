'use client'

import Link from 'next/link'
import { useState } from 'react'

type FormState = {
  naam: string
  bedrijfsnaam: string
  telefoonnummer: string
  branche: string
  bericht: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    naam: '',
    bedrijfsnaam: '',
    telefoonnummer: '',
    branche: '',
    bericht: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))
  }

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
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setSending(false)
    }
  }

  const inputClass = 'w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-white/25 transition text-sm'
  const labelClass = 'text-white/35 text-xs font-semibold uppercase tracking-widest mb-2 block'

  return (
    <div className="bg-[#07070f] text-white min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-75 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <Link href="/demo" className="text-white/40 text-sm hover:text-white transition">
            Bekijk demo
          </Link>
        </div>
      </nav>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 pb-24">

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.06] mb-4">
            Zet Vertero deze week<br className="hidden sm:block" /> live op jouw website
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-md">
            Stuur ons een bericht. We nemen binnen 24 uur contact op.
          </p>
        </div>

        <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-7 sm:p-8 mb-6">
          {sent ? (
            <div className="py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-green-400">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-semibold text-base mb-1">Bericht ontvangen</p>
              <p className="text-white/40 text-sm">We nemen binnen 24 uur contact met je op.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Naam</label>
                  <input type="text" value={form.naam} onChange={set('naam')} placeholder="Jan Jansen" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bedrijfsnaam</label>
                  <input type="text" value={form.bedrijfsnaam} onChange={set('bedrijfsnaam')} placeholder="Jansen Kozijnen BV" required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Telefoonnummer</label>
                  <input type="tel" value={form.telefoonnummer} onChange={set('telefoonnummer')} placeholder="06-12345678" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Branche</label>
                  <select value={form.branche} onChange={set('branche')} required
                    className={`${inputClass} appearance-none`}>
                    <option value="" disabled>Kies je branche</option>
                    <option value="Kozijnen">Kozijnen</option>
                    <option value="Badkamer">Badkamer</option>
                    <option value="Keuken">Keuken</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Bericht <span className="normal-case font-normal text-white/20">(optioneel)</span></label>
                <textarea value={form.bericht} onChange={set('bericht')} placeholder="Vertel ons meer over je situatie…" rows={4}
                  className={`${inputClass} resize-none`} />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="self-start bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-semibold px-7 py-3 rounded-lg text-sm transition"
              >
                {sending ? 'Versturen…' : 'Stuur bericht →'}
              </button>
            </form>
          )}
        </div>

        <a
          href="https://wa.me/31612345678"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-white/40 hover:text-white transition text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Of stuur direct een WhatsApp →
        </a>

      </div>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-70 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-6" />
          </Link>
          <div className="flex gap-6">
            <Link href="/demo" className="text-white/25 text-sm hover:text-white transition">Demo</Link>
            <Link href="/dashboard" className="text-white/25 text-sm hover:text-white transition">Inloggen</Link>
          </div>
          <p className="text-white/15 text-xs">© 2025 Vertero</p>
        </div>
      </footer>

    </div>
  )
}
