import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function LeadsPage() {
  const { userId } = await auth()

  const { data: leads } = await supabase
    .from('leads')
    .select('*, quizzes(name, config)')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-2">Overzicht</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Leads</h1>
        <p className="text-white/40 text-sm mt-1">{leads?.length || 0} inzendingen totaal</p>
      </div>

      {!leads?.length ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-bold text-xl mx-auto mb-4">◎</div>
          <div className="font-semibold mb-2">Nog geen leads</div>
          <div className="text-white/40 text-sm">Embed een quiz op een website om leads te ontvangen</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {leads.map(lead => {
            const questions: { id: string; question: string }[] = lead.quizzes?.config?.questions || []
            return (
              <div key={lead.id} className="bg-[#0d0d1c] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="font-bold text-base">{lead.name || 'Onbekend'}</div>
                    <div className="text-white/40 text-xs mt-0.5">{lead.quizzes?.name || '—'} · {new Date(lead.created_at).toLocaleDateString('nl-NL')}</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] flex-shrink-0">
                    {lead.status}
                  </span>
                </div>

                {/* Contactgegevens */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[#07070f] rounded-xl px-4 py-3 border border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">E-mail</div>
                    <div className="text-sm text-white/80 font-mono truncate">{lead.email || '—'}</div>
                  </div>
                  <div className="bg-[#07070f] rounded-xl px-4 py-3 border border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Telefoon</div>
                    <div className="text-sm text-white/80 font-mono">{lead.phone || '—'}</div>
                  </div>
                  <div className="bg-[#07070f] rounded-xl px-4 py-3 border border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1">Adres</div>
                    <div className="text-sm text-white/80 truncate">
                      {lead.answers?.adres || '—'}
                    </div>
                  </div>
                </div>

                {/* Antwoorden */}
                {questions.length > 0 && (
                  <div className="border-t border-white/5 pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Antwoorden</div>
                    <div className="grid grid-cols-2 gap-2">
                      {questions.map(q => (
                        <div key={q.id} className="bg-[#07070f] rounded-xl px-4 py-3 border border-white/5">
                          <div className="text-[10px] font-bold text-white/25 mb-1 truncate">{q.question}</div>
                          <div className="text-sm text-white/80">
                            {lead.answers?.[q.id] || <span className="text-white/20 italic">Geen antwoord</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
