export default function SettingsPage() {
  const name = process.env.OWNER_NAME ?? 'Eigenaar'
  const email = process.env.OWNER_EMAIL ?? ''

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Account</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Instellingen</h1>
        <p className="text-white/40 text-sm mt-1">Beheer je account en voorkeuren</p>
      </div>

      <div className="px-6 py-6 max-w-2xl">
        <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-bold mb-4">Profiel</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-sm">Naam</span>
              <span className="text-sm font-medium">{name}</span>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-sm">E-mailadres</span>
              <span className="text-sm font-medium">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
