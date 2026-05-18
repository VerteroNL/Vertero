import Link from 'next/link'
import { MousePointerClick, ScanSearch, BellRing, Wrench, Zap, Gift, X, Home, Droplets, UtensilsCrossed } from 'lucide-react'

const NAV = (
  <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
    <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <Link href="/" className="hover:opacity-75 transition">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vertero" className="h-7" />
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="hidden sm:block text-white/40 text-sm hover:text-white transition">Inloggen</Link>
        <Link href="/contact" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 py-2 rounded-lg font-semibold text-sm transition">
          Neem contact op
        </Link>
      </div>
    </div>
  </nav>
)

const FOOTER = (
  <footer className="border-t border-white/[0.06] py-8">
    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Link href="/" className="hover:opacity-70 transition">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vertero" className="h-6" />
      </Link>
      <div className="flex gap-6">
        <Link href="/demo" className="text-white/25 text-sm hover:text-white transition">Demo</Link>
        <Link href="/contact" className="text-white/25 text-sm hover:text-white transition">Contact</Link>
        <Link href="/dashboard" className="text-white/25 text-sm hover:text-white transition">Inloggen</Link>
      </div>
      <p className="text-white/15 text-xs">© 2025 Vertero</p>
    </div>
  </footer>
)

function PhoneMockup() {
  return (
    <div className="relative flex justify-center md:justify-end items-center select-none">
      {/* Glow behind phone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-72 bg-[#25d366]/10 blur-3xl rounded-full" />
      </div>

      {/* Phone shell */}
      <div
        className="relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{
          width: 270,
          borderRadius: 50,
          background: 'linear-gradient(160deg,#2a2a3a 0%,#111118 60%,#0a0a10 100%)',
          padding: '3px',
        }}
      >
        {/* Side button right */}
        <div className="absolute right-[-3px] top-28 w-[3px] h-10 bg-white/10 rounded-l" />
        {/* Volume buttons left */}
        <div className="absolute left-[-3px] top-24 w-[3px] h-7 bg-white/10 rounded-r" />
        <div className="absolute left-[-3px] top-36 w-[3px] h-7 bg-white/10 rounded-r" />

        {/* Inner bezel */}
        <div
          className="overflow-hidden"
          style={{ borderRadius: 48, background: '#000' }}
        >
          {/* Screen — iOS lockscreen-style wallpaper */}
          <div
            style={{
              minHeight: 540,
              background: 'linear-gradient(175deg, #0f3460 0%, #16213e 40%, #1a1a2e 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-4 pb-1">
              <span className="text-white text-[13px] font-semibold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
              {/* Dynamic island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-[26px] bg-black rounded-full z-10" />
              {/* Status icons */}
              <div className="flex items-center gap-[5px]">
                {/* Signal bars */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <rect x="0" y="7" width="3" height="5" rx="0.5" fill="white" fillOpacity="1"/>
                  <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="white" fillOpacity="1"/>
                  <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white" fillOpacity="1"/>
                  <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="white" fillOpacity="0.35"/>
                </svg>
                {/* WiFi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 8.5a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z" fill="white"/>
                  <path d="M3.5 5.5a5.6 5.6 0 0 1 8 0" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                  <path d="M0.5 2.5a9.5 9.5 0 0 1 14 0" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45"/>
                </svg>
                {/* Battery */}
                <div className="flex items-center gap-[2px]">
                  <div className="relative w-[22px] h-[11px] border border-white/70 rounded-[3px]">
                    <div className="absolute inset-[1.5px] right-[3px] bg-white rounded-[1.5px]" />
                  </div>
                  <div className="w-[2px] h-[5px] bg-white/50 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Lock screen time block */}
            <div className="text-center mt-2 mb-4">
              <p className="text-white text-[52px] font-thin tracking-tight leading-none">9:41</p>
              <p className="text-white/60 text-[13px] mt-1">Maandag 18 mei</p>
            </div>

            {/* WhatsApp push notification banner */}
            <div className="mx-3 mb-3">
              <div
                className="rounded-[18px] overflow-hidden"
                style={{
                  background: 'rgba(28,28,30,0.82)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                {/* Notification header */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                  {/* WhatsApp icon */}
                  <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: '#25d366' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="text-white/50 text-[11px] font-medium flex-1">WHATSAPP</span>
                  <span className="text-white/35 text-[11px]">nu</span>
                </div>

                {/* Message content */}
                <div className="px-4 pb-4">
                  <p className="text-white text-[13px] font-semibold leading-snug mb-0.5">Vertero: Nieuwe aanvraag ✅</p>
                  <p className="text-white/55 text-[12px] leading-snug">Jan de Vries · 6 kozijnen, aluminium</p>
                  <p className="text-white/55 text-[12px] leading-snug">Budget: €2.000 tot €8.000 · Start: 2 mnd</p>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 rounded-[10px] py-1.5 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <span className="text-white/60 text-[11px] font-medium">Beantwoord</span>
                    </div>
                    <div className="flex-1 rounded-[10px] py-1.5 text-center" style={{ background: 'rgba(37,211,102,0.18)' }}>
                      <span className="text-[#25d366] text-[11px] font-semibold">Bel terug</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second (older) notification — dimmer */}
            <div className="mx-3">
              <div
                className="rounded-[18px] px-4 py-3"
                style={{
                  background: 'rgba(28,28,30,0.55)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-[5px] flex items-center justify-center flex-shrink-0" style={{ background: '#25d366' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="text-white/30 text-[10px]">WhatsApp · gisteren 14:07</span>
                </div>
                <p className="text-white/40 text-[11px] leading-snug">Vertero: Petra Smit · badkamer renovatie · Budget: €5 tot 15k</p>
              </div>
            </div>

            {/* Spacer + home indicator */}
            <div className="flex-1" />
            <div className="flex justify-center pb-3 pt-4">
              <div className="w-28 h-[5px] bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="bg-[#07070f] text-white min-h-screen">
      {NAV}

      {/* HERO — dark */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.06] tracking-tight mb-6">
            Jij belt alleen nog klanten<br className="hidden sm:block" />
            <span className="text-[#f97316]"> die écht willen kopen</span>
          </h1>
          <p className="text-white/55 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Wij zetten een slim systeem op jouw website. Serieuze aanvragen komen direct op je telefoon. De rest wordt automatisch afgehandeld.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/demo" className="text-center bg-[#f97316] hover:bg-[#ea6c0a] px-8 py-3.5 rounded-xl font-semibold text-base transition">
              Bekijk de demo
            </Link>
            <Link href="/contact" className="text-center border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm text-white/70 hover:text-white transition">
              Neem contact op
            </Link>
          </div>
        </div>
        <PhoneMockup />
      </section>

      {/* CIJFERS — licht */}
      <section className="bg-[#0d0d1c] border-t border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { getal: '48 uur', label: 'Live op jouw website' },
              { getal: '5 vragen', label: 'Dat is alles wat jouw klant invult' },
              { getal: '€0', label: 'Kosten eerste maand' },
            ].map(c => (
              <div key={c.getal}>
                <p className="text-4xl md:text-5xl font-extrabold text-[#f97316] mb-2">{c.getal}</p>
                <p className="text-white/45 text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — dark */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-4">Hoe het werkt</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14 max-w-xl">Drie stappen. Geen technisch gedoe.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                Icon: MousePointerClick,
                title: 'Wij plaatsen een korte quiz op jouw website',
                body: 'Bezoekers vullen 5 vragen in over hun situatie, budget en timing. Geen lange formulieren, geen drempel.',
              },
              {
                n: '02',
                Icon: ScanSearch,
                title: 'Elke aanvraag wordt direct beoordeeld',
                body: 'Serieus of niet: het systeem weet het binnen 60 seconden. Matige leads worden automatisch afgewikkeld.',
              },
              {
                n: '03',
                Icon: BellRing,
                title: 'Jij krijgt alleen de goede aanvragen op je telefoon',
                body: 'Met naam, situatie, budget en timing. Alles wat je nodig hebt om meteen een goed gesprek te voeren.',
              },
            ].map(s => (
              <div key={s.n} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[#f97316]/40 text-sm font-bold">{s.n}</span>
                  <s.Icon size={18} className="text-[#f97316]/60" />
                </div>
                <h3 className="font-bold text-base mb-3 leading-snug">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS / MOCKUPS — licht */}
      <section className="bg-[#0d0d1c] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-4">Zo ziet het eruit</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14 max-w-xl">Van quizvraag tot melding op je telefoon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Mockup 1 — browser + quiz stap */}
            <div className="flex flex-col">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">Stap 1: De quiz</p>
              <div className="bg-[#07070f] border border-white/10 rounded-2xl overflow-hidden flex-1">
                {/* Browser chrome */}
                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/25 ml-2">
                    jouwbedrijf.nl
                  </div>
                </div>
                {/* Quiz UI */}
                <div className="px-6 py-6">
                  <div className="w-full bg-white/5 rounded-full h-0.5 mb-5">
                    <div className="bg-[#f97316] h-0.5 rounded-full w-1/5" />
                  </div>
                  <p className="text-white/30 text-[10px] mb-2">Vraag 1 van 5</p>
                  <p className="text-white text-sm font-bold mb-4 leading-snug">Wat wil je vervangen?</p>
                  <div className="flex flex-col gap-2">
                    {['Enkele kozijnen', 'Alle kozijnen in huis', 'Kozijnen + deuren'].map((opt, i) => (
                      <div key={opt} className={`px-4 py-2.5 rounded-xl border text-xs ${i === 0 ? 'border-[#f97316] bg-[#f97316]/10 text-white font-medium' : 'border-white/10 text-white/40'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="bg-[#f97316] text-white text-xs font-bold px-5 py-2 rounded-lg opacity-80">
                      Volgende →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 2 — laadscherm */}
            <div className="flex flex-col">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">Stap 2: Beoordeling</p>
              <div className="bg-[#07070f] border border-white/10 rounded-2xl overflow-hidden flex-1">
                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/25 ml-2">
                    jouwbedrijf.nl
                  </div>
                </div>
                <div className="px-6 py-12 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#f97316] animate-spin" />
                  <p className="text-white/50 text-sm text-center">Aanvraag wordt beoordeeld…</p>
                  <p className="text-white/20 text-xs text-center">Even geduld</p>
                </div>
              </div>
            </div>

            {/* Mockup 3 — resultaat */}
            <div className="flex flex-col">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">Stap 3: Jouw melding</p>
              <div className="bg-[#07070f] border border-white/10 rounded-2xl overflow-hidden flex-1">
                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-[10px] text-white/25 ml-2">
                    dashboard.vertero.nl
                  </div>
                </div>
                <div className="px-5 py-5">
                  <div className="border border-green-500/40 bg-green-500/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Serieuze aanvraag</span>
                    </div>
                    <p className="text-white text-xs font-medium mb-3 leading-relaxed">Klant wil 6 aluminium kozijnen laten vervangen, serieus budget en korte doorlooptijd.</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { l: 'Budget', v: '€2.000 tot €8.000' },
                        { l: 'Timing', v: 'Binnen 2 maanden' },
                      ].map(f => (
                        <div key={f.l} className="bg-black/20 rounded-lg px-3 py-2">
                          <p className="text-white/25 text-[9px] uppercase tracking-widest mb-0.5">{f.l}</p>
                          <p className="text-white/70 text-[10px] font-semibold">{f.v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/35 text-[10px] leading-relaxed border-t border-white/[0.06] pt-3">Bel vandaag terug, klant vergelijkt actief.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VOOR WIE — dark */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-4">Voor wie</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14 max-w-xl">Speciaal voor installatie- en renovatiebedrijven</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Home,
                branche: 'Kozijnenbedrijven',
                pijn: 'Nooit meer bellen met iemand die alleen een prijsje wil vergelijken',
                checks: ['Alleen aanvragen met concreet budget', 'Klant heeft materiaal al gekozen'],
              },
              {
                Icon: Droplets,
                branche: 'Badkamerspecialisten',
                pijn: 'Jij spreekt alleen klanten met een concreet plan en een realistisch budget',
                checks: ['Geen huurwoningen zonder toestemming', 'Budget en planning al bekend'],
              },
              {
                Icon: UtensilsCrossed,
                branche: 'Keukenspecialisten',
                pijn: 'De serieuze aanvragen komen als eerste bij jou binnen, niet bij de concurrent',
                checks: ['Klant is klaar om te beslissen', 'Meting of planning al gedaan'],
              },
            ].map(b => (
              <div key={b.branche} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-8">
                <b.Icon size={22} className="text-[#f97316]/60 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-3">{b.branche}</p>
                <p className="text-white/80 text-base font-medium leading-snug mb-5">{b.pijn}</p>
                <ul className="flex flex-col gap-2">
                  {b.checks.map(c => (
                    <li key={c} className="flex items-start gap-2 text-white/40 text-xs">
                      <span className="text-[#f97316] flex-shrink-0 mt-0.5">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAAROM VERTERO — licht */}
      <section className="bg-[#0d0d1c] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-4">Waarom Vertero</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-14 max-w-xl">Wij regelen alles. Jij hoeft niks te doen.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              { Icon: Wrench, label: 'Geen doe-het-zelf tool, wij regelen alles' },
              { Icon: Zap, label: 'Live binnen 48 uur' },
              { Icon: Gift, label: 'Eerste maand gratis, daarna €249/maand' },
              { Icon: X, label: 'Geen contract, altijd opzegbaar' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 bg-[#07070f] border border-white/[0.08] rounded-xl px-5 py-4">
                <item.Icon size={16} className="text-[#f97316] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPRICHTER QUOTE — dark */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="text-[#f97316]/30 text-7xl font-serif leading-none block mb-4">"</span>
            <p className="text-white/70 text-xl md:text-2xl font-medium leading-relaxed mb-8">
              Ik zag dat kozijnen en badkamerbedrijven uren per week kwijt waren aan aanvragen die nergens op sloegen. Vertero lost dat op, zonder dat de ondernemer er iets voor hoeft te doen.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-white/20 text-xs">foto</span>
              </div>
              <div>
                <p className="font-bold text-base">[NAAM INVULLEN]</p>
                <p className="text-white/35 text-sm">Oprichter, Vertero</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — licht */}
      <section className="bg-[#0d0d1c] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Klaar om betere aanvragen te ontvangen?</h2>
          <p className="text-white/40 text-base mb-8">Eerste maand gratis. Live binnen 48 uur.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/demo" className="text-center border border-white/15 hover:border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm text-white/70 hover:text-white transition">
              Bekijk de demo eerst
            </Link>
            <Link href="/contact" className="text-center bg-[#f97316] hover:bg-[#ea6c0a] px-8 py-3.5 rounded-xl font-semibold text-base transition">
              Neem contact op →
            </Link>
          </div>
        </div>
      </section>

      {FOOTER}
    </div>
  )
}
