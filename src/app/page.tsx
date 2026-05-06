'use client'

import Link from 'next/link'
import { useState } from 'react'
import DemoQuiz from './_components/DemoQuiz'

export default function HomePage() {
  return (
    <div className="bg-[#07070f] text-white min-h-screen">

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
      <section className="bg-white/[0.015]">
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
      <section id="hoe-het-werkt" className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28">
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
              title: 'Leads in je mail',
              desc: 'Elke aanvraag komt direct in je dashboard én per mail — ook als je onderweg bent.',
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
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28">
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
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-28">
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
              q: 'Is het gratis?',
              a: 'Ja, gratis starten. Geen creditcard nodig.',
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
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24 text-center">
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

