'use client'

import { useState, useEffect } from 'react'
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

const eventPool = [
  ['Raamkozijnen Visser', 'nieuwe lead ontvangen'],
  ['Badkamer Concepts BV', 'lead gescoord — hoge prioriteit'],
  ['Keukenpaleis Tilburg', 'quiz gewijzigd'],
  ['De Kozijnenman', 'aangemeld voor proefperiode'],
  ['Badkamer & Bad Groep', '3 leads binnengekomen'],
  ['Reno Renovaties', 'widget geïnstalleerd'],
  ['Keukenpaleis Tilburg', 'lead gescoord — gemiddeld'],
  ['Raamkozijnen Visser', 'lead via directe link'],
  ['Badkamer Concepts BV', 'quiz geüpdate'],
  ['Keukenstudio Noord', 'abonnement beëindigd'],
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
  return <span className="font-mono text-white text-lg tracking-widest">{t}</span>
}

type Event = { id: number; bedrijf: string; actie: string; ts: string }

function LiveFeed() {
  const [events, setEvents] = useState<Event[]>(() =>
    eventPool.slice(0, 6).map((e, i) => ({
      id: i,
      bedrijf: e[0],
      actie: e[1],
      ts: `${pad(new Date().getHours())}:${pad(new Date().getMinutes() - (5 - i))}`,
    }))
  )
  const counter = { current: eventPool.length }

  useEffect(() => {
    const id = setInterval(() => {
      const idx = counter.current % eventPool.length
      counter.current++
      const d = new Date()
      setEvents(prev => [{
        id: counter.current,
        bedrijf: eventPool[idx][0],
        actie: eventPool[idx][1],
        ts: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      }, ...prev.slice(0, 14)])
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      {events.map(e => (
        <div key={e.id} className="flex gap-3 items-start">
          <span className="font-mono text-[11px] text-[#444] tabular-nums flex-shrink-0 pt-px">{e.ts}</span>
          <div>
            <span className="text-[12px] text-[#aaa]">{e.bedrijf}</span>
            <span className="text-[12px] text-[#555]"> — {e.actie}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'actief' ? '#22c55e' : status === 'proef' ? '#f59e0b' : '#3f3f3f'
  return <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
}

const label = 'text-[10px] tracking-[0.15em] uppercase text-[#444]'
const val = 'font-mono text-2xl text-[#2563EB] leading-none'

export default function OsDashboard() {
  const mrr = 745
  const actief = klanten.filter(k => k.status === 'actief').length

  const branche = [
    { naam: 'Kozijnen', pct: 43 },
    { naam: 'Badkamer', pct: 29 },
    { naam: 'Keuken', pct: 29 },
  ]

  return (
    <div
      className="flex flex-col h-full overflow-y-auto text-white"
      style={{
        background: '#080808',
        backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <span className={label} style={{ letterSpacing: '0.2em' }}>Vertero OS</span>
        <LiveClock />
        <div className="flex items-center gap-2">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span className={label}>Systeem actief</span>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">

        {/* KPI rij */}
        <div className="grid grid-cols-4 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
          {[
            { label: 'MRR', value: `€${mrr}` },
            { label: 'Actieve klanten', value: actief },
            { label: 'Leads deze maand', value: 47 },
            { label: 'Conversieratio', value: '34%' },
          ].map(k => (
            <div key={k.label} className="bg-[#080808] px-5 py-4">
              <div className={label + ' mb-3'}>{k.label}</div>
              <div className={val}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Hoofd — 60/40 */}
        <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>

          {/* Klantenlijst */}
          <div className="bg-[#080808] overflow-x-auto">
            <div className="px-5 py-3 border-b border-[#1a1a1a]">
              <span className={label}>Klanten</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111]">
                  <th className={'text-left px-5 py-2 ' + label}>Bedrijf</th>
                  <th className={'text-left px-4 py-2 ' + label}>Branche</th>
                  <th className={'text-left px-4 py-2 ' + label}>Status</th>
                  <th className={'text-right px-5 py-2 ' + label}>MRR</th>
                </tr>
              </thead>
              <tbody>
                {klanten.map((k, i) => (
                  <tr
                    key={k.naam}
                    className="border-b border-[#111] transition-colors"
                    style={{ background: i % 2 === 0 ? '#080808' : '#0b0b0b' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#111')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#080808' : '#0b0b0b')}
                  >
                    <td className="px-5 py-3">
                      <div className="text-[13px] text-[#ccc]">{k.naam}</div>
                      <div className={label + ' mt-0.5'}>sinds {k.sinds}</div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#555]">{k.branche}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={k.status} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-[13px] text-[#555]">
                      {k.mrr > 0 ? `€${k.mrr}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live feed */}
          <div className="bg-[#080808]">
            <div className="px-5 py-3 border-b border-[#1a1a1a]">
              <span className={label}>Activiteit</span>
            </div>
            <div className="px-5 py-4 overflow-hidden">
              <LiveFeed />
            </div>
          </div>
        </div>

        {/* Onderste rij — 60/40 */}
        <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>

          {/* MRR grafiek */}
          <div className="bg-[#080808] p-5">
            <div className={label + ' mb-4'}>MRR groei 2025</div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={mrrData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip
                  contentStyle={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 2, color: '#aaa', fontSize: 11 }}
                  formatter={(v) => [`€${v}`, 'MRR']}
                  cursor={{ stroke: '#333' }}
                />
                <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Branche */}
          <div className="bg-[#080808] p-5">
            <div className={label + ' mb-5'}>Branche verdeling</div>
            <div className="flex flex-col gap-5">
              {branche.map((b, i) => (
                <div key={b.naam}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-[#666]">{b.naam}</span>
                    <span className="font-mono text-[12px] text-[#444]">{b.pct}%</span>
                  </div>
                  <div style={{ height: 1, background: '#1a1a1a', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, height: 1,
                      width: `${b.pct}%`,
                      background: i === 0 ? '#2563EB' : i === 1 ? '#f97316' : '#7c3aed',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
