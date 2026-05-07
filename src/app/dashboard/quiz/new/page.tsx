'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const all4 = { 0: '__contact__', 1: '__contact__', 2: '__contact__', 3: '__contact__' }
const to4 = { 0: '4', 1: '4', 2: '4', 3: '4' }
const to5 = { 0: '5', 1: '5', 2: '5', 3: '5' }
const to6 = { 0: '6', 1: '6', 2: '6', 3: '6' }

const TEMPLATES = [
  {
    id: 'badkamer',
    icon: '🚿',
    name: 'Badkamerrenovatie',
    desc: 'Volledig, tegels, sanitair of uitbreiding',
    questions: [
      { id: '1', question: 'Wat wil je laten doen aan de badkamer?', type: 'multiple', options: ['Volledige renovatie', 'Alleen tegels vervangen', 'Sanitair vervangen', 'Uitbreiding / verbouwing'], branches: { 0: '2', 1: '3', 2: '4', 3: '2' } },
      { id: '2', question: 'Hoe groot is de badkamer?', type: 'multiple', options: ['Klein (< 4 m²)', 'Normaal (4–7 m²)', 'Ruim (7–12 m²)', 'Groot (> 12 m²)'], branches: to5 },
      { id: '3', question: 'Welk oppervlak wil je betegelen?', type: 'multiple', options: ['Alleen de vloer', 'Alleen de wanden', 'Vloer én wanden', 'Bad- of douchehoek'], branches: to5 },
      { id: '4', question: 'Wat wil je vervangen?', type: 'multiple', options: ['Douche of bad', 'Toilet', 'Wastafel / meubel', 'Alles'], branches: to5 },
      { id: '5', question: 'Wat is je budget globaal?', type: 'multiple', options: ['Minder dan €5.000', '€5.000 – €15.000', '€15.000 – €30.000', 'Meer dan €30.000'] },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'dak',
    icon: '🏠',
    name: 'Dakrenovatie / dakkapel',
    desc: 'Dakbedekking, dakkapel, isolatie of goten',
    questions: [
      { id: '1', question: 'Wat voor dakwerk zoek je?', type: 'multiple', options: ['Dakbedekking vervangen', 'Dakkapel plaatsen', 'Dakisolatie', 'Dakgoot / afvoer'], branches: { 0: '2', 1: '3', 2: '4', 3: '5' } },
      { id: '2', question: 'Wat voor dak heb je?', type: 'multiple', options: ['Plat dak', 'Schuin dak (pannen)', 'Schuin dak (bitumen)', 'Sedum / groen dak'], branches: to5 },
      { id: '3', question: 'Welk type dakkapel?', type: 'multiple', options: ['Liggende dakkapel', 'Staande dakkapel', 'Mansardekap', 'Dakopbouw'], branches: to5 },
      { id: '4', question: 'Hoe wil je isoleren?', type: 'multiple', options: ['Van binnenuit', 'Van buitenaf (op het dak)', 'Weet ik nog niet', 'Combinatie'], branches: to5 },
      { id: '5', question: 'Wat is je budget globaal?', type: 'multiple', options: ['Minder dan €3.000', '€3.000 – €10.000', '€10.000 – €25.000', 'Meer dan €25.000'] },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'aanbouw',
    icon: '🧱',
    name: 'Aanbouw / uitbouw',
    desc: 'Aanbouw, opbouw, garage of berging',
    questions: [
      { id: '1', question: 'Wat wil je laten bouwen?', type: 'multiple', options: ['Aanbouw achterzijde', 'Zijuitbouw', 'Opbouw extra verdieping', 'Garage of berging'], branches: { 0: '2', 1: '2', 2: '3', 3: '4' } },
      { id: '2', question: 'Wat wordt het gebruik?', type: 'multiple', options: ['Woonkamer uitbreiden', 'Extra slaapkamer', 'Keuken uitbreiden', 'Thuiskantoor'], branches: to5 },
      { id: '3', question: 'Hoeveel verdiepingen worden het?', type: 'multiple', options: ['1 extra verdieping', '2 extra verdiepingen', 'Alleen dakopbouw / kap', 'Nog niet zeker'], branches: to5 },
      { id: '4', question: 'Welk type?', type: 'multiple', options: ['Aangebouwde garage', 'Vrijstaande garage', 'Carport', 'Berging / schuur'], branches: to5 },
      { id: '5', question: 'Hoe groot globaal (m²)?', type: 'multiple', options: ['Minder dan 15 m²', '15–30 m²', '30–60 m²', 'Meer dan 60 m²'] },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'schilderwerk',
    icon: '🎨',
    name: 'Schilderwerk binnen/buiten',
    desc: 'Binnen, buiten, kozijnen of combinatie',
    questions: [
      { id: '1', question: 'Wat wil je laten schilderen?', type: 'multiple', options: ['Binnenmuren', 'Buitenmuren', 'Kozijnen / deuren', 'Binnen én buiten'], branches: { 0: '2', 1: '3', 2: '4', 3: '2' } },
      { id: '2', question: 'Om hoeveel kamers gaat het?', type: 'multiple', options: ['1–2 kamers', '3–5 kamers', 'Hele woning', 'Bedrijfspand'], branches: to5 },
      { id: '3', question: 'Hoe groot is het pand?', type: 'multiple', options: ['Rijtjeswoning', 'Twee-onder-een-kap', 'Vrijstaande woning', 'Bedrijfspand'], branches: to5 },
      { id: '4', question: 'Hoeveel kozijnen of deuren?', type: 'multiple', options: ['1–5', '6–15', '16–30', 'Meer dan 30'], branches: to5 },
      { id: '5', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1 maand', 'Binnen 3 maanden', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'airco',
    icon: '❄️',
    name: 'Airco / warmtepomp',
    desc: 'Koeling, verwarming of warmtepomp',
    questions: [
      { id: '1', question: 'Wat wil je laten installeren?', type: 'multiple', options: ['Airconditioning', 'Warmtepomp', 'Beide', 'Weet ik nog niet'], branches: { 0: '2', 1: '3', 2: '2', 3: '4' } },
      { id: '2', question: 'Voor hoeveel ruimtes?', type: 'multiple', options: ['1 ruimte', '2–3 ruimtes', '4+ ruimtes', 'Heel huis / pand'], branches: to5 },
      { id: '3', question: 'Wat voor woning of pand?', type: 'multiple', options: ['Rijtjeswoning', 'Vrijstaande woning', 'Appartement', 'Bedrijfspand'], branches: to5 },
      { id: '4', question: 'Wat is het hoofddoel?', type: 'multiple', options: ['Koelen in de zomer', 'Verwarmen (gas eruit)', 'Beide', 'Energie besparen'], branches: to5 },
      { id: '5', question: 'Wat is je budget globaal?', type: 'multiple', options: ['Minder dan €2.000', '€2.000 – €6.000', '€6.000 – €15.000', 'Meer dan €15.000'] },
      { id: '6', question: 'Wanneer wil je installatie?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Oriënterend'], branches: all4 },
    ],
  },
  {
    id: 'kozijnen',
    icon: '🪟',
    name: 'Kozijnen / ramen',
    desc: 'Ramen, deuren of kozijnen vervangen',
    questions: [
      { id: '1', question: 'Wat wil je laten vervangen?', type: 'multiple', options: ['Ramen', 'Buitendeuren', 'Kozijnen (inclusief ramen)', 'Combinatie'], branches: { 0: '2', 1: '3', 2: '2', 3: '2' } },
      { id: '2', question: 'Hoeveel ramen of kozijnen?', type: 'multiple', options: ['1–3', '4–8', '9–15', 'Meer dan 15'], branches: to4 },
      { id: '3', question: 'Welk type deur?', type: 'multiple', options: ['Voordeur', 'Achterdeur', 'Schuifpui / openslaand', 'Meerdere deuren'], branches: to4 },
      { id: '4', question: 'Welk materiaal?', type: 'multiple', options: ['Kunststof', 'Hout', 'Aluminium', 'Geen voorkeur'] },
      { id: '5', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'tuin',
    icon: '🌿',
    name: 'Tuinaanleg / bestrating',
    desc: 'Tuin, terras, schutting of beplanting',
    questions: [
      { id: '1', question: 'Wat wil je laten doen?', type: 'multiple', options: ['Volledige tuinaanleg', 'Bestrating / terras', 'Schutting / omheining', 'Beplanting / borders'], branches: { 0: '2', 1: '3', 2: '4', 3: '5' } },
      { id: '2', question: 'Hoe groot is de tuin?', type: 'multiple', options: ['Klein (< 30 m²)', 'Gemiddeld (30–80 m²)', 'Groot (80–200 m²)', 'Zeer groot (> 200 m²)'], branches: to6 },
      { id: '3', question: 'Welk materiaal voor de bestrating?', type: 'multiple', options: ['Tegels', 'Klinkers / keien', 'Siergrind', 'Hout / composiet'], branches: to6 },
      { id: '4', question: 'Welk type afscheiding?', type: 'multiple', options: ['Houten schutting', 'Betonschutting', 'Schermgaas / draadwerk', 'Haag / groen'], branches: to6 },
      { id: '5', question: 'Wat voor tuin wil je?', type: 'multiple', options: ['Siertuin', 'Moestuin', 'Onderhoudsvriendelijk', 'Speeltuin voor kinderen'], branches: to6 },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'vloeren',
    icon: '🪵',
    name: 'Vloeren leggen',
    desc: 'Laminaat, PVC, parket of tegels',
    questions: [
      { id: '1', question: 'Welk type vloer wil je?', type: 'multiple', options: ['Laminaat', 'PVC / vinyl', 'Parket / massief hout', 'Tegels'], branches: { 0: '2', 1: '2', 2: '3', 3: '4' } },
      { id: '2', question: 'Hoeveel m² moet er gelegd worden?', type: 'multiple', options: ['Minder dan 20 m²', '20–50 m²', '50–100 m²', 'Meer dan 100 m²'], branches: to5 },
      { id: '3', question: 'Welk type parket?', type: 'multiple', options: ['Massief houten vloer', 'Engineered parket', 'Visgraat', 'Strokenparket'], branches: to5 },
      { id: '4', question: 'In welke ruimte komen de tegels?', type: 'multiple', options: ['Woonkamer', 'Keuken', 'Badkamer', 'Meerdere ruimtes'], branches: to5 },
      { id: '5', question: 'Moet de ondervloer ook aangepakt worden?', type: 'multiple', options: ['Nee, de vloer is vlak', 'Ja, nieuwe ondervloer nodig', 'Er moet egalisatie', 'Weet ik nog niet'] },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'elektra',
    icon: '⚡',
    name: 'Elektra',
    desc: 'Groepenkast, stopcontacten, zonnepanelen of laadpaal',
    questions: [
      { id: '1', question: 'Wat voor elektrawerk zoek je?', type: 'multiple', options: ['Groepenkast vervangen / uitbreiden', 'Extra stopcontacten of lichtpunten', 'Zonnepanelen aansluiting', 'Laadpaal installeren'], branches: { 0: '2', 1: '3', 2: '4', 3: '5' } },
      { id: '2', question: 'Hoe oud is de huidige installatie?', type: 'multiple', options: ['Jonger dan 10 jaar', '10–25 jaar oud', 'Ouder dan 25 jaar', 'Weet ik niet'], branches: to6 },
      { id: '3', question: 'Hoeveel punten moeten er bij?', type: 'multiple', options: ['1–3 punten', '4–10 punten', '11–20 punten', 'Meer dan 20'], branches: to6 },
      { id: '4', question: 'Hoeveel zonnepanelen?', type: 'multiple', options: ['1–6 panelen', '7–12 panelen', '13–20 panelen', 'Meer dan 20'], branches: to6 },
      { id: '5', question: 'Welk type laadpaal?', type: 'multiple', options: ['Thuis (1-fase)', 'Thuis (3-fase)', 'Zakelijk / meerdere punten', 'Weet ik nog niet'], branches: to6 },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'loodgieter',
    icon: '🔧',
    name: 'Loodgieter',
    desc: 'Lekkage, cv-ketel, sanitair of leidingwerk',
    questions: [
      { id: '1', question: 'Wat is er nodig?', type: 'multiple', options: ['Lekkage repareren', 'Cv-ketel / verwarming', 'Sanitair installeren', 'Nieuw leidingwerk'], branches: { 0: '2', 1: '3', 2: '4', 3: '5' } },
      { id: '2', question: 'Waar is de lekkage?', type: 'multiple', options: ['Waterleiding', 'Afvoer / riool', 'Dak of dakgoot', 'Weet ik nog niet'], branches: to6 },
      { id: '3', question: 'Wat moet er aan de cv?', type: 'multiple', options: ['Cv-ketel vervangen', 'Onderhoud / service', 'Extra radiator plaatsen', 'Vloerverwarming aanleggen'], branches: to6 },
      { id: '4', question: 'Wat wil je laten installeren?', type: 'multiple', options: ['Douche of bad', 'Toilet', 'Wastafel / meubel', 'Alles'], branches: to6 },
      { id: '5', question: 'Welk leidingwerk?', type: 'multiple', options: ['Warm- en koudwaterleiding', 'Gasleiding', 'Afvoerleidingen', 'Alles nieuw'], branches: to6 },
      { id: '6', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'], branches: all4 },
    ],
  },
  {
    id: 'leeg',
    icon: '📋',
    name: 'Leeg beginnen',
    desc: 'Zelf vragen toevoegen',
    questions: [],
  },
]

const POPULAR_ID = 'badkamer'

export default function NewQuizPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState('badkamer')
  const [name, setName] = useState('Badkamerrenovatie aanvraag')
  const [nameCustomised, setNameCustomised] = useState(false)
  const [loading, setLoading] = useState(false)

  function pickTemplate(id: string) {
    const t = TEMPLATES.find(t => t.id === id)!
    setSelectedId(id)
    if (!nameCustomised) {
      setName(t.questions.length > 0 ? `${t.name} aanvraag` : '')
    }
  }

  async function createQuiz() {
    if (!name.trim()) return
    setLoading(true)

    const template = TEMPLATES.find(t => t.id === selectedId)!
    const idMap: Record<string, string> = {}
    const baseQuestions = template.questions.map(q => {
      const newId = Math.random().toString(36).slice(2)
      idMap[q.id] = newId
      return { ...q, id: newId }
    })
    const questions = baseQuestions.map((q, i) => {
      const orig = template.questions[i] as { branches?: Record<number, string> }
      if (!orig.branches) return q
      const branches: Record<number, string> = {}
      for (const [k, v] of Object.entries(orig.branches)) {
        branches[Number(k)] = v === '__contact__' ? '__contact__' : (idMap[v] ?? v)
      }
      return { ...q, branches }
    })

    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), config: { questions } }),
    })

    if (res.ok) {
      const quiz = await res.json()
      router.push(`/dashboard/quiz/${quiz.id}`)
    }
    setLoading(false)
  }

  const selected = TEMPLATES.find(t => t.id === selectedId)!

  return (
    <div className="flex h-full overflow-hidden">

      {/* LEFT — template picker */}
      <div className="flex-1 overflow-y-auto border-r border-white/[0.07]">
        <div className="px-6 pt-8 pb-5 border-b border-white/[0.07]">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Kies wat voor aanvragen je wilt binnenhalen</h1>
          <p className="text-white/40 text-sm">Klaar in 2 minuten. Pas daarna aan wat je wilt.</p>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => pickTemplate(t.id)}
              className={`relative text-left p-4 rounded-xl border transition ${
                selectedId === t.id
                  ? 'border-[#f97316] bg-[#f97316]/8'
                  : 'border-white/10 hover:border-white/25 bg-[#0d0d1c]'
              }`}
            >
              {t.id === POPULAR_ID && (
                <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-[#f97316]/20 text-[#f97316] px-1.5 py-0.5 rounded-full">
                  Populair
                </span>
              )}
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="font-semibold text-sm text-white mb-0.5">{t.name}</div>
              <div className="text-white/35 text-xs">
                {t.questions.length > 0 ? `${t.questions.length} vragen` : 'Leeg'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT — preview + CTA */}
      <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto">
        <div className="p-6 flex-1">
          <div className="text-3xl mb-3">{selected.icon}</div>
          <h2 className="font-extrabold text-lg mb-1">{selected.name}</h2>
          <p className="text-white/40 text-xs mb-5">{selected.desc}</p>

          {selected.questions.length > 0 ? (
            <ul className="flex flex-col gap-2 mb-6">
              {selected.questions.map((q, i) => (
                <li key={q.id} className="flex gap-2.5 text-xs text-white/50">
                  <span className="text-white/20 flex-shrink-0 w-4">{i + 1}.</span>
                  <span className="leading-relaxed">{q.question}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/25 text-xs mb-6">Je voegt zelf vragen toe in de editor.</p>
          )}
        </div>

        <div className="p-6 border-t border-white/[0.07]">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
            Naam
          </label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setNameCustomised(true) }}
            placeholder="bijv. Badkamerrenovatie aanvraag"
            className="w-full bg-[#07070f] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/20 outline-none focus:border-[#f97316]/50 transition text-sm mb-3"
          />
          <button
            onClick={createQuiz}
            disabled={!name.trim() || loading}
            className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition text-sm"
          >
            {loading ? 'Bezig…' : 'Maak mijn quiz →'}
          </button>
        </div>
      </div>
    </div>
  )
}