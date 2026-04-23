'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Plan = 'free' | 'pro'

export default function BillingClient({ plan, justUpgraded }: { plan: Plan; justUpgraded: boolean }) {
  const [interval, setInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function startCheckout() {
    setLoading(true)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interval }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  async function openPortal() {
    setLoading(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg">
      {justUpgraded && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 text-green-400 text-sm font-semibold">
          ✓ Je bent nu Vertero Pro — welkom!
        </div>
      )}

      <h1 className="text-2xl font-extrabold mb-1">Abonnement</h1>
      <p className="text-white/40 text-sm mb-8">Beheer je plan en betaalinformatie.</p>

      {/* Current plan */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Huidig plan</p>
        <div className="flex items-center gap-3">
          <span className={`text-lg font-extrabold ${plan === 'pro' ? 'text-[#f97316]' : 'text-white'}`}>
            {plan === 'pro' ? 'Pro' : 'Free'}
          </span>
          {plan === 'pro' && (
            <span className="bg-[#f97316]/15 text-[#f97316] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Actief
            </span>
          )}
        </div>
        {plan === 'free' && (
          <p className="text-white/30 text-xs mt-1">1 quiz · 5 leads/maand</p>
        )}
        {plan === 'pro' && (
          <p className="text-white/30 text-xs mt-1">Onbeperkt quizzen · Onbeperkt leads</p>
        )}
      </div>

      {plan === 'free' ? (
        <div className="bg-[#0d0d1c] border border-[#f97316]/30 rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f97316] mb-4">Upgrade naar Pro</p>

          {/* Interval toggle */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setInterval('month')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${interval === 'month' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
            >
              Maandelijks · €69
            </button>
            <button
              onClick={() => setInterval('year')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${interval === 'year' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
            >
              Jaarlijks · €690
              <span className="bg-[#f97316]/20 text-[#f97316] text-[10px] font-bold px-1.5 py-0.5 rounded-full">−17%</span>
            </button>
          </div>

          <ul className="text-white/50 text-sm space-y-2 mb-6">
            {['Onbeperkt quizzen', 'Onbeperkt leads', 'Eigen branding', 'E-mail notificaties'].map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-[#f97316] text-xs">✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            onClick={startCheckout}
            disabled={loading}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-bold py-3.5 rounded-xl transition"
          >
            {loading ? 'Laden...' : 'Upgraden naar Pro →'}
          </button>
        </div>
      ) : (
        <button
          onClick={openPortal}
          disabled={loading}
          className="w-full border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-semibold py-3 rounded-xl transition text-sm"
        >
          {loading ? 'Laden...' : 'Abonnement beheren →'}
        </button>
      )}
    </div>
  )
}
