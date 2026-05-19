'use client'

import Link from 'next/link'

const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }

const klanten = [
  { naam: 'Raamkozijnen Visser', branche: 'Kozijnen', status: 'actief', mrr: 149, since: 'jan 2025', leads: 14 },
  { naam: 'Badkamer Concepts BV', branche: 'Badkamer', status: 'actief', mrr: 149, since: 'feb 2025', leads: 9 },
  { naam: 'Keukenpaleis Tilburg', branche: 'Keuken', status: 'actief', mrr: 149, since: 'mrt 2025', leads: 11 },
  { naam: 'De Kozijnenman', branche: 'Kozijnen', status: 'proef', mrr: 0, since: 'apr 2025', leads: 2 },
  { naam: 'Badkamer & Bad Groep', branche: 'Badkamer', status: 'actief', mrr: 149, since: 'apr 2025', leads: 7 },
  { naam: 'Keukenstudio Noord', branche: 'Keuken', status: 'gestopt', mrr: 0, since: 'feb 2025', leads: 4 },
  { naam: 'Reno Renovaties', branche: 'Kozijnen', status: 'actief', mrr: 149, since: 'mei 2025', leads: 0 },
]

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

export default function KlantenPage() {
  const actief = klanten.filter(k => k.status === 'actief').length
  const mrr = klanten.reduce((s, k) => s + k.mrr, 0)
  const totalLeads = klanten.reduce((s, k) => s + k.leads, 0)

  return (
    <div className="flex flex-col h-full overflow-y-auto text-white" style={{
      background: '#080808',
      backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      <style>{`@keyframes dotpulse{0%,100%{transform:scale(1);opacity:.2}50%{transform:scale(2.2);opacity:0}}`}</style>
      <div className="flex items-center px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <span style={{ ...LABEL, letterSpacing: '0.22em' }}>Klanten</span>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
          {[
            { label: 'Actieve klanten', value: actief, prefix: '' },
            { label: 'Totale MRR', value: mrr, prefix: '€' },
            { label: 'Totaal leads', value: totalLeads, prefix: '' },
          ].map(s => (
            <div key={s.label} className="bg-[#080808] px-5 py-4">
              <div className="mb-3" style={LABEL}>{s.label}</div>
              <div className="font-mono text-2xl leading-none" style={{ color: '#2563EB' }}>{s.prefix}{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabel */}
        <div className="border border-[#1a1a1a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-2.5" style={LABEL}>Bedrijf</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Branche</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Status</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>Leads</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>MRR</th>
              </tr>
            </thead>
            <tbody className="bg-[#080808]">
              {klanten.map(k => (
                <tr key={k.naam} className="border-b border-[#111] transition-colors duration-200 hover:bg-[#0d0d0d] group">
                  <td className="px-5 py-3.5">
                    <div className="text-[13px]" style={{ color: '#ccc' }}>{k.naam}</div>
                    <div style={{ ...LABEL, marginTop: 2, color: '#333' }}>since {k.since}</div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: '#555' }}>{k.branche}</td>
                  <td className="px-5 py-3.5"><StatusDot status={k.status} /></td>
                  <td className="px-5 py-3.5 text-right font-mono text-[13px]" style={{ color: '#555' }}>{k.leads}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-mono text-[13px]" style={{ color: k.mrr > 0 ? '#2563EB' : '#333' }}>
                        {k.mrr > 0 ? `€${k.mrr}` : '—'}
                      </span>
                    </div>
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
