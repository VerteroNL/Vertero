'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BETA_HIDE_PRO } from '@/lib/flags'
import DemoQuiz from './_components/DemoQuiz'

export default function HomePage() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Free', monthly: 0, features: [
        '1 quiz',
        '5 aanvragen per maand',
        'Website + directe link',
        'Vertero-branding zichtbaar',
      ], cta: 'Gratis beginnen', href: '/probeer', highlight: false
    },
    {
      name: 'Pro', monthly: 69, annualTotal: 690, features: [
        'Onbeperkt quizzen',
        'Onbeperkt aanvragen',
        'Geen Vertero-branding',
        'Eigen kleuren en logo',
        'Mailmelding bij nieuwe lead',
        'Website + directe link',
      ], cta: '14 dagen gratis proberen', href: '/sign-up', highlight: true
    },
  ]

  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/7">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
          <Link href="/" className="hover:opacity-80 transition">
            <img src="/logo.png" alt="Vertero" className="h-8" />
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <a href="#prijzen" className="hidden md:block text-white/60 text-sm hover:text-white transition">Prijzen</a>
            <Link href="/faq" className="hidden md:block text-white/60 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/sign-in" className="hidden md:block text-white/60 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/probeer" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 md:px-5 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Meer aanvragen,<br />betere klanten,<br />
            <span className="text-[#f97316]">minder rommel</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-4 leading-relaxed">
            Zet een quiz op je website. Bezoekers vullen een paar vragen in, jij ziet direct wie het waard is om terug te bellen.
          </p>
          <p className="text-white/35 text-sm mb-10">
            Werkt ingebouwd op je website of gewoon als link via WhatsApp of mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link href="/probeer" className="bg-[#f97316] hover:bg-[#ea6c0a] px-8 py-3.5 rounded-xl font-semibold text-base transition">
              Maak je eerste quiz
            </Link>
            <Link href="/sign-in" className="text-white/40 hover:text-white text-sm transition">
              Al een account? Inloggen
            </Link>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/30 text-xs font-medium">Voorbeeld quiz</p>
            <p className="text-white/25 text-xs">Stap 1 van 3</p>
          </div>
          <div className="w-full bg-white/5 rounded-full h-0.5 mb-8">
            <div className="bg-[#f97316] h-0.5 rounded-full w-1/3"></div>
          </div>
          <h3 className="text-xl font-bold mb-6">Wat wil je laten doen?</h3>
          <div className="flex flex-col gap-3 mb-8">
            {['Badkamer verbouwen', 'Uitbouw plaatsen', 'Dakrenovatie', 'Weet ik nog niet'].map((item, i) => (
              <div key={i} className={`border p-4 rounded-xl text-sm cursor-pointer transition ${
                i === 0
                  ? 'border-[#f97316] bg-[#f97316]/10 text-white'
                  : 'border-white/10 text-white/50 hover:border-white/25'
              }`}>
                {item}
              </div>
            ))}
          </div>
          <button className="w-full bg-[#f97316] hover:bg-[#ea6c0a] py-3.5 rounded-xl font-semibold text-sm transition">
            Volgende
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 pb-16 md:pb-28 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Meer aanvragen', desc: 'Een quiz voelt laagdrempeliger dan een contactformulier. Meer bezoekers maken het af.' },
          { title: 'Betere kwalificatie', desc: 'Je stelt precies de vragen die jij nodig hebt. Geen vage berichten meer, alleen bruikbare leads.' },
          { title: 'Overal te gebruiken', desc: 'Embed de quiz op je site, of deel gewoon een link. Werkt ook goed via WhatsApp of social.' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] mb-5"></div>
            <h3 className="font-bold text-base mb-2">{item.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <div className="max-w-xl mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Binnen een kwartier live</h2>
          <p className="text-white/40 text-base leading-relaxed">Geen developer nodig. Geen ingewikkeld dashboard. Gewoon aanmelden, instellen en klaar.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '1', title: 'Stel je vragen in', desc: 'Begin met een leeg formulier of een template. Voeg vragen toe, pas de volgorde aan, klaar.' },
            { n: '2', title: 'Zet hem live', desc: 'Kopieer één regel code naar je website of gebruik de directe link. Werkt op elk platform.' },
            { n: '3', title: 'Leads binnenhalen', desc: 'Elke inzending komt direct in je dashboard met naam, telefoonnummer en alle antwoorden.' },
          ].map((item) => (
            <div key={item.n} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition">
              <div className="text-[#f97316]/40 text-sm font-bold mb-5">{item.n}</div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="text-[#f97316] text-sm font-semibold mb-4">Probeer het zelf</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Zo ziet het er uit voor jouw klant</h2>
            <p className="text-white/40 text-base leading-relaxed mb-6">
              Klik door de vragen hiernaast. Zo ervaart een bezoeker het op jouw website — snel, duidelijk, zonder gedoe.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-white/50">
              {[
                'Jij bepaalt welke vragen gesteld worden',
                'Eigen merkkleur en stijl',
                'Leads komen direct in je dashboard',
              ].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-[#f97316] mt-0.5 flex-shrink-0">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <DemoQuiz />
        </div>
      </section>

      {/* EMBED */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <div className="max-w-xl mb-10 md:mb-14">
          <p className="text-[#f97316] text-sm font-semibold mb-4">Zo zet je het op je site</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Twee manieren, beide gratis</h2>
          <p className="text-white/40 text-base leading-relaxed">Jouw slug en code verschijnen automatisch nadat je een quiz hebt aangemaakt.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <EmbedCard
            title="Widget op je site"
            badge="Aanbevolen"
            desc="Bezoekers openen de quiz via een knop op jouw site. Geen pagina-overgang."
            code={`<script src="https://vertero.nl/widget.js"></script>\n<button data-vertero="jouw-slug">\n  Vraag offerte aan\n</button>`}
          />
          <EmbedCard
            title="Directe link"
            desc="Deel via WhatsApp, mail of social. Geen code nodig."
            code="https://vertero.nl/quiz/jouw-slug"
          />
        </div>
      </section>

      {/* PRICING */}
      {!BETA_HIDE_PRO && <section id="prijzen" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-t border-white/7">
        <div className="max-w-xl mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Geen verrassingen</h2>
          <p className="text-white/40 text-base">Vaste prijs, geen contract, op elk moment op te zeggen.</p>
        </div>

        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <span className={`text-sm font-semibold ${!annual ? 'text-white' : 'text-white/40'}`}>Per maand</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-12 h-6 rounded-full relative transition-colors ${annual ? 'bg-[#f97316]' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${annual ? 'left-7' : 'left-1'}`}></div>
          </button>
          <span className={`text-sm font-semibold ${annual ? 'text-white' : 'text-white/40'}`}>
            Per jaar
            <span className="ml-2 bg-[#f97316]/20 text-[#f97316] text-xs font-bold px-2 py-0.5 rounded-full">−17%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {plans.map((plan) => (
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
              <h3 className="text-white/50 text-sm font-semibold mb-4">{plan.name}</h3>
              <div className="h-24 flex flex-col justify-start mb-2">
                {plan.monthly === 0 ? (
                  <>
                    <div className="text-4xl font-extrabold">€0</div>
                    <div className="text-white/30 text-xs mt-1">altijd gratis</div>
                  </>
                ) : annual && plan.annualTotal ? (
                  <>
                    <div className="text-4xl font-extrabold">€{plan.annualTotal}</div>
                    <div className="text-white/30 text-xs mt-1">per jaar — 2 maanden gratis</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-extrabold">€{plan.monthly}</div>
                    <div className="text-white/30 text-xs mt-1">per maand</div>
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
          ))}
        </div>
      </section>}

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24 border-t border-white/7 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Klaar om meer leads te ontvangen?</h2>
        <p className="text-white/40 text-base mb-8">Gratis beginnen, geen creditcard nodig.</p>
        <Link href="/probeer" className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] px-10 py-4 rounded-xl font-semibold text-base transition">
          Maak je eerste quiz gratis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/7 py-10" id="footer">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="hover:opacity-80 transition">
             <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <Link href="/faq" className="text-white/35 text-sm hover:text-white transition">FAQ</Link>
            <a href="#prijzen" className="text-white/35 text-sm hover:text-white transition">Prijzen</a>
            <Link href="/contact" className="text-white/35 text-sm hover:text-white transition">Contact</Link>
            <Link href="/sign-in" className="text-white/35 text-sm hover:text-white transition">Inloggen</Link>
          </div>
          <p className="text-white/20 text-sm">© 2025 Vertero</p>
        </div>
      </footer>

    </div>
  )
}

function EmbedCard({ title, badge, desc, code }: { title: string; badge?: string; desc: string; code: string }) {
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
      <button onClick={copy}
        className="text-sm font-semibold text-white/40 hover:text-white transition text-left">
        {copied ? '✓ Gekopieerd' : 'Kopieer code'}
      </button>
    </div>
  )
}
