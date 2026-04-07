'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Free', monthly: 0, features: [
        '1 quiz',
        '10 aanvragen per maand',
        'Website + link',
        'Vertero branding',
      ], cta: 'Start gratis', href: '/sign-up', highlight: false
    },
    {
      name: 'Premium', monthly: 39, features: [
        '2 quizzen',
        'Onbeperkt aanvragen',
        'Eigen branding',
        'E-mail notificaties',
        'Website + link',
      ], cta: 'Start Premium', href: '/sign-up', highlight: true
    },
    {
      name: 'Pro', monthly: 69, features: [
        '5 quizzen',
        'Onbeperkt aanvragen',
        'Eigen branding',
        'Team gebruikers',
        'Prioriteit support',
      ], cta: 'Start Pro', href: '/sign-up', highlight: false
    },
    {
      name: 'Enterprise', monthly: null, features: [
        'Onbeperkt quizzen',
        'Onbeperkt aanvragen',
        'Custom integraties',
        'Accountmanager',
        'SLA',
      ], cta: 'Neem contact op', href: '/contact', highlight: false
    },
  ]

  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/7">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
          <Link href="/" className="text-xl font-extrabold hover:opacity-80 transition">
            verte<span className="text-[#f97316]">ro</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            {/* <a href="#prijzen" className="hidden md:block text-white/60 text-sm hover:text-[#f97316] transition">Prijzen</a> */}
            <Link href="/faq" className="hidden md:block text-white/60 text-sm hover:text-[#f97316] transition">FAQ</Link>
            <Link href="/sign-in" className="hidden md:block text-white/60 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 md:px-5 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            Plug &amp; play quiz builder
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Meer aanvragen<br />via je website<br />
            <span className="text-[#f97316]">zonder gedoe</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-4 leading-relaxed">
            Laat bezoekers een paar simpele vragen invullen en ontvang direct serieuze aanvragen.
          </p>
          <p className="text-white/40 text-sm mb-10">
            Werkt op je website óf deel simpel een link via WhatsApp, mail of social media
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link href="/sign-up" className="bg-[#f97316] hover:bg-[#ea6c0a] px-8 py-3.5 rounded-xl font-semibold text-base transition">
              Gratis starten →
            </Link>
            <Link href="/sign-in" className="text-white/50 hover:text-white text-sm transition">
              Al een account? Inloggen
            </Link>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest">Voorbeeld quiz</p>
            <p className="text-white/30 text-xs">Vraag 1 van 3</p>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1 mb-8">
            <div className="bg-[#f97316] h-1 rounded-full w-1/3"></div>
          </div>
          <h3 className="text-xl font-bold mb-6">Wat wil je laten doen?</h3>
          <div className="flex flex-col gap-3 mb-8">
            {['Badkamer verbouwen', 'Uitbouw plaatsen', 'Dak renovatie', 'Ik weet het nog niet'].map((item, i) => (
              <div key={i} className={`border p-4 rounded-xl text-sm cursor-pointer transition ${
                i === 0
                  ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                  : 'border-white/10 text-white/60 hover:border-[#f97316]/50'
              }`}>
                {item}
              </div>
            ))}
          </div>
          <button className="w-full bg-[#f97316] hover:bg-[#ea6c0a] py-3.5 rounded-xl font-semibold text-sm transition">
            Volgende stap →
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 pb-16 md:pb-28 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: '📈', title: 'Meer aanvragen', desc: 'Bezoekers vullen sneller iets in dan een standaard contactformulier.' },
          { icon: '🎯', title: 'Betere klanten', desc: 'Je stelt vooraf de juiste vragen en filtert ongeschikte aanvragen eruit.' },
          { icon: '🔗', title: 'Flexibel te gebruiken', desc: 'Embed op je website of deel gewoon een directe link via WhatsApp of mail.' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest text-center mb-4">Hoe het werkt</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 md:mb-16">In 3 stappen live</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Maak je vragen', desc: 'Kies een template of begin leeg. Voeg je eigen vragen toe in een paar klikken.' },
            { n: '2', title: 'Plaats of deel', desc: 'Zet de quiz op je website met één regel code, of stuur gewoon de directe link.' },
            { n: '3', title: 'Ontvang aanvragen', desc: 'Leads komen direct binnen in je dashboard met naam, telefoon en alle antwoorden.' },
          ].map((item) => (
            <div key={item.n} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
              <div className="w-9 h-9 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316] font-bold mb-5">
                {item.n}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING — verborgen, later activeren */}
      {/*
      <section id="prijzen" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest text-center mb-4">Prijzen</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Simpel en duidelijk</h2>
        <p className="text-white/40 text-center text-sm mb-10">Geen contract. Stop wanneer je wilt.</p>

        <div className="flex items-center justify-center gap-4 mb-10 md:mb-14">
          <span className={`text-sm font-semibold ${!annual ? 'text-white' : 'text-white/40'}`}>Maandelijks</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-12 h-6 rounded-full relative transition-colors ${annual ? 'bg-[#f97316]' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${annual ? 'left-7' : 'left-1'}`}></div>
          </button>
          <span className={`text-sm font-semibold ${annual ? 'text-white' : 'text-white/40'}`}>
            Jaarlijks
            <span className="ml-2 bg-[#f97316]/20 text-[#f97316] text-xs font-bold px-2 py-0.5 rounded-full">−17%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const monthlyPrice = plan.monthly === null ? null : annual ? Math.round(plan.monthly * 0.83) : plan.monthly
            const annualTotal = plan.monthly ? Math.round(plan.monthly * 0.83 * 12) : null
            return (
              <div
                key={plan.name}
                className={`bg-[#0d0d1c] rounded-2xl p-8 flex flex-col relative ${
                  plan.highlight ? 'border border-[#f97316]' : 'border border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                    Aanbevolen
                  </div>
                )}
                <h3 className="text-white/60 text-sm font-semibold mb-4">{plan.name}</h3>
                <div className="h-24 flex flex-col justify-start mb-2">
                  {plan.monthly === null ? (
                    <div className="text-3xl font-extrabold mt-2">Op aanvraag</div>
                  ) : plan.monthly === 0 ? (
                    <>
                      <div className="text-4xl font-extrabold">€0</div>
                      <div className="text-white/30 text-xs mt-1">voor altijd gratis</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <div className="text-4xl font-extrabold">€{monthlyPrice}</div>
                        {annual && <div className="text-white/30 text-sm line-through">€{plan.monthly}</div>}
                      </div>
                      <div className="text-white/30 text-xs mt-1">per maand</div>
                      {annual && annualTotal && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#f97316] text-xs font-semibold">€{annualTotal} / jaar</span>
                          <span className="bg-[#f97316]/15 text-[#f97316] text-[10px] font-bold px-1.5 py-0.5 rounded-full">−17%</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <ul className="text-white/50 text-sm space-y-2.5 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition ${
                    plan.highlight
                      ? 'bg-[#f97316] hover:bg-[#ea6c0a] text-white'
                      : 'border border-white/20 hover:border-white/40 text-white/60 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </section>
      */}

      {/* FOOTER */}
      <footer className="border-t border-white/7 py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xl font-extrabold hover:opacity-80 transition">
            verte<span className="text-[#f97316]">ro</span>
          </Link>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <Link href="/faq" className="text-white/40 text-sm hover:text-white transition">FAQ</Link>
            {/* <a href="#prijzen" className="text-white/40 text-sm hover:text-white transition">Prijzen</a> */}
            <Link href="/sign-in" className="text-white/40 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="text-white/40 text-sm hover:text-white transition">Registreren</Link>
          </div>
          <p className="text-white/20 text-sm">© 2026 Vertero. Alle rechten voorbehouden.</p>
        </div>
      </footer>

    </div>
  )
}