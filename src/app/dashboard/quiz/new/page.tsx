'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
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
    const questions = template?.questions.map(q => ({
      ...q,
      id: Math.random().toString(36).slice(2)
    })) || []

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
    <div className="p-4 sm:p-8 max-w-2xl">
      <h1 className="font-serif text-3xl italic mb-2">Nieuwe quiz</h1>
      <p className="text-white/40 text-sm mb-8">Geef je quiz een naam en kies een template</p>

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
  )
}