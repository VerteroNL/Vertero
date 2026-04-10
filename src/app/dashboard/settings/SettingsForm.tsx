'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  initialEmailOnNewLead: boolean
}

export default function SettingsForm({ initialEmailOnNewLead }: Props) {
  const router = useRouter()
  const [emailOnNewLead, setEmailOnNewLead] = useState(initialEmailOnNewLead)
  const [savingNotif, setSavingNotif] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function toggleEmailOnNewLead() {
    const next = !emailOnNewLead
    setEmailOnNewLead(next)
    setSavingNotif(true)
    await fetch('/api/user/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_on_new_lead: next }),
    })
    setSavingNotif(false)
  }

  async function deleteAccount() {
    if (deleteConfirm !== 'VERWIJDER') return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.push('/')
    } catch {
      setDeleteError('Er ging iets mis. Probeer het opnieuw.')
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Notificaties */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-bold mb-4">Notificaties</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">E-mail bij nieuwe lead</p>
            <p className="text-white/40 text-xs mt-0.5">Ontvang een e-mail zodra er een nieuwe lead binnenkomt</p>
          </div>
          <button
            onClick={toggleEmailOnNewLead}
            disabled={savingNotif}
            className={`relative w-11 h-6 rounded-full transition-colors ${emailOnNewLead ? 'bg-[#f97316]' : 'bg-white/10'}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailOnNewLead ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Gevaarzone */}
      <div className="bg-[#0d0d1c] border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-red-400 mb-1">Gevaarzone</h2>
        <p className="text-white/40 text-xs mb-4">Dit verwijdert je account en alle bijbehorende data permanent</p>
        <button
          onClick={() => setDeleteModal(true)}
          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          Account verwijderen
        </button>
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-lg font-extrabold mb-2">Weet je het zeker?</h3>
            <p className="text-white/40 text-sm mb-6">
              Dit verwijdert permanent: al je quizzes, leads, en je account. Dit kan niet ongedaan worden gemaakt.
            </p>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2 block">
              Typ VERWIJDER om te bevestigen
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-red-500/50"
              placeholder="VERWIJDER"
            />
            {deleteError && <p className="text-red-400 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(false); setDeleteConfirm(''); setDeleteError('') }}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Annuleren
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirm !== 'VERWIJDER' || deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                {deleting ? 'Verwijderen...' : 'Verwijder alles'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
