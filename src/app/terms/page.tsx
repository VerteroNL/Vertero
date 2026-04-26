import Link from 'next/link'

export const metadata = {
  title: 'Algemene voorwaarden — Vertero',
  description: 'De algemene voorwaarden van Vertero.',
}

export default function TermsPage() {
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Algemene voorwaarden</h1>
        <p className="text-white/40 text-sm mb-12">Laatst bijgewerkt: 26 april 2025</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. Definities</h2>
            <ul className="space-y-2">
              {[
                ['Vertero', 'de dienst aangeboden door Vertero B.V., gevestigd in Nederland'],
                ['Gebruiker', 'een bedrijf of zelfstandige die een account aanmaakt op Vertero'],
                ['Lead', 'een bezoeker die een quiz invult en contactgegevens achterlaat'],
                ['Quiz', 'een door de gebruiker aangemaakte reeks vragen bedoeld voor het ontvangen van offerteaanvragen'],
              ].map(([term, def]) => (
                <li key={term} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] font-bold flex-shrink-0 min-w-[80px]">{term}:</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Toepasselijkheid</h2>
            <p>
              Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Vertero en gebruikers,
              alsmede op het gebruik van het platform en alle daarmee samenhangende diensten. Door een account aan
              te maken of gebruik te maken van Vertero, accepteer je deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. De dienst</h2>
            <p className="mb-3">
              Vertero biedt een platform waarmee gebruikers quizzen kunnen aanmaken en publiceren om
              offerteaanvragen te ontvangen. De dienst bestaat uit:
            </p>
            <ul className="space-y-2">
              {[
                'Een dashboard voor het aanmaken en beheren van quizzen',
                'Een widget die op externe websites kan worden geplaatst',
                'Een overzicht van ontvangen leads (offerteaanvragen)',
                'Optionele e-mailnotificaties bij nieuwe leads',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Vertero is een hulpmiddel — wij zijn geen partij in de offerterelatie tussen gebruiker en lead.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. Account en toegang</h2>
            <p>
              Je bent zelf verantwoordelijk voor de beveiliging van je account en de vertrouwelijkheid van je
              inloggegevens. Vertero is niet aansprakelijk voor schade als gevolg van ongeautoriseerde toegang
              tot jouw account. Je mag je account niet overdragen aan derden zonder schriftelijke toestemming.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Abonnementen en betaling</h2>
            <p className="mb-3">
              Vertero biedt een gratis plan en een betaald Pro-abonnement. Voor het Pro-abonnement geldt:
            </p>
            <ul className="space-y-2">
              {[
                'Betaling geschiedt vooraf per maand of per jaar via Stripe',
                'Het abonnement wordt automatisch verlengd tenzij je het opzegt',
                'Opzeggen kan op elk moment; je behoudt toegang tot het einde van de betaalde periode',
                'Terugbetaling is niet mogelijk, tenzij wettelijk vereist',
                'Prijswijzigingen worden minimaal 30 dagen van tevoren aangekondigd',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. Acceptabel gebruik</h2>
            <p className="mb-3">Het is niet toegestaan om Vertero te gebruiken voor:</p>
            <ul className="space-y-2">
              {[
                'Het verzamelen van gegevens zonder toestemming van de invuller',
                'Misleidende, illegale of frauduleuze doeleinden',
                'Spam of ongewenste communicatie naar leads',
                'Het overbelasten of verstoren van onze infrastructuur',
                'Activiteiten die in strijd zijn met de AVG of andere toepasselijke wetgeving',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">✕</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Vertero behoudt zich het recht voor accounts te blokkeren of te verwijderen bij schending van
              deze regels, zonder voorafgaande kennisgeving.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Verwerking van persoonsgegevens</h2>
            <p>
              Als gebruiker ben jij de verwerkingsverantwoordelijke voor de leadgegevens die via jouw quiz
              worden verzameld. Vertero verwerkt deze gegevens uitsluitend als verwerker in jouw opdracht.
              Wij verwerken gegevens conform ons{' '}
              <Link href="/privacy" className="text-[#f97316] hover:underline">privacybeleid</Link>.
              Je bent zelf verantwoordelijk voor het informeren van leads over de verwerking van hun
              persoonsgegevens en voor naleving van de AVG.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Intellectueel eigendom</h2>
            <p>
              Alle rechten op het platform, de software en de content van Vertero berusten bij Vertero B.V.
              Jij behoudt alle rechten op de door jou gemaakte quizzen en ingevoerde content. Je verleent
              Vertero een beperkte licentie om deze content op te slaan en te verwerken voor het leveren
              van de dienst.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Aansprakelijkheid</h2>
            <p className="mb-3">
              Vertero spant zich in een betrouwbare dienst te leveren, maar garandeert geen ononderbroken
              beschikbaarheid. Wij zijn niet aansprakelijk voor:
            </p>
            <ul className="space-y-2">
              {[
                'Indirecte schade, gederfde winst of gemiste leads',
                'Schade als gevolg van onjuist gebruik van het platform',
                'Schade door handelingen van leads of derden',
                'Tijdelijke onbeschikbaarheid door onderhoud of storingen',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="text-[#f97316] text-xs mt-0.5 flex-shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Onze aansprakelijkheid is in alle gevallen beperkt tot het bedrag dat je in de afgelopen
              drie maanden aan Vertero hebt betaald.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Beëindiging</h2>
            <p>
              Je kunt je account op elk moment verwijderen via het dashboard of door contact op te nemen
              met <a href="mailto:support@vertero.nl" className="text-[#f97316] hover:underline">support@vertero.nl</a>.
              Na verwijdering worden jouw gegevens en leads binnen 30 dagen definitief verwijderd.
              Vertero kan jouw account beëindigen bij overtreding van deze voorwaarden of bij langdurige
              inactiviteit op een gratis plan.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">11. Wijzigingen</h2>
            <p>
              Vertero mag deze voorwaarden aanpassen. Bij wezenlijke wijzigingen ontvang je minimaal 30 dagen
              van tevoren een melding. Voortgezet gebruik van de dienst na de ingangsdatum geldt als acceptatie
              van de nieuwe voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">12. Toepasselijk recht</h2>
            <p>
              Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
              bevoegde rechter in het arrondissement waar Vertero B.V. is gevestigd, tenzij wettelijk anders
              bepaald.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">13. Contact</h2>
            <p>
              Voor vragen over deze voorwaarden kun je contact opnemen via{' '}
              <a href="mailto:support@vertero.nl" className="text-[#f97316] hover:underline">support@vertero.nl</a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.07] flex flex-wrap gap-6 text-sm text-white/30">
          <Link href="/privacy" className="hover:text-white transition">Privacybeleid →</Link>
          <Link href="/" className="hover:text-white transition">Terug naar home →</Link>
        </div>
      </div>
    </div>
  )
}
