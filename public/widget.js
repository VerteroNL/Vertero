(function () {
  const script = document.currentScript;
  const quizId = script.getAttribute('data-id');
  const apiBase = new URL(script.src).origin;

  if (!quizId) return console.error('vertero: geen data-id gevonden');

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
    }
    #vertero-close {
      position: absolute; top: 16px; right: 20px;
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 20px; cursor: pointer;
    }
    .vertero-progress { display: flex; gap: 5px; margin-bottom: 24px; }
    .vertero-seg { flex: 1; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.1); }
    .vertero-seg.on { background: var(--vt-brand); }
    .vertero-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; line-height: 1.3; }
    .vertero-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
    .vertero-options { display: flex; flex-direction: column; gap: 8px; }
    .vertero-opt {
      padding: 12px 16px; border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 10px; cursor: pointer; font-size: 14px;
      color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03);
      transition: all 0.15s; text-align: left;
    }
    .vertero-opt:hover { border-color: var(--vt-brand); color: white; }
    .vertero-opt.selected { border-color: var(--vt-brand); background: rgba(249,115,22,0.12); color: white; }
    .vertero-input {
      width: 100%; padding: 12px 14px;
      background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: white; font-size: 14px;
      outline: none; margin-bottom: 10px; box-sizing: border-box;
    }
    .vertero-input:focus { border-color: var(--vt-brand); }
    .vertero-input::placeholder { color: rgba(255,255,255,0.2); }
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
    .vertero-back:hover { color: white; }
    .vertero-error { color: #ff6b6b; font-size: 12px; margin-top: 10px; text-align: center; display: none; }
    .vertero-error.visible { display: block; }
    .vertero-success { text-align: center; padding: 20px 0; }
    .vertero-success-icon { font-size: 48px; margin-bottom: 16px; }
    .vertero-success-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    .vertero-success-text { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.6; }
    .vertero-powered { text-align: center; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .vertero-powered span { font-size: 11px; font-weight: 500; letter-spacing: 0.03em; color: rgba(255,255,255,0.25); }
    .vertero-powered img { height: 11px; opacity: 0.4; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="vertero-btn">📋 Offerte aanvragen</button>
    <div id="vertero-overlay">
      <div id="vertero-modal">
        <button id="vertero-close">✕</button>
        <div id="vertero-content"></div>
        <div class="vertero-powered"><span>Powered by</span><a href="https://vertero.nl" target="_blank" rel="noopener noreferrer"><img src="${apiBase}/logo.png" alt="Vertero" /></a></div>
      </div>
    </div>
  `);

  let quiz = null;
  let quizLoaded = false;
  let pendingRender = false;
  let currentStep = 0;
  let answers = {};

  window.verteroSetContact = (field, value) => {
    answers[field] = value;
    console.log('Contact updated:', field, value, answers);
  };
  window.verteroSelect = (step, value, el) => {
    answers[step] = value;
    document.querySelectorAll('.vertero-opt').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  };
  window.verteroInput = (step, value) => { answers[step] = value; };
  window.verteroNext = () => {
    if (!quiz) return;
    const questions = quiz.config?.questions || [];
    if (currentStep < questions.length) {
      const q = questions[currentStep];
      const isOptional = q.optional === true;
      if (!isOptional && !answers[currentStep]) {
        const err = document.getElementById('vertero-error');
        if (err) { err.classList.add('visible'); }
        return;
      }
      currentStep++;
      renderStep();
    }
  };
  window.verteroBack = () => {
    if (currentStep > 0) { currentStep--; renderStep(); }
  };
  window.verteroSubmit = async () => {
    const name = document.getElementById('vertero-name')?.value || '';
    const email = document.getElementById('vertero-email')?.value || '';
    const phone = document.getElementById('vertero-phone')?.value || '';
    const street = document.getElementById('vertero-street')?.value || '';
    const postcode = document.getElementById('vertero-postcode')?.value || '';
    const city = document.getElementById('vertero-city')?.value || '';
    const err = document.getElementById('vertero-error');

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!name || !email || !street || !postcode || !city) {
      if (err) { err.textContent = 'Vul alsjeblieft alle verplichte velden in.'; err.classList.add('visible'); }
      return;
    }
    if (!emailValid) {
      if (err) { err.textContent = 'Vul een geldig e-mailadres in.'; err.classList.add('visible'); }
      return;
    }
    if (err) err.classList.remove('visible');

    const questions = quiz.config?.questions || [];
    const formattedAnswers = {};
    questions.forEach((q, i) => { formattedAnswers[q.question] = answers[i] || ''; });

    try {
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: quizId, name, email, phone, street, postcode, city, answers: formattedAnswers })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (err) { err.textContent = data.error || 'Er ging iets mis. Probeer het opnieuw.'; err.classList.add('visible'); }
        return;
      }
    } catch (e) {
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

  fetch(`${apiBase}/api/quiz-public/${quizId}`)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      quiz = data;
      quizLoaded = true;
      const color = data?.config?.brandColor || '#f97316';
      document.documentElement.style.setProperty('--vt-brand', color);
      if (pendingRender) { pendingRender = false; renderStep(); }
    })
    .catch(e => {
      quizLoaded = true;
      console.error('vertero: quiz kon niet worden geladen', e);
      if (pendingRender) {
        pendingRender = false;
        document.getElementById('vertero-content').innerHTML = '<div style="text-align:center;padding:40px;color:#ff6b6b;font-size:14px">Quiz kon niet worden geladen.</div>';
      }
    });

  document.getElementById('vertero-btn').onclick = () => {
    document.getElementById('vertero-overlay').classList.add('open');
    if (quizLoaded && quiz) {
      renderStep();
    } else if (quizLoaded && !quiz) {
      document.getElementById('vertero-content').innerHTML = '<div style="text-align:center;padding:40px;color:#ff6b6b;font-size:14px">Quiz kon niet worden geladen.</div>';
    } else {
      pendingRender = true;
      document.getElementById('vertero-content').innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.4);font-size:14px">Laden...</div>';
    }
  };
  document.getElementById('vertero-close').onclick = closeModal;
  document.getElementById('vertero-overlay').onclick = (e) => {
    if (e.target === document.getElementById('vertero-overlay')) closeModal();
  };

  function closeModal() {
    document.getElementById('vertero-overlay').classList.remove('open');
    currentStep = 0;
    answers = {};
  }

  function renderStep() {
    if (!quiz) return;
    const questions = quiz.config?.questions || [];
    const content = document.getElementById('vertero-content');

    const progressHTML = `
      <div class="vertero-progress">
        ${questions.map((_, i) => `<div class="vertero-seg ${i <= currentStep ? 'on' : ''}"></div>`).join('')}
        <div class="vertero-seg"></div>
      </div>
    `;

    if (currentStep < questions.length) {
      const q = questions[currentStep];
      const isOptional = q.optional === true;
      content.innerHTML = `
        ${progressHTML}
        <div class="vertero-title">${q.question}</div>
        ${isOptional ? `<div class="vertero-sub">Optioneel</div>` : ''}
        ${(q.type === 'multiple' || !q.type) ? `
          <div class="vertero-options">
            ${q.options.map(opt => `
              <button class="vertero-opt ${answers[currentStep] === opt ? 'selected' : ''}"
                onclick="verteroSelect(${currentStep}, '${opt.replace(/'/g, "\\'")}', this)">
                ${opt}
              </button>
            `).join('')}
          </div>
        ` : `
          <input class="vertero-input" type="text" placeholder="Jouw antwoord..."
            value="${answers[currentStep] || ''}"
            oninput="verteroInput(${currentStep}, this.value)" />
        `}
        <div id="vertero-error" class="vertero-error">Geef alsjeblieft een antwoord om verder te gaan.</div>
        <div class="vertero-nav">
          ${currentStep > 0 ? `<button class="vertero-back" onclick="verteroBack()">← Terug</button>` : '<div></div>'}
          <button class="vertero-next" onclick="verteroNext()">Volgende →</button>
        </div>
      `;
    } else {
      content.innerHTML = `
        ${progressHTML}
        <div class="vertero-title">Jouw gegevens</div>
        <div class="vertero-sub">We sturen je binnen 24 uur een offerte op maat.</div>
        <input class="vertero-input" type="text" id="vertero-name" placeholder="Naam" />
        <input class="vertero-input" type="text" id="vertero-street" placeholder="Straat en huisnummer" />
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input class="vertero-input" type="text" id="vertero-postcode" placeholder="Postcode" style="margin-bottom:0" />
          <input class="vertero-input" type="text" id="vertero-city" placeholder="Woonplaats" style="margin-bottom:0" />
        </div>
        <input class="vertero-input" type="email" id="vertero-email" placeholder="E-mailadres" style="margin-top:8px" />
        <input class="vertero-input" type="tel" id="vertero-phone" placeholder="Telefoonnummer (optioneel)" />
        <div id="vertero-error" class="vertero-error"></div>
        <div class="vertero-nav">
          <button class="vertero-back" onclick="verteroBack()">← Terug</button>
          <button class="vertero-next" onclick="verteroSubmit()">Versturen 🚀</button>
        </div>
      `;
    }
  }
})()