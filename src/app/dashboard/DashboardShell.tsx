'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const navLinks = (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5 mt-2">Overzicht</p>
        <Link onClick={() => setOpen(false)} href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Dashboard
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/leads" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Leads
        </Link>

        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5 mt-4">Quiz</p>
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Mijn quizzes
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz/new" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          + Nieuwe quiz
        </Link>
      </nav>

      <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard/installeren" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Installeren
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/feedback" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Feedback
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/billing" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Abonnement
        </Link>
      </div>

      <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard/settings" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          ⚙ Instellingen
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton appearance={{ elements: { avatarBox: 'w-4 h-4' } }} />
          <span className="text-sm font-medium text-white/30">Account</span>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#07070f] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-white/7 flex-col sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-white/7">
          <Link href="/" className="hover:opacity-80 transition inline-block">
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
        </div>
        {navLinks}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#07070f]/95 backdrop-blur border-b border-white/7 flex items-center justify-between px-4 py-3">
        <Link href="/" className="hover:opacity-80 transition">
          <img src="/logo.png" alt="Vertero" className="h-7" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition text-white/60 hover:text-white"
          aria-label="Menu openen"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-[#07070f] border-r border-white/7 flex flex-col h-full overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/7 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="hover:opacity-80 transition">
                <img src="/logo.png" alt="Vertero" className="h-7" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition text-white/40 hover:text-white"
                aria-label="Menu sluiten"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}

      {/* Main content — add top padding on mobile for fixed header */}
      <main className="flex-1 min-h-0 overflow-y-auto pt-[57px] md:pt-0 flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
