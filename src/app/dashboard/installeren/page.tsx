'use client'

import { useState } from 'react'

const SCRIPT_TAG = `<script src="https://vertero.nl/widget.js" data-id="JOUW-QUIZ-ID" data-label="Vraag een offerte aan"></scr` + `ipt>`
const SCRIPT_TAG_NO_ID = `<script src="https://vertero.nl/widget.js"></scr` + `ipt>`
const BUTTON_EXAMPLE = `<button onclick="Vertero.open('JOUW-QUIZ-ID')">
  Vraag een offerte aan
</button>`
const BUTTON_COMBO = `<!-- Script met floating knop -->
<script src="https://vertero.nl/widget.js" data-id="JOUW-QUIZ-ID"></scr` + `ipt>

<!-- Eigen knop ergens op de pagina -->
<button onclick="Vertero.open('JOUW-QUIZ-ID')">
  Vraag een offerte aan
</button>`

const platforms = [
  { id: 'wordpress', label: 'WordPress' },
  { id: 'wix', label: 'Wix' },
  { id: 'squarespace', label: 'Squarespace' },
  { id: 'webflow', label: 'Webflow' },
  { id: 'jimdo', label: 'Jimdo' },
  { id: 'html', label: 'HTML' },
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative bg-[#07070f] border border-white/10 rounded-xl p-4 pr-24 my-4">
      <code className="text-[#f97316] text-xs font-mono break-all leading-relaxed whitespace-pre-wrap">{code}</code>
      <button
        onClick={copy}
        className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1.5 rounded-lg transition"
      >
        {copied ? '✓ Klaar' : 'Kopieer'}
      </button>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316] text-xs font-bold mt-0.5">
        {number}
      </div>
      <div className="flex-1 pb-6 border-b border-white/5 last:border-0 last:pb-0">
        <p className="font-semibold text-sm mb-1.5">{title}</p>
        <div className="text-white/50 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f97316]/5 border border-[#f97316]/15 rounded-xl px-4 py-3 text-sm text-white/60 leading-relaxed mt-2">
      <span className="text-[#f97316] font-bold">Tip: </span>{children}
    </div>
  )
}

const floatingInstructions: Record<string, React.ReactNode> = {
  wordpress: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina in WordPress">
        Ga naar <strong className="text-white">Pagina's</strong> of <strong className="text-white">Berichten</strong> en open de pagina die je wil bewerken.
      </Step>
      <Step number={2} title="Voeg een 'Aangepaste HTML' blok toe">
        Klik in de Gutenberg editor op het <strong className="text-white">+</strong> icoontje, zoek op <strong className="text-white">"Aangepaste HTML"</strong> en klik erop.
        <Tip>Gebruik je de klassieke editor? Klik dan op het tabblad <strong className="text-white">Tekst</strong> (niet Visueel) en plak de code daar in.</Tip>
      </Step>
      <Step number={3} title="Plak de code">
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit het Vertero dashboard.
      </Step>
      <Step number={4} title="Publiceer de pagina">
        Klik op <strong className="text-white">Bijwerken</strong> of <strong className="text-white">Publiceren</strong>. De knop verschijnt rechtsonder op je pagina.
      </Step>
    </div>
  ),
  wix: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de Wix Editor">
        Log in op wix.com en open de editor. Ga naar de pagina waar je de quiz wil plaatsen.
      </Step>
      <Step number={2} title="Voeg een HTML element toe">
        Klik op <strong className="text-white">+</strong> → <strong className="text-white">Insluiten</strong> → <strong className="text-white">HTML insluiten</strong>.
        <Tip>Zet de hoogte van het HTML-element op minimaal <strong className="text-white">1px</strong> — de widget zweeft boven de pagina, dus de grootte maakt niet uit.</Tip>
      </Step>
      <Step number={3} title="Plak de code">
        Dubbelklik op het element, kies <strong className="text-white">Code</strong> en plak:
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID.
      </Step>
      <Step number={4} title="Publiceer je site">
        Klik op <strong className="text-white">Publiceren</strong>. De widget is nu live.
      </Step>
    </div>
  ),
  squarespace: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina-editor">
        Ga naar <strong className="text-white">Pagina's</strong>, open de pagina en klik op <strong className="text-white">Bewerken</strong>.
      </Step>
      <Step number={2} title="Voeg een Code-blok toe">
        Klik op <strong className="text-white">Blok toevoegen</strong> en kies <strong className="text-white">Code</strong>.
        <Tip>Squarespace toont codeblokken niet in de voorvertoning — dit is normaal. De widget verschijnt wel op de live site.</Tip>
      </Step>
      <Step number={3} title="Plak de code">
        Zorg dat <strong className="text-white">HTML</strong> is geselecteerd en plak:
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID.
      </Step>
      <Step number={4} title="Sla op en publiceer">
        Klik op <strong className="text-white">Toepassen</strong> → <strong className="text-white">Opslaan</strong>.
      </Step>
    </div>
  ),
  webflow: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de Webflow Designer">
        Open je project en ga naar de pagina waarop je de quiz wil plaatsen.
      </Step>
      <Step number={2} title="Voeg een Embed element toe">
        Sleep een <strong className="text-white">Embed</strong> element vanuit het Add-paneel naar je pagina (onder <strong className="text-white">Components</strong>).
      </Step>
      <Step number={3} title="Plak de code">
        Dubbelklik op het element en plak:
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID. Klik op <strong className="text-white">Save &amp; Close</strong>.
      </Step>
      <Step number={4} title="Publiceer je site">
        Klik op <strong className="text-white">Publish</strong>.
      </Step>
    </div>
  ),
  jimdo: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina in Jimdo">
        Log in op jimdo.com, ga naar de pagina en klik op <strong className="text-white">Bewerken</strong>.
      </Step>
      <Step number={2} title="Voeg een Widget/HTML element toe">
        Klik op <strong className="text-white">+ Toevoegen</strong> en kies <strong className="text-white">Widget/HTML</strong>.
      </Step>
      <Step number={3} title="Plak de code">
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID.
      </Step>
      <Step number={4} title="Sla op">
        Klik op <strong className="text-white">Opslaan</strong>.
      </Step>
    </div>
  ),
  html: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open je HTML-bestand">
        Open het bestand van de pagina in je editor (bijv. VS Code of Notepad++).
      </Step>
      <Step number={2} title="Plak de code voor de sluitende body-tag">
        Zoek de <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag en plak er direct boven:
        <CodeBlock code={SCRIPT_TAG} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID.
      </Step>
      <Step number={3} title="Upload het bestand">
        Sla op en upload naar je server. De widget is direct actief.
        <Tip>Gebruik cPanel of DirectAdmin? Upload via de <strong className="text-white">Bestandsbeheer</strong> in je hosting dashboard.</Tip>
      </Step>
    </div>
  ),
}

const eigenKnopInstructions = (
  <div className="flex flex-col gap-4">
    <Step number={1} title="Voeg de scripttag toe aan je pagina">
      Plak dit eenmalig vóór de sluitende <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag, of in het HTML-blok van je platform.
      Als je <em>alleen</em> eigen knoppen gebruikt (geen floating knop), laat dan <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">data-id</code> weg:
      <CodeBlock code={SCRIPT_TAG_NO_ID} />
    </Step>
    <Step number={2} title="Voeg onclick toe aan elke knop">
      Voeg <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">{'onclick="Vertero.open(\'JOUW-QUIZ-ID\')"'}</code> toe aan elke bestaande knop die de quiz moet openen:
      <CodeBlock code={BUTTON_EXAMPLE} />
      Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit het dashboard. Je kunt dit op meerdere knoppen op de pagina zetten.
    </Step>
    <Step number={3} title="Wil je ook de floating knop behouden?">
      Geen probleem — je kunt beide combineren. Zet gewoon <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">data-id</code> terug in de scripttag:
      <CodeBlock code={BUTTON_COMBO} />
    </Step>
  </div>
)

export default function InstallerenPage() {
  const [method, setMethod] = useState<'floating' | 'eigen'>('floating')
  const [platform, setPlatform] = useState('wordpress')

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight">Quiz installeren</h1>
        <p className="text-white/40 text-sm mt-1">Kies hoe je de quiz op je website wil aanbieden</p>
      </div>

      <div className="px-6 py-6 max-w-3xl">

        {/* Methode tabs */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setMethod('floating')}
            className={`text-left px-5 py-4 rounded-2xl border transition ${
              method === 'floating'
                ? 'border-[#f97316] bg-[#f97316]/5'
                : 'border-white/10 bg-[#0d0d1c] hover:border-white/20'
            }`}
          >
            <p className={`font-semibold text-sm mb-1 ${method === 'floating' ? 'text-white' : 'text-white/70'}`}>Floating knop</p>
            <p className="text-white/35 text-xs leading-relaxed">Automatische knop rechtsonder op de pagina</p>
          </button>
          <button
            onClick={() => setMethod('eigen')}
            className={`text-left px-5 py-4 rounded-2xl border transition ${
              method === 'eigen'
                ? 'border-[#f97316] bg-[#f97316]/5'
                : 'border-white/10 bg-[#0d0d1c] hover:border-white/20'
            }`}
          >
            <p className={`font-semibold text-sm mb-1 ${method === 'eigen' ? 'text-white' : 'text-white/70'}`}>Eigen knop</p>
            <p className="text-white/35 text-xs leading-relaxed">Open de quiz vanuit je eigen knoppen op de pagina</p>
          </button>
        </div>

        {method === 'floating' && (
          <>
            {/* Platform tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    platform === p.id
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#0d0d1c] border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
              {floatingInstructions[platform]}
            </div>
          </>
        )}

        {method === 'eigen' && (
          <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
            {eigenKnopInstructions}
          </div>
        )}

        <div className="mt-6 text-white/30 text-xs leading-relaxed">
          Je quiz-ID vind je op de quizpagina in het Vertero dashboard. Klik op een quiz en kopieer de ID uit de URL of gebruik de knop "Embed code".
        </div>
      </div>
    </div>
  )
}
