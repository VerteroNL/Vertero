'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  ticks,
  format,
  onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  ticks: number[]
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-white/70">{label}</label>
        <span className="text-[#f97316] font-bold text-base tabular-nums">{format(value)}</span>
      </div>
      {hint && <p className="text-white/30 text-xs mb-3">{hint}</p>}
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="w-full h-1.5 rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-[#f97316]/60"
            style={{ width: `${pct(value)}%` }}
          />
        </div>
        {/* Tick marks */}
        {ticks.map(t => (
          <div
            key={t}
            className="absolute w-px h-2.5 bg-white/20 pointer-events-none"
            style={{ left: `${pct(t)}%` }}
          />
        ))}
        {/* Hidden range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer"
          style={{ height: '40px', top: '50%', transform: 'translateY(-50%)', touchAction: 'none' }}
        />
        {/* Thumb */}
        <div
          className="absolute w-4 h-4 rounded-full bg-[#f97316] border-2 border-white/20 shadow-lg pointer-events-none"
          style={{ left: `clamp(0px, calc(${pct(value)}% - 8px), calc(100% - 16px))` }}
        />
      </div>
      {/* Tick labels */}
      <div className="relative mt-2 h-4">
        {ticks.map(t => (
          <span
            key={t}
            className="absolute text-[10px] text-white/20 -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${pct(t)}%` }}
          >
            {format(t)}
          </span>
        ))}
      </div>
    </div>
  )
}

function ResultRow({ label, value, accent, large }: { label: string; value: string; accent?: boolean; large?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 ${large ? 'border-t border-white/10 mt-1' : 'border-b border-white/5'}`}>
      <span className={`text-sm ${accent ? 'font-semibold text-white' : 'text-white/50'}`}>{label}</span>
      <span className={`font-bold tabular-nums ${large ? 'text-2xl text-[#f97316]' : accent ? 'text-white text-sm' : 'text-white/70 text-sm'}`}>
        {value}
      </span>
    </div>
  )
}

function euro(n: number) {
  if (!isFinite(n)) return '€0'
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1).replace('.', ',')} mln`
  if (n >= 1_000) return `€${(n / 1_000).toFixed(1).replace('.', ',')}k`
  return `€${n.toFixed(1).replace('.', ',')}`
}

export default function ROICalculatorPage() {
  // Inputs
  const [aanvragenPerMaand, setAanvragenPerMaand] = useState(30)
  const [onvolledigPct, setOnvolledigPct] = useState(40)
  const [gemiddeldeOpdracht, setGemiddeldeOpdracht] = useState(3500)
  const [conversieZonderInfo, setConversieZonderInfo] = useState(20)
  const [tijdPerAanvraag, setTijdPerAanvraag] = useState(25)
  const [uurtarief, setUurtarief] = useState(75)

  const result = useMemo(() => {
    const onvolledigeAanvragen = aanvragenPerMaand * (onvolledigPct / 100)
    const volledigeAanvragen = aanvragenPerMaand - onvolledigeAanvragen

    // Omzet verlies door slechte aanvragen
    // Slechte aanvragen converteren minder goed
    const conversieSlechteAanvraag = conversieZonderInfo / 100
    const conversieGoede = Math.min((conversieZonderInfo + 25) / 100, 1) // met goede info 25pp meer kans
    const gewonnenOpdrachtenHuidigeAanpak = volledigeAanvragen * conversieGoede + onvolledigeAanvragen * conversieSlechteAanvraag
    const gewonnenOpdrachtenMetVertero = aanvragenPerMaand * conversieGoede
    const extraOpdrachtenPerMaand = gewonnenOpdrachtenMetVertero - gewonnenOpdrachtenHuidigeAanpak
    const omzetVerliesPerMaand = extraOpdrachtenPerMaand * gemiddeldeOpdracht

    // Tijdsverlies
    const tijdVerlorPerMaand = onvolledigeAanvragen * (tijdPerAanvraag / 60)
    const kostenTijdPerMaand = tijdVerlorPerMaand * uurtarief

    const totaalVerliesPerMaand = omzetVerliesPerMaand + kostenTijdPerMaand
    const totaalVerliesPerJaar = totaalVerliesPerMaand * 12

    return {
      onvolledigeAanvragen: Math.round(onvolledigeAanvragen),
      extraOpdrachten: extraOpdrachtenPerMaand,
      omzetVerlies: omzetVerliesPerMaand,
      tijdVerloren: tijdVerlorPerMaand,
      kostenTijd: kostenTijdPerMaand,
      totaalMaand: totaalVerliesPerMaand,
      totaalJaar: totaalVerliesPerJaar,
    }
  }, [aanvragenPerMaand, onvolledigPct, gemiddeldeOpdracht, conversieZonderInfo, tijdPerAanvraag, uurtarief])

  const urgentie = result.totaalJaar > 50000 ? 'hoog' : result.totaalJaar > 15000 ? 'middel' : 'laag'

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
            <Link href="/sign-in" className="hidden md:block text-white/60 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 md:px-5 py-2 rounded-lg font-semibold text-sm transition">
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-5 md:px-10 pt-14 pb-10 text-center">
        <div className="inline-block bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          ROI Calculator
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
          Hoeveel geld mis jij door<br />
          <span className="text-[#f97316]">slechte offerteaanvragen?</span>
        </h1>
        <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Vage aanvragen kosten je meer dan je denkt, in gemiste omzet én verspilde tijd.
          Bereken in 30 seconden wat het jou kost.
        </p>
      </section>

      {/* CALCULATOR */}
      <section className="max-w-5xl mx-auto px-5 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Sliders */}
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-6">Jouw situatie</p>
              <div className="flex flex-col gap-8">
                <Slider
                  label="Aanvragen per maand"
                  hint="Het totaal aantal offerteaanvragen dat je ontvangt"
                  value={aanvragenPerMaand}
                  min={0}
                  max={200}
                  step={1}
                  ticks={[0, 50, 100, 150, 200]}
                  format={v => `${v}`}
                  onChange={setAanvragenPerMaand}
                />
                <Slider
                  label="Onvolledig of vaag"
                  hint="Hoeveel % van de aanvragen is te vaag om direct te beantwoorden"
                  value={onvolledigPct}
                  min={0}
                  max={100}
                  step={1}
                  ticks={[0, 25, 50, 75, 100]}
                  format={v => `${v}%`}
                  onChange={setOnvolledigPct}
                />
                <Slider
                  label="Gemiddelde opdrachtswaarde"
                  hint="Wat is een gemiddelde opdracht waard voor jouw bedrijf"
                  value={gemiddeldeOpdracht}
                  min={0}
                  max={50000}
                  step={1}
                  ticks={[0, 10000, 25000, 50000]}
                  format={euro}
                  onChange={setGemiddeldeOpdracht}
                />
                <Slider
                  label="Conversie bij goede aanvraag"
                  hint="Hoe vaak win je een opdracht als de aanvraag compleet is"
                  value={conversieZonderInfo}
                  min={0}
                  max={100}
                  step={1}
                  ticks={[0, 25, 50, 75, 100]}
                  format={v => `${v}%`}
                  onChange={setConversieZonderInfo}
                />
                <Slider
                  label="Extra tijd per vage aanvraag"
                  hint="Minuten kwijt aan nabellen, doorvragen of wachten op info"
                  value={tijdPerAanvraag}
                  min={0}
                  max={120}
                  step={1}
                  ticks={[0, 30, 60, 90, 120]}
                  format={v => `${v} min`}
                  onChange={setTijdPerAanvraag}
                />
                <Slider
                  label="Uurtarief / waarde van jouw tijd"
                  hint="Wat is jouw tijd waard per uur (eigen tarief of MKB-gemiddelde)"
                  value={uurtarief}
                  min={0}
                  max={200}
                  step={1}
                  ticks={[0, 50, 100, 150, 200]}
                  format={v => `${euro(v)}/u`}
                  onChange={setUurtarief}
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">

            {/* Main result card */}
            <div className={`rounded-2xl border p-6 md:p-8 ${
              urgentie === 'hoog'
                ? 'bg-red-500/5 border-red-500/20'
                : urgentie === 'middel'
                ? 'bg-[#f97316]/5 border-[#f97316]/20'
                : 'bg-[#0d0d1c] border-white/10'
            }`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Berekening</p>

              <ResultRow
                label={`Vage aanvragen / maand`}
                value={`${result.onvolledigeAanvragen} van ${aanvragenPerMaand}`}
              />
              <ResultRow
                label="Extra uren kwijt aan navragen"
                value={`${result.tijdVerloren.toFixed(1)} uur/mnd`}
              />
              <ResultRow
                label="Kosten verspilde tijd"
                value={euro(result.kostenTijd)}
                accent
              />
              <ResultRow
                label="Gemiste opdrachten / maand"
                value={`~${result.extraOpdrachten.toFixed(1)}`}
              />
              <ResultRow
                label="Misgelopen omzet / maand"
                value={euro(result.omzetVerlies)}
                accent
              />

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/50">Elke maand laat je liggen</span>
                  <span className="font-bold text-white tabular-nums">{euro(result.totaalMaand)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Dit verdien je erbij per jaar</span>
                  <span className={`text-3xl font-extrabold tabular-nums ${
                    urgentie === 'hoog' ? 'text-red-400' : 'text-[#f97316]'
                  }`}>
                    {euro(result.totaalJaar)}
                  </span>
                </div>
              </div>
            </div>

            {/* Context label */}
            <div className="bg-white/[0.03] border border-white/7 rounded-xl px-5 py-4 text-sm text-white/40 leading-relaxed">
              {urgentie === 'hoog' && (
                <>
                  <span className="text-red-400 font-semibold">Dit loopt snel op. </span>
                  Bij jouw aantallen laat je {euro(result.totaalMaand)} per maand liggen. Dat is meer dan een fulltime medewerker per jaar.
                </>
              )}
              {urgentie === 'middel' && (
                <>
                  <span className="text-[#f97316] font-semibold">Zeker niet te negeren. </span>
                  Met betere aanvragen heb je dit snel terugverdiend.
                </>
              )}
              {urgentie === 'laag' && (
                <>
                  <span className="text-white/60 font-semibold">Klein bedrag, telt op. </span>
                  Zelfs bij weinig aanvragen loopt dit aan het einde van het jaar op.
                </>
              )}
            </div>

            {/* CTA */}
            <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
              <p className="font-bold text-base mb-1">Zet hier een stop aan</p>
              <p className="text-white/40 text-sm mb-5 leading-relaxed">
                Met Vertero ontvang je alleen volledige, gerichte aanvragen zodat je direct een prijsopgave kunt sturen zonder gedoe.
              </p>
              <Link
                href="/sign-up"
                className="block text-center bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                Gratis beginnen →
              </Link>
            </div>
          </div>
        </div>

        {/* How it works strip */}
        <div className="mt-12 pt-12 border-t border-white/7">
          <p className="text-center text-white/25 text-xs font-bold uppercase tracking-widest mb-8">Hoe Vertero dit oplost</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                n: '1',
                title: 'Jij stelt de vragen vooraf',
                desc: 'Bouw een korte quiz met precies de info die jij nodig hebt voor een offerte. Geen vage berichten meer.',
              },
              {
                n: '2',
                title: 'Klant vult in, leads worden gescoord',
                desc: 'Elke aanvraag komt compleet binnen met naam, contactgegevens én een automatische score zodat je direct weet wie de moeite waard is.',
              },
              {
                n: '3',
                title: 'Minder tijd, betere conversie',
                desc: 'Geen nabellen voor basisinfo. Je spendeert je tijd aan echte opdrachten, niet aan opvolging.',
              },
            ].map(item => (
              <div key={item.n} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316] text-xs font-bold mb-4">
                  {item.n}
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/7 py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="hover:opacity-80 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vertero" className="h-7" />
          </Link>
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            <Link href="/faq" className="text-white/40 text-sm hover:text-white transition">FAQ</Link>
            <Link href="/sign-in" className="text-white/40 text-sm hover:text-white transition">Inloggen</Link>
            <Link href="/sign-up" className="text-white/40 text-sm hover:text-white transition">Registreren</Link>
          </div>
          <p className="text-white/20 text-sm">© 2026 Vertero. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  )
}
