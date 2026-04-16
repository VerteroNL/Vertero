'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import LeadRowActions from '../LeadRowActions'
import { calculateScore } from '@/lib/scoring'

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const stroke = 4.5
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f97316' : '#ef4444'
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold leading-none" style={{ color, fontSize: size * 0.26 }}>{score}%</span>
      </div>
    </div>
  )
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  answers: Record<string, string>
  created_at: string
  quizzes?: { name: string; config?: { scoring?: boolean; questions: { id: string; type: 'multiple' | 'text'; options: string[] }[] } } | null
}

type SortKey = 'name' | 'date' | 'score' | 'quiz'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 25

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg
      className={`inline-block ml-1 w-3 h-3 transition ${active ? 'opacity-100' : 'opacity-20'}`}
      viewBox="0 0 10 12" fill="none"
    >
      <path
        d="M5 1v10M2 9l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: active && dir === 'asc' ? 'scaleY(-1)' : undefined, transformOrigin: '50% 50%' }}
      />
    </svg>
  )
}

export default function ArchivedLeadsTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const [loading, setLoading] = useState(false)

  const leadsWithScore = useMemo(() =>
    leads.map(lead => ({
      ...lead,
      score: lead.quizzes?.config
        ? calculateScore(lead.quizzes.config as Parameters<typeof calculateScore>[0], lead.answers)
        : null,
    })),
    [leads]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return leadsWithScore
    return leadsWithScore.filter(l =>
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.quizzes?.name?.toLowerCase().includes(q)
    )
  }, [leadsWithScore, search])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = (a.name || '').localeCompare(b.name || '')
      else if (sortKey === 'date') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      else if (sortKey === 'score') cmp = (a.score ?? -1) - (b.score ?? -1)
      else if (sortKey === 'quiz') cmp = (a.quizzes?.name || '').localeCompare(b.quizzes?.name || '')
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  function handleSearch(val: string) { setSearch(val); setPage(1) }

  const allSelected = paginated.length > 0 && paginated.every(l => selected.has(l.id))
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => { const next = new Set(prev); paginated.forEach(l => next.delete(l.id)); return next })
    } else {
      setSelected(prev => { const next = new Set(prev); paginated.forEach(l => next.add(l.id)); return next })
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  async function deleteSelected() {
    setLoading(true)
    await fetch('/api/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    })
    setSelected(new Set()); setConfirmDelete(false); setLoading(false)
    window.location.reload()
  }

  async function restoreSelected() {
    setLoading(true)
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected), status: 'seen' }),
    })
    setSelected(new Set()); setConfirmRestore(false); setLoading(false)
    window.location.reload()
  }

  async function restoreOne(id: string, e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id], status: 'seen' }),
    })
    window.location.reload()
  }

  return (
    <>
      {/* Search + toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Zoek op naam, e-mail of quiz..."
            className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition">✕</button>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {someSelected && (
            <>
              <span className="text-white/30 text-sm whitespace-nowrap">{selected.size} geselecteerd</span>
              <button
                onClick={() => setConfirmRestore(true)}
                className="text-[#f97316] hover:text-[#ea6c0a] text-sm font-semibold transition whitespace-nowrap"
              >
                Terugzetten
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-red-400/70 hover:text-red-400 text-sm font-semibold transition whitespace-nowrap"
              >
                Verwijderen
              </button>
            </>
          )}
        </div>
      </div>

      {search && (
        <p className="text-white/30 text-xs mb-3">
          {filtered.length} resultaat{filtered.length !== 1 ? 'en' : ''} voor &quot;{search}&quot;
        </p>
      )}

      <div className="bg-[#0d0d1c] border border-white/10 rounded-xl overflow-hidden">
        {/* Desktop column headers */}
        <div className="hidden md:flex items-center gap-2 border-b border-white/10 px-5 py-2.5">
          <button
            onClick={toggleAll}
            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${
              allSelected ? 'bg-[#f97316] border-[#f97316]' : someSelected ? 'bg-[#f97316]/30 border-[#f97316]/50' : 'border-white/20 hover:border-white/40'
            }`}
          >
            {(allSelected || someSelected) && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                {allSelected
                  ? <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                }
              </svg>
            )}
          </button>
          <div className="flex-1 grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-3">
            <button onClick={() => handleSort('name')} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 text-left transition">
              Naam <SortIcon active={sortKey === 'name'} dir={sortDir} />
            </button>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Telefoon</span>
            <button onClick={() => handleSort('quiz')} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 text-left transition">
              Quiz <SortIcon active={sortKey === 'quiz'} dir={sortDir} />
            </button>
            <button onClick={() => handleSort('date')} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 text-left transition">
              Datum <SortIcon active={sortKey === 'date'} dir={sortDir} />
            </button>
            <button onClick={() => handleSort('score')} className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/40 text-left transition">
              Score <SortIcon active={sortKey === 'score'} dir={sortDir} />
            </button>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="px-5 py-12 text-center text-white/25 text-sm">
            {search ? `Geen leads gevonden voor "${search}"` : 'Geen afgevinkte leads'}
          </div>
        ) : (
          paginated.map((lead, i) => {
            const isLast = i === paginated.length - 1
            const isSelected = selected.has(lead.id)
            const { score } = lead

            return (
              <div
                key={lead.id}
                className={`${!isLast ? 'border-b border-white/5' : ''} ${isSelected ? 'bg-[#f97316]/5' : 'hover:bg-white/[0.02]'} transition`}
              >
                {/* Desktop row */}
                <div className="hidden md:flex items-center gap-2">
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
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-3 py-3.5 min-w-0">
                    <div>
                      <div className="font-semibold text-sm text-white/70">{lead.name || '—'}</div>
                      <div className="text-white/30 text-xs mt-0.5 font-mono truncate">{lead.email || '—'}</div>
                    </div>
                    <div className="text-white/40 text-xs">{lead.phone || <span className="text-white/20">—</span>}</div>
                    <div className="text-white/30 text-xs truncate">{lead.quizzes?.name || '—'}</div>
                    <div className="text-white/30 text-xs">{new Date(lead.created_at).toLocaleDateString('nl-NL')}</div>
                    <div className="flex justify-end">
                      {score !== null ? <ScoreRing score={score} size={44} /> : <span className="text-white/20 text-xs">—</span>}
                    </div>
                  </Link>
                  <div className="pr-4 flex items-center gap-1">
                    <button
                      onClick={e => restoreOne(lead.id, e)}
                      title="Terugzetten naar actief"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#f97316]/20 text-white/40 hover:text-[#f97316] transition text-sm"
                    >
                      ↩
                    </button>
                    <LeadRowActions leadId={lead.id} deleteOnly />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="flex md:hidden items-start gap-3 px-4 py-4">
                  <button
                    onClick={() => toggleOne(lead.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                      isSelected ? 'bg-[#f97316] border-[#f97316]' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm text-white/80 min-w-0 truncate">{lead.name || '—'}</div>
                      {score !== null && <ScoreRing score={score} size={40} />}
                    </div>
                    <div className="text-white/40 text-xs font-mono truncate mb-1">{lead.email || '—'}</div>
                    <div className="flex items-center gap-2 text-white/25 text-xs">
                      <span>{lead.quizzes?.name || '—'}</span>
                      <span>·</span>
                      <span>{new Date(lead.created_at).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={e => restoreOne(lead.id, e)}
                      title="Terugzetten naar actief"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#f97316]/20 text-white/40 hover:text-[#f97316] transition text-sm"
                    >
                      ↩
                    </button>
                    <LeadRowActions leadId={lead.id} deleteOnly />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Restore confirm modal */}
      {confirmRestore && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setConfirmRestore(false)}
        >
          <div
            className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="font-bold text-base mb-1.5">
              {selected.size} lead{selected.size !== 1 ? 's' : ''} terugzetten?
            </div>
            <div className="text-white/40 text-sm leading-relaxed mb-7">
              De leads worden teruggeplaatst in de actieve lijst.
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmRestore(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition"
              >
                Annuleren
              </button>
              <button
                onClick={restoreSelected}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {loading ? 'Bezig...' : 'Terugzetten'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div className="font-bold text-base mb-1.5">
              {selected.size} lead{selected.size !== 1 ? 's' : ''} verwijderen
            </div>
            <div className="text-white/40 text-sm leading-relaxed mb-7">
              Dit kan niet ongedaan worden gemaakt.
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition"
              >
                Annuleren
              </button>
              <button
                onClick={deleteSelected}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {loading ? 'Bezig...' : 'Verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-xs">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} van {sorted.length} leads
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition text-sm"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                  p === page ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/20 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition text-sm"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
