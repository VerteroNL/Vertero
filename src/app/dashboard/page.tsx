'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const klanten = [
  { naam: 'Raamkozijnen Visser', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'jan 2025' },
  { naam: 'Badkamer Concepts BV', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'feb 2025' },
  { naam: 'Keukenpaleis Tilburg', branche: 'Keuken', status: 'actief', mrr: 149, sinds: 'mrt 2025' },
  { naam: 'De Kozijnenman', branche: 'Kozijnen', status: 'proef', mrr: 0, sinds: 'apr 2025' },
  { naam: 'Badkamer & Bad Groep', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'apr 2025' },
  { naam: 'Keukenstudio Noord', branche: 'Keuken', status: 'gestopt', mrr: 0, sinds: 'feb 2025' },
  { naam: 'Reno Renovaties', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'mei 2025' },
]

const mrrData = [
  { m: 'jan', v: 149 }, { m: 'feb', v: 298 }, { m: 'mrt', v: 447 },
  { m: 'apr', v: 596 }, { m: 'mei', v: 745 }, { m: 'jun', v: 745 },
  { m: 'jul', v: 894 }, { m: 'aug', v: 894 }, { m: 'sep', v: 894 },
  { m: 'okt', v: 1043 }, { m: 'nov', v: 1043 }, { m: 'dec', v: 1192 },
]

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

function pad(n: number) { return String(n).padStart(2, '0') }

function LiveClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-white text-lg" style={{ letterSpacing: '0.12em' }}>{t}</span>
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

function KpiValue({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useCountUp(value)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="font-mono text-2xl leading-none transition-all duration-300 cursor-default select-none"
      style={{
        color: '#2563EB',
        textShadow: hovered ? '0 0 20px rgba(37,99,235,0.6), 0 0 40px rgba(37,99,235,0.3)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {prefix}{count.toLocaleString('nl-NL')}{suffix}
    </div>
  )
}

type FeedEvent = { id: number; kleur: string; tekst: string; ts: string; fresh: boolean }

function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(() => {
    const now = new Date()
    return eventPool.slice(0, 7).map((e, i) => ({
      id: i,
      kleur: e.kleur,
      tekst: e.tekst,
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
        id: counter.current,
        kleur: eventPool[idx].kleur,
        tekst: eventPool[idx].tekst,
        ts: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
        fresh: true,
      }
      setEvents(prev => [ev, ...prev.slice(0, 13)])
      setTimeout(() => setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, fresh: false } : e)), 600)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      {events.map(e => (
        <div
          key={e.id}
          className="flex gap-3 items-start"
          style={{
            opacity: e.fresh ? 0 : 1,
            transform: e.fresh ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
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

function StatusDot({ status }: { status: string }) {
  const color = status === 'actief' ? '#22c55e' : status === 'proef' ? '#f59e0b' : '#2a2a2a'
  const pulse = status === 'actief'
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16 }}>
      {pulse && (
        <span style={{
          position: 'absolute', width: 14, height: 14, borderRadius: '50%',
          background: color, opacity: 0.25,
          animation: 'dotpulse 2s ease-in-out infinite',
        }} />
      )}
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'block', position: 'relative' }} />
    </span>
  )
}

function BranchBar({ naam, pct, kleur, delay }: { naam: string; pct: number; kleur: string; delay: number }) {
  const [w, setW] = useState(0)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const dur = 900
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setW(pct * ease)
        setCount(Math.round(pct * ease))
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
        <div style={{ position: 'absolute', top: 0, left: 0, height: 1, width: `${w}%`, background: kleur, transition: 'none' }} />
      </div>
    </div>
  )
}

const LABEL = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#444' }

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      {children}
    </div>
  )
}

export default function OsDashboard() {
  const mrr = 745
  const actief = klanten.filter(k => k.status === 'actief').length

  const kpis = [
    { label: 'MRR', value: mrr, prefix: '€' },
    { label: 'Actieve klanten', value: actief },
    { label: 'Leads deze maand', value: 47 },
    { label: 'Conversieratio', value: 34, suffix: '%' },
  ]

  const branche = [
    { naam: 'Kozijnen', pct: 43, kleur: '#2563EB' },
    { naam: 'Badkamer', pct: 29, kleur: '#22c55e' },
    { naam: 'Keuken', pct: 29, kleur: '#7c3aed' },
  ]

  return (
    <div
      className="flex flex-col h-full overflow-y-auto text-white"
      style={{
        background: '#080808',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.06) 0%, transparent 70%), radial-gradient(circle, #141414 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px',
      }}
    >
      <style>{`
        @keyframes dotpulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes systempulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes gridmove {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 0 0, 28px 28px; }
        }
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

        {/* KPI rij */}
        <FadeIn delay={60}>
          <div className="grid grid-cols-4 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
            {kpis.map((k, i) => (
              <KpiBlock key={k.label} {...k} delay={i * 80} />
            ))}
          </div>
        </FadeIn>

        {/* Hoofd 60/40 */}
        <FadeIn delay={160}>
          <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>

            {/* Klantenlijst */}
            <div className="bg-[#080808] overflow-x-auto">
              <div className="px-5 py-3 border-b border-[#1a1a1a]">
                <span style={LABEL}>Klanten</span>
              </div>
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
                  {klanten.map((k) => (
                    <KlantenRij key={k.naam} klant={k} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live feed */}
            <div className="bg-[#080808]">
              <div className="px-5 py-3 border-b border-[#1a1a1a]">
                <span style={LABEL}>Activiteit</span>
              </div>
              <div className="px-5 py-4 overflow-hidden">
                <LiveFeed />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Onderste rij */}
        <FadeIn delay={260}>
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
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <Line
                    type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5}
                    dot={false} activeDot={{ r: 3, fill: '#2563EB', strokeWidth: 0 }}
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
                  <BranchBar key={b.naam} naam={b.naam} pct={b.pct} kleur={b.kleur} delay={300 + i * 100} />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  )
}

function KpiBlock({ label, value, prefix = '', suffix = '' }: { label: string; value: number; prefix?: string; suffix?: string; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="bg-[#080808] px-5 py-4 cursor-default transition-all duration-200"
      style={{ borderBottom: hovered ? '1px solid rgba(37,99,235,0.5)' : '1px solid transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-3" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }}>{label}</div>
      <KpiValue value={value} prefix={prefix} suffix={suffix} />
    </div>
  )
}

function KlantenRij({ klant }: { klant: typeof klanten[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <tr
      className="border-b border-[#111] transition-all duration-200"
      style={{ background: hovered ? 'rgba(37,99,235,0.04)' : 'transparent', boxShadow: hovered ? 'inset 0 0 20px rgba(37,99,235,0.03)' : 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td className="px-5 py-3">
        <div className="text-[13px]" style={{ color: '#ccc' }}>{klant.naam}</div>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#333', marginTop: 2 }}>sinds {klant.sinds}</div>
      </td>
      <td className="px-4 py-3 text-[13px]" style={{ color: '#555' }}>{klant.branche}</td>
      <td className="px-4 py-3">
        <StatusDot status={klant.status} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-3">
          <span className="font-mono text-[13px]" style={{ color: '#555' }}>{klant.mrr > 0 ? `€${klant.mrr}` : '—'}</span>
          <span style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s ease', color: '#2563EB', fontSize: 12 }}>→</span>
        </div>
      </td>
    </tr>
  )
}
