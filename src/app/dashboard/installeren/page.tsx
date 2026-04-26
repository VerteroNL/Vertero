'use client'

import { useState } from 'react'

const CODE = `<script src="https://vertero.nl/widget.js" data-id="JOUW-QUIZ-ID"></scr` + `ipt>`

const platforms = [
  { id: 'wordpress', label: 'WordPress', icon: '🔵' },
  { id: 'wix', label: 'Wix', icon: '⬛' },
  { id: 'squarespace', label: 'Squarespace', icon: '⬜' },
  { id: 'webflow', label: 'Webflow', icon: '🔷' },
  { id: 'jimdo', label: 'Jimdo', icon: '🟢' },
  { id: 'html', label: 'Eigen website', icon: '🖥️' },
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
      <code className="text-[#f97316] text-xs font-mono break-all leading-relaxed">{code}</code>
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

const instructions: Record<string, React.ReactNode> = {
  wordpress: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina waar je de quiz wil plaatsen">
        Ga in het WordPress dashboard naar <strong className="text-white">Pagina's</strong> of <strong className="text-white">Berichten</strong> en open de pagina die je wil bewerken.
      </Step>
      <Step number={2} title="Voeg een 'Aangepaste HTML' blok toe">
        Klik in de Gutenberg editor op het <strong className="text-white">+</strong> icoontje om een nieuw blok toe te voegen. Zoek op <strong className="text-white">"Aangepaste HTML"</strong> of <strong className="text-white">"Custom HTML"</strong> en klik erop.
        <Tip>Gebruik je nog de oude klassieke editor? Klik dan op het tabblad <strong className="text-white">Tekst</strong> (niet Visueel) en plak de code daar in.</Tip>
      </Step>
      <Step number={3} title="Plak de embed code">
        Kopieer de code hieronder en plak hem in het HTML-blok:
        <CodeBlock code={CODE} />
        Vergeet niet <strong className="text-white">JOUW-QUIZ-ID</strong> te vervangen met jouw eigen quiz-ID. Die vind je op de quizpagina in Vertero.
      </Step>
      <Step number={4} title="Publiceer de pagina">
        Klik rechtsboven op <strong className="text-white">Bijwerken</strong> of <strong className="text-white">Publiceren</strong>. De quiz knop verschijnt nu rechtsonder op je pagina.
      </Step>
    </div>
  ),

  wix: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de Wix Editor">
        Log in op <strong className="text-white">wix.com</strong> en open de editor van je website. Ga naar de pagina waar je de quiz wil plaatsen.
      </Step>
      <Step number={2} title="Voeg een HTML element toe">
        Klik in de linkerkant op <strong className="text-white">+</strong> → <strong className="text-white">Insluiten</strong> → <strong className="text-white">HTML insluiten</strong>. Sleep het element naar de gewenste plek op de pagina.
        <Tip>Wix laadt de widget als een iframe. Zet de hoogte van het HTML-element op minimaal <strong className="text-white">1px</strong> — de widget zweeft boven de pagina, dus de grootte maakt verder niet uit.</Tip>
      </Step>
      <Step number={3} title="Plak de embed code">
        Dubbelklik op het HTML-element en kies <strong className="text-white">Code</strong>. Plak dan de volgende code:
        <CodeBlock code={CODE} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit Vertero.
      </Step>
      <Step number={4} title="Publiceer je site">
        Klik rechtsboven op <strong className="text-white">Publiceren</strong>. De widget is nu live op je website.
      </Step>
    </div>
  ),

  squarespace: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina-editor">
        Ga in Squarespace naar <strong className="text-white">Pagina's</strong> en open de pagina die je wil bewerken. Klik op <strong className="text-white">Bewerken</strong>.
      </Step>
      <Step number={2} title="Voeg een Code-blok toe">
        Klik op een sectie en kies <strong className="text-white">Blok toevoegen</strong>. Scroll naar beneden en kies <strong className="text-white">Code</strong>.
        <Tip>Squarespace toont codeblokken standaard niet in de voorvertoning — dit is normaal. De widget verschijnt wel op de live website.</Tip>
      </Step>
      <Step number={3} title="Plak de embed code">
        Plak de volgende code in het codeblok. Zorg dat <strong className="text-white">HTML</strong> is geselecteerd (niet CSS of JavaScript):
        <CodeBlock code={CODE} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit Vertero.
      </Step>
      <Step number={4} title="Sla op en publiceer">
        Klik op <strong className="text-white">Toepassen</strong> en daarna op <strong className="text-white">Opslaan</strong>. Bekijk daarna je live website — de knop staat rechtsonder.
      </Step>
    </div>
  ),

  webflow: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de Webflow Designer">
        Open je project in de Webflow Designer en ga naar de pagina waarop je de quiz wil plaatsen.
      </Step>
      <Step number={2} title="Voeg een Embed element toe">
        Sleep vanuit het <strong className="text-white">Add</strong> paneel (links) een <strong className="text-white">Embed</strong> element naar je pagina. Je vindt het onder <strong className="text-white">Components</strong>.
      </Step>
      <Step number={3} title="Plak de embed code">
        Dubbelklik op het Embed-element. Plak de onderstaande code in het tekstveld en klik op <strong className="text-white">Save & Close</strong>:
        <CodeBlock code={CODE} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit Vertero.
      </Step>
      <Step number={4} title="Publiceer je site">
        Klik rechtsbovenin op <strong className="text-white">Publish</strong> en kies je domein. De quiz knop is nu live.
      </Step>
    </div>
  ),

  jimdo: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open de pagina in Jimdo">
        Log in op <strong className="text-white">jimdo.com</strong> en ga naar de pagina waarop je de quiz wil plaatsen. Klik op <strong className="text-white">Bewerken</strong>.
      </Step>
      <Step number={2} title="Voeg een Widget/HTML element toe">
        Klik op <strong className="text-white">+ Toevoegen</strong> en kies <strong className="text-white">Widget/HTML</strong>. Dit vind je vaak onderaan de lijst met elementen.
      </Step>
      <Step number={3} title="Plak de embed code">
        Plak de volgende code in het tekstinvoerveld:
        <CodeBlock code={CODE} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit Vertero.
      </Step>
      <Step number={4} title="Sla op">
        Klik op <strong className="text-white">Opslaan</strong>. Bekijk je website — de knop verschijnt rechtsonder in beeld.
      </Step>
    </div>
  ),

  html: (
    <div className="flex flex-col gap-4">
      <Step number={1} title="Open je HTML-bestand">
        Open het HTML-bestand van de pagina waarop je de quiz wil plaatsen. Dit kan in een teksteditor zoals VS Code, Notepad++, of een andere editor.
      </Step>
      <Step number={2} title="Plak de code voor de sluitende body-tag">
        Zoek de <code className="text-[#f97316] font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag in je bestand. Plak de volgende code er direct boven:
        <CodeBlock code={CODE} />
        Vervang <strong className="text-white">JOUW-QUIZ-ID</strong> met jouw quiz-ID uit Vertero.
      </Step>
      <Step number={3} title="Upload het bestand">
        Sla het bestand op en upload het naar je server via FTP of het beheerpaneel van je hosting. De widget is direct actief.
        <Tip>Gebruik je cPanel of DirectAdmin? Upload het bestand via de <strong className="text-white">Bestandsbeheer</strong> in je hosting dashboard.</Tip>
      </Step>
    </div>
  ),
}

export default function InstallerenPage() {
  const [active, setActive] = useState('wordpress')

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.07] flex-shrink-0">
        <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mb-1.5">Aan de slag</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Quiz installeren</h1>
        <p className="text-white/40 text-sm mt-1">Volg de stappen voor jouw websiteplatform</p>
      </div>

      <div className="px-6 py-6 max-w-3xl">

      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              active === p.id
                ? 'bg-[#f97316] text-white'
                : 'bg-[#0d0d1c] border border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-[#0d0d1c] border border-white/10 rounded-2xl p-6">
        {instructions[active]}
      </div>

      {/* Footer note */}
      <div className="mt-6 text-white/30 text-xs leading-relaxed">
        Je quiz-ID vind je op de pagina van je quiz in het Vertero dashboard. Klik op een quiz en kopieer de ID uit de URL of gebruik de knop "Embed code" bovenin.
      </div>
      </div>
    </div>
  )
}
