(function () {
  const script = document.currentScript;
  const defaultQuizId = script.getAttribute('data-id');
  const defaultLabel = script.getAttribute('data-label') || '📋 Offerte aanvragen';
  const apiBase = new URL(script.src).origin;

  const style = document.createElement('style');
  style.textContent = `
    :root { --vt-brand: #f97316; }
    #vertero-btn {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--vt-brand); color: white; border: none;
      padding: 14px 24px; border-radius: 50px;
      font-family: sans-serif; font-size: 15px; font-weight: 600;
      cursor: pointer; box-shadow: 0 8px 24px rgba(249,115,22,0.4);
      z-index: 9999; transition: all 0.2s;
    }
    #vertero-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    #vertero-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.7); z-index: 10000;
      align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }
    #vertero-overlay.open { display: flex; }
    #vertero-modal {
      background: #0d0d1c; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; width: 480px; max-width: 95vw;
      max-height: 90vh; overflow-y: auto; padding: 32px;
      font-family: sans-serif; color: white; position: relative;
      transition: opacity 0.15s;
    }
    #vertero-modal.vt-hidden { opacity: 0; pointer-events: none; }
    #vertero-modal.vt-light {
      background: #ffffff; border-color: rgba(0,0,0,0.06); color: #111;
    }
    #vertero-close {
      position: absolute; top: 16px; right: 20px;
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 20px; cursor: pointer;
    }
    .vt-light #vertero-close { color: rgba(0,0,0,0.3); }
    .vertero-progress { display: flex; gap: 5px; margin-bottom: 24px; }
    .vertero-seg { flex: 1; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.1); }
    .vt-light .vertero-seg { background: rgba(0,0,0,0.08); }
    .vertero-seg.on { background: var(--vt-brand); }
    .vertero-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
    .vertero-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
    .vt-light .vertero-sub { color: rgba(0,0,0,0.55); }
    .vertero-options { display: flex; flex-direction: column; gap: 8px; }
    .vertero-opt {
      padding: 12px 16px; border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 10px; cursor: pointer; font-size: 14px;
      color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03);
      transition: all 0.15s; text-align: left;
    }
    .vt-light .vertero-opt {
      border-color: rgba(0,0,0,0.15); color: rgba(0,0,0,0.75); background: rgba(0,0,0,0.02);
    }
    .vertero-opt:hover { border-color: rgba(255,255,255,0.25); color: white; }
    .vt-light .vertero-opt:hover { border-color: rgba(0,0,0,0.4); color: #111; }
    .vertero-opt.selected { border-color: var(--vt-brand); opacity: 1; }
    .vt-light .vertero-opt.selected { color: #111; }
    .vertero-input {
      width: 100%; padding: 12px 14px;
      background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: white; font-size: 14px;
      outline: none; margin-bottom: 10px; box-sizing: border-box;
    }
    .vt-light .vertero-input {
      background: #ffffff; border-color: rgba(0,0,0,0.15); color: #111;
    }
    .vertero-input:focus { border-color: var(--vt-brand); }
    .vertero-input::placeholder { color: rgba(255,255,255,0.2); }
    .vt-light .vertero-input::placeholder { color: rgba(0,0,0,0.35); }
    .vertero-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
    .vertero-next {
      background: var(--vt-brand); color: white; border: none;
      padding: 11px 24px; border-radius: 10px; font-size: 14px;
      font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .vertero-next:hover { filter: brightness(1.1); }
    .vertero-back {
      background: none; border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.4); padding: 10px 18px;
      border-radius: 10px; font-size: 14px; cursor: pointer;
    }
    .vt-light .vertero-back { border-color: rgba(0,0,0,0.15); color: rgba(0,0,0,0.55); }
    .vertero-back:hover { color: white; }
    .vt-light .vertero-back:hover { color: #111; }
    .vertero-error { color: #ff6b6b; font-size: 12px; margin-top: 10px; text-align: center; display: none; }
    .vertero-error.visible { display: block; }
    .vertero-success { text-align: center; padding: 20px 0; }
    .vertero-success-icon { font-size: 48px; margin-bottom: 16px; }
    .vertero-success-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    .vertero-success-text { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.6; }
    .vt-light .vertero-success-text { color: rgba(0,0,0,0.55); }
    .vertero-powered { text-align: center; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .vertero-powered span { font-size: 11px; font-weight: 500; letter-spacing: 0.03em; color: rgba(255,255,255,0.25); }
    .vt-light .vertero-powered span { color: rgba(0,0,0,0.4); }
    .vertero-powered .vertero-logo { opacity: 0.4; }
    .vt-light .vertero-powered .vertero-logo { opacity: 1; }
    .vertero-radio {
      display: flex; align-items: center; gap: 12px;
      padding: 4px; cursor: pointer; background: none; border: none;
      font-size: 14px; color: rgba(255,255,255,0.45); transition: color 0.15s;
    }
    .vt-light .vertero-radio { color: rgba(0,0,0,0.45); }
    .vertero-radio.active { color: white; }
    .vt-light .vertero-radio.active { color: #111; }
    .vertero-radio-dot {
      width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.15s;
    }
    .vt-light .vertero-radio-dot { border-color: rgba(0,0,0,0.2); }
    .vertero-radio-inner {
      width: 8px; height: 8px; border-radius: 50%; background: var(--vt-brand); display: none;
    }
    .vertero-radio.active .vertero-radio-dot { border-color: var(--vt-brand); }
    .vertero-radio.active .vertero-radio-inner { display: block; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    ${defaultQuizId ? `<button id="vertero-btn">${defaultLabel}</button>` : ''}
    <div id="vertero-overlay">
      <div id="vertero-modal">
        <button id="vertero-close">✕</button>
        <div id="vertero-content"></div>
        <div class="vertero-powered"><a href="https://vertero.nl" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:6px;text-decoration:none;"><span>Powered by</span><span class="vertero-logo" style="display:inline-block;height:11px;width:42px;background:url('${apiBase}/logo.png') no-repeat left center/contain;vertical-align:middle;"></span></a></div>
      </div>
    </div>
  `);

  const DEFAULT_CONTACT_FIELDS = [
    { key: 'name',     enabled: true, required: true  },
    { key: 'email',    enabled: true, required: true  },
    { key: 'phone',    enabled: true, required: false },
    { key: 'street',   enabled: true, required: true  },
    { key: 'postcode', enabled: true, required: true  },
    { key: 'city',     enabled: true, required: true  },
  ];
  const FIELD_LABELS = { name: 'Naam', email: 'E-mailadres', phone: 'Telefoonnummer (optioneel)', street: 'Straat en huisnummer', postcode: 'Postcode', city: 'Woonplaats' };
  const FIELD_PLACEHOLDERS = { name: 'Naam', email: 'E-mailadres', phone: 'Telefoonnummer (optioneel)', street: 'Straat en huisnummer', postcode: 'Postcode', city: 'Woonplaats' };
  const FIELD_TYPES = { name: 'text', email: 'email', phone: 'tel', street: 'text', postcode: 'text', city: 'text' };

  const quizCache = {};
  let activeQuizId = null;
  let quiz = null;
  let history = [0];
  let answers = {};

  function currentStep() { return history[history.length - 1]; }

  function resolveNext(q, answer, questions) {
    const targetId = q.type === 'text'
      ? q.defaultBranch
      : (q.branches && q.branches[q.options.indexOf(answer)]);
    if (targetId === '__contact__') return 'contact';
    if (targetId) {
      const idx = questions.findIndex(q2 => q2.id === targetId);
      if (idx !== -1) return idx;
    }
    const cur = questions.findIndex(q2 => q2.id === q.id);
    return cur < questions.length - 1 ? cur + 1 : 'contact';
  }

  window.verteroSelect = (qId, value, el) => {
    answers[qId] = value;
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--vt-brand').trim() || '#f97316';
    document.querySelectorAll('.vertero-opt').forEach(o => {
      o.classList.remove('selected');
      o.style.borderColor = '';
      o.style.background = '';
    });
    el.classList.add('selected');
    el.style.borderColor = brand + '99';
    el.style.background = brand + '18';
  };
  window.verteroInput = (qId, value) => { answers[qId] = value; };
  window.verteroToggleCustom = (qId) => {
    const q = quiz?.config?.questions?.find(q => q.id === qId);
    if (!q) return;
    if (answers[qId] !== undefined && !q.options.includes(answers[qId])) return;
    answers[qId] = '';
    renderStep();
    setTimeout(() => document.getElementById('vertero-custom-inp-' + qId)?.focus(), 0);
  };
  window.verteroCustomInput = (qId, value) => { answers[qId] = value; };

  window.verteroNext = () => {
    if (!quiz) return;
    const questions = quiz.config?.questions || [];
    const step = currentStep();
    const q = questions[step];
    if (!q) return;

    const isOptional = q.optional === true;
    if (!isOptional && !answers[q.id]) {
      const err = document.getElementById('vertero-error');
      if (err) err.classList.add('visible');
      return;
    }

    const next = resolveNext(q, answers[q.id] || '', questions);
    if (next === 'contact') {
      renderContact();
    } else {
      history.push(next);
      renderStep();
    }
  };

  window.verteroBack = () => {
    if (history.length > 1) {
      history.pop();
      renderStep();
    }
  };

  window.verteroSubmit = async () => {
    const err = document.getElementById('vertero-error');
    const activeFields = (quiz.config?.contactFields ?? DEFAULT_CONTACT_FIELDS).filter(f => f.enabled);
    const contactData = {};
    activeFields.forEach(f => {
      contactData[f.key] = document.getElementById(`vertero-${f.key}`)?.value?.trim() || '';
    });

    for (const f of activeFields) {
      if (!f.required) continue;
      if (f.key === 'email') {
        if (!contactData.email) { if (err) { err.textContent = 'Vul je e-mailadres in.'; err.classList.add('visible'); } return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) { if (err) { err.textContent = 'Vul een geldig e-mailadres in.'; err.classList.add('visible'); } return; }
      } else if (!contactData[f.key]) {
        if (err) { err.textContent = 'Vul alsjeblieft alle verplichte velden in.'; err.classList.add('visible'); }
        return;
      }
    }
    if (err) err.classList.remove('visible');

    const questions = quiz.config?.questions || [];
    const formattedAnswers = {};
    questions.forEach(q => { formattedAnswers[q.question] = answers[q.id] || ''; });

    try {
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: activeQuizId,
          name: contactData.name || '', email: contactData.email || '',
          phone: contactData.phone || '', street: contactData.street || '',
          postcode: contactData.postcode || '', city: contactData.city || '',
          answers: formattedAnswers
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (err) { err.textContent = data.error || 'Er ging iets mis. Probeer het opnieuw.'; err.classList.add('visible'); }
        return;
      }
    } catch {
      if (err) { err.textContent = 'Er ging iets mis. Probeer het opnieuw.'; err.classList.add('visible'); }
      return;
    }

    document.getElementById('vertero-content').innerHTML = `
      <div class="vertero-success">
        <div class="vertero-success-icon">✅</div>
        <div class="vertero-success-title">Aanvraag ontvangen!</div>
        <div class="vertero-success-text">Bedankt! We nemen binnen 24 uur contact met je op.</div>
      </div>
    `;
  };

  function openQuiz(id) {
    activeQuizId = id;
    history = [0];
    answers = {};
    quiz = null;

    const overlay = document.getElementById('vertero-overlay');
    const modal = document.getElementById('vertero-modal');
    const content = document.getElementById('vertero-content');
    modal.classList.add('vt-hidden');
    overlay.classList.add('open');

    if (quizCache[id]) {
      quiz = quizCache[id];
      applyBrandColor(quiz);
      renderStep();
      return;
    }

    content.innerHTML = '';

    fetch(`${apiBase}/api/quiz-public/${id}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => {
        quizCache[id] = data;
        if (activeQuizId !== id) return;
        quiz = data;
        applyBrandColor(quiz);
        renderStep();
      })
      .catch(() => {
        if (activeQuizId !== id) return;
        content.innerHTML = '<div style="text-align:center;padding:40px;color:#ff6b6b;font-size:14px">Quiz kon niet worden geladen.</div>';
      });
  }

  function applyBrandColor(data) {
    const color = data?.config?.brandColor || '#f97316';
    const isLight = data?.config?.theme === 'light';
    document.documentElement.style.setProperty('--vt-brand', color);
    const modal = document.getElementById('vertero-modal');
    if (modal) {
      if (isLight) modal.classList.add('vt-light');
      else modal.classList.remove('vt-light');
      modal.classList.remove('vt-hidden');
    }
    const poweredLogo = document.querySelector('.vertero-logo');
    if (poweredLogo) {
      const logoSrc = isLight ? `${apiBase}/LogoInColor.png` : `${apiBase}/logo.png`;
      poweredLogo.style.backgroundImage = `url('${logoSrc}')`;
      poweredLogo.style.opacity = isLight ? '1' : '0.4';
    }
    const powered = document.querySelector('.vertero-powered');
    if (powered) powered.style.display = data?.config?.hidePoweredBy ? 'none' : '';
  }

  function closeModal() {
    document.getElementById('vertero-overlay').classList.remove('open');
    history = [0];
    answers = {};
  }

  function renderStep() {
    if (!quiz) return;
    const questions = quiz.config?.questions || [];
    const step = currentStep();
    const q = questions[step];
    if (!q) return;
    const content = document.getElementById('vertero-content');

    const progressHTML = `
      <div class="vertero-progress">
        ${questions.map((_, i) => `<div class="vertero-seg ${i < history.length ? 'on' : ''}"></div>`).join('')}
      </div>
    `;

    const isOptional = q.optional === true;
    content.innerHTML = `
      ${progressHTML}
      <div class="vertero-title">${q.question}</div>
      ${isOptional ? `<div class="vertero-sub">Optioneel</div>` : ''}
      ${(q.type === 'multiple' || !q.type) ? `
        <div class="vertero-options">
          ${q.options.map(opt => `
            <button class="vertero-opt ${answers[q.id] === opt ? 'selected' : ''}"
              onclick="verteroSelect('${q.id}', '${opt.replace(/'/g, "\\'")}', this)">
              ${opt}
            </button>
          `).join('')}
          ${q.allowCustom ? (() => {
            const isCustomSelected = answers[q.id] !== undefined && !q.options.includes(answers[q.id]);
            const customVal = isCustomSelected ? answers[q.id].replace(/"/g, '&quot;') : '';
            return `
              <button class="vertero-radio${isCustomSelected ? ' active' : ''}" onclick="verteroToggleCustom('${q.id}')">
                <span class="vertero-radio-dot"><span class="vertero-radio-inner"></span></span>
                Anders, namelijk...
              </button>
              ${isCustomSelected ? `<input class="vertero-input" type="text" id="vertero-custom-inp-${q.id}"
                value="${customVal}" placeholder="Typ je antwoord..."
                oninput="verteroCustomInput('${q.id}', this.value)" />` : ''}
            `;
          })() : ''}
        </div>
      ` : `
        <input class="vertero-input" type="text" placeholder="${q.placeholder || 'Jouw antwoord...'}"
          value="${answers[q.id] || ''}"
          oninput="verteroInput('${q.id}', this.value)" />
      `}
      <div id="vertero-error" class="vertero-error">Geef alsjeblieft een antwoord om verder te gaan.</div>
      <div class="vertero-nav">
        ${history.length > 1 ? `<button class="vertero-back" onclick="verteroBack()">← Terug</button>` : '<div></div>'}
        <button class="vertero-next" onclick="verteroNext()">Volgende →</button>
      </div>
    `;
  }

  function renderContact() {
    if (!quiz) return;
    const questions = quiz.config?.questions || [];
    const activeFields = (quiz.config?.contactFields ?? DEFAULT_CONTACT_FIELDS).filter(f => f.enabled);
    const content = document.getElementById('vertero-content');

    const progressHTML = `
      <div class="vertero-progress">
        ${questions.map(() => `<div class="vertero-seg on"></div>`).join('')}
        <div class="vertero-seg on"></div>
      </div>
    `;

    const fieldsHTML = activeFields.map(f => {
      const label = FIELD_LABELS[f.key] || f.key;
      const placeholder = f.required ? label : `${label} (optioneel)`;
      const type = FIELD_TYPES[f.key] || 'text';
      return `<input class="vertero-input" type="${type}" id="vertero-${f.key}" placeholder="${placeholder}" />`;
    }).join('');

    content.innerHTML = `
      ${progressHTML}
      <div class="vertero-title">Jouw gegevens</div>
      <div class="vertero-sub">We sturen je binnen 24 uur een offerte op maat.</div>
      ${fieldsHTML}
      <div id="vertero-error" class="vertero-error"></div>
      <div class="vertero-nav">
        <button class="vertero-back" onclick="verteroBack()">← Terug</button>
        <button class="vertero-next" onclick="verteroSubmit()">Versturen 🚀</button>
      </div>
    `;
  }

  // Override verteroBack to handle going back from contact form
  const origBack = window.verteroBack;
  window.verteroBack = () => {
    const content = document.getElementById('vertero-content');
    if (content && content.querySelector('#vertero-name')) {
      renderStep();
    } else {
      origBack();
    }
  };

  if (defaultQuizId) {
    document.getElementById('vertero-btn').onclick = () => openQuiz(defaultQuizId);
  }

  document.getElementById('vertero-close').onclick = closeModal;
  document.getElementById('vertero-overlay').onclick = (e) => {
    if (e.target === document.getElementById('vertero-overlay')) closeModal();
  };

  window.Vertero = { open: openQuiz };
})()
