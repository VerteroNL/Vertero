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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-8" />
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            <a href="#hoe-het-werkt" className="hidden md:block text-white/60 text-sm hover:text-white transition">Hoe het werkt</a>
            <a href="#prijzen" className="hidden md:block text-white/60 text-sm hover:text-white transition">Prijzen</a>
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
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8">
            🔥 1.200+ aannemers gingen je voor
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5">
            Meer aanvragen<br />via je website —<br />
            <span className="text-[#f97316]">beter gekwalificeerd</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-3 leading-relaxed">
            Zet een quiz op je site. Bezoekers vullen een paar vragen in, jij ziet direct wie het waard is om terug te bellen.
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
            ✓ Direct live &nbsp;·&nbsp; ✓ Geen creditcard &nbsp;·&nbsp; ✓ Klaar in 5 minuten
          </p>
        </div>
        <DemoQuiz />
      </section>

      {/* TESTIMONIAL STRIP */}
      <section className="border-t border-b border-white/7 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {[
            {
              quote: 'Van 4 naar 12 aanvragen per week. En eindelijk weet ik van tevoren wat ze willen.',
              name: 'Marco Jansen',
              role: 'Aannemer · Rotterdam',
              since: 'Gebruikt Vertero sinds maart',
            },
            {
              quote: 'Vroeger belde ik mensen terug die toch niks deden. Nu zie ik meteen wie serieus is.',
              name: 'Stefan de Bruin',
              role: 'Schildersbedrijf · Utrecht',
              since: 'Gebruikt Vertero sinds januari',
            },
            {
              quote: 'Mijn quiz staat op mijn site én in mijn WhatsApp bio. Werkt geweldig.',
              name: 'Kim Visser',
              role: 'Hoveniersbedrijf · Eindhoven',
              since: 'Gebruikt Vertero sinds mei',
            },
          ].map(t => (
            <div key={t.name}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f97316"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-white/35 text-xs">{t.role}</p>
              <p className="text-white/20 text-xs mt-0.5">{t.since}</p>
            </div>
          ))}
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
              visual: (
                <div className="bg-[#07070f] border border-white/10 rounded-xl p-4 mt-5">
                  <div className="h-2 w-24 bg-white/10 rounded-full mb-3" />
                  <div className="h-2 w-32 bg-white/5 rounded-full mb-4" />
                  {['Verbouwing', 'Aanbouw', 'Renovatie'].map(o => (
                    <div key={o} className="border border-white/8 rounded-lg px-3 py-2 text-xs text-white/25 mb-2">{o}</div>
                  ))}
                  <div className="mt-3 h-7 w-20 bg-[#f97316]/30 rounded-lg" />
                </div>
              ),
            },
            {
              n: '2',
              title: 'Zet hem op je site',
              desc: 'Plak één regel code op je website, of deel een directe link via WhatsApp.',
              visual: (
                <div className="bg-[#07070f] border border-white/10 rounded-xl p-4 mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-red-500/40" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/40" />
                    <div className="h-2 w-2 rounded-full bg-green-500/40" />
                    <div className="h-1.5 w-32 bg-white/5 rounded-full ml-2" />
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded mb-2" />
                  <div className="h-2 w-3/4 bg-white/5 rounded mb-4" />
                  <div className="border border-[#f97316]/30 rounded-lg px-3 py-2.5 text-xs text-[#f97316] font-semibold w-fit">
                    Offerte aanvragen →
                  </div>
                </div>
              ),
            },
            {
              n: '3',
              title: 'Leads in je mail',
              desc: 'Elke aanvraag kom direct in je dashboard én per mail — ook als je onderweg bent.',
              visual: (
                <div className="bg-[#07070f] border border-white/10 rounded-xl p-4 mt-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#f97316]/15 border border-[#f97316]/25 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                    </div>
                    <div>
                      <div className="h-2 w-20 bg-white/25 rounded-full mb-1" />
                      <div className="h-1.5 w-28 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  {[['Wat voor werk?', 'Uitbouw'], ['Budget?', '€15k – €30k'], ['Wanneer?', 'Zo snel mogelijk']].map(([l, v]) => (
                    <div key={l} className="grid grid-cols-2 gap-2 mb-1.5">
                      <span className="text-[10px] text-white/25">{l}</span>
                      <span className="text-[10px] text-white/55">{v}</span>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map((item) => (
            <div key={item.n} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition">
              <div className="text-[#f97316]/40 text-sm font-bold mb-2">{item.n}</div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              {item.visual}
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
              q: 'Heb ik een website nodig?',
              a: 'Nee. Je krijgt ook een directe link die je kunt delen via WhatsApp, Instagram of mail. Handig als je nog geen site hebt.',
            },
            {
              q: 'Hoe komt de quiz op mijn website?',
              a: 'Je plakt één stukje code in je site. Duurt 2 minuten. Werkt op elke website — ook WordPress, Wix en Squarespace.',
            },
            {
              q: 'Wat kost het later?',
              a: 'Gratis starten. Als je meer wilt — onbeperkte quiz, eigen kleuren, e-mailmeldingen — betaal je €69 per maand. Geen contract.',
            },
            {
              q: 'Waarom niet gewoon een contactformulier?',
              a: 'Quizzes converteren 3× beter. Bezoekers vullen ze sneller in, en jij weet al wat ze willen voor je terugbelt.',
            },
            {
              q: 'Hoe ontvang ik de leads?',
              a: 'In je dashboard én direct per mail. Ook als je op de bouw zit of bij een klant — je ziet het meteen.',
            },
            {
              q: 'Kan ik stoppen wanneer ik wil?',
              a: 'Altijd. Geen contract, geen opzegtermijn. Maar de meeste aannemers blijven zodra de eerste aanvragen binnenkomen.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-white font-semibold text-sm mb-2 leading-snug">{q}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      {!BETA_HIDE_PRO && <section id="prijzen" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28 border-b border-white/7">
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
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24 border-b border-white/7 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Klaar om meer aanvragen te ontvangen?</h2>
        <p className="text-white/40 text-base mb-8">Direct beginnen — geen creditcard, geen account nodig.</p>
        <Link href="/probeer" className="inline-block bg-[#f97316] hover:bg-[#ea6c0a] px-10 py-4 rounded-xl font-semibold text-base transition">
          Probeer gratis →
        </Link>
        <p className="text-white/20 text-xs mt-4">✓ Direct live &nbsp;·&nbsp; ✓ Klaar in 5 minuten</p>
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
      <button onClick={copy}
        className="text-sm font-semibold text-white/40 hover:text-white transition text-left">
        {copied ? '✓ Gekopieerd' : 'Kopieer code'}
      </button>
    </div>
  )
}
