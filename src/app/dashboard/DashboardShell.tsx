'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const navLinks = (
    <>
      <div className="px-3 pt-4 pb-2">
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz/new"
          className="flex items-center justify-center gap-2 w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold text-sm py-2.5 rounded-xl transition">
          + Nieuwe quiz
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Dashboard
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/leads" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Leads
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition">
          Mijn quizzes
        </Link>
      </nav>

      <div className="px-3 py-3 border-t border-white/7 flex flex-col gap-0.5">
        <Link onClick={() => setOpen(false)} href="/dashboard/installeren" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Installeren
        </Link>
        <Link onClick={() => setOpen(false)} href="/dashboard/settings" className="px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
          Instellingen
        </Link>
        <form action="/api/logout" method="POST">
          <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:text-white hover:bg-white/5 transition">
            Uitloggen
          </button>
        </form>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#07070f] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-white/7 flex-col sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-white/7">
          <Link href="/" className="hover:opacity-80 transition inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
        </div>
        {navLinks}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#07070f]/95 backdrop-blur border-b border-white/7 flex items-center justify-between px-4 py-3">
        <Link href="/" className="hover:opacity-80 transition">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#07070f] border-r border-white/7 flex flex-col h-full overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/7 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="hover:opacity-80 transition">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

      <main className="flex-1 min-h-0 overflow-y-auto pt-[57px] md:pt-0 flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
