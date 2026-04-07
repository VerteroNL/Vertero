import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="flex min-h-screen bg-[#07070f] text-white">
      <aside className="w-56 flex-shrink-0 bg-[#0d0d1c] border-r border-white/7 flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-white/7">
          <div className="font-serif text-xl">Verto</div>
        </div>
        <nav className="flex-1 p-3">
          <div className="text-white/30 text-xs font-bold uppercase tracking-widest px-2 mb-2 mt-3">Overzicht</div>
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            ◈ Dashboard
          </Link>
          <Link href="/dashboard/leads" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            ◉ Leads
          </Link>
          <div className="text-white/30 text-xs font-bold uppercase tracking-widest px-2 mb-2 mt-4">Quiz</div>
          <Link href="/dashboard/quiz" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            ⊞ Mijn quizzes
          </Link>
          <Link href="/dashboard/quiz/new" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            + Nieuwe quiz
          </Link>
          <div className="text-white/30 text-xs font-bold uppercase tracking-widest px-2 mb-2 mt-4">Account</div>
          <Link href="/dashboard/billing" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            ◇ Abonnement
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
            ⊙ Instellingen
          </Link>
        </nav>
        <div className="p-3 border-t border-white/7">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton />
            <div className="text-sm font-medium">Account</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}