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
    .select('*, quizzes(name)')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl italic">Leads</h1>
        <p className="text-white/40 text-sm mt-1">{leads?.length || 0} inzendingen totaal</p>
      </div>

      {leads?.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center">
          <div className="text-4xl mb-4">◉</div>
          <div className="font-semibold mb-2">Nog geen leads</div>
          <div className="text-white/40 text-sm">Embed een quiz op een website om leads te ontvangen</div>
        </div>
      ) : (
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Naam</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">E-mail</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Quiz</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/30">Datum</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {leads?.map(lead => (
                <tr key={lead.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4 font-medium">{lead.name || '—'}</td>
                  <td className="px-6 py-4 text-white/50 font-mono text-sm">{lead.email || '—'}</td>
                  <td className="px-6 py-4 text-white/50 text-sm">{lead.quizzes?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6c5ce7]/10 text-[#6c5ce7]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/30 text-sm font-mono">
                    {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-white/20 hover:text-white text-sm transition"
                    >
                      Bekijk →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}