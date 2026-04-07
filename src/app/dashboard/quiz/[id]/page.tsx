'use client'

import { useState, useEffect, use } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
}

interface Quiz {
  id: string
  name: string
  slug: string
  active: boolean
  config: { questions: Question[] }
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(r => r.json())
      .then(data => {
        setQuiz(data)
        setQuestions(data.config?.questions || [])
      })
  }, [id])

  function addQuestion() {
    setQuestions(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      question: '',
      type: 'multiple',
      options: ['', '']
    }])
  }

  function updateQuestion(qId: string, field: string, value: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, [field]: value } : q))
  }

  function addOption(qId: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q))
  }

  function updateOption(qId: string, index: number, value: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? {
      ...q,
      options: q.options.map((o, i) => i === index ? value : o)
    } : q))
  }

  function removeOption(qId: string, index: number) {
    setQuestions(prev => prev.map(q => q.id === qId ? {
      ...q,
      options: q.options.filter((_, i) => i !== index)
    } : q))
  }

  function removeQuestion(qId: string) {
    setQuestions(prev => prev.filter(q => q.id !== qId))
  }

  async function saveQuiz() {
    setSaving(true)
    await fetch(`/api/quiz/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { questions } })
    })
    setSaving(false)
  }

  function copyEmbed() {
    navigator.clipboard.writeText(
      `<script src="https://vertero.nl/widget.js" data-id="${quiz?.slug}"></script>`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://vertero.nl/quiz/${quiz?.slug}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!quiz) return (
    <div className="p-8 text-white/40">Laden...</div>
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl italic">{quiz.name}</h1>
          <p className="text-white/40 text-sm mt-1 font-mono">{quiz.slug}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={copyLink}
            className="border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {copiedLink ? '✓ Gekopieerd!' : '🔗 Deel link'}
          </button>
          <button
            onClick={copyEmbed}
            className="border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {copied ? '✓ Gekopieerd!' : '⌘ Embed code'}
          </button>
          <button
            onClick={saveQuiz}
            disabled={saving}
            className="bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {saving ? 'Opslaan...' : 'Opslaan →'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono">
                Vraag {qi + 1}
              </div>
              <button onClick={() => removeQuestion(q.id)} className="text-white/20 hover:text-red-400 text-sm transition">
                ✕ Verwijderen
              </button>
            </div>

            <input
              type="text"
              value={q.question}
              onChange={e => updateQuestion(q.id, 'question', e.target.value)}
              placeholder="Typ je vraag hier..."
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition mb-4"
            />

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => updateQuestion(q.id, 'type', 'multiple')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${q.type === 'multiple' ? 'bg-[#6c5ce7] text-white' : 'border border-white/10 text-white/40 hover:text-white'}`}
              >
                Meerkeuze
              </button>
              <button
                onClick={() => updateQuestion(q.id, 'type', 'text')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${q.type === 'text' ? 'bg-[#6c5ce7] text-white' : 'border border-white/10 text-white/40 hover:text-white'}`}
              >
                Open tekst
              </button>
            </div>

            {q.type === 'multiple' && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md border border-white/10 flex-shrink-0"></div>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      placeholder={`Optie ${oi + 1}`}
                      className="flex-1 bg-[#07070f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#6c5ce7]/50 transition"
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(q.id, oi)} className="text-white/20 hover:text-red-400 transition">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addOption(q.id)} className="text-left text-sm text-white/30 hover:text-white/60 transition mt-1 pl-7">
                  + Optie toevoegen
                </button>
              </div>
            )}

            {q.type === 'text' && (
              <div className="bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white/20 text-sm">
                Bezoeker typt hier vrij...
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="w-full border border-dashed border-white/10 hover:border-[#6c5ce7]/40 rounded-2xl py-5 text-white/30 hover:text-white/60 text-sm font-semibold transition"
      >
        + Vraag toevoegen
      </button>
    </div>
  )
}