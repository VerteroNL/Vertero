'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DemoQuiz from './_components/DemoQuiz'

export default function HomePage() {
  const router = useRouter()
  const [remaining, setRemaining] = useState(50)
  const [email, setEmail] = useState('')
  const [signupState, setSignupState] = useState<'idle' | 'loading' | 'done' | 'full' | 'duplicate' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/founding')
      .then(r => r.json())
      .then(d => setRemaining(d.remaining))
      .catch(() => {})
  }, [])

  async function submitFounding(e: React.FormEvent) {
    e.preventDefault()
    setSignupState('loading')
    try {
      const res = await fetch('/api/founding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.full) { setSignupState('full'); return }
      if (res.status === 409) { setSignupState('duplicate'); return }
      if (!res.ok) { setSignupState('error'); return }
      setRemaining(data.remaining)
      router.push('/sign-up')
    } catch {
      setSignupState('error')
    }
  }

  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* LAUNCH BANNER */}
      <div className="bg-[#f97316] text-white text-center text-xs sm:text-sm font-semibold py-2.5 px-4">
        🚀 Net gelanceerd — word een van de eerste 50 founding members en krijg 3 maanden gratis het hoogste abonnement zodra we live gaan.{' '}
        <a href="#founding" className="underline underline-offset-2 hover:opacity-80 transition">Meer info →</a>
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
          <Link href="/" className="hover:opacity-80 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-8" />
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <a href="#hoe-het-werkt" className="hidden md:block text-white/60 text-sm hover:text-white transition">Hoe het werkt</a>
            <Link href="/sign-in" className="hidden md:block text-white/60 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/probeer" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 md:px-5 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5">
            Stop met tijd verspillen aan aanvragen<br />
            <span className="text-[#f97316]">die nergens op slaan</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-3 leading-relaxed">
            Zet een quiz op je site. Bezoekers vullen een paar vragen in — jij weet binnen 10 seconden of het een serieuze aanvraag is. Geen bellen met mensen die toch niet kopen.
          </p>
          <p className="text-white/35 text-sm mb-8">
            Direct beginnen — geen account nodig
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-5">
            <Link href="/probeer" className="w-full sm:w-auto text-center bg-[#f97316] hover:bg-[#ea6c0a] px-8 py-3.5 rounded-xl font-semibold text-base transition">
              Probeer gratis →
            </Link>
            <a href="#hoe-het-werkt" className="text-white/40 hover:text-white text-sm transition text-center">
              Hoe werkt het? ↓
            </a>
          </div>
          <p className="text-white/25 text-xs">
            ✓ Direct live &nbsp;·&nbsp; ✓ Geen creditcard &nbsp;·&nbsp; ✓ Klaar in 15 minuten
          </p>
        </div>
        <DemoQuiz />
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-t border-white/7 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-sm font-medium">Gebouwd samen met aannemers in Nederland</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
            {['Timmerwerk', 'Dakdekkers', 'Loodgieters', 'Stukadoors', 'Schilders'].map(type => (
              <span key={type} className="text-white/20 text-sm">{type}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDING MEMBER */}
      <section id="founding" className="border-t border-b border-white/7 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <div className="max-w-2xl mx-auto bg-[#f97316]/[0.07] border border-[#f97316]/25 rounded-2xl p-8 md:p-12 text-center">
            <span className="inline-flex items-center gap-2 bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              🚀 Net gelanceerd · Nog {remaining} plekken beschikbaar
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Word een founding member</h2>
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Vertero is nieuw. We zoeken aannemers die als eerste meebouwen — en die ons vertellen wat écht werkt.
              In ruil krijg je <strong className="text-white/80">3 maanden</strong> ons hoogste abonnement gratis zodra we officieel lanceren, inclusief persoonlijke hulp bij het instellen.
            </p>
            <ul className="flex flex-row gap-6 justify-center mb-8">
              {['3 maanden gratis bij lancering', 'Persoonlijke onboarding', 'Wij installeren de quiz gratis op jouw website'].map(f => (
                <li key={f} className="flex items-center justify-center gap-2 text-sm text-white/70">
                  <span className="text-[#f97316]">✓</span> {f}
                </li>
              ))}
            </ul>

            {signupState === 'done' ? null : signupState === 'full' || remaining === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <p className="text-white/50 text-sm">Alle plekken zijn vergeven. Stuur ons een mail als je toch wil meedoen.</p>
              </div>
            ) : (
              <form onSubmit={submitFounding} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  required
                  className="flex-1 bg-[#07070f] border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-[#f97316]/50 transition text-sm"
                />
                <button
                  type="submit"
                  disabled={signupState === 'loading'}
                  className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap"
                >
                  {signupState === 'loading' ? 'Bezig…' : 'Aanmelden →'}
                </button>
              </form>
            )}
            {signupState === 'duplicate' && (
              <p className="text-white/40 text-xs mt-3">Dit e-mailadres is al aangemeld — <Link href="/sign-up" className="underline">maak een account aan →</Link></p>
            )}
            {signupState === 'error' && (
              <p className="text-red-400 text-xs mt-3">Er ging iets mis. Probeer het opnieuw.</p>
            )}
            <p className="text-white/25 text-xs mt-4">Je e-mailadres reserveert je plek · Daarna maak je een account aan</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="hoe-het-werkt" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-b border-white/7">
        <div className="max-w-xl mb-12 md:mb-16">
          <p className="text-[#f97316] text-sm font-semibold mb-3">Hoe het werkt</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Binnen een kwartier live</h2>
          <p className="text-white/40 text-base leading-relaxed">Geen developer nodig. Gewoon instellen en klaar.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              n: '1',
              title: 'Bouw je quiz',
              desc: 'Kies een template voor aannemers of begin leeg. Vragen aanpassen duurt 2 minuten.',
            },
            {
              n: '2',
              title: 'Zet hem op je site',
              desc: 'Plak één regel code op je website, of deel een directe link via WhatsApp.',
            },
            {
              n: '3',
              title: 'Weet direct of het serieus is',
              desc: 'Elke aanvraag staat in je dashboard met alle antwoorden. Binnen 10 seconden zie je budget, planning en wat ze nodig hebben — voor je ook maar de telefoon pakt.',
            },
          ].map((item) => (
            <div key={item.n} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
              <div className="text-[#f97316]/40 text-sm font-bold mb-5">{item.n}</div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMBED */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-b border-white/7">
        <div className="max-w-xl mb-10 md:mb-14">
          <p className="text-[#f97316] text-sm font-semibold mb-4">Zo zet je het op je site</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Twee manieren, beide gratis</h2>
          <p className="text-white/40 text-base leading-relaxed">Werkt op elke website — ook WordPress, Squarespace en Wix.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <EmbedCard
            title="Widget op je site"
            badge="Aanbevolen"
            desc="Werkt op elke knop op je site — bestaande buttons, links of afbeeldingen. Geen pagina-overgang."
            code={`<script src="https://vertero.nl/widget.js"></script>\n<button data-vertero="jouw-slug">\n  Vraag offerte aan\n</button>`}
            note="Voeg data-vertero toe aan élke bestaande knop op je site."
          />
          <EmbedCard
            title="Directe link"
            desc="Deel via WhatsApp, mail of social. Geen code nodig."
            code="https://vertero.nl/quiz/jouw-slug"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-b border-white/7">
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Veelgestelde vragen</h2>
          <p className="text-white/40 text-base">Vragen die aannemers altijd stellen voor ze beginnen.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
          {[
            {
              q: 'Werkt dit ook zonder website?',
              a: 'Ja. Je krijgt een directe link die je kunt delen via WhatsApp, Instagram of mail — zonder dat je een website nodig hebt.',
            },
            {
              q: 'Hoe lang duurt instellen?',
              a: 'Maximaal 15 minuten. Je kiest een template, past de vragen aan en zet hem live. Als founding member installeren wij hem gratis voor je.',
            },
            {
              q: 'Hoe komt de quiz op mijn website?',
              a: 'Je plakt één stukje code in je site. Duurt 2 minuten. Werkt op elke website — ook WordPress, Wix en Squarespace.',
            },
            {
              q: 'Is het gratis?',
              a: 'Ja, gratis starten. Geen creditcard nodig.',
            },
            {
              q: 'Waarom niet gewoon een contactformulier?',
              a: 'Een contactformulier vertelt je niets. Met een quiz weet je al wat het project inhoudt, wat het budget is en wanneer ze willen starten — voor je terugbelt.',
            },
            {
              q: 'Hoe ontvang ik de leads?',
              a: 'In je dashboard én direct per mail. Ook als je op de bouw zit of bij een klant — je ziet het meteen.',
            },
            {
              q: 'Kan ik stoppen wanneer ik wil?',
              a: 'Altijd. Geen contract, geen opzegtermijn.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-2 leading-snug">{q}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24 border-b border-white/7 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Jouw eerste quiz staat er binnen 15 minuten.<br className="hidden sm:block" /> Gratis.</h2>
        <p className="text-white/40 text-base mb-8">Geen creditcard, geen developer, geen gedoe.</p>
        <Link href="/probeer" className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] px-10 py-4 rounded-xl font-semibold text-base transition">
          Probeer gratis →
        </Link>
        <p className="text-white/20 text-xs mt-4">✓ Direct live &nbsp;·&nbsp; ✓ Klaar in 15 minuten &nbsp;·&nbsp; ✓ Geen creditcard</p>
      </section>

      {/* FOOTER */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="hover:opacity-80 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <a href="#hoe-het-werkt" className="text-white/35 text-sm hover:text-white transition">Hoe het werkt</a>
            <Link href="/faq" className="text-white/35 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/contact" className="text-white/35 text-sm hover:text-white transition">Contact</Link>
            <Link href="/sign-in" className="text-white/35 text-sm hover:text-white transition">Inloggen</Link>
          </div>
          <p className="text-white/20 text-sm">© 2025 Vertero</p>
        </div>
      </footer>

    </div>
  )
}

function EmbedCard({ title, badge, desc, code, note }: { title: string; badge?: string; desc: string; code: string; note?: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-base">{title}</h3>
        {badge && <span className="bg-[#f97316]/20 text-[#f97316] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      <div className="bg-[#07070f] border border-white/7 rounded-xl p-4 font-mono text-xs text-white/50 leading-relaxed whitespace-pre-wrap break-all">{code}</div>
      {note && <p className="text-white/25 text-xs">{note}</p>}
      <button onClick={copy} className="text-sm font-semibold text-white/40 hover:text-white transition text-left">
        {copied ? '✓ Gekopieerd' : 'Kopieer code'}
      </button>
    </div>
  )
}

