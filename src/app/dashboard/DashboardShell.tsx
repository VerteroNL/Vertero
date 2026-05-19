'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, TrendingUp, Wrench, Users2 } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/klanten', label: 'Klanten', icon: Users },
  { href: '/dashboard/financieel', label: 'Financieel', icon: TrendingUp },
  { href: '/dashboard/installeren', label: 'Installeren', icon: Wrench },
  { href: '/dashboard/team', label: 'Team', icon: Users2 },
]

function NavLink({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-200 rounded-sm"
      style={{
        color: active ? '#fff' : 'rgba(255,255,255,0.32)',
        background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
        borderLeft: active ? '2px solid #2563EB' : '2px solid transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
          e.currentTarget.style.background = 'rgba(37,99,235,0.05)'
          e.currentTarget.style.borderLeft = '2px solid rgba(37,99,235,0.35)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderLeft = '2px solid transparent'
        }
      }}
    >
      <Icon size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
      {label}
    </Link>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const navLinks = (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(item => (
          <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} onClick={() => setOpen(false)} />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#1a1a1a]">
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm transition-all duration-200 rounded-sm flex items-center gap-2.5"
            style={{ color: 'rgba(255,255,255,0.18)', borderLeft: '2px solid transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
              e.currentTarget.style.borderLeft = '2px solid rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.18)'
              e.currentTarget.style.borderLeft = '2px solid transparent'
            }}
          >
            Uitloggen
          </button>
        </form>
      </div>
    </>
  )

  return (
    <div className="flex h-screen text-white" style={{ background: '#080808' }}>
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: #2a2a2a #080808; }
        *::-webkit-scrollbar { width: 4px; height: 4px; }
        *::-webkit-scrollbar-track { background: #080808; }
        *::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        *::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
      `}</style>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 flex-shrink-0 border-r border-[#1a1a1a] flex-col sticky top-0 h-screen" style={{ background: '#080808' }}>
        <div className="px-5 py-5 border-b border-[#1a1a1a]">
          <Link href="/" className="hover:opacity-70 transition-opacity duration-200 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-6" />
          </Link>
        </div>
        {navLinks}
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-[#1a1a1a] flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" className="hover:opacity-70 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vertero" className="h-6" />
        </Link>
        <button onClick={() => setOpen(true)} className="w-9 h-9 flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Menu openen">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 border-r border-[#1a1a1a] flex flex-col h-full overflow-y-auto" style={{ background: '#080808' }}>
            <div className="px-5 py-5 border-b border-[#1a1a1a] flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Vertero" className="h-6" />
              </Link>
              <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.3)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto pt-[49px] md:pt-0 flex flex-col">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
