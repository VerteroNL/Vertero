'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// ─── Data ───────────────────────────────────────────────────────────────────

const mrrData = [
  { m: 'jan', v: 149 }, { m: 'feb', v: 298 }, { m: 'mrt', v: 447 },
  { m: 'apr', v: 596 }, { m: 'mei', v: 745 }, { m: 'jun', v: 745 },
  { m: 'jul', v: 894 }, { m: 'aug', v: 894 }, { m: 'sep', v: 894 },
  { m: 'okt', v: 1043 }, { m: 'nov', v: 1043 }, { m: 'dec', v: 1192 },
]

const omzetData: Record<string, number> = {
  'Vandaag': 149,
  'Deze week': 596,
  'Deze maand': 745,
  '3 maanden': 2235,
  'Dit jaar': 7301,
}

const eventPool: Array<{ kleur: string; tekst: string }> = [
  { kleur: '#2563EB', tekst: 'Raamkozijnen Visser — nieuwe lead ontvangen' },
  { kleur: '#22c55e', tekst: 'Badkamer Concepts BV — lead gekwalificeerd' },
  { kleur: '#f97316', tekst: 'Keukenpaleis Tilburg — quiz gewijzigd' },
  { kleur: '#2563EB', tekst: 'De Kozijnenman — aangemeld voor proefperiode' },
  { kleur: '#22c55e', tekst: 'Badkamer & Bad Groep — 3 leads binnengekomen' },
  { kleur: '#2563EB', tekst: 'Reno Renovaties — widget geïnstalleerd' },
  { kleur: '#22c55e', tekst: 'Keukenpaleis Tilburg — lead gescoord' },
  { kleur: '#2563EB', tekst: 'Raamkozijnen Visser — lead via directe link' },
  { kleur: '#ef4444', tekst: 'Keukenstudio Noord — abonnement beëindigd' },
  { kleur: '#f97316', tekst: 'Badkamer Concepts BV — quiz geüpdate' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad(n: number) { return String(n).padStart(2, '0') }

const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 1100) {
  const [val, setVal] = useState(0)
  const prev = useRef(target)
  useEffect(() => {
    const from = prev.current === target ? 0 : prev.current
    prev.current = target
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(from + (target - from) * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => { const d = new Date(); setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`) }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-white text-lg" style={{ letterSpacing: '0.12em' }}>{t}</span>
}

// ─── Omzet toggle ─────────────────────────────────────────────────────────────

const omzetPeriodes = ['Vandaag', 'Deze week', 'Deze maand', '3 maanden', 'Dit jaar']

function OmzetToggle({ selected, onChange }: { selected: string; onChange: (s: string) => void }) {
  return (
    <div className="flex gap-px border border-[#1a1a1a]">
      {omzetPeriodes.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="px-2.5 py-1 text-[10px] transition-all duration-200"
          style={{
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: selected === p ? 'rgba(37,99,235,0.15)' : 'transparent',
            color: selected === p ? '#6ba3f5' : '#444',
            borderBottom: selected === p ? '1px solid #2563EB' : '1px solid transparent',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

// ─── KPI block ───────────────────────────────────────────────────────────────

function KpiBlock({ label, value, prefix = '', suffix = '', large = false }: {
  label: string; value: number; prefix?: string; suffix?: string; large?: boolean
}) {
  const count = useCountUp(value)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="bg-[#080808] px-5 py-4 cursor-default transition-all duration-200"
      style={{ borderBottom: hovered ? '1px solid rgba(37,99,235,0.45)' : '1px solid transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-3" style={LABEL}>{label}</div>
      <div
        className="font-mono leading-none transition-all duration-300"
        style={{
          fontSize: large ? 36 : 24,
          color: '#2563EB',
          textShadow: hovered ? '0 0 24px rgba(37,99,235,0.55), 0 0 48px rgba(37,99,235,0.25)' : 'none',
        }}
      >
        {prefix}{count.toLocaleString('nl-NL')}{suffix}
      </div>
    </div>
  )
}

// ─── Status dot ──────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const color = status === 'actief' ? '#22c55e' : status === 'proef' ? '#f59e0b' : '#2a2a2a'
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16 }}>
      {status === 'actief' && (
        <span style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: color, opacity: 0.2, animation: 'dotpulse 2s ease-in-out infinite' }} />
      )}
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'block', position: 'relative' }} />
    </span>
  )
}

// ─── Klant tabel rij ─────────────────────────────────────────────────────────

const klanten = [
  { naam: 'Raamkozijnen Visser', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'jan 2025' },
  { naam: 'Badkamer Concepts BV', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'feb 2025' },
  { naam: 'Keukenpaleis Tilburg', branche: 'Keuken', status: 'actief', mrr: 149, sinds: 'mrt 2025' },
  { naam: 'De Kozijnenman', branche: 'Kozijnen', status: 'proef', mrr: 0, sinds: 'apr 2025' },
  { naam: 'Badkamer & Bad Groep', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'apr 2025' },
  { naam: 'Keukenstudio Noord', branche: 'Keuken', status: 'gestopt', mrr: 0, sinds: 'feb 2025' },
  { naam: 'Reno Renovaties', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'mei 2025' },
]

function KlantenRij({ klant }: { klant: typeof klanten[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <tr
      className="border-b border-[#111] transition-all duration-200"
      style={{ background: hov ? 'rgba(37,99,235,0.04)' : 'transparent' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td className="px-5 py-3">
        <div className="text-[13px]" style={{ color: '#ccc' }}>{klant.naam}</div>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333', marginTop: 2 }}>sinds {klant.sinds}</div>
      </td>
      <td className="px-4 py-3 text-[13px]" style={{ color: '#555' }}>{klant.branche}</td>
      <td className="px-4 py-3"><StatusDot status={klant.status} /></td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-3">
          <span className="font-mono text-[13px]" style={{ color: '#555' }}>{klant.mrr > 0 ? `€${klant.mrr}` : '—'}</span>
          <span style={{ opacity: hov ? 1 : 0, transition: 'opacity 0.2s', color: '#2563EB', fontSize: 12 }}>→</span>
        </div>
      </td>
    </tr>
  )
}

// ─── Branche bar ─────────────────────────────────────────────────────────────

function BranchBar({ naam, pct, kleur, delay }: { naam: string; pct: number; kleur: string; delay: number }) {
  const [w, setW] = useState(0)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 900, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setW(pct * ease); setCount(Math.round(pct * ease))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[12px]" style={{ color: '#666' }}>{naam}</span>
        <span className="font-mono text-[12px]" style={{ color: '#555' }}>{count}%</span>
      </div>
      <div style={{ height: 1, background: '#161616', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: 1, width: `${w}%`, background: kleur }} />
      </div>
    </div>
  )
}

// ─── Live Feed ────────────────────────────────────────────────────────────────

type FeedEvent = { id: number; kleur: string; tekst: string; ts: string; fresh: boolean }

function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(() => {
    const now = new Date()
    return eventPool.slice(0, 7).map((e, i) => ({
      id: i, kleur: e.kleur, tekst: e.tekst,
      ts: `${pad(now.getHours())}:${pad(now.getMinutes() - (6 - i))}`,
      fresh: false,
    }))
  })
  const counter = useRef(eventPool.length)
  useEffect(() => {
    const id = setInterval(() => {
      const idx = counter.current % eventPool.length
      counter.current++
      const d = new Date()
      const ev: FeedEvent = {
        id: counter.current, kleur: eventPool[idx].kleur, tekst: eventPool[idx].tekst,
        ts: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`, fresh: true,
      }
      setEvents(prev => [ev, ...prev.slice(0, 13)])
      setTimeout(() => setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, fresh: false } : e)), 600)
    }, 5000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      {events.map(e => (
        <div key={e.id} className="flex gap-3 items-start"
          style={{ opacity: e.fresh ? 0 : 1, transform: e.fresh ? 'translateY(-8px)' : 'translateY(0)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
          <span className="font-mono text-[11px] tabular-nums flex-shrink-0 pt-px" style={{ color: '#444' }}>{e.ts}</span>
          <div className="flex items-start gap-2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: e.kleur, flexShrink: 0, marginTop: 4 }} />
            <span className="text-[12px] leading-snug" style={{ color: '#999' }}>{e.tekst}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OsDashboard() {
  const [omzetPeriode, setOmzetPeriode] = useState('Deze maand')
  const omzet = omzetData[omzetPeriode]
  const mrr = 745
  const actief = klanten.filter(k => k.status === 'actief').length
  const gemMrr = Math.round(mrr / actief)

  const branche = [
    { naam: 'Kozijnen', pct: 43, kleur: '#2563EB' },
    { naam: 'Badkamer', pct: 29, kleur: '#22c55e' },
    { naam: 'Keuken', pct: 29, kleur: '#7c3aed' },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto text-white" style={{
      background: '#080808',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.06) 0%, transparent 70%), radial-gradient(circle, #141414 1px, transparent 1px)',
      backgroundSize: '100% 100%, 28px 28px',
    }}>
      <style>{`
        @keyframes dotpulse { 0%,100%{transform:scale(1);opacity:0.2} 50%{transform:scale(2.2);opacity:0} }
        @keyframes systempulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
      `}</style>

      {/* Top bar */}
      <FadeIn delay={0}>
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
          <span style={{ ...LABEL, letterSpacing: '0.22em' }}>Vertero OS</span>
          <LiveClock />
          <div className="flex items-center gap-2">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'systempulse 2.5s ease-in-out infinite' }} />
            <span style={LABEL}>Systeem actief</span>
          </div>
        </div>
      </FadeIn>

      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Financiële KPI's — rij 1 */}
        <FadeIn delay={60}>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span style={LABEL}>Financieel</span>
              <OmzetToggle selected={omzetPeriode} onChange={setOmzetPeriode} />
            </div>
            <div className="grid grid-cols-4 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
              <KpiBlock label="Totale MRR" value={mrr} prefix="€" large />
              <KpiBlock label={`Omzet — ${omzetPeriode}`} value={omzet} prefix="€" />
              <KpiBlock label="Actieve klanten" value={actief} />
              <KpiBlock label="Gem. MRR per klant" value={gemMrr} prefix="€" />
            </div>
          </div>
        </FadeIn>

        {/* Leads KPI's — rij 2 */}
        <FadeIn delay={120}>
          <div>
            <div className="mb-2"><span style={LABEL}>Leads</span></div>
            <div className="grid grid-cols-4 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
              <KpiBlock label="Leads deze maand" value={47} />
              <KpiBlock label="Gekwalificeerd" value={29} />
              <KpiBlock label="Afgevangen" value={18} />
              <KpiBlock label="Conversieratio" value={34} suffix="%" />
            </div>
          </div>
        </FadeIn>

        {/* Hoofd 60/40 */}
        <FadeIn delay={200}>
          <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>
            {/* Klantenlijst */}
            <div className="bg-[#080808] overflow-x-auto">
              <div className="px-5 py-3 border-b border-[#1a1a1a]"><span style={LABEL}>Klanten</span></div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#111]">
                    <th className="text-left px-5 py-2" style={LABEL}>Bedrijf</th>
                    <th className="text-left px-4 py-2" style={LABEL}>Branche</th>
                    <th className="text-left px-4 py-2" style={LABEL}>Status</th>
                    <th className="text-right px-5 py-2" style={LABEL}>MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {klanten.map(k => <KlantenRij key={k.naam} klant={k} />)}
                </tbody>
              </table>
            </div>

            {/* Live feed */}
            <div className="bg-[#080808]">
              <div className="px-5 py-3 border-b border-[#1a1a1a]"><span style={LABEL}>Activiteit</span></div>
              <div className="px-5 py-4 overflow-hidden"><LiveFeed /></div>
            </div>
          </div>
        </FadeIn>

        {/* Onderste rij */}
        <FadeIn delay={290}>
          <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>
            {/* MRR grafiek */}
            <div className="bg-[#080808] p-5">
              <div className="mb-4" style={LABEL}>MRR groei 2025</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={mrrData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <XAxis dataKey="m" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: 2, color: '#aaa', fontSize: 11, padding: '6px 10px' }}
                    formatter={(v) => [`€${v}`, 'MRR']}
                    cursor={{ stroke: '#2a2a2a', strokeWidth: 1 }}
                  />
                  <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5} dot={false}
                    activeDot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.5))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Branche */}
            <div className="bg-[#080808] p-5">
              <div className="mb-5" style={LABEL}>Branche verdeling</div>
              <div className="flex flex-col gap-5">
                {branche.map((b, i) => (
                  <BranchBar key={b.naam} naam={b.naam} pct={b.pct} kleur={b.kleur} delay={320 + i * 100} />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  )
}
