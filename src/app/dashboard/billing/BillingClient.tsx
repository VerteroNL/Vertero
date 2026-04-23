'use client'

import { useState } from 'react'

type Plan = 'free' | 'pro'

const FREE_FEATURES = [
  { label: '1 quiz', included: true },
  { label: '5 leads per maand', included: true },
  { label: 'Website + directe link', included: true },
  { label: '"Powered by Vertero" zichtbaar', included: true },
  { label: 'Eigen branding', included: false },
  { label: 'Onbeperkt leads', included: false },
  { label: 'E-mail notificaties', included: false },
]

const PRO_FEATURES = [
  { label: 'Onbeperkt quizzen', included: true },
  { label: 'Onbeperkt leads', included: true },
  { label: 'Website + directe link', included: true },
  { label: 'Geen "Powered by Vertero"', included: true },
  { label: 'Eigen branding + bedrijfskleuren', included: true },
  { label: 'E-mail notificaties', included: true },
  { label: 'Prioriteit support', included: true },
]

export default function BillingClient({ plan, justUpgraded }: { plan: Plan; justUpgraded: boolean }) {
  const [interval, setInterval] = useState<'month' | 'year'>('year')
  const [loading, setLoading] = useState(false)

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
    <div className="p-4 sm:p-8 max-w-3xl">

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

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold mb-1">Abonnement</h1>
        <p className="text-white/40 text-sm">Beheer je plan en betaalinformatie.</p>
      </div>

      {plan === 'pro' ? (
        /* PRO STATE */
        <div className="space-y-4">
          <div className="bg-[#0d0d1c] border border-[#f97316]/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xl font-extrabold text-white">Vertero Pro</span>
                  <span className="bg-[#f97316]/15 text-[#f97316] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Actief</span>
                </div>
                <p className="text-white/40 text-sm">Alle functies, onbeperkt.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-white">€69</p>
                <p className="text-white/30 text-xs">/maand</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {PRO_FEATURES.map(f => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-white/60">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f.label}
                </div>
              ))}
            </div>
            <button
              onClick={openPortal}
              disabled={loading}
              className="w-full border border-white/10 hover:border-white/25 text-white/60 hover:text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-40"
            >
              {loading ? 'Laden...' : 'Abonnement & facturen beheren →'}
            </button>
          </div>
        </div>
      ) : (
        /* FREE STATE — plan comparison + upgrade */
        <div className="space-y-6">

          {/* Current plan card */}
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold text-white mb-0.5">Free plan</p>
                <p className="text-white/40 text-xs">Je huidige plan</p>
              </div>
              <span className="text-2xl font-extrabold text-white">€0</span>
            </div>
            <div className="space-y-2">
              {FREE_FEATURES.map(f => (
                <div key={f.label} className={`flex items-center gap-2 text-sm ${f.included ? 'text-white/50' : 'text-white/20'}`}>
                  {f.included ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-white/40">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade card */}
          <div className="bg-[#0d0d1c] border border-[#f97316] rounded-2xl overflow-hidden">
            <div className="bg-[#f97316] px-6 py-2 flex items-center justify-between">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Aanbevolen</p>
              <p className="text-white/80 text-xs font-semibold">14 dagen gratis proberen</p>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-extrabold text-white text-xl mb-0.5">Vertero Pro</p>
                  <p className="text-white/40 text-xs">Alles wat je nodig hebt om te groeien</p>
                </div>
                <div className="text-right">
                  {interval === 'year' ? (
                    <>
                      <p className="text-2xl font-extrabold text-white">€690</p>
                      <p className="text-white/30 text-xs">/jaar</p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-extrabold text-white">€69</p>
                      <p className="text-white/30 text-xs">/maand</p>
                    </>
                  )}
                </div>
              </div>

              {/* Interval toggle */}
              <div className="flex items-center gap-2 mb-6 mt-4">
                <button
                  onClick={() => setInterval('month')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition border ${
                    interval === 'month'
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/5 text-white/30 hover:text-white/60'
                  }`}
                >
                  Maandelijks
                </button>
                <button
                  onClick={() => setInterval('year')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition border flex items-center justify-center gap-2 ${
                    interval === 'year'
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/5 text-white/30 hover:text-white/60'
                  }`}
                >
                  Jaarlijks
                  <span className="bg-[#f97316]/20 text-[#f97316] text-[10px] font-bold px-1.5 py-0.5 rounded-full">−17%</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {PRO_FEATURES.map(f => (
                  <div key={f.label} className="flex items-center gap-2 text-sm text-white/60">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f.label}
                  </div>
                ))}
              </div>

              <button
                onClick={startCheckout}
                disabled={loading}
                className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white font-bold py-4 rounded-xl transition text-base"
              >
                {loading ? 'Laden...' : '14 dagen gratis starten →'}
              </button>
              <p className="text-center text-white/25 text-xs mt-3">Daarna {interval === 'year' ? '€690/jaar' : '€69/maand'} · Opzegbaar wanneer je wilt</p>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
