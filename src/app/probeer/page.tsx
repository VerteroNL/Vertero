'use client'

import { useState, useEffect } from 'react'
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

const FAKE_LEADS = [
  { name: 'Pieter de Vries', tag: 'Verbouwing' },
  { name: 'Sandra Bakker', tag: 'Offerte aangevraagd' },
  { name: 'Mark Janssen', tag: 'Airco installatie' },
  { name: 'Lisa van den Berg', tag: 'Schilderwerk' },
]

interface Question {
  id: string
  question: string
  options: string[]
}

type Step = 1 | 2 | 'published'

export default function ProbeerPage() {
  const [step, setStep] = useState<Step>(1)
  const [quizName, setQuizName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('leeg')
  const [questions, setQuestions] = useState<Question[]>([])
  const [publishing, setPublishing] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'bouwen' | 'preview'>('bouwen')
  const [previewQ, setPreviewQ] = useState(0)
  const [previewStage, setPreviewStage] = useState<'quiz' | 'contact'>('quiz')
  const [showNotification, setShowNotification] = useState(false)
  const [notifIdx, setNotifIdx] = useState(0)

  useEffect(() => {
    if (step !== 'published') return
    const t1 = setTimeout(() => setShowNotification(true), 1800)
    const t2 = setInterval(() => setNotifIdx(i => (i + 1) % FAKE_LEADS.length), 3200)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [step])

  // Reset preview when questions change

  function goToStep2() {
    if (!quizName.trim()) return
    const template = TEMPLATES.find(t => t.id === selectedTemplate)
    setQuestions((template?.questions || []).map(q => ({
      id: Math.random().toString(36).slice(2),
      question: q.question,
      options: [...q.options],
    })))
    setPreviewQ(0)
    setPreviewStage('quiz')
    setStep(2)
  }

  function addQuestion() {
    if (questions.length >= 5) return
    setQuestions(prev => [...prev, { id: Math.random().toString(36).slice(2), question: '', options: ['', ''] }])
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

  function copyLink() {
    const url = `${window.location.origin}/quiz/${publishedSlug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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
          Gratis · Klaar in 2 minuten
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
          Maak je eigen<br />leadquiz
        </h1>
        <p className="text-white/50 text-base mb-10 leading-relaxed">
          Bouw een quiz, deel hem en ontvang serieuze aanvragen. Zonder account.
        </p>

        <div className="mb-7">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
            Hoe heet je quiz?
          </label>
          <input
            type="text"
            autoFocus
            value={quizName}
            onChange={e => setQuizName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && goToStep2()}
            placeholder='bijv. "Offerte zonnepanelen"'
            className="w-full bg-[#0d0d1c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 outline-none focus:border-[#f97316]/50 transition text-base"
          />
        </div>

        <div className="mb-8">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-3">
            Kies een startpunt
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`border rounded-xl p-4 text-left transition ${selectedTemplate === t.id ? 'border-[#f97316] bg-[#f97316]/5' : 'border-white/10 hover:border-white/20 bg-[#0d0d1c]'}`}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-sm leading-tight mb-0.5">{t.name}</div>
                <div className="text-white/35 text-xs">{t.questions.length > 0 ? `${t.questions.length} vragen meegeleverd` : 'Zelf bouwen'}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={goToStep2}
          disabled={!quizName.trim()}
          className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-base"
        >
          Doorgaan →
        </button>

        <div className="flex items-center justify-center gap-5 mt-6 text-white/25 text-xs">
          <span>✓ Direct live</span>
        </div>
      </div>
    </div>
  )

  /* ─── STEP 2 ─── */
  if (step === 2) return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Nav />

      {/* Sub-header */}
      <div className="border-b border-white/[0.07] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setStep(1)} className="text-white/35 hover:text-white text-sm transition flex-shrink-0">← Terug</button>
          <span className="text-white/20 text-sm flex-shrink-0">|</span>
          <span className="text-sm font-semibold text-white/80 truncate">{quizName}</span>
        </div>
        {/* Mobile tabs */}
        <div className="flex md:hidden bg-white/5 rounded-lg p-1 gap-1 flex-shrink-0">
          {(['bouwen', 'preview'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition capitalize ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40'}`}>
              {tab === 'bouwen' ? 'Bouwen' : 'Preview'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* LEFT: Builder */}
        <div className={`${activeTab === 'preview' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-[54%] border-r border-white/[0.07] min-h-0`}>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                className="w-full border border-dashed border-white/[0.12] hover:border-white/25 rounded-xl py-3.5 text-sm text-white/35 hover:text-white/60 transition"
              >
                + Vraag toevoegen
              </button>
            ) : (
              <p className="text-center text-white/25 text-xs py-1">
                Maximum van 5 vragen bereikt ·{' '}
                <Link href="/sign-up" className="text-[#f97316] hover:text-[#ea6c0a] transition">Meer? Maak een account</Link>
              </p>
            )}
          </div>

          {/* Sticky publish */}
          <div className="border-t border-white/[0.07] p-4 sm:p-5 flex-shrink-0">
            <button
              onClick={publish}
              disabled={publishing || !canPublish}
              className="w-full bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition"
            >
              {publishing ? 'Publiceren...' : 'Publiceer gratis →'}
            </button>
            <p className="text-center text-white/25 text-xs mt-2">Geen account vereist</p>
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div className={`${activeTab === 'bouwen' ? 'hidden' : 'flex'} md:flex flex-col flex-1 items-center justify-center bg-white/[0.012] p-6 overflow-y-auto`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-6">Live voorbeeld</p>

          {/* Phone frame */}
          <div className="w-[268px] bg-[#07070f] rounded-[34px] border-2 border-white/[0.12] shadow-2xl overflow-hidden">
            {/* Notch */}
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-white/30">{previewQ + 1} / {questions.length}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-[2px] mb-4">
                    <div className="bg-[#f97316] h-[2px] rounded-full transition-all" style={{ width: `${((previewQ + 1) / questions.length) * 100}%` }} />
                  </div>
                  <p className="text-white text-[13px] font-semibold mb-4 leading-snug flex-shrink-0">
                    {currentQ.question || <span className="text-white/20 italic">Jouw vraag...</span>}
                  </p>
                  <div className="space-y-2 flex-1">
                    {currentQ.options.filter(Boolean).map((opt, i) => (
                      <div key={i} className="text-left text-[11px] px-3 py-2.5 rounded-lg border border-white/10 text-white/60">
                        {opt}
                      </div>
                    ))}
                    {currentQ.options.filter(Boolean).length === 0 && (
                      <div className="border border-dashed border-white/10 rounded-lg p-3 text-white/15 text-[10px]">Voeg opties toe...</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2">
                    {previewQ > 0
                      ? <button onClick={() => setPreviewQ(p => p - 1)} className="text-white/30 text-[11px]">← Vorige</button>
                      : <div />
                    }
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
  )

  /* ─── PUBLISHED ─── */
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <Nav />
      <div className="max-w-[520px] mx-auto px-5 pt-12 pb-24">

        {/* Success badge */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Je quiz staat live!</h1>
          <p className="text-white/40 text-sm">Deel de link en ontvang je eerste leads</p>
        </div>

        {/* Share link card */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-5 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Jouw quizlink</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-[#07070f] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/50 font-mono truncate">
              {quizUrl}
            </div>
            <button
              onClick={copyLink}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition ${copied ? 'bg-green-500/15 text-green-400 border border-green-500/25' : 'bg-[#f97316] hover:bg-[#ea6c0a] text-white'}`}
            >
              {copied ? '✓' : 'Kopieer'}
            </button>
          </div>
          <a href={`/quiz/${publishedSlug}`} target="_blank" rel="noopener noreferrer"
            className="text-[11px] text-white/25 hover:text-[#f97316] transition inline-flex items-center gap-1">
            Quiz bekijken ↗
          </a>
        </div>

        {/* Fake lead notification */}
        <div className={`transition-all duration-700 ${showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} mb-4`}>
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f97316]">Voorbeeld — zo ziet een echte lead eruit</p>
          </div>
          <div className="bg-[#0d0d1c] border border-[#f97316]/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{FAKE_LEADS[notifIdx].name}</p>
              <p className="text-xs text-white/40 truncate">Nieuwe lead · {FAKE_LEADS[notifIdx].tag}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-white/20">nu</span>
              <span className="text-[9px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded font-medium">TEST</span>
            </div>
          </div>
        </div>

        {/* Main CTA card */}
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl overflow-hidden mb-4">
          <div className="px-6 pt-7 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f97316] mb-3">Volgende stap</p>
            <h2 className="text-[22px] font-extrabold leading-tight mb-3">
              Meld je aan om<br />je leads te bekijken
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Zodra iemand je quiz invult, sla je de lead op in jouw persoonlijk dashboard. Geen lead gaat verloren.
            </p>

            {/* Progress steps */}
            <div className="flex items-center gap-0 mb-7">
              {[
                { label: 'Quiz gebouwd', state: 'done' },
                { label: 'Leads ontvangen', state: 'current' },
                { label: 'Leads bekijken', state: 'todo' },
              ].map((s, i) => (
                <div key={i} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      s.state === 'done' ? 'bg-green-500/15 border-green-500/30 text-green-400'
                      : s.state === 'current' ? 'bg-[#f97316]/15 border-[#f97316]/30 text-[#f97316]'
                      : 'bg-white/[0.04] border-white/10 text-white/25'
                    }`}>
                      {s.state === 'done' ? '✓' : i + 1}
                    </div>
                    <span className={`text-[9px] font-semibold mt-1 text-center leading-tight ${
                      s.state === 'done' ? 'text-green-400' : s.state === 'current' ? 'text-white/70' : 'text-white/25'
                    }`}>{s.label}</span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px bg-white/10 mx-2 mb-3" />}
                </div>
              ))}
            </div>

            <Link
              href={`/sign-up`}
              className="block w-full text-center bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold py-4 rounded-xl transition text-base"
            >
              Maak gratis account →
            </Link>

            <div className="flex items-center justify-center gap-5 mt-4">
              {['Gratis starten', '2 minuten'].map(t => (
                <span key={t} className="text-[10px] text-white/30 flex items-center gap-1">
                  <span className="text-green-500 text-[10px]">✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.07] px-6 py-3.5 flex items-center justify-center gap-1.5 text-xs text-white/30">
            Al een account?
            <Link href="/sign-in" className="text-[#f97316] hover:text-[#ea6c0a] transition font-semibold ml-1">
              Inloggen →
            </Link>
          </div>
        </div>

        <button
          onClick={() => { setStep(1); setQuizName(''); setQuestions([]); setPublishedSlug(''); setShowNotification(false) }}
          className="w-full text-center text-white/25 hover:text-white/50 text-sm transition py-2"
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
