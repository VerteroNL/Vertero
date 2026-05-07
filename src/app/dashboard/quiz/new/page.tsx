'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
  {
    id: 'aannemer',
    icon: '🏗️',
    name: 'Aannemer — met logica',
    desc: 'Vertakt per type werk, eindigt met registratie',
    questions: [
      {
        id: '1',
        question: 'Wat voor werk zoek je?',
        type: 'multiple',
        options: ['Verbouwing / renovatie', 'Nieuwbouw', 'Onderhoud / reparatie', 'Weet ik nog niet'],
        branches: { 0: '2', 1: '3', 2: '4', 3: '5' },
      },
      {
        id: '2',
        question: 'Welk deel van de woning of het pand?',
        type: 'multiple',
        options: ['Keuken', 'Badkamer', 'Woonkamer of slaapkamer', 'Heel de woning'],
        branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
      },
      {
        id: '3',
        question: 'Wat voor gebouw gaat het om?',
        type: 'multiple',
        options: ['Woning', 'Uitbouw / aanbouw', 'Garage of berging', 'Bedrijfspand'],
        branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
      },
      {
        id: '4',
        question: 'Wat is er aan de hand?',
        type: 'multiple',
        options: ['Lekkage', 'Scheuren of verzakking', 'Dak of goot', 'Iets anders'],
        branches: { 0: '5', 1: '5', 2: '5', 3: '5' },
      },
      {
        id: '5',
        question: 'Wat is je budget globaal?',
        type: 'multiple',
        options: ['Minder dan €5.000', '€5.000 – €20.000', '€20.000 – €50.000', 'Meer dan €50.000'],
      },
      {
        id: '6',
        question: 'Wanneer wil je starten?',
        type: 'multiple',
        options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'],
        branches: { 0: '__contact__', 1: '__contact__', 2: '__contact__', 3: '__contact__' },
      },
    ],
  },
  {
    id: 'verbouwing',
    icon: '🏠',
    name: 'Verbouwing / Aannemer',
    desc: 'Voor aannemers en bouwbedrijven',
    questions: [
      { id: '1', question: 'Wat voor werk heb je nodig?', type: 'multiple', options: ['Verbouwing', 'Aanbouw', 'Nieuwbouw', 'Renovatie'] },
      { id: '2', question: 'Hoe groot is het project?', type: 'multiple', options: ['Klein (< 1 week)', 'Middel (1–4 weken)', 'Groot (1–3 maanden)', 'Zeer groot (3+ maanden)'] },
      { id: '3', question: 'Wat is je budget globaal?', type: 'multiple', options: ['Minder dan €5.000', '€5.000 – €20.000', '€20.000 – €50.000', 'Meer dan €50.000'] },
      { id: '4', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'] },
    ]
  },
  {
    id: 'schilderwerk',
    icon: '🎨',
    name: 'Schilderwerk',
    desc: 'Voor schildersbedrijven',
    questions: [
      { id: '1', question: 'Wat wil je laten schilderen?', type: 'multiple', options: ['Binnenmuren', 'Buitenmuren', 'Kozijnen / deuren', 'Alles'] },
      { id: '2', question: 'Om hoeveel kamers gaat het?', type: 'multiple', options: ['1–2 kamers', '3–5 kamers', 'Hele woning', 'Bedrijfspand'] },
      { id: '3', question: 'Wanneer wil je starten?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1 maand', 'Binnen 3 maanden', 'Nog niet zeker'] },
      { id: '4', question: 'Welke kleur of stijl heb je in gedachten?', type: 'text', options: [] },
    ]
  },
  {
    id: 'airco',
    icon: '❄️',
    name: 'Airco installatie',
    desc: 'Voor airco installateurs',
    questions: [
      { id: '1', question: 'Voor hoeveel ruimtes wil je een airco?', type: 'multiple', options: ['1 ruimte', '2–3 ruimtes', '4+ ruimtes', 'Heel huis / pand'] },
      { id: '2', question: 'Wat voor gebouw?', type: 'multiple', options: ['Woning', 'Appartement', 'Kantoor', 'Bedrijfspand'] },
      { id: '3', question: 'Wat is je budget globaal?', type: 'multiple', options: ['Minder dan €1.000', '€1.000 – €3.000', '€3.000 – €6.000', 'Meer dan €6.000'] },
      { id: '4', question: 'Wanneer wil je installatie?', type: 'multiple', options: ['Zo snel mogelijk', 'Binnen 1 maand', 'Binnen 3 maanden', 'Oriënterend'] },
    ]
  },
  {
    id: 'leeg',
    icon: '📋',
    name: 'Leeg beginnen',
    desc: 'Zelf vragen toevoegen',
    questions: []
  },
]

export default function NewQuizPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('leeg')
  const [loading, setLoading] = useState(false)

  async function createQuiz() {
    if (!name) return
    setLoading(true)

    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    const idMap: Record<string, string> = {}
    const baseQuestions = (template?.questions ?? []).map(q => {
      const newId = Math.random().toString(36).slice(2)
      idMap[q.id] = newId
      return { ...q, id: newId }
    })
    const questions = baseQuestions.map((q, i) => {
      const orig = template!.questions[i] as { branches?: Record<number, string> }
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
      body: JSON.stringify({ name, config: { questions } }),
    })

    if (res.ok) {
      const quiz = await res.json()
      router.push(`/dashboard/quiz/${quiz.id}`)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Beheer</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Nieuwe quiz</h1>
        <p className="text-white/40 text-sm mt-1">Geef je quiz een naam en kies een template</p>
      </div>

      <div className="px-6 py-6 max-w-2xl">

      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
          Quiz naam
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="bijv. Verbouwing aanvraag"
          className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/50 transition"
        />
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
          Template kiezen
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`border rounded-xl p-4 cursor-pointer transition ${
                selectedTemplate === t.id
                  ? 'border-[#f97316] bg-[#f97316]/5'
                  : 'border-white/10 hover:border-white/20 bg-[#0d0d1c]'
              }`}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="font-semibold text-sm mb-1">{t.name}</div>
              <div className="text-white/40 text-xs">{t.desc}</div>
              {t.questions.length > 0 && (
                <div className="text-white/20 text-xs mt-2">{t.questions.length} vragen inbegrepen</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={createQuiz}
        disabled={!name || loading}
        className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
      >
        {loading ? 'Aanmaken...' : 'Quiz aanmaken →'}
      </button>
      </div>
    </div>
  )
}