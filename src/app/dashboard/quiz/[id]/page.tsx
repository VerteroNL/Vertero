'use client'

import { useState, useEffect, use } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
  allowCustom?: boolean
}

interface Quiz {
  id: string
  name: string
  slug: string
  active: boolean
  config: { questions: Question[]; scoring?: boolean }
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [scoring, setScoring] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    fetch(`/api/quiz/${id}`)
      .then(r => r.json())
      .then(data => {
        setQuiz(data)
        setQuestions(data.config?.questions || [])
        setScoring(data.config?.scoring ?? false)
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

  function moveOption(qId: string, index: number, direction: -1 | 1) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q
      const opts = [...q.options]
      const target = index + direction
      if (target < 0 || target >= opts.length) return q;
      [opts[index], opts[target]] = [opts[target], opts[index]]
      return { ...q, options: opts }
    }))
  }

  function removeQuestion(qId: string) {
    setQuestions(prev => prev.filter(q => q.id !== qId))
  }

  function toggleAllowCustom(qId: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, allowCustom: !q.allowCustom } : q))
  }

  async function saveQuiz() {
    setSaving(true)
    await fetch(`/api/quiz/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { questions, scoring } })
    })
    setSaving(false)
    setSavedAt(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }))
  }

  function copyEmbed() {
    const tag = '<script src="https://vertero.nl/widget.js" data-id="' + quiz?.slug + '"></scr' + 'ipt>'
    navigator.clipboard.writeText(tag)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://vertero.nl/quiz/${quiz?.slug}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!quiz) return (
    <div className="p-8 text-white/40 text-sm">Laden...</div>
  )

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-10">
        <div>
          <p className="text-[#f97316] text-xs font-bold uppercase tracking-widest mb-2">Quiz bewerken</p>
          <h1 className="text-3xl font-extrabold tracking-tight">{quiz.name}</h1>
          <p className="text-white/30 text-xs mt-1 font-mono">{quiz.slug}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {savedAt && (
            <span className="text-white/30 text-xs self-center">✓ Opgeslagen om {savedAt}</span>
          )}
          <a
            href={`/quiz/${quiz.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            👁 Preview
          </a>
          <button
            onClick={copyLink}
            className="border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            {copiedLink ? '✓ Gekopieerd' : '🔗 Deel link'}
          </button>
          <button
            onClick={copyEmbed}
            className="border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            {copied ? '✓ Gekopieerd' : '⌘ Embed code'}
          </button>
          <button
            onClick={saveQuiz}
            disabled={saving}
            className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {saving ? 'Opslaan...' : 'Opslaan →'}
          </button>
        </div>
      </div>

      {/* Scoring toggle */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Lead scoring</p>
          <p className="text-white/40 text-xs mt-0.5">
            {scoring
              ? 'Antwoorden bovenaan = beste score. Herorden per vraag.'
              : 'Schakel in om leads automatisch te scoren op basis van hun antwoorden.'}
          </p>
        </div>
        <button
          onClick={() => setScoring(s => !s)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${scoring ? 'bg-[#f97316]' : 'bg-white/10'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${scoring ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                Vraag {qi + 1}
              </div>
              <button onClick={() => removeQuestion(q.id)} className="text-white/20 hover:text-red-400 text-xs font-semibold transition">
                Verwijderen
              </button>
            </div>

            <input
              type="text"
              value={q.question}
              onChange={e => updateQuestion(q.id, 'question', e.target.value)}
              placeholder="Typ je vraag hier..."
              className="w-full bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition mb-4 text-sm"
            />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => updateQuestion(q.id, 'type', 'multiple')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${q.type === 'multiple' ? 'bg-[#f97316] text-white' : 'border border-white/10 text-white/40 hover:text-white'}`}
              >
                Meerkeuze
              </button>
              <button
                onClick={() => updateQuestion(q.id, 'type', 'text')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${q.type === 'text' ? 'bg-[#f97316] text-white' : 'border border-white/10 text-white/40 hover:text-white'}`}
              >
                Open tekst
              </button>
            </div>

            {q.type === 'multiple' && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    {scoring && (
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => moveOption(q.id, oi, -1)}
                          disabled={oi === 0}
                          className="text-white/20 hover:text-white disabled:opacity-0 text-[10px] leading-none transition"
                        >▲</button>
                        <button
                          onClick={() => moveOption(q.id, oi, 1)}
                          disabled={oi === q.options.length - 1}
                          className="text-white/20 hover:text-white disabled:opacity-0 text-[10px] leading-none transition"
                        >▼</button>
                      </div>
                    )}
                    <div className="w-4 h-4 rounded border border-white/10 flex-shrink-0" />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      placeholder={scoring
                        ? oi === 0 ? 'Beste antwoord' : oi === q.options.length - 1 ? 'Minste antwoord' : `Optie ${oi + 1}`
                        : `Optie ${oi + 1}`}
                      className="flex-1 bg-[#07070f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#f97316]/40 transition"
                    />
                    {scoring && (
                      <span className="text-[10px] text-white/20 w-14 text-right flex-shrink-0">
                        {q.options.length - oi}pt
                      </span>
                    )}
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(q.id, oi)} className="text-white/20 hover:text-red-400 transition text-sm">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addOption(q.id)} className="text-left text-xs text-white/30 hover:text-white/60 transition mt-1 pl-6 font-semibold">
                  + Optie toevoegen
                </button>

                {/* Allow custom answer toggle */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white/40">Eigen antwoord toestaan</span>
                    <p className="text-[11px] text-white/20 mt-0.5">Voegt een &quot;Anders, namelijk...&quot; optie toe</p>
                  </div>
                  <button
                    onClick={() => toggleAllowCustom(q.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${q.allowCustom ? 'bg-[#f97316]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${q.allowCustom ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {q.type === 'text' && (
              <div className="flex flex-col gap-2">
                <div className="bg-[#07070f] border border-white/10 rounded-xl px-4 py-3 text-white/20 text-sm">
                  Bezoeker typt hier vrij...
                </div>
                {scoring && (
                  <p className="text-white/25 text-xs pl-1">Tekstvragen tellen niet mee voor de score</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="w-full border border-dashed border-white/10 hover:border-[#f97316]/30 rounded-2xl py-5 text-white/30 hover:text-white/60 text-sm font-semibold transition"
      >
        + Vraag toevoegen
      </button>
    </div>
  )
}
