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
    <div className="p-8 max-w-5xl">
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
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/7">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">Naam</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">E-mail</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">Quiz</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">Status</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/25">Datum</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads?.map(lead => (
                <tr key={lead.id} className="hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4 font-medium text-sm">{lead.name || '—'}</td>
                  <td className="px-6 py-4 text-white/40 font-mono text-xs">{lead.email || '—'}</td>
                  <td className="px-6 py-4 text-white/40 text-sm">{lead.quizzes?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f97316]/10 text-[#f97316]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/30 text-xs font-mono">
                    {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-white/25 hover:text-white text-sm transition font-medium"
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
