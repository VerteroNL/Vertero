'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

function Slider({
  label,
  sub,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  sub?: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-[#f97316] font-bold text-sm tabular-nums">{format(value)}</span>
      </div>
      {sub && <p className="text-white/25 text-xs mb-3">{sub}</p>}
      <div className="relative h-5 flex items-center">
        <div className="w-full h-1.5 rounded-full bg-white/[0.07]">
          <div className="h-1.5 rounded-full bg-[#f97316]/40" style={{ width: `${pct}%` }} />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
          style={{ height: '40px', top: '50%', transform: 'translateY(-50%)', touchAction: 'none' }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-[#f97316] border-2 border-[#07070f] shadow-lg pointer-events-none"
          style={{ left: `clamp(0px, calc(${pct}% - 8px), calc(100% - 16px))` }}
        />
      </div>
    </div>
  )
}

function fmt(n: number) {
  if (!isFinite(n) || n === 0) return '€0'
  return `€${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export default function ROICalculatorPage() {
  const [aanvragen, setAanvragen] = useState(25)
  const [vaagPct, setVaagPct] = useState(40)
  const [opdracht, setOpdracht] = useState(3000)
  const [minuten, setMinuten] = useState(20)

  const r = useMemo(() => {
    const vaag = aanvragen * (vaagPct / 100)
    const omzetJaar = vaag * 0.25 * opdracht * 12
    const urenJaar = vaag * (minuten / 60) * 12
    return {
      vaag: Math.round(vaag),
      omzetJaar,
      urenJaar,
      werkweken: urenJaar / 40,
      opdrachtenJaar: Math.round(vaag * 0.25 * 12),
      perMaand: omzetJaar / 12,
      perDag: omzetJaar / 365,
    }
  }, [aanvragen, vaagPct, opdracht, minuten])

  const hoog = r.omzetJaar >= 50000

  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-75 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden sm:block text-white/40 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-12">
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-3">ROI Calculator</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4 max-w-xl">
            Wat kosten vage aanvragen jou per jaar?
          </h1>
          <p className="text-white/40 text-base max-w-md leading-relaxed">
            Vul je situatie in en zie direct hoeveel omzet én tijd je verliest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* SLIDERS */}
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-7 sm:p-9 flex flex-col justify-between gap-6">
            <Slider
              label="Aanvragen per maand"
              value={aanvragen} min={1} max={200} step={1}
              format={v => `${v}`}
              onChange={setAanvragen}
            />
            <Slider
              label="Waarvan vaag of onvolledig"
              sub="Te weinig info om direct een offerte op te sturen"
              value={vaagPct} min={0} max={100} step={1}
              format={v => `${v}%`}
              onChange={setVaagPct}
            />
            <Slider
              label="Gemiddelde opdrachtswaarde"
              value={opdracht} min={100} max={50000} step={100}
              format={fmt}
              onChange={setOpdracht}
            />
            <Slider
              label="Tijd kwijt per vage aanvraag"
              sub="Nabellen, doorvragen, wachten op info"
              value={minuten} min={5} max={120} step={5}
              format={v => `${v} min`}
              onChange={setMinuten}
            />
          </div>

          {/* RESULT + CTA — één kaart */}
          <div className="lg:sticky lg:top-[73px] bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">

            <div className="p-7 sm:p-9 border-b border-white/[0.06]">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Jij laat per jaar liggen</p>
              <p className={`text-6xl sm:text-7xl font-extrabold tabular-nums leading-none mb-3 ${hoog ? 'text-red-400' : 'text-[#f97316]'}`}>
                {fmt(r.omzetJaar)}
              </p>
              <p className="text-white/30 text-sm">
                <span className="text-white/60 font-medium">{fmt(r.perMaand)}</span> per maand &nbsp;·&nbsp; <span className="text-white/60 font-medium">{fmt(Math.round(r.perDag))}</span> per dag
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
              {[
                { label: 'Vage aanvragen/mnd', value: `${r.vaag}` },
                { label: 'Gemiste opdrachten/jr', value: `~${r.opdrachtenJaar}` },
                { label: 'Uren verspild/jr', value: `${Math.round(r.urenJaar)}` },
              ].map(({ label, value }) => (
                <div key={label} className="px-5 py-5">
                  <p className="text-white/25 text-[11px] mb-1.5 leading-tight">{label}</p>
                  <p className="text-white font-bold text-lg tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="p-7 sm:p-9">
              <p className="font-bold text-base mb-1.5">Zet er een stop aan</p>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                {hoog
                  ? `Elke dag dat je wacht kost je ${fmt(Math.round(r.perDag))}. Vertero zorgt dat elke aanvraag compleet binnenkomt.`
                  : 'Vertero zorgt dat elke aanvraag compleet binnenkomt. Direct klaar om een offerte te sturen.'}
              </p>
              <Link
                href="/sign-up"
                className="block text-center bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3 rounded-lg text-sm transition"
              >
                Gratis beginnen →
              </Link>
            </div>

          </div>
        </div>
      </div>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
