'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Aan de slag',
    items: [
      {
        q: 'Wat is Vertero?',
        a: 'Vertero is een tool waarmee je een quiz maakt die je op je website plaatst of via een link deelt. Bezoekers vullen de quiz in, jij ontvangt een compleet lead met alle informatie die je nodig hebt om direct een offerte te sturen.',
      },
      {
        q: 'Hoe begin ik?',
        a: 'Maak een gratis account aan, stel je eerste quiz in en kopieer de embedcode naar je website. In minder dan 10 minuten ontvang je je eerste leads.',
      },
      {
        q: 'Heb ik technische kennis nodig?',
        a: 'Nee. De quizbuilder werkt volledig zonder code. Voor het embedden op je website plak je één regel HTML — dat is alles.',
      },
    ],
  },
  {
    category: 'Quiz & leads',
    items: [
      {
        q: 'Wat voor vragen kan ik stellen?',
        a: 'Je kunt meerkeuze-vragen en open tekstvragen toevoegen. Bij meerkeuze kun je ook een "Anders, namelijk..."-optie inschakelen zodat bezoekers een eigen antwoord kunnen invullen.',
      },
      {
        q: 'Wat is lead scoring?',
        a: 'Met lead scoring krijgt elk antwoord automatisch een score. De beste antwoorden staan bovenaan, de minste onderaan. Zo zie je in één oogopslag welke lead de meeste kans heeft op een opdracht.',
      },
      {
        q: 'Welke contactgegevens worden verzameld?',
        a: 'Na de quiz wordt de bezoeker gevraagd om naam, e-mailadres, adres en optioneel telefoonnummer in te vullen. Deze gegevens zijn direct zichtbaar in je dashboard.',
      },
      {
        q: 'Kan ik mijn quiz op meerdere plekken gebruiken?',
        a: 'Ja. Elke quiz heeft een directe link én een embedcode. Je kunt dezelfde quiz op meerdere pagina\'s embedden of de link delen via e-mail, social media of WhatsApp.',
      },
    ],
  },
  {
    category: 'Prijzen & abonnement',
    items: [
      {
        q: 'Is Vertero gratis?',
        a: 'Ja, er is een gratis plan waarmee je 1 quiz kunt aanmaken en tot 10 aanvragen per maand kunt ontvangen. Voor meer quizzen of onbeperkte aanvragen kun je upgraden naar een betaald plan.',
      },
      {
        q: 'Kan ik op elk moment opzeggen?',
        a: 'Ja. Je betaalt per maand en kunt op elk moment opzeggen. Na opzegging blijf je actief tot het einde van de betaalperiode.',
      },
      {
        q: 'Zijn er opstartkosten?',
        a: 'Nee. Je betaalt alleen het maandelijkse bedrag, geen eenmalige kosten.',
      },
    ],
  },
  {
    category: 'Privacy & data',
    items: [
      {
        q: 'Waar worden mijn gegevens opgeslagen?',
        a: 'Alle data wordt opgeslagen in een beveiligde database binnen de EU. Wij delen jouw gegevens of die van je leads nooit met derden.',
      },
      {
        q: 'Voldoet Vertero aan de AVG?',
        a: 'Ja. Als verwerkingsverantwoordelijke ben jij verantwoordelijk voor de verwerking van persoonsgegevens via jouw quiz. Vertero treedt op als verwerker en verwerkt gegevens uitsluitend in jouw opdracht.',
      },
      {
        q: 'Kan ik mijn data exporteren?',
        a: 'Ja. In de leads-pagina kun je met één klik al je leads exporteren als CSV-bestand.',
      },
    ],
  },
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-sm text-white">{q}</span>
        <span className={`flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-transform ${open ? 'rotate-45' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-white/50 text-sm leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-75 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden sm:block text-white/40 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/probeer" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 pb-24">

        {/* HEADER */}
        <div className="mb-14">
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-3">Veelgestelde vragen</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4">
            Hoe werkt Vertero?
          </h1>
          <p className="text-white/40 text-base max-w-md leading-relaxed">
            Staat je vraag er niet bij? Stuur ons een bericht via de <Link href="/contact" className="text-white/60 hover:text-white underline underline-offset-2 transition">contactpagina</Link>.
          </p>
        </div>

        {/* FAQ SECTIONS */}
        <div className="flex flex-col gap-10">
          {FAQS.map(section => (
            <div key={section.category}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">{section.category}</p>
              <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl px-6">
                {section.items.map(item => (
                  <Item key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-bold text-base mb-1">Klaar om te starten?</p>
            <p className="text-white/40 text-sm">Maak gratis een account aan en ontvang je eerste leads vandaag.</p>
          </div>
          <Link
            href="/probeer"
            className="flex-shrink-0 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-6 py-3 rounded-lg text-sm transition whitespace-nowrap"
          >
            Gratis beginnen →
          </Link>
        </div>

      </div>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-70 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-6" />
          </Link>
          <div className="flex gap-6">
            <Link href="/faq" className="text-white/25 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/sign-in" className="text-white/25 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="text-white/25 text-sm hover:text-white transition">Registreren</Link>
          </div>
          <p className="text-white/15 text-xs">© 2026 Vertero</p>
        </div>
      </footer>

    </div>
  )
}
