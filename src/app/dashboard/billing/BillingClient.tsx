'use client'

import { useState } from 'react'

type Plan = 'free' | 'pro'

export default function BillingClient({ plan, justUpgraded }: { plan: Plan; justUpgraded: boolean }) {
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    setLoading(true)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interval: annual ? 'year' : 'month' }),
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
    <div className="p-4 sm:p-8 max-w-2xl">

      {justUpgraded && (
        <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-green-400 font-bold text-sm">Je bent nu Vertero Pro!</p>
            <p className="text-green-400/60 text-xs mt-0.5">Welkom — alle Pro functies zijn direct beschikbaar.</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-extrabold mb-1">Abonnement</h1>
      <p className="text-white/40 text-sm mb-8">Beheer je plan en betaalinformatie.</p>

      {/* Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <span className={`text-sm font-semibold ${!annual ? 'text-white' : 'text-white/40'}`}>Maandelijks</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`w-12 h-6 rounded-full relative transition-colors ${annual ? 'bg-[#f97316]' : 'bg-white/20'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${annual ? 'left-7' : 'left-1'}`} />
        </button>
        <span className={`text-sm font-semibold ${annual ? 'text-white' : 'text-white/40'}`}>
          Jaarlijks
          <span className="ml-2 bg-[#f97316]/20 text-[#f97316] text-xs font-bold px-2 py-0.5 rounded-full">−17%</span>
        </span>
      </div>

      {/* Cards — zelfde stijl als homepage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Free */}
        <div className={`bg-[#0d0d1c] rounded-2xl p-8 flex flex-col relative ${plan === 'free' ? 'border border-[#f97316]' : 'border border-white/10'}`}>
          {plan === 'free' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
              Huidig plan
            </div>
          )}
          <h3 className="text-white/60 text-sm font-semibold mb-4">Free</h3>
          <div className="h-24 flex flex-col justify-start mb-2">
            <div className="text-4xl font-extrabold">€0</div>
            <div className="text-white/30 text-xs mt-1">gratis plan</div>
          </div>
          <ul className="text-white/50 text-sm space-y-2.5 flex-1 mb-8">
            {['1 quiz', '5 aanvragen per maand', 'Website + link', 'Powered by Vertero zichtbaar'].map(f => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
          {plan === 'free' && (
            <div className="block text-center py-3 rounded-xl text-sm font-semibold border border-white/20 text-white/40 cursor-default">
              Huidig plan
            </div>
          )}
        </div>

        {/* Pro */}
        <div className={`bg-[#0d0d1c] rounded-2xl p-8 flex flex-col relative ${plan === 'pro' ? 'border border-[#f97316]' : 'border border-[#f97316]'}`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
            {plan === 'pro' ? 'Huidig plan' : 'Aanbevolen'}
          </div>
          <h3 className="text-white/60 text-sm font-semibold mb-4">Pro</h3>
          <div className="h-24 flex flex-col justify-start mb-2">
            {annual ? (
              <>
                <div className="text-4xl font-extrabold">€690</div>
                <div className="text-white/30 text-xs mt-1">per jaar</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-[#f97316]/15 text-[#f97316] text-[10px] font-bold px-2 py-0.5 rounded-full">2 maanden gratis</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl font-extrabold">€69</div>
                <div className="text-white/30 text-xs mt-1">per maand</div>
              </>
            )}
          </div>
          <ul className="text-white/50 text-sm space-y-2.5 flex-1 mb-8">
            {['Onbeperkt quizzen', 'Onbeperkt aanvragen', 'Geen "Powered by Vertero"', 'Eigen branding + bedrijfskleuren', 'E-mail notificaties', 'Website + link'].map(f => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
          {plan === 'pro' ? (
            <button
              onClick={openPortal}
              disabled={loading}
              className="block text-center py-3 rounded-xl text-sm font-semibold transition bg-[#f97316] hover:bg-[#ea6c0a] text-white disabled:opacity-40"
            >
              {loading ? 'Laden...' : 'Abonnement beheren →'}
            </button>
          ) : (
            <button
              onClick={startCheckout}
              disabled={loading}
              className="block text-center py-3 rounded-xl text-sm font-semibold transition bg-[#f97316] hover:bg-[#ea6c0a] text-white disabled:opacity-40"
            >
              {loading ? 'Laden...' : '14 dagen gratis proberen'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
