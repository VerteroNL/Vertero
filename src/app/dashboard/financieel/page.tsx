'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }

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

const periodes = Object.keys(omzetData)

const transacties = [
  { datum: '19 mei 2025', naam: 'Raamkozijnen Visser', bedrag: 149, type: 'Maandelijks' },
  { datum: '18 mei 2025', naam: 'Badkamer Concepts BV', bedrag: 149, type: 'Maandelijks' },
  { datum: '17 mei 2025', naam: 'Badkamer & Bad Groep', bedrag: 149, type: 'Maandelijks' },
  { datum: '15 mei 2025', naam: 'Keukenpaleis Tilburg', bedrag: 149, type: 'Maandelijks' },
  { datum: '14 mei 2025', naam: 'Reno Renovaties', bedrag: 149, type: 'Maandelijks' },
  { datum: '1 apr 2025', naam: 'Badkamer & Bad Groep', bedrag: 149, type: 'Maandelijks' },
  { datum: '1 apr 2025', naam: 'De Kozijnenman', bedrag: 0, type: 'Gratis periode' },
]

export default function FinancieelPage() {
  const [periode, setPeriode] = useState('Deze maand')
  const omzet = omzetData[periode]
  const mrr = 745

  return (
    <div className="flex flex-col h-full overflow-y-auto text-white" style={{
      background: '#080808',
      backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <span style={{ ...LABEL, letterSpacing: '0.22em' }}>Financieel</span>
        <div className="flex gap-px border border-[#1a1a1a]">
          {periodes.map(p => (
            <button key={p} onClick={() => setPeriode(p)}
              className="px-2.5 py-1 text-[10px] transition-all duration-200"
              style={{
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: periode === p ? 'rgba(37,99,235,0.15)' : 'transparent',
                color: periode === p ? '#6ba3f5' : '#444',
                borderBottom: periode === p ? '1px solid #2563EB' : '1px solid transparent',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">

        {/* KPI's */}
        <div className="grid grid-cols-4 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
          {[
            { label: 'Totale MRR', value: `€${mrr}` },
            { label: `Omzet — ${periode}`, value: `€${omzet.toLocaleString('nl-NL')}` },
            { label: 'Actieve abonnementen', value: '5' },
            { label: 'Gem. per klant', value: `€${Math.round(mrr / 5)}` },
          ].map(k => (
            <div key={k.label} className="bg-[#080808] px-5 py-4">
              <div className="mb-3" style={LABEL}>{k.label}</div>
              <div className="font-mono text-2xl leading-none" style={{ color: '#2563EB' }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Grafieken */}
        <div className="grid gap-px border border-[#1a1a1a]" style={{ gridTemplateColumns: '3fr 2fr', background: '#1a1a1a' }}>
          <div className="bg-[#080808] p-5">
            <div className="mb-4" style={LABEL}>MRR groei 2025</div>
            <ResponsiveContainer width="100%" height={180}>
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

          <div className="bg-[#080808] p-5">
            <div className="mb-4" style={LABEL}>Omzet per maand</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mrrData.slice(0, 6)} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={8}>
                <XAxis dataKey="m" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                <Tooltip
                  contentStyle={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: 2, color: '#aaa', fontSize: 11, padding: '6px 10px' }}
                  formatter={(v) => [`€${v}`, 'Omzet']}
                  cursor={{ fill: 'rgba(37,99,235,0.05)' }}
                />
                <Bar dataKey="v" fill="rgba(37,99,235,0.4)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transacties */}
        <div className="border border-[#1a1a1a]">
          <div className="px-5 py-3 border-b border-[#1a1a1a]"><span style={LABEL}>Recente betalingen</span></div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-2.5" style={LABEL}>Datum</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Klant</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Type</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>Bedrag</th>
              </tr>
            </thead>
            <tbody className="bg-[#080808]">
              {transacties.map((t, i) => (
                <tr key={i} className="border-b border-[#111] transition-colors duration-200 hover:bg-[#0d0d0d]">
                  <td className="px-5 py-3 font-mono text-[12px]" style={{ color: '#444' }}>{t.datum}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#ccc' }}>{t.naam}</td>
                  <td className="px-5 py-3 text-[12px]" style={{ ...LABEL, color: '#555' }}>{t.type}</td>
                  <td className="px-5 py-3 text-right font-mono text-[13px]" style={{ color: t.bedrag > 0 ? '#2563EB' : '#333' }}>
                    {t.bedrag > 0 ? `€${t.bedrag}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
