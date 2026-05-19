'use client'

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const klanten = [
  { naam: 'Raamkozijnen Visser', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'jan 2025' },
  { naam: 'Badkamer Concepts BV', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'feb 2025' },
  { naam: 'Keukenpaleis Tilburg', branche: 'Keuken', status: 'actief', mrr: 149, sinds: 'mrt 2025' },
  { naam: 'De Kozijnenman', branche: 'Kozijnen', status: 'gratis', mrr: 0, sinds: 'apr 2025' },
  { naam: 'Badkamer & Bad Groep', branche: 'Badkamer', status: 'actief', mrr: 149, sinds: 'apr 2025' },
  { naam: 'Keukenstudio Noord', branche: 'Keuken', status: 'gestopt', mrr: 0, sinds: 'feb 2025' },
  { naam: 'Reno Renovaties', branche: 'Kozijnen', status: 'actief', mrr: 149, sinds: 'mei 2025' },
]

const mrrData = [
  { maand: 'jan', mrr: 149 },
  { maand: 'feb', mrr: 298 },
  { maand: 'mrt', mrr: 447 },
  { maand: 'apr', mrr: 596 },
  { maand: 'mei', mrr: 745 },
  { maand: 'jun', mrr: 745 },
  { maand: 'jul', mrr: 894 },
  { maand: 'aug', mrr: 894 },
  { maand: 'sep', mrr: 894 },
  { maand: 'okt', mrr: 1043 },
  { maand: 'nov', mrr: 1043 },
  { maand: 'dec', mrr: 1192 },
]

const activiteitBronnen = [
  'Raamkozijnen Visser heeft een nieuwe lead ontvangen',
  'Badkamer Concepts BV: lead gescoord als ★★★',
  'Keukenpaleis Tilburg heeft quiz geüpdate',
  'De Kozijnenman heeft zich aangemeld',
  'Badkamer & Bad Groep: 3 leads deze week',
  'Reno Renovaties heeft widget geïnstalleerd',
  'Keukenpaleis Tilburg: lead gescoord als ★★',
  'Raamkozijnen Visser: lead via directe link',
  'Badkamer Concepts BV heeft quiz geüpdate',
  'Keukenstudio Noord: abonnement stopgezet',
]

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-sm text-white/30 tabular-nums">{time}</span>
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'actief') return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Actief
    </span>
  )
  if (status === 'gratis') return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
      Gratis periode
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/30">
      Gestopt
    </span>
  )
}

export default function OsDashboard() {
  const [activiteit, setActiviteit] = useState(() =>
    activiteitBronnen.slice(0, 5).map((tekst, i) => ({ id: i, tekst, tijd: `${5 - i}m geleden` }))
  )
  const feedRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(activiteitBronnen.length)

  useEffect(() => {
    const id = setInterval(() => {
      const idx = counterRef.current % activiteitBronnen.length
      counterRef.current++
      const nieuweItem = { id: counterRef.current, tekst: activiteitBronnen[idx], tijd: 'zojuist' }
      setActiviteit(prev => [nieuweItem, ...prev.slice(0, 9)])
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const actieveKlanten = klanten.filter(k => k.status === 'actief').length
  const mrr = klanten.reduce((sum, k) => sum + k.mrr, 0)
  const leadsDezeM = 47
  const conversie = 34

  const branche = [
    { naam: 'Kozijnen', aantal: 3, pct: 43 },
    { naam: 'Badkamer', aantal: 2, pct: 29 },
    { naam: 'Keuken', aantal: 2, pct: 29 },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#07070f]">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold tracking-tight text-white">Vertero OS</span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <LiveClock />
      </div>

      <div className="px-6 py-6 flex flex-col gap-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'MRR', value: `€${mrr.toLocaleString('nl-NL')}`, sub: '+€149 vorige maand', color: '#2563EB' },
            { label: 'Actieve klanten', value: actieveKlanten, sub: `${klanten.length} totaal`, color: '#f97316' },
            { label: 'Leads deze maand', value: leadsDezeM, sub: '+12% t.o.v. vorige maand', color: '#a855f7' },
            { label: 'Conversieratio', value: `${conversie}%`, sub: 'van lead naar klant', color: '#10b981' },
          ].map(card => (
            <div key={card.label} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl px-5 py-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">{card.label}</div>
              <div className="text-3xl font-extrabold mb-1" style={{ color: card.color }}>{card.value}</div>
              <div className="text-[11px] text-white/30">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Klantenlijst — 2/3 */}
          <div className="xl:col-span-2 bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.07]">
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">Klantenlijst</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/20">Bedrijf</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/20">Branche</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/20">Status</th>
                    <th className="text-right px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white/20">MRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {klanten.map(k => (
                    <tr key={k.naam} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-white/80">{k.naam}</div>
                        <div className="text-[11px] text-white/30">sinds {k.sinds}</div>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-sm">{k.branche}</td>
                      <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                      <td className="px-5 py-3 text-right font-mono font-semibold text-white/60 tabular-nums">
                        {k.mrr > 0 ? `€${k.mrr}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live activiteit — 1/3 */}
          <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">Live activiteit</div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            </div>
            <div ref={feedRef} className="flex-1 overflow-y-auto max-h-72 divide-y divide-white/[0.04]">
              {activiteit.map(item => (
                <div key={item.id} className="px-5 py-3">
                  <div className="text-[12px] text-white/70 leading-snug mb-0.5">{item.tekst}</div>
                  <div className="text-[10px] text-white/25">{item.tijd}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* MRR grafiek — 2/3 */}
          <div className="xl:col-span-2 bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">MRR groei 2025</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mrrData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="maand" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip
                  contentStyle={{ background: '#0d0d1c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(v: number) => [`€${v}`, 'MRR']}
                />
                <Line type="monotone" dataKey="mrr" stroke="#2563EB" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#2563EB' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Branche verdeling — 1/3 */}
          <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Branche verdeling</div>
            <div className="flex flex-col gap-4">
              {branche.map((b, i) => (
                <div key={b.naam}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-white/70">{b.naam}</span>
                    <span className="text-white/35 text-xs tabular-nums">{b.aantal} klanten</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${b.pct}%`,
                        background: i === 0 ? '#2563EB' : i === 1 ? '#f97316' : '#a855f7'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Acties */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col gap-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Acties</div>
              <a href="/dashboard/leads" className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] transition">
                Alle leads bekijken →
              </a>
              <a href="/dashboard/quiz" className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white/50 hover:text-white transition">
                Quizzes beheren →
              </a>
              <a href="/dashboard/quiz/new" className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white/50 hover:text-white transition">
                Nieuwe quiz aanmaken →
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
