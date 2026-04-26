import Link from 'next/link'

export const metadata = {
  title: 'Privacybeleid — Vertero',
  description: 'Hoe Vertero omgaat met jouw persoonsgegevens.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Nav */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="hover:opacity-80 transition">
          <img src="/logo.png" alt="Vertero" className="h-7" />
        </Link>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition">← Terug naar home</Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-3">Juridisch</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Privacybeleid</h1>
        <p className="text-white/40 text-sm mb-12">Laatst bijgewerkt: 26 april 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. Wie zijn wij?</h2>
            <p>
              Vertero is een dienst van Vertero B.V., gevestigd in Nederland. Wij bieden een platform waarmee bedrijven
              eenvoudig offerteaanvragen kunnen ontvangen via slimme quizzen op hun website. In dit privacybeleid leggen
              wij uit welke persoonsgegevens wij verwerken, waarom, en wat jouw rechten zijn.
            </p>
            <p className="mt-3">
              Vragen? Stuur een e-mail naar <a href="mailto:privacy@vertero.nl" className="text-[#f97316] hover:underline">privacy@vertero.nl</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Welke gegevens verwerken wij?</h2>
            <p className="mb-4">Wij verwerken twee categorieën persoonsgegevens:</p>

            <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden mb-4">
              <div className="px-5 py-3 border-b border-white/[0.07]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Gegevens van gebruikers (bedrijven die Vertero gebruiken)</p>
              </div>
              <ul className="divide-y divide-white/[0.05]">
                {['Naam en e-mailadres (via aanmeldformulier)', 'Betalingsgegevens (verwerkt door Stripe — wij slaan geen betaalgegevens op)', 'Inloggegevens (beheerd via Clerk)', 'Gebruiksdata en instellingen'].map(item => (
                  <li key={item} className="px-5 py-3 text-sm flex items-center gap-2.5">
                    <span className="text-[#f97316] text-xs flex-shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.07]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Gegevens van leads (bezoekers die een quiz invullen)</p>
              </div>
              <ul className="divide-y divide-white/[0.05]">
                {['Naam, e-mailadres en telefoonnummer', 'Adresgegevens', 'Antwoorden op quizvragen'].map(item => (
                  <li key={item} className="px-5 py-3 text-sm flex items-center gap-2.5">
                    <span className="text-[#f97316] text-xs flex-shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. Waarvoor gebruiken wij jouw gegevens?</h2>
            <p className="mb-3">Wij gebruiken persoonsgegevens uitsluitend voor de volgende doeleinden:</p>
            <ul className="space-y-2">
              {[
                'Het leveren en verbeteren van onze dienst',
                'Het verzenden van offerteaanvragen naar de betreffende ondernemer',
                'Het afhandelen van betalingen en facturatie',
                'Het versturen van e-mailnotificaties (alleen als je dit hebt ingesteld)',
                'Het naleven van wettelijke verplichtingen',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. Grondslag voor verwerking</h2>
            <p>
              Wij verwerken jouw gegevens op basis van uitvoering van een overeenkomst (gebruik van onze dienst),
              gerechtvaardigd belang (fraudepreventie, beveiliging) en in sommige gevallen op basis van toestemming.
              Leadgegevens worden verwerkt in opdracht van de ondernemer die de quiz heeft aangemaakt — zij zijn
              de verwerkingsverantwoordelijke voor die gegevens.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Bewaartermijnen</h2>
            <p>
              Accountgegevens bewaren wij zolang je een actief account hebt. Na beëindiging van je account
              verwijderen wij jouw gegevens binnen 30 dagen, tenzij wettelijke bewaarplichten van toepassing zijn.
              Leadgegevens worden bewaard totdat de gebruiker (ondernemer) ze verwijdert of het account wordt
              opgeheven.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. Delen met derden</h2>
            <p className="mb-3">Wij delen gegevens uitsluitend met:</p>
            <ul className="space-y-2">
              {[
                'Clerk — voor authenticatie en accountbeheer',
                'Stripe — voor betalingsverwerking',
                'Supabase — voor gegevensopslag (servers in de EU)',
                'Resend — voor het verzenden van e-mailnotificaties',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Alle dienstverleners zijn gevestigd in de EU of werken met EU-standaard contracten. Wij verkopen
              jouw gegevens nooit aan derden.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Jouw rechten</h2>
            <p className="mb-3">Onder de AVG heb je de volgende rechten:</p>
            <ul className="space-y-2">
              {[
                'Recht op inzage in jouw persoonsgegevens',
                'Recht op correctie van onjuiste gegevens',
                'Recht op verwijdering ("recht op vergetelheid")',
                'Recht op beperking van de verwerking',
                'Recht op dataportabiliteit',
                'Recht om bezwaar te maken',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Stuur een verzoek naar <a href="mailto:privacy@vertero.nl" className="text-[#f97316] hover:underline">privacy@vertero.nl</a>.
              Wij reageren binnen 30 dagen. Je kunt ook een klacht indienen bij de{' '}
              <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">Autoriteit Persoonsgegevens</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Beveiliging</h2>
            <p>
              Wij treffen passende technische en organisatorische maatregelen om jouw gegevens te beveiligen,
              waaronder versleuteling van gegevens in transit (HTTPS), toegangsbeperking en gebruik van beveiligde
              infrastructuur. Bij een datalek dat jouw rechten ernstig schaadt, informeren wij jou en de Autoriteit
              Persoonsgegevens conform de wettelijke vereisten.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Cookies</h2>
            <p>
              Vertero maakt gebruik van functionele cookies die noodzakelijk zijn voor de werking van de dienst
              (zoals sessiebeheer via Clerk). Wij plaatsen geen tracking- of advertentiecookies van derden.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Wijzigingen</h2>
            <p>
              Dit privacybeleid kan worden aangepast. Bij wezenlijke wijzigingen informeren wij je via e-mail of
              een melding in het dashboard. De datum bovenaan geeft aan wanneer de laatste versie van kracht is gegaan.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.07] flex flex-wrap gap-6 text-sm text-white/30">
          <Link href="/terms" className="hover:text-white transition">Algemene voorwaarden →</Link>
          <Link href="/" className="hover:text-white transition">Terug naar home →</Link>
        </div>
      </div>
    </div>
  )
}
