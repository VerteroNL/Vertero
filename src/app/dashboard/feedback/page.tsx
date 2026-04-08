'use client'

import { useState } from 'react'

type FeedbackType = 'algemeen' | 'bug' | 'feature'

const types: { value: FeedbackType; label: string; icon: string; desc: string }[] = [
  { value: 'algemeen', label: 'Algemene feedback', icon: '💬', desc: 'Deel je ervaring of een algemene opmerking' },
  { value: 'bug', label: 'Bug melden', icon: '🐛', desc: 'Iets werkt niet zoals verwacht' },
  { value: 'feature', label: 'Feature request', icon: '✨', desc: 'Ik mis een functie of heb een idee' },
]

export default function FeedbackPage() {
  const [selected, setSelected] = useState<FeedbackType | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!selected || !message.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selected, message }),
      })

      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🙌</div>
          <h2 className="text-xl font-bold mb-2">Bedankt voor je feedback!</h2>
          <p className="text-white/40 text-sm">We lezen alles en gebruiken het om Vertero beter te maken.</p>
          <button
            onClick={() => { setDone(false); setSelected(null); setMessage('') }}
            className="mt-6 text-xs text-[#6c5ce7] hover:text-[#7d6ef5] font-semibold transition"
          >
            Nog iets insturen →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl italic">Feedback</h1>
        <p className="text-white/40 text-sm mt-1">Help ons Vertero beter te maken</p>
      </div>

      {/* Type selectie */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelected(type.value)}
            className={`text-left p-4 rounded-2xl border transition ${
              selected === type.value
                ? 'border-[#6c5ce7] bg-[#6c5ce7]/10'
                : 'border-white/10 bg-[#0d0d1c] hover:border-white/20'
            }`}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <div className="font-semibold text-sm mb-1">{type.label}</div>
            <div className="text-white/40 text-xs leading-relaxed">{type.desc}</div>
          </button>
        ))}
      </div>

      {/* Tekstveld */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6 mb-4">
        <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3 block">
          Jouw bericht
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            selected === 'bug'
              ? 'Beschrijf wat er mis ging en hoe we het kunnen reproduceren...'
              : selected === 'feature'
              ? 'Welke functie mis je? Wat zou het voor jou oplossen?'
              : 'Deel je gedachten, ervaringen of suggesties...'
          }
          rows={6}
          className="w-full bg-transparent text-sm text-white placeholder-white/20 resize-none outline-none leading-relaxed"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-4">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || !message.trim() || loading}
        className="bg-[#6c5ce7] hover:bg-[#7d6ef5] disabled:opacity-30 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-sm transition"
      >
        {loading ? 'Versturen...' : 'Feedback versturen →'}
      </button>
    </div>
  )
}