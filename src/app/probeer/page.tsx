'use client'

import { useState } from 'react'
import Link from 'next/link'

const TEMPLATES = [
  {
    id: 'verbouwing', icon: '🏠', name: 'Verbouwing / Aannemer', desc: 'Voor aannemers en bouwbedrijven',
    questions: [
      { question: 'Wat voor werk heb je nodig?', options: ['Verbouwing', 'Aanbouw', 'Nieuwbouw', 'Renovatie'] },
      { question: 'Hoe groot is het project?', options: ['Klein (< 1 week)', 'Middel (1–4 weken)', 'Groot (1–3 maanden)', 'Zeer groot (3+ maanden)'] },
      { question: 'Wat is je budget globaal?', options: ['< €5.000', '€5.000 – €20.000', '€20.000 – €50.000', '> €50.000'] },
      { question: 'Wanneer wil je starten?', options: ['Zo snel mogelijk', 'Binnen 1–3 maanden', 'Later dit jaar', 'Nog niet zeker'] },
    ]
  },
  {
    id: 'schilderwerk', icon: '🎨', name: 'Schilderwerk', desc: 'Voor schildersbedrijven',
    questions: [
      { question: 'Wat wil je laten schilderen?', options: ['Binnenmuren', 'Buitenmuren', 'Kozijnen / deuren', 'Alles'] },
      { question: 'Om hoeveel kamers gaat het?', options: ['1–2 kamers', '3–5 kamers', 'Hele woning', 'Bedrijfspand'] },
      { question: 'Wanneer wil je starten?', options: ['Zo snel mogelijk', 'Binnen 1 maand', 'Binnen 3 maanden', 'Nog niet zeker'] },
    ]
  },
  {
    id: 'airco', icon: '❄️', name: 'Airco installatie', desc: 'Voor installateurs',
    questions: [
      { question: 'Voor hoeveel ruimtes wil je een airco?', options: ['1 ruimte', '2–3 ruimtes', '4+ ruimtes', 'Heel huis / pand'] },
      { question: 'Wat voor gebouw?', options: ['Woning', 'Appartement', 'Kantoor', 'Bedrijfspand'] },
      { question: 'Wat is je budget globaal?', options: ['< €1.000', '€1.000 – €3.000', '€3.000 – €6.000', '> €6.000'] },
    ]
  },
  {
    id: 'leeg', icon: '✏️', name: 'Leeg beginnen', desc: 'Zelf vragen toevoegen',
    questions: []
  },
]


interface Question {
  id: string
  question: string
  type: 'multiple' | 'text'
  options: string[]
  branches?: Record<number, string>
}

type Step = 1 | 2 | 'published'

export default function ProbeerPage() {
  const [step, setStep] = useState<Step>(1)
  const [quizName, setQuizName] = useState('Mijn quiz')
  const [selectedTemplate, setSelectedTemplate] = useState('leeg')
  const [questions, setQuestions] = useState<Question[]>([])
  const [publishing, setPublishing] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState('')
  const [activeTab, setActiveTab] = useState<'bouwen' | 'preview'>('bouwen')
  const [previewQ, setPreviewQ] = useState(0)
  const [previewStage, setPreviewStage] = useState<'quiz' | 'contact'>('quiz')

  function selectTemplate(t: typeof TEMPLATES[number]) {
    setSelectedTemplate(t.id)
    setQuizName(t.id === 'leeg' ? 'Mijn quiz' : t.name)
  }

  function goToStep2() {
    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    if (!quizName.trim()) setQuizName(template?.name || 'Mijn quiz')
    setQuestions((template?.questions || []).map(q => ({
      id: Math.random().toString(36).slice(2),
      question: q.question,
      type: 'multiple' as const,
      options: [...q.options],
    })))
    setPreviewQ(0)
    setPreviewStage('quiz')
    setStep(2)
  }

  function addQuestion() {
    if (questions.length >= 5) return
    setQuestions(prev => [...prev, { id: Math.random().toString(36).slice(2), question: '', type: 'multiple' as const, options: ['', ''] }])
  }

  function removeQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function updateQuestion(id: string, text: string) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: text } : q))
  }

  function updateOption(qid: string, idx: number, text: string) {
    setQuestions(prev => prev.map(q => q.id === qid ? { ...q, options: q.options.map((o, i) => i === idx ? text : o) } : q))
  }

  function addOption(qid: string) {
    setQuestions(prev => prev.map(q => q.id === qid && q.options.length < 4 ? { ...q, options: [...q.options, ''] } : q))
  }

  function removeOption(qid: string, idx: number) {
    setQuestions(prev => prev.map(q => q.id === qid && q.options.length > 2 ? { ...q, options: q.options.filter((_, i) => i !== idx) } : q))
  }

  function updateBranch(qId: string, optionIndex: number, target: string) {
    setQuestions(qs => qs.map(q => {
      if (q.id !== qId) return q
      const branches = { ...(q.branches || {}) }
      if (target === '') delete branches[optionIndex]
      else branches[optionIndex] = target
      return { ...q, branches }
    }))
  }

  async function publish() {
    setPublishing(true)
    const res = await fetch('/api/quiz-temp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: quizName, config: { questions } }),
    })
    const data = await res.json()
    if (data.slug) {
      setPublishedSlug(data.slug)
      if (typeof window !== 'undefined') {
        localStorage.setItem('vertero_claim_token', data.token)
      }
      setStep('published')
    }
    setPublishing(false)
  }

const canPublish = questions.length > 0 && questions.every(q => q.question.trim() && q.options.filter(Boolean).length >= 2)
  const currentQ = questions[previewQ]
  const quizUrl = typeof window !== 'undefined' ? `${window.location.origin}/quiz/${publishedSlug}` : `https://vertero.nl/quiz/${publishedSlug}`

  /* ─── STEP 1 ─── */
  if (step === 1) return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Nav />
      <div className="max-w-lg mx-auto px-5 pt-14 pb-24">
        <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-10">
          Gratis · Klaar in ~10 minuten
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
          Maak je eigen<br />leadquiz
        </h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          Bouw een quiz, deel hem en ontvang serieuze aanvragen. Zonder account.
        </p>

        {/* Social proof */}
        <div className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 mb-6 text-sm">
          <span className="text-lg mt-0.5">⭐</span>
          <p className="text-white/60 leading-snug">
            <span className="text-white font-semibold">Marco uit Rotterdam</span> kwalificeert nu
            3× meer aanvragen — zijn quiz stond live in minder dan een kwartier.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-3">
            Kies een startpunt
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`border rounded-xl p-4 text-left transition ${selectedTemplate === t.id ? 'border-[#f97316] bg-[#f97316]/5' : 'border-white/10 hover:border-white/20 bg-[#0d0d1c]'}`}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-sm leading-tight mb-1">{t.name}</div>
                <ul className="space-y-0.5">
                  {t.questions.slice(0, 4).map((q, i) => (
                    <li key={i} className="text-white/35 text-xs truncate">· {q.question}</li>
                  ))}
                  {t.questions.length === 0 && (
                    <li className="text-white/35 text-xs italic">Bouw je eigen vragen</li>
                  )}
                </ul>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={goToStep2}
          className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-xl transition text-base"
        >
          Start met template →
        </button>

        <div className="flex items-center justify-center gap-5 mt-6 text-white/25 text-xs">
          <span>✓ Direct live</span>
        </div>
      </div>
    </div>
  )

  /* ─── STEP 2 ─── */
  if (step === 2) return (
    <div className="bg-[#07070f] text-white">
      <div className="sticky top-0 z-50">
        <Nav />
        {/* Sub-header */}
        <div className="border-b border-white/[0.07] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 bg-[#07070f]">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setStep(1)} className="text-white/35 hover:text-white text-sm transition flex-shrink-0">← Terug</button>
            <span className="text-white/20 text-sm flex-shrink-0">|</span>
            <span className="text-sm font-semibold text-white/80 truncate">{quizName}</span>
          </div>
          <div className="flex md:hidden bg-white/5 rounded-lg p-1 gap-1 flex-shrink-0">
            {(['bouwen', 'preview'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                {tab === 'bouwen' ? 'Bouwen' : 'Preview'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* LEFT: Builder — scrolls normally */}
        <div className={`${activeTab === 'preview' ? 'hidden' : 'block'} md:block w-full md:w-[54%] border-r border-white/[0.07]`}>
          <div className="p-4 sm:p-6">
            {questions.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-xl p-12 text-center text-white/25 text-sm mb-4">
                Voeg je eerste vraag toe
              </div>
            )}

            {questions.map((q, qi) => (
              <div key={q.id} className="bg-[#0d0d1c] border border-white/10 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Vraag {qi + 1}</span>
                  <button onClick={() => removeQuestion(q.id)} className="text-white/20 hover:text-red-400 transition text-sm w-5 h-5 flex items-center justify-center">✕</button>
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={e => updateQuestion(q.id, e.target.value)}
                  placeholder="Typ hier je vraag..."
                  className="w-full bg-[#07070f] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#f97316]/40 transition mb-3"
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(q.id, oi, e.target.value)}
                        placeholder={`Optie ${oi + 1}`}
                        className="flex-1 bg-[#07070f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition"
                      />
                      {questions.length > 1 && (
                        <select
                          value={q.branches?.[oi] ?? ''}
                          onChange={e => updateBranch(q.id, oi, e.target.value)}
                          className="text-[10px] bg-[#07070f] border border-white/10 text-white/40 rounded px-1.5 py-1 outline-none cursor-pointer hover:border-white/20 transition flex-shrink-0 max-w-[130px]"
                        >
                          <option value="">Volgende vraag</option>
                          {questions.map((tq, ti) => tq.id !== q.id && (
                            <option key={tq.id} value={tq.id}>
                              Vraag {ti + 1}{tq.question ? `: ${tq.question.slice(0, 16)}${tq.question.length > 16 ? '…' : ''}` : ''}
                            </option>
                          ))}
                          <option value="__contact__">Contactformulier</option>
                        </select>
                      )}
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(q.id, oi)} className="text-white/20 hover:text-red-400 transition flex-shrink-0 text-xs">✕</button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 4 && (
                    <button onClick={() => addOption(q.id)} className="text-white/30 hover:text-white/60 text-xs transition pl-5.5 pt-1">
                      + Optie toevoegen
                    </button>
                  )}
                </div>
              </div>
            ))}

            {questions.length < 5 ? (
              <button
                onClick={addQuestion}
                className="w-full border border-dashed border-white/[0.12] hover:border-white/25 rounded-xl py-3.5 text-sm text-white/35 hover:text-white/60 transition mb-4"
              >
                + Vraag toevoegen
              </button>
            ) : (
              <p className="text-center text-white/25 text-xs py-1 mb-4">
                Maximum van 5 vragen bereikt ·{' '}
                <Link href="/sign-up" className="text-[#f97316] hover:text-[#ea6c0a] transition">Meer? Maak een account</Link>
              </p>
            )}

            <button
              onClick={publish}
              disabled={publishing || !canPublish}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition"
            >
              {publishing ? 'Publiceren...' : 'Publiceer gratis →'}
            </button>
            <p className="text-center text-white/25 text-xs mt-2 pb-6">Geen account vereist</p>
          </div>
        </div>

        {/* RIGHT: Live preview — sticky so it stays in view while left scrolls */}
        <div className={`${activeTab === 'bouwen' ? 'hidden' : 'flex'} md:flex flex-1 sticky top-[89px] h-[calc(100vh-89px)] items-center justify-center bg-white/[0.012] p-6`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-6 text-center">Live voorbeeld</p>
            <div className="w-[268px] bg-[#07070f] rounded-[34px] border-2 border-white/[0.12] shadow-2xl overflow-hidden">
              <div className="h-7 flex items-center justify-center">
                <div className="w-14 h-1 bg-white/10 rounded-full" />
              </div>
              <div className="px-4 pb-5 min-h-[400px] flex flex-col">
                {questions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-white/20 text-xs text-center px-4">
                    Voeg vragen toe om de preview te zien
                  </div>
                ) : previewStage === 'quiz' && currentQ ? (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="text-[9px] text-white/30">{previewQ + 1} / {questions.length}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-[2px] mb-4">
                      <div className="bg-[#f97316] h-[2px] rounded-full transition-all" style={{ width: `${((previewQ + 1) / questions.length) * 100}%` }} />
                    </div>
                    <p className="text-white text-[13px] font-semibold mb-4 leading-snug">
                      {currentQ.question || <span className="text-white/20 italic">Jouw vraag...</span>}
                    </p>
                    <div className="space-y-2 flex-1">
                      {currentQ.options.filter(Boolean).map((opt, i) => (
                        <div key={i} className="text-left text-[11px] px-3 py-2.5 rounded-lg border border-white/10 text-white/60">{opt}</div>
                      ))}
                      {currentQ.options.filter(Boolean).length === 0 && (
                        <div className="border border-dashed border-white/10 rounded-lg p-3 text-white/15 text-[10px]">Voeg opties toe...</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2">
                      {previewQ > 0
                        ? <button onClick={() => setPreviewQ(p => p - 1)} className="text-white/30 text-[11px]">← Vorige</button>
                        : <div />}
                      <button
                        onClick={() => previewQ < questions.length - 1 ? setPreviewQ(p => p + 1) : setPreviewStage('contact')}
                        className="bg-[#f97316] text-white text-[11px] font-bold px-4 py-2 rounded-lg"
                      >
                        Volgende →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <p className="text-white text-[13px] font-semibold mb-1">Bijna klaar!</p>
                    <p className="text-white/40 text-[10px] mb-3">Laat je gegevens achter.</p>
                    {['Naam', 'E-mail', 'Telefoon (optioneel)'].map(f => (
                      <div key={f} className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 mb-2 text-white/25 text-[10px]">{f}</div>
                    ))}
                    <button className="w-full bg-[#f97316] text-white text-[11px] font-bold py-2.5 rounded-lg mt-1">Versturen →</button>
                    <button onClick={() => { setPreviewStage('quiz'); setPreviewQ(0) }} className="text-center text-white/25 text-[10px] mt-2">← Terug</button>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4 flex items-center justify-center gap-1.5 opacity-30">
                <span className="text-[8px] text-white/50">Powered by</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Vertero" className="h-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /* ─── PUBLISHED ─── */
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Nav />
      <div className="max-w-[520px] mx-auto px-5 pt-12 pb-24">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border border-[#f97316]/25 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Je quiz is klaar. Nog 1 stap.</h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
            Maak je gratis account om hem op je site te zetten en leads te ontvangen.
          </p>
        </div>

        {/* CTA card */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 mb-5">
          <Link
            href="/sign-up?strategy=oauth_google"
            className="flex items-center justify-center gap-2.5 w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition text-sm mb-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Doorgaan met Google
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center justify-center w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-3.5 rounded-xl transition text-sm mb-5"
          >
            Doorgaan met e-mail →
          </Link>
          <p className="text-center text-white/25 text-xs leading-relaxed">
            Geen wachtwoord nodig · Klaar in 30 seconden · Geen creditcard
          </p>
        </div>

        {/* 3 benefits */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '🔗', label: 'Deelbare link' },
            { icon: '💻', label: 'Embed op je site' },
            { icon: '📧', label: 'Leads in je mail' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-[#0d0d1c] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-2xl mb-1.5">{icon}</div>
              <p className="text-white/55 text-xs font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Email callout */}
        <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3.5 mb-5">
          <span className="text-xl flex-shrink-0 mt-0.5">📧</span>
          <p className="text-sm text-white/55 leading-snug">
            Elke lead krijg je <span className="text-white font-semibold">direct in je mail</span> — ook als je op de bouw zit of bij klanten.
          </p>
        </div>

        {/* Locked preview */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-white/[0.07] flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Staat klaar voor je</p>
            <span className="text-white/20 text-xs">🔒</span>
          </div>
          {/* Locked quiz link */}
          <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2 select-none pointer-events-none opacity-40">
            <div className="flex-1 bg-[#07070f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 font-mono truncate blur-[3px]">
              {quizUrl}
            </div>
            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/30">Kopieer</div>
          </div>
          {/* Locked lead example */}
          <div className="px-5 py-4 flex items-center gap-3 select-none pointer-events-none opacity-40">
            <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold blur-[5px] text-white">Pieter de Vries</p>
              <p className="text-xs text-white/40">Nieuwe lead · Verbouwing</p>
            </div>
            <span className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded font-medium flex-shrink-0">🔒 NIEUW</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-6">
          {[
            { q: 'Hoe zet ik dit op mijn website?', a: 'Je krijgt een stukje code dat je 1× plakt. Werkt op elke website — ook WordPress, Squarespace en Wix.' },
            { q: 'Is het gratis?', a: 'Gratis starten. Geen creditcard nodig.' },
            { q: 'Kan ik stoppen wanneer ik wil?', a: 'Altijd. Geen contract, geen opzegtermijn.' },
          ].map((faq, i, arr) => (
            <div key={i} className={`px-5 py-4 ${i < arr.length - 1 ? 'border-b border-white/[0.07]' : ''}`}>
              <p className="text-white/80 text-sm font-semibold mb-1">{faq.q}</p>
              <p className="text-white/40 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <p className="text-center text-white/25 text-xs mb-3">
          Al een account?{' '}
          <Link href="/sign-in" className="text-[#f97316] hover:text-[#ea6c0a] transition font-semibold">
            Inloggen →
          </Link>
        </p>
        <button
          onClick={() => { setStep(1); setQuizName('Mijn quiz'); setSelectedTemplate('leeg'); setQuestions([]); setPublishedSlug('') }}
          className="w-full text-center text-white/20 hover:text-white/40 text-xs transition py-2"
        >
          Nieuwe quiz bouwen
        </button>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="hover:opacity-75 transition">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vertero" className="h-8" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-white/50 text-sm hover:text-white transition hidden sm:block">Inloggen</Link>
          <Link href="/sign-up" className="bg-[#f97316] hover:bg-[#ea6c0a] px-4 py-2 rounded-lg text-sm font-semibold transition">
            Gratis starten
          </Link>
        </div>
      </div>
    </nav>
  )
}
