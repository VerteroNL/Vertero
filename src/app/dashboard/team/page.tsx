'use client'

const LABEL: React.CSSProperties = { fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#444' }

const teamleden = [
  {
    naam: 'Sander Goppel',
    rol: 'Oprichter',
    klanten: 4,
    installatiesDezeMaand: 2,
    mrrGegenereerd: 447,
    initialen: 'SG',
    kleur: '#2563EB',
    laatstActief: 'Vandaag, 10:42',
  },
  {
    naam: 'Milan de Vries',
    rol: 'Medewerker',
    klanten: 2,
    installatiesDezeMaand: 1,
    mrrGegenereerd: 298,
    initialen: 'MV',
    kleur: '#7c3aed',
    laatstActief: 'Gisteren, 16:05',
  },
  {
    naam: 'Joep Aarts',
    rol: 'Medewerker',
    klanten: 1,
    installatiesDezeMaand: 0,
    mrrGegenereerd: 0,
    initialen: 'JA',
    kleur: '#f59e0b',
    laatstActief: '2 dagen geleden',
  },
]

function Avatar({ initialen, kleur }: { initialen: string; kleur: string }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: `${kleur}22`,
      border: `1px solid ${kleur}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, color: kleur, flexShrink: 0,
      letterSpacing: '0.05em',
    }}>
      {initialen}
    </div>
  )
}

function RolBadge({ rol }: { rol: string }) {
  const isOprichter = rol === 'Oprichter'
  return (
    <span style={{
      ...LABEL,
      color: isOprichter ? '#6ba3f5' : '#555',
      background: isOprichter ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.03)',
      padding: '2px 8px',
    }}>
      {rol}
    </span>
  )
}

const totaalKlanten = teamleden.reduce((s, t) => s + t.klanten, 0)
const totaalInstallaties = teamleden.reduce((s, t) => s + t.installatiesDezeMaand, 0)
const topMrr = [...teamleden].sort((a, b) => b.mrrGegenereerd - a.mrrGegenereerd)[0]

export default function TeamPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto text-white" style={{
      background: '#080808',
      backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      <div className="flex items-center px-6 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <span style={{ ...LABEL, letterSpacing: '0.22em' }}>Team</span>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">

        {/* Team samenvatting */}
        <div className="grid grid-cols-3 gap-px border border-[#1a1a1a]" style={{ background: '#1a1a1a' }}>
          <div className="bg-[#080808] px-5 py-4">
            <div className="mb-3" style={LABEL}>Klanten over team</div>
            <div className="font-mono text-2xl leading-none" style={{ color: '#2563EB' }}>{totaalKlanten}</div>
          </div>
          <div className="bg-[#080808] px-5 py-4">
            <div className="mb-3" style={LABEL}>Installaties deze maand</div>
            <div className="font-mono text-2xl leading-none" style={{ color: '#2563EB' }}>{totaalInstallaties}</div>
          </div>
          <div className="bg-[#080808] px-5 py-4">
            <div className="mb-3" style={LABEL}>Meeste MRR gegenereerd</div>
            <div className="flex items-center gap-2 mt-1">
              <Avatar initialen={topMrr.initialen} kleur={topMrr.kleur} />
              <div>
                <div className="text-[13px]" style={{ color: '#ccc' }}>{topMrr.naam}</div>
                <div className="font-mono text-[11px]" style={{ color: '#2563EB' }}>€{topMrr.mrrGegenereerd}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teamleden tabel */}
        <div className="border border-[#1a1a1a]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-5 py-2.5" style={LABEL}>Naam</th>
                <th className="text-left px-5 py-2.5" style={LABEL}>Rol</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>Klanten</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>Installaties</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>MRR gegenereerd</th>
                <th className="text-right px-5 py-2.5" style={LABEL}>Laatste actief</th>
              </tr>
            </thead>
            <tbody className="bg-[#080808]">
              {teamleden.map(lid => (
                <tr key={lid.naam} className="border-b border-[#111] transition-colors duration-200 hover:bg-[#0d0d0d]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initialen={lid.initialen} kleur={lid.kleur} />
                      <span className="text-[13px]" style={{ color: '#ccc' }}>{lid.naam}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RolBadge rol={lid.rol} /></td>
                  <td className="px-5 py-3.5 text-right font-mono text-[13px]" style={{ color: '#666' }}>{lid.klanten}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-[13px]" style={{ color: '#666' }}>{lid.installatiesDezeMaand}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-[13px]" style={{ color: lid.mrrGegenereerd > 0 ? '#2563EB' : '#333' }}>
                    {lid.mrrGegenereerd > 0 ? `€${lid.mrrGegenereerd}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[12px]" style={{ color: '#444' }}>{lid.laatstActief}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
