'use client'

const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }

type Status = 'live' | 'bezig' | 'probleem'

const klanten: Array<{
  naam: string
  branche: string
  quiz: boolean
  widget: boolean
  whatsapp: boolean
  eersteLead: boolean
  status: Status
}> = [
  { naam: 'Raamkozijnen Visser', branche: 'Kozijnen', quiz: true, widget: true, whatsapp: true, eersteLead: true, status: 'live' },
  { naam: 'Badkamer Concepts BV', branche: 'Badkamer', quiz: true, widget: true, whatsapp: true, eersteLead: true, status: 'live' },
  { naam: 'Keukenpaleis Tilburg', branche: 'Keuken', quiz: true, widget: true, whatsapp: false, eersteLead: true, status: 'bezig' },
  { naam: 'De Kozijnenman', branche: 'Kozijnen', quiz: true, widget: false, whatsapp: false, eersteLead: false, status: 'bezig' },
  { naam: 'Badkamer & Bad Groep', branche: 'Badkamer', quiz: true, widget: true, whatsapp: true, eersteLead: true, status: 'live' },
  { naam: 'Keukenstudio Noord', branche: 'Keuken', quiz: true, widget: true, whatsapp: false, eersteLead: false, status: 'probleem' },
  { naam: 'Reno Renovaties', branche: 'Kozijnen', quiz: true, widget: true, whatsapp: true, eersteLead: false, status: 'bezig' },
]

function Check({ ok }: { ok: boolean }) {
  return (
    <span style={{ color: ok ? '#22c55e' : '#2a2a2a', fontSize: 14, fontWeight: 500 }}>
      {ok ? '✓' : '✗'}
    </span>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; color: string; bg: string }> = {
    live: { label: 'Live', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
    bezig: { label: 'In progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    probleem: { label: 'Probleem', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  }
  const s = map[status]
  return (
    <span style={{ ...LABEL, color: s.color, background: s.bg, padding: '2px 8px', letterSpacing: '0.1em' }}>
      {s.label}
    </span>
  )
}

function KlantenRij({ klant }: { klant: typeof klanten[0] }) {
  return (
    <tr className="border-b border-[#111] transition-colors duration-200 hover:bg-[#0d0d0d]">
      <td className="px-5 py-3.5">
        <div className="text-[13px]" style={{ color: '#ccc' }}>{klant.naam}</div>
        <div style={{ ...LABEL, marginTop: 2, color: '#333' }}>{klant.branche}</div>
      </td>
      <td className="px-5 py-3.5 text-center"><Check ok={klant.quiz} /></td>
      <td className="px-5 py-3.5 text-center"><Check ok={klant.widget} /></td>
      <td className="px-5 py-3.5 text-center"><Check ok={klant.whatsapp} /></td>
      <td className="px-5 py-3.5 text-center"><Check ok={klant.eersteLead} /></td>
      <td className="px-5 py-3.5"><StatusBadge status={klant.status} /></td>
    </tr>
  )
}

const live = klanten.filter(k => k.status === 'live').length
const bezig = klanten.filter(k => k.status === 'bezig').length
const probleem = klanten.filter(k => k.status === 'probleem').length

export default function InstallerenPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto text-white" style={{
      background: '#080808',
      backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <span style={{ ...LABEL, letterSpacing: '0.22em' }}>Installatiestatus</span>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Samenvatting */}
        <div className="grid grid-cols-3 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
          {[
            { label: 'Live', value: live, color: '#22c55e' },
            { label: 'In progress', value: bezig, color: '#f59e0b' },
            { label: 'Probleem', value: probleem, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="bg-[#080808] px-5 py-4">
              <div className="mb-3" style={LABEL}>{s.label}</div>
              <div className="font-mono text-2xl leading-none" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabel */}
        <div className="border border-[#1a1a1a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-2.5" style={LABEL}>Klant</th>
                <th className="text-center px-5 py-2.5" style={LABEL}>Quiz gebouwd</th>
                <th className="text-center px-5 py-2.5" style={LABEL}>Widget live</th>
                <th className="text-center px-5 py-2.5" style={LABEL}>WhatsApp</th>
                <th className="text-center px-5 py-2.5" style={LABEL}>Eerste lead</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Status</th>
              </tr>
            </thead>
            <tbody className="bg-[#080808]">
              {klanten.map(k => <KlantenRij key={k.naam} klant={k} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
