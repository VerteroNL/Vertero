'use client'

import { useState } from 'react'
import Link from 'next/link'
import LeadRowActions from './LeadRowActions'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  answers: Record<string, string>
  created_at: string
  quizzes?: { name: string } | null
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const allSelected = leads.length > 0 && selected.size === leads.length
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(leads.map((l) => l.id)))
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function exportSelected() {
    const toExport = leads.filter((l) => selected.has(l.id))
    const answerKeys = Array.from(new Set(toExport.flatMap((l) => Object.keys(l.answers))))
    const headers = ['Naam', 'E-mail', 'Telefoon', 'Datum', ...answerKeys]
    const rows = toExport.map((l) => [
      l.name,
      l.email,
      l.phone ?? '',
      new Date(l.created_at).toLocaleDateString('nl-NL'),
      ...answerKeys.map((k) => l.answers[k] ?? ''),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {someSelected && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-white/40 text-sm">{selected.size} geselecteerd</span>
          <button
            onClick={exportSelected}
            className="text-[#f97316] hover:text-[#ea6c0a] text-sm font-semibold transition"
          >
            Exporteren →
          </button>
        </div>
      )}

      <div className="bg-[#0d0d1c] border border-white/10 rounded-xl overflow-hidden">
        {/* Header row with select-all */}
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-2.5">
          <button
            onClick={toggleAll}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${
              allSelected
                ? 'bg-[#f97316] border-[#f97316]'
                : someSelected
                ? 'bg-[#f97316]/30 border-[#f97316]/50'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            {(allSelected || someSelected) && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                {allSelected ? (
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
            )}
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">
            {allSelected ? 'Alles deselecteren' : 'Alles selecteren'}
          </span>
        </div>

        {leads.map((lead, i) => {
          const isLast = i === leads.length - 1
          const isSelected = selected.has(lead.id)
          return (
            <div
              key={lead.id}
              className={`flex items-center gap-2 ${!isLast ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-[#f97316]/5' : 'hover:bg-white/[0.02]'} transition`}
            >
              <div className="pl-5 flex-shrink-0">
                <button
                  onClick={() => toggleOne(lead.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                    isSelected ? 'bg-[#f97316] border-[#f97316]' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center px-3 py-3.5 min-w-0">
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {lead.name || '—'}
                    {lead.status === 'new' && (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#f97316]/10 text-[#f97316] flex-shrink-0">
                        Nieuw
                      </span>
                    )}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5 font-mono truncate">{lead.email || '—'}</div>
                </div>
                <div className="text-white/40 text-xs">{lead.phone || <span className="text-white/20">—</span>}</div>
                <div className="text-white/40 text-xs">{lead.answers?.adres?.split(',').slice(-1)[0]?.trim() || <span className="text-white/20">—</span>}</div>
                <div className="text-white/30 text-xs">
                  <div>{lead.quizzes?.name || '—'}</div>
                  <div className="mt-0.5">{new Date(lead.created_at).toLocaleDateString('nl-NL')}</div>
                </div>
              </Link>
              <div className="pr-4">
                <LeadRowActions leadId={lead.id} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
