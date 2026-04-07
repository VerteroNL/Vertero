import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const { data: lead } = await supabase
    .from('leads')
    .select('*, quizzes(name, config)')
    .eq('id', id)
    .eq('user_id', userId!)
    .maybeSingle()

  if (!lead) return (
    <div className="p-8 text-white/40">Lead niet gevonden.</div>
  )

  const questions = lead.quizzes?.config?.questions || []

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/dashboard/leads" className="text-white/30 hover:text-white text-sm transition mb-8 inline-block">
        ← Terug naar leads
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl italic">{lead.name || 'Onbekend'}</h1>
        <p className="text-white/40 text-sm mt-1">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</p>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-sm">
          <span className="text-white/30 mr-2">Quiz</span>
          <span className="text-white">{lead.quizzes?.name || '—'}</span>
        </div>
        <div className="bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-sm">
          <span className="text-white/30 mr-2">Datum</span>
          <span className="text-white">{new Date(lead.created_at).toLocaleDateString('nl-NL')}</span>
        </div>
        <div className="bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-sm">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6c5ce7]/10 text-[#6c5ce7]">
            {lead.status}
          </span>
        </div>
      </div>

      <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Antwoorden</h2>

      <div className="flex flex-col gap-3">
        {questions.length > 0 ? questions.map((q: { id: string, question: string }) => (
          <div key={q.id} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-sm mb-2">{q.question}</p>
            <p className="text-white font-medium">
              {lead.answers?.[q.id] || <span className="text-white/20 font-normal italic">Geen antwoord</span>}
            </p>
          </div>
        )) : (
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 text-white/30 text-sm">
            Geen vragenstructuur gevonden.
          </div>
        )}
      </div>
    </div>
  )
}