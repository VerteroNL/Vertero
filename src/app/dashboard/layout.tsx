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
      <aside className="w-60 flex-shrink-0 border-r border-white/7 flex flex-col sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-white/7">
          <Link href="/" className="hover:opacity-80 transition inline-block">
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5 mt-2">Overzicht</p>
          <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/leads" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
            Leads
          </Link>

          <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5 mt-4">Quiz</p>
          <Link href="/dashboard/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
            Mijn quizzes
          </Link>
          <Link href="/dashboard/quiz/new" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
            + Nieuwe quiz
          </Link>
        </nav>

        <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
          <Link href="/dashboard/installeren" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            Installeren
          </Link>
          <Link href="/dashboard/feedback" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            Feedback
          </Link>
        </div>

        <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
          <Link href="/dashboard/settings" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            ⚙ Instellingen
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton appearance={{ elements: { avatarBox: 'w-4 h-4' } }} />
            <span className="text-sm font-medium text-white/30">Account</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
