'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Aan de slag',
    items: [
      {
        q: 'Wat is Vertero?',
        a: 'Vertero is een tool waarmee je een quiz maakt die je op je website zet of via een link deelt. Bezoekers beantwoorden een paar vragen, en jij ziet precies wat ze nodig hebben — inclusief contactgegevens en alle antwoorden.',
      },
      {
        q: 'Hoe begin ik?',
        a: 'Maak een account aan, stel je vragen in en zet de quiz live. Embed hem op je site met één regel code, of stuur gewoon de link door. Duurt hooguit een kwartier.',
      },
      {
        q: 'Heb ik technische kennis nodig?',
        a: 'Nee. Alles werkt via een gewone editor, zonder code. Voor het plaatsen op je website kopieer je één stukje HTML — dat is het enige.',
      },
    ],
  },
  {
    category: 'Quiz en leads',
    items: [
      {
        q: 'Wat voor vragen kan ik stellen?',
        a: 'Meerkeuze en open vragen. Bij meerkeuze kun je ook een "Anders, namelijk..."-optie aanzetten zodat mensen een eigen antwoord kunnen typen.',
      },
      {
        q: 'Wat is lead scoring?',
        a: 'Je kunt per antwoord een score instellen. Leads worden daarna automatisch gesorteerd van meest naar minst interessant. Handig als je veel aanvragen ontvangt.',
      },
      {
        q: 'Welke contactgegevens worden er gevraagd?',
        a: 'Na de quiz vult de bezoeker naam, e-mailadres en adres in. Telefoonnummer is optioneel. Je ziet alles direct in je dashboard.',
      },
      {
        q: 'Kan ik dezelfde quiz op meerdere plekken gebruiken?',
        a: 'Ja. Elke quiz heeft een eigen link en embedcode. Je kunt hem op meerdere pagina\'s embedden of de link doorsturen via e-mail, WhatsApp of social media.',
      },
    ],
  },
  {
    category: 'Prijzen en abonnement',
    items: [
      {
        q: 'Is er een gratis versie?',
        a: 'Ja. Met het gratis plan maak je 1 quiz en ontvang je tot 5 aanvragen per maand. Genoeg om te testen of het voor jou werkt.',
      },
      {
        q: 'Kan ik op elk moment opzeggen?',
        a: 'Ja. Je betaalt per maand en kunt altijd stoppen. Na opzegging blijft je account actief tot het einde van de betaalperiode.',
      },
      {
        q: 'Zijn er opstartkosten?',
        a: 'Nee. Alleen het maandelijkse bedrag, verder niets.',
      },
    ],
  },
  {
    category: 'Privacy en beveiliging',
    items: [
      {
        q: 'Waar worden mijn gegevens opgeslagen?',
        a: 'Alles staat in een beveiligde database in de EU. We delen jouw gegevens of die van je leads nooit met anderen.',
      },
      {
        q: 'Voldoet Vertero aan de AVG?',
        a: 'Ja. Jij bent als gebruiker de verwerkingsverantwoordelijke voor de gegevens die via jouw quiz binnenkomen. Vertero verwerkt ze alleen namens jou.',
      },
      {
        q: 'Kan ik mijn leads exporteren?',
        a: 'Ja, als CSV. Eén klik vanuit het leads-overzicht.',
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
        <span className="font-medium text-sm text-white">{q}</span>
        <span className={`flex-shrink-0 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center transition-transform ${open ? 'rotate-45' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-white/45 text-sm leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="bg-[#07070f] text-white min-h-screen">

      <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="hover:opacity-75 transition">
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

        <div className="mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4">
            Veelgestelde vragen
          </h1>
          <p className="text-white/40 text-base max-w-md leading-relaxed">
            Staat je vraag er niet bij? Stuur een bericht via de{' '}
            <Link href="/contact" className="text-white/60 hover:text-white underline underline-offset-2 transition">contactpagina</Link>.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {FAQS.map(section => (
            <div key={section.category}>
              <p className="text-xs font-semibold text-white/25 mb-2 uppercase tracking-widest">{section.category}</p>
              <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl px-6">
                {section.items.map(item => (
                  <Item key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-bold text-base mb-1">Klaar om te starten?</p>
            <p className="text-white/40 text-sm">Gratis account aanmaken, geen creditcard nodig.</p>
          </div>
          <Link
            href="/probeer"
            className="flex-shrink-0 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-6 py-3 rounded-lg text-sm transition whitespace-nowrap"
          >
            Probeer Vertero gratis
          </Link>
        </div>

      </div>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-70 transition">
            <img src="/logo.png" alt="Vertero" className="h-6" />
          </Link>
          <div className="flex gap-6">
            <Link href="/faq" className="text-white/25 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/contact" className="text-white/25 text-sm hover:text-white transition">Contact</Link>
            <Link href="/sign-in" className="text-white/25 text-sm hover:text-white transition">Inloggen</Link>
          </div>
          <p className="text-white/15 text-xs">© 2025 Vertero</p>
        </div>
      </footer>

    </div>
  )
}
