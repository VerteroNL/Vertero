'use client'

import { useState } from 'react'

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
  config: { questions: Question[]; scoring?: boolean; brandColor?: string }
}

export default function QuizEditor({ quiz: initial, plan }: { quiz: Quiz; plan: 'free' | 'pro' }) {
  const isPro = plan === 'pro'
  const [quiz] = useState<Quiz>(initial)
  const [questions, setQuestions] = useState<Question[]>(initial.config?.questions || [])
  const [scoring, setScoring] = useState(initial.config?.scoring ?? false)
  const [brandColor, setBrandColor] = useState(initial.config?.brandColor ?? '#f97316')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [previewQ, setPreviewQ] = useState(0)
  const [previewStage, setPreviewStage] = useState<'quiz' | 'contact'>('quiz')

  function addQuestion() {
    setQuestions(prev => [...prev, { id: Math.random().toString(36).slice(2), question: '', type: 'multiple', options: ['', ''] }])
  }

  function updateQuestion(qId: string, field: string, value: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, [field]: value } : q))
  }

  function addOption(qId: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q))
  }

  function updateOption(qId: string, index: number, value: string) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, options: q.options.map((o, i) => i === index ? value : o) } : q))
  }

  function removeOption(qId: string, index: number) {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, options: q.options.filter((_, i) => i !== index) } : q))
  }

  function moveOption(qId: string, index: number, direction: -1 | 1) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q
      const opts = [...q.options]
      const target = index + direction
      if (target < 0 || target >= opts.length) return q
      ;[opts[index], opts[target]] = [opts[target], opts[index]]
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
    await fetch(`/api/quiz/${quiz.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { questions, scoring, brandColor } }),
    })
    setSaving(false)
    setSavedAt(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }))
  }

  function copyEmbed() {
    navigator.clipboard.writeText(`<script src="https://vertero.nl/widget.js" data-id="${quiz.slug}"></` + `script>`)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://vertero.nl/quiz/${quiz.slug}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const currentQ = questions[previewQ]

  return (
    <div className="flex flex-col h-full">

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.07] bg-[#07070f]">
        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">{quiz.name}</h1>
          <p className="text-white/30 text-xs font-mono">vertero.nl/quiz/{quiz.slug}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {savedAt && <span className="text-white/30 text-xs hidden sm:block">✓ {savedAt}</span>}
          <a href={`/quiz/${quiz.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Preview
          </a>
          <button onClick={copyLink}
            className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {copiedLink ? 'Gekopieerd!' : 'Deel link'}
          </button>
          <button onClick={copyEmbed}
            className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            {copiedEmbed ? 'Gekopieerd!' : 'Embed code'}
          </button>
          <button onClick={saveQuiz} disabled={saving}
            className="bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
            {saving ? 'Opslaan...' : 'Opslaan →'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT — vragen */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">

            {questions.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center text-white/20 text-sm mb-4">
                Nog geen vragen — voeg er een toe
              </div>
            )}

            <div className="flex flex-col gap-3 mb-3">
              {questions.map((q, qi) => (
                <div key={q.id} className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">

                  {/* Question header */}
                  <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                    <span className="w-6 h-6 rounded-md bg-white/5 text-white/30 text-[11px] font-bold flex items-center justify-center flex-shrink-0">{qi + 1}</span>
                    <input
                      type="text"
                      value={q.question}
                      onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="Typ je vraag hier..."
                      className="flex-1 bg-transparent text-white placeholder-white/20 outline-none text-sm font-medium"
                    />
                    <button onClick={() => removeQuestion(q.id)} className="text-white/15 hover:text-red-400 transition flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  </div>

                  {/* Type tabs */}
                  <div className="flex items-center gap-1 px-5 pb-4">
                    {(['multiple', 'text'] as const).map(t => (
                      <button key={t} onClick={() => updateQuestion(q.id, 'type', t)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition ${q.type === t ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                        {t === 'multiple' ? 'Meerkeuze' : 'Open tekst'}
                      </button>
                    ))}
                  </div>

                  {/* Options */}
                  {q.type === 'multiple' && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2 group">
                            {scoring && (
                              <div className="flex flex-col gap-0.5 flex-shrink-0">
                                <button onClick={() => moveOption(q.id, oi, -1)} disabled={oi === 0} className="text-white/20 hover:text-white disabled:opacity-0 text-[10px] leading-none transition">▲</button>
                                <button onClick={() => moveOption(q.id, oi, 1)} disabled={oi === q.options.length - 1} className="text-white/20 hover:text-white disabled:opacity-0 text-[10px] leading-none transition">▼</button>
                              </div>
                            )}
                            <div className="w-3.5 h-3.5 rounded-full border border-white/15 flex-shrink-0" />
                            <input
                              type="text"
                              value={opt}
                              onChange={e => updateOption(q.id, oi, e.target.value)}
                              placeholder={scoring ? (oi === 0 ? 'Beste antwoord' : oi === q.options.length - 1 ? 'Minste antwoord' : `Optie ${oi + 1}`) : `Optie ${oi + 1}`}
                              className="flex-1 bg-transparent border-b border-white/[0.06] focus:border-white/20 py-1.5 text-sm text-white placeholder-white/20 outline-none transition"
                            />
                            {scoring && <span className="text-[10px] text-white/20 w-8 text-right flex-shrink-0">{q.options.length - oi}pt</span>}
                            {q.options.length > 2 && (
                              <button onClick={() => removeOption(q.id, oi)} className="text-white/10 hover:text-red-400 transition opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3">
                        <button onClick={() => addOption(q.id)} className="text-[11px] text-white/30 hover:text-[#f97316] transition font-semibold flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Optie toevoegen
                        </button>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-[11px] text-white/30">Eigen antwoord</span>
                          <button onClick={() => toggleAllowCustom(q.id)}
                            className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${q.allowCustom ? 'bg-[#f97316]' : 'bg-white/10'}`}>
                            <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${q.allowCustom ? 'translate-x-4' : 'translate-x-0'}`} />
                          </button>
                        </label>
                      </div>
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="border-t border-white/[0.06] px-5 py-4">
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white/20 text-sm italic">
                        Bezoeker typt hier vrij...
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addQuestion}
              className="w-full border border-dashed border-white/10 hover:border-[#f97316]/40 hover:bg-[#f97316]/[0.03] rounded-2xl py-4 text-white/25 hover:text-white/60 text-sm font-semibold transition flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Vraag toevoegen
            </button>
          </div>
        </div>

        {/* RIGHT — instellingen + preview */}
        <div className="hidden lg:flex flex-col w-80 border-l border-white/[0.07] overflow-y-auto bg-[#07070f]">

          {/* Instellingen */}
          <div className="p-5 border-b border-white/[0.07]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-4">Instellingen</p>

            {/* Merkkleur */}
            <div className={`flex items-center justify-between mb-5 ${!isPro ? 'opacity-50' : ''}`}>
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  Merkkleur
                  {!isPro && <span className="text-[9px] font-bold uppercase tracking-widest bg-[#f97316]/20 text-[#f97316] px-1.5 py-0.5 rounded-full">Pro</span>}
                </p>
                <p className="text-white/35 text-xs mt-0.5">{isPro ? 'Knoppen en accenten' : 'Upgrade naar Pro om eigen kleuren te gebruiken'}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg border border-white/10 overflow-hidden relative flex-shrink-0 ${isPro ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  {isPro && <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />}
                  <div className="w-full h-full" style={{ background: brandColor }} />
                </div>
                <span className="text-white/30 text-[11px] font-mono">{brandColor.toUpperCase()}</span>
              </div>
            </div>

            {/* Lead scoring */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lead scoring</p>
                <p className="text-white/35 text-xs mt-0.5">Score op antwoordvolgorde</p>
              </div>
              <button onClick={() => setScoring(s => !s)}
                className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${scoring ? 'bg-[#f97316]' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${scoring ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-4">Live preview</p>

            <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-2xl overflow-hidden">
              {questions.length === 0 ? (
                <div className="p-8 text-center text-white/20 text-xs">
                  Voeg een vraag toe om de preview te zien
                </div>
              ) : previewStage === 'quiz' && currentQ ? (
                <div className="p-4">
                  {/* Progress */}
                  <div className="flex gap-1 mb-4">
                    {questions.map((_, i) => (
                      <div key={i} className="h-[2px] flex-1 rounded-full transition-all"
                        style={{ background: i <= previewQ ? brandColor : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <p className="text-white/30 text-[10px] mb-2">{previewQ + 1} / {questions.length}</p>
                  <p className="text-white text-sm font-semibold mb-3 leading-snug">
                    {currentQ.question || <span className="text-white/20 italic">Jouw vraag...</span>}
                  </p>
                  {currentQ.type === 'multiple' && (
                    <div className="flex flex-col gap-1.5 mb-3">
                      {currentQ.options.filter(Boolean).map((opt, i) => (
                        <div key={i} className="text-[11px] px-3 py-2 rounded-lg border border-white/10 text-white/50">{opt}</div>
                      ))}
                    </div>
                  )}
                  {currentQ.type === 'text' && (
                    <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white/20 text-[11px] mb-3">Vrij antwoord...</div>
                  )}
                  <div className="flex items-center justify-between">
                    {previewQ > 0
                      ? <button onClick={() => setPreviewQ(p => p - 1)} className="text-white/30 text-[11px]">← Vorige</button>
                      : <div />}
                    <button
                      onClick={() => previewQ < questions.length - 1 ? setPreviewQ(p => p + 1) : setPreviewStage('contact')}
                      className="text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: brandColor }}>
                      Volgende →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-white text-sm font-semibold mb-1">Bijna klaar!</p>
                  <p className="text-white/30 text-[11px] mb-3">Contactgegevens invullen</p>
                  {['Naam', 'E-mail', 'Adres'].map(f => (
                    <div key={f} className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white/20 text-[11px] mb-1.5">{f}</div>
                  ))}
                  <div className="flex items-center justify-between mt-3">
                    <button onClick={() => { setPreviewStage('quiz'); setPreviewQ(0) }} className="text-white/30 text-[11px]">← Terug</button>
                    <button className="text-white text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: brandColor }}>Versturen →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Statistieken */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{questions.length}</p>
                <p className="text-white/30 text-[11px]">vragen</p>
              </div>
              <div className="bg-[#0d0d1c] border border-white/[0.08] rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{questions.filter(q => q.type === 'multiple').reduce((s, q) => s + q.options.filter(Boolean).length, 0)}</p>
                <p className="text-white/30 text-[11px]">antwoorden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
