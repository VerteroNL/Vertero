'use client'

import { useState, useRef } from 'react'

interface Question {
  id: string
  question: string
  type: 'multiple' | 'text' | 'photo'
  options: string[]
  allowCustom?: boolean
  branches?: Record<number, string>
  defaultBranch?: string
  placeholder?: string
  maxPhotos?: number
}

interface ContactFieldConfig {
  key: string
  enabled: boolean
  required: boolean
}

interface Quiz {
  id: string
  name: string
  slug: string
  config: { questions: Question[]; brandColor?: string; contactFields?: ContactFieldConfig[]; theme?: 'dark' | 'light' }
}

const DEFAULT_CONTACT_FIELDS: ContactFieldConfig[] = [
  { key: 'name',     enabled: true, required: true  },
  { key: 'email',    enabled: true, required: true  },
  { key: 'phone',    enabled: true, required: false },
  { key: 'street',   enabled: true, required: true  },
  { key: 'postcode', enabled: true, required: true  },
  { key: 'city',     enabled: true, required: true  },
]

const FIELD_LABELS: Record<string, string> = {
  name: 'Naam', email: 'E-mailadres', phone: 'Telefoon',
  street: 'Straat', postcode: 'Postcode', city: 'Woonplaats',
}

const FIELD_PLACEHOLDERS: Record<string, string> = {
  name: 'Jan Jansen', email: 'jan@bedrijf.nl', phone: '+31 6 12345678',
  street: 'Voorbeeldstraat', postcode: '1234 AB', city: 'Amsterdam',
}

const FIELD_TYPES: Record<string, string> = {
  name: 'text', email: 'email', phone: 'tel',
  street: 'text', postcode: 'text', city: 'text',
}

async function compressAndUpload(file: File): Promise<string> {
  const MAX = 1200
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h)
  const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.75))
  const form = new FormData()
  form.append('file', blob, 'photo.jpg')
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  const data = await res.json()
  if (!data.url) throw new Error('Upload mislukt')
  return data.url
}

async function pdokLookup(postcode: string, huisnummer: string): Promise<{ straat: string; stad: string } | null> {
  try {
    const q = encodeURIComponent(`${postcode} ${huisnummer}`)
    const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${q}&fq=type:adres&rows=1`)
    const data = await res.json()
    const doc = data?.response?.docs?.[0]
    if (!doc?.straatnaam) return null
    return { straat: doc.straatnaam, stad: doc.woonplaatsnaam }
  } catch { return null }
}

function resolveNext(q: Question, answer: string, questions: Question[]): number | 'contact' {
  const targetId = (q.type === 'text' || q.type === 'photo')
    ? q.defaultBranch
    : q.branches?.[q.options.indexOf(answer)]
  if (targetId === '__contact__') return 'contact'
  if (targetId) {
    const idx = questions.findIndex(q2 => q2.id === targetId)
    if (idx !== -1) return idx
  }
  const cur = questions.findIndex(q2 => q2.id === q.id)
  return cur < questions.length - 1 ? cur + 1 : 'contact'
}

export default function QuizClient({ quiz, showPoweredBy = true }: { quiz: Quiz; showPoweredBy?: boolean }) {
  const brand = quiz.config?.brandColor || '#f97316'
  const isLight = quiz.config?.theme === 'light'
  const c = isLight ? {
    page: 'bg-[#f0f0f2]',
    card: 'bg-white border-black/[0.08]',
    title: 'text-gray-900',
    sub: 'text-gray-500',
    opt: 'border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    progress: 'bg-black/8',
    back: 'text-gray-500 hover:text-gray-900',
    label: 'text-gray-600',
    powered: 'text-gray-400',
    readonly: 'bg-gray-50 border-gray-200 text-gray-500',
  } : {
    page: 'bg-[#07070f]',
    card: 'bg-[#0d0d1c] border-white/10',
    title: 'text-white',
    sub: 'text-white/40',
    opt: 'border-white/10 text-white/60 hover:border-white/20 hover:text-white',
    input: 'bg-[#07070f] border-white/10 text-white placeholder-white/20',
    progress: 'bg-white/5',
    back: 'text-white/40 hover:text-white',
    label: 'text-white/40',
    powered: 'text-white/25',
    readonly: 'bg-[#050508] border-white/5 text-white/30',
  }

  const activeFields = (quiz.config?.contactFields ?? DEFAULT_CONTACT_FIELDS).filter(f => f.enabled)
  const requiredKeys = activeFields.filter(f => f.required).map(f => f.key)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<number[]>([0])
  const [stage, setStage] = useState<'quiz' | 'contact' | 'done'>('quiz')
  const [contact, setContact] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [contactError, setContactError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({})
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [housenumber, setHousenumber] = useState('')
  const [lookupStreet, setLookupStreet] = useState('')
  const [lookupCity, setLookupCity] = useState('')
  const [lookupFound, setLookupFound] = useState(false)
  const [lookupManual, setLookupManual] = useState(false)
  const [lookupLoading, setLookupLoading] = useState(false)

  const questions = quiz.config?.questions || []
  const current = history[history.length - 1]
  const q = questions[current]

  const hasPostcode = activeFields.some(f => f.key === 'postcode')
  const hasStreet = activeFields.some(f => f.key === 'street')
  const hasCity = activeFields.some(f => f.key === 'city')

  async function triggerLookup() {
    const pc = contact.postcode?.trim()
    if (!pc || !housenumber.trim()) return
    setLookupLoading(true)
    const result = await pdokLookup(pc, housenumber.trim())
    setLookupLoading(false)
    if (result) {
      setLookupStreet(result.straat)
      setLookupCity(result.stad)
      setLookupFound(true)
      setLookupManual(false)
    }
  }

  function fieldError(key: string) {
    if (key === 'street') {
      if (!touched.street) return false
      if (!requiredKeys.includes('street')) return false
      return !(lookupFound && !lookupManual ? lookupStreet : contact.street)?.trim()
    }
    if (key === 'city') {
      if (!touched.city) return false
      if (!requiredKeys.includes('city')) return false
      return !(lookupFound && !lookupManual ? lookupCity : contact.city)?.trim()
    }
    return touched[key] && requiredKeys.includes(key) && !contact[key]?.trim()
  }

  function emailError() {
    if (!touched.email) return null
    if (!contact.email?.trim()) return requiredKeys.includes('email') ? 'Vul je e-mailadres in' : null
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) return 'Vul een geldig e-mailadres in'
    return null
  }

  function handleNext() {
    const next = resolveNext(q, answers[q.id] || '', questions)
    if (next === 'contact') setStage('contact')
    else setHistory(h => [...h, next])
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const maxPhotos = q.maxPhotos || 5
    const existing = photoUrls[q.id] || []
    const toUpload = files.slice(0, maxPhotos - existing.length)
    if (!toUpload.length) return
    setUploading(true)
    const urls: string[] = []
    for (const f of toUpload) {
      try { urls.push(await compressAndUpload(f)) } catch { /* skip */ }
    }
    const next = [...existing, ...urls]
    setPhotoUrls(p => ({ ...p, [q.id]: next }))
    setAnswers(p => ({ ...p, [q.id]: next.join(',') }))
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removePhoto(qId: string, idx: number) {
    const next = (photoUrls[qId] || []).filter((_, i) => i !== idx)
    setPhotoUrls(p => ({ ...p, [qId]: next }))
    setAnswers(p => ({ ...p, [qId]: next.join(',') }))
  }

  async function submit() {
    const allTouched = Object.fromEntries(activeFields.map(f => [f.key, true]))
    setTouched(p => ({ ...p, ...allTouched }))

    const streetVal = (lookupFound && !lookupManual)
      ? `${lookupStreet} ${housenumber}`.trim()
      : contact.street || ''
    const cityVal = (lookupFound && !lookupManual) ? lookupCity : contact.city || ''

    const missing: string[] = []
    for (const f of activeFields) {
      if (!f.required) continue
      if (f.key === 'email') {
        if (!contact.email?.trim()) missing.push('e-mailadres')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) missing.push('geldig e-mailadres')
      } else if (f.key === 'street') {
        if (!streetVal.trim()) missing.push('straat')
      } else if (f.key === 'city') {
        if (!cityVal.trim()) missing.push('woonplaats')
      } else if (!contact[f.key]?.trim()) {
        missing.push(FIELD_LABELS[f.key]?.toLowerCase() || f.key)
      }
    }

    if (missing.length > 0) {
      setContactError(`Vul alsjeblieft in: ${missing.join(', ')}.`)
      return
    }

    setContactError(null)
    setSubmitting(true)
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: quiz.slug,
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        street: streetVal,
        postcode: contact.postcode || '',
        city: cityVal,
        answers
      })
    })
    setSubmitting(false)
    setStage('done')
  }

  if (stage === 'done') return (
    <div className={`min-h-screen ${c.page} flex flex-col items-center justify-center`}>
      <div className="text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className={`text-2xl font-bold ${c.title} mb-2`}>Bedankt!</h2>
        <p className={`${c.sub} text-sm`}>Je antwoorden zijn ontvangen.</p>
      </div>
      <PoweredBy isLight={isLight} />
    </div>
  )

  if (questions.length === 0) return (
    <div className={`min-h-screen ${c.page} flex items-center justify-center ${c.sub}`}>
      Deze quiz heeft nog geen vragen.
    </div>
  )

  if (stage === 'contact') return (
    <div className={`min-h-screen ${c.page} flex items-center justify-center p-4 sm:p-6`}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${c.title} mb-2`}>Bijna klaar!</h1>
          <p className={`${c.sub} text-sm`}>Laat je gegevens achter zodat we contact kunnen opnemen.</p>
        </div>

        <div className={`${c.card} border rounded-2xl p-6 sm:p-8 mb-6 flex flex-col gap-4`}>
          {activeFields.map(f => {
            if (f.key === 'postcode' && hasPostcode) return (
              <div key="postcode-row">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                      Postcode{f.required && <span className="text-[#f97316] ml-1">*</span>}
                    </label>
                    <input type="text" value={contact.postcode || ''}
                      onChange={e => { setContact(p => ({ ...p, postcode: e.target.value })); setLookupFound(false) }}
                      onBlur={() => { setTouched(p => ({ ...p, postcode: true })); triggerLookup() }}
                      placeholder="1234 AB"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${c.input} ${fieldError('postcode') ? 'border-red-400' : ''}`} />
                  </div>
                  <div>
                    <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                      Huisnr.{f.required && <span className="text-[#f97316] ml-1">*</span>}
                    </label>
                    <input type="text" value={housenumber}
                      onChange={e => { setHousenumber(e.target.value); setLookupFound(false) }}
                      onBlur={() => triggerLookup()}
                      placeholder="12"
                      className={`w-full border rounded-xl px-4 py-3 outline-none transition ${c.input}`} />
                  </div>
                </div>
                {lookupLoading && <p className={`${c.sub} text-xs mt-1.5`}>Adres opzoeken…</p>}
              </div>
            )

            if (f.key === 'street' && hasStreet) return (
              <div key="street">
                <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                  Straat{f.required && <span className="text-[#f97316] ml-1">*</span>}
                  {lookupFound && !lookupManual && (
                    <button onClick={() => setLookupManual(true)}
                      className={`ml-2 normal-case font-normal ${isLight ? 'text-gray-400' : 'text-white/25'} hover:underline`}>
                      Klopt niet?
                    </button>
                  )}
                </label>
                <input type="text"
                  value={lookupFound && !lookupManual ? lookupStreet : contact.street || ''}
                  readOnly={lookupFound && !lookupManual}
                  onChange={e => setContact(p => ({ ...p, street: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, street: true }))}
                  placeholder={FIELD_PLACEHOLDERS.street}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition ${lookupFound && !lookupManual ? c.readonly : c.input} ${fieldError('street') ? 'border-red-400' : ''}`} />
                {fieldError('street') && <p className="text-red-400 text-xs mt-1.5">Vul dit veld in</p>}
              </div>
            )

            if (f.key === 'city' && hasCity) return (
              <div key="city">
                <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                  Woonplaats{f.required && <span className="text-[#f97316] ml-1">*</span>}
                </label>
                <input type="text"
                  value={lookupFound && !lookupManual ? lookupCity : contact.city || ''}
                  readOnly={lookupFound && !lookupManual}
                  onChange={e => setContact(p => ({ ...p, city: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, city: true }))}
                  placeholder={FIELD_PLACEHOLDERS.city}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition ${lookupFound && !lookupManual ? c.readonly : c.input} ${fieldError('city') ? 'border-red-400' : ''}`} />
                {fieldError('city') && <p className="text-red-400 text-xs mt-1.5">Vul dit veld in</p>}
              </div>
            )

            return (
              <div key={f.key}>
                <label className={`${c.label} text-xs font-semibold uppercase tracking-widest mb-2 block`}>
                  {FIELD_LABELS[f.key] || f.key}
                  {f.required
                    ? <span className="text-[#f97316] ml-1">*</span>
                    : <span className={`${isLight ? 'text-gray-400' : 'text-white/20'} normal-case font-normal ml-1`}>(optioneel)</span>
                  }
                </label>
                <input
                  type={FIELD_TYPES[f.key] || 'text'}
                  value={contact[f.key] || ''}
                  onChange={e => setContact(p => ({ ...p, [f.key]: e.target.value }))}
                  onBlur={() => setTouched(p => ({ ...p, [f.key]: true }))}
                  placeholder={FIELD_PLACEHOLDERS[f.key] || ''}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition ${c.input} ${
                    (f.key === 'email' ? emailError() : fieldError(f.key)) ? 'border-red-400 focus:border-red-500' : ''
                  }`}
                />
                {f.key === 'email' && emailError() && <p className="text-red-400 text-xs mt-1.5">{emailError()}</p>}
                {f.key !== 'email' && fieldError(f.key) && <p className="text-red-400 text-xs mt-1.5">Vul dit veld in</p>}
              </div>
            )
          })}
        </div>

        {contactError && <p className="text-red-400 text-sm mb-4">{contactError}</p>}

        <div className="grid grid-cols-3 items-center">
          <button onClick={() => setStage('quiz')} className={`${c.back} text-sm transition justify-self-start`}>
            ← Terug
          </button>
          {showPoweredBy && <PoweredBy isLight={isLight} />}
          <button onClick={submit} disabled={submitting}
            className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            style={{ background: brand }}>
            {submitting ? 'Versturen...' : 'Versturen →'}
          </button>
        </div>
      </div>
    </div>
  )

  const photos = photoUrls[q?.id] || []
  const maxPhotos = q?.maxPhotos || 5

  return (
    <div className={`min-h-screen ${c.page} flex items-center justify-center p-4 sm:p-6`}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${c.title} mb-1`}>{quiz.name}</h1>
          <p className={`${c.sub} text-sm`}>{history.length} / {questions.length}</p>
        </div>

        <div className={`w-full ${c.progress} rounded-full h-1 mb-8`}>
          <div className="h-1 rounded-full transition-all" style={{ width: `${(history.length / questions.length) * 100}%`, background: brand }} />
        </div>

        <div className={`${c.card} border rounded-2xl p-6 sm:p-8 mb-6`}>
          <h2 className={`${c.title} text-xl font-semibold mb-6`}>{q.question}</h2>

          {(q.type === 'multiple' || !q.type) && (
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${c.opt}`}
                  style={answers[q.id] === opt ? { borderColor: `${brand}99`, background: `${brand}18`, color: isLight ? '#111' : '#fff' } : {}}>
                  {opt}
                </button>
              ))}
              {q.allowCustom && (() => {
                const isCustomSelected = answers[q.id] !== undefined && !q.options.includes(answers[q.id])
                return (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: isCustomSelected ? prev[q.id] : '' }))}
                      className="flex items-center gap-3 px-1 py-1 text-sm transition">
                      <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ borderColor: isCustomSelected ? brand : isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }}>
                        {isCustomSelected && <span className="w-2 h-2 rounded-full" style={{ background: brand }} />}
                      </span>
                      <span style={{ color: isCustomSelected ? (isLight ? '#111' : '#fff') : isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)' }}>
                        Anders, namelijk...
                      </span>
                    </button>
                    {isCustomSelected && (
                      <input type="text" autoFocus value={answers[q.id]}
                        onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Typ je antwoord..."
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition ${c.input}`} />
                    )}
                  </div>
                )
              })()}
            </div>
          )}

          {q.type === 'text' && (
            <textarea value={answers[q.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder={q.placeholder || 'Typ je antwoord...'} rows={4}
              className={`w-full border rounded-xl px-4 py-3 outline-none transition resize-none ${c.input}`} />
          )}

          {q.type === 'photo' && (
            <div className="flex flex-col gap-3">
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map((url, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                      <button onClick={() => removePhoto(q.id, i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center leading-none">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length < maxPhotos && (
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition ${isLight ? 'border-gray-200 hover:border-gray-400' : 'border-white/10 hover:border-white/25'}`}
                  style={uploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                  <span className="text-3xl">📷</span>
                  <span className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/40'}`}>
                    {uploading ? 'Uploaden...' : `Foto toevoegen (${photos.length}/${maxPhotos})`}
                  </span>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={handlePhotoChange} />
                </label>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 items-center">
          {history.length > 1 ? (
            <button onClick={() => setHistory(h => h.slice(0, -1))} className={`${c.back} text-sm transition justify-self-start`}>
              ← Vorige
            </button>
          ) : <div />}
          {showPoweredBy && <PoweredBy isLight={isLight} />}
          <button onClick={handleNext} disabled={!answers[q.id] || uploading}
            className="justify-self-end disabled:opacity-30 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
            style={{ background: brand }}>
            Volgende →
          </button>
        </div>
      </div>
    </div>
  )
}

function PoweredBy({ isLight = false }: { isLight?: boolean }) {
  return (
    <a href="https://vertero.nl" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
      <span className={`${isLight ? 'text-gray-400' : 'text-white/25'} text-[11px] font-medium tracking-wide`}>Powered by</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={isLight ? '/LogoInColor.png' : '/logo.png'} alt="Vertero" className={`h-[11px] ${isLight ? '' : 'opacity-40'}`} />
    </a>
  )
}
