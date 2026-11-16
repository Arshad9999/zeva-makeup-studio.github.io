/* Local-only interactions: selections, notes and visit marks stay on this device. */
(() => {
  'use strict';
  const store = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  const modal = document.querySelector('#booking-modal');
  const form = modal.querySelector('form');
  const choices = [...modal.querySelectorAll('input[name="services"]')];
  const valid = new Set(choices.map(choice => choice.value));
  let plan = store.get('zeva-plan', []);
  if (!Array.isArray(plan)) plan = [];
  plan = [...new Set(plan.filter(item => valid.has(item)))];
  const nav = document.querySelector('.nav-links');
  const theme = document.createElement('button');
  theme.type = 'button'; theme.className = 'theme-toggle'; nav.append(theme);
  const applyTheme = value => { document.documentElement.dataset.theme = value; theme.textContent = value === 'dark' ? '☀ Light' : '☾ Dark'; theme.setAttribute('aria-label', value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); store.set('zeva-theme', value); };
  theme.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  applyTheme(store.get('zeva-theme', 'light') === 'dark' ? 'dark' : 'light');

  const particles = document.createElement('div'); particles.className = 'sparkles'; particles.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 12; i++) { const dot = document.createElement('i'); dot.style.left = `${(i * 37) % 100}%`; dot.style.animationDelay = `${-i * 1.1}s`; dot.style.animationDuration = `${11 + i % 5}s`; particles.append(dot); }
  document.body.append(particles);
  const ticker = document.createElement('div'); ticker.className = 'status-ticker'; const tickerText = document.createElement('span'); tickerText.textContent = '✦  Personalised appointments  ·  Availability confirmed by Zeva  ·  Explore services & prices  ✦'; ticker.append(tickerText);
  document.querySelector('main').prepend(ticker);

  const vibe = document.createElement('section'); vibe.className = 'vibe-section';
  vibe.innerHTML = '<div class="interactive-shell"><p class="eyebrow">A little inspiration</p><h2>Find your look.</h2><p>Choose the moment and explore a focused selection from Zeva’s service menu.</p><div class="vibe-actions" role="group" aria-label="Choose your occasion"><button type="button" data-vibe="bridal" aria-pressed="false">Bridal</button><button type="button" data-vibe="party" aria-pressed="false">Party</button><button type="button" data-vibe="casual" aria-pressed="false">Casual</button><button type="button" data-vibe="all" aria-pressed="true">See all</button></div><p class="vibe-status" aria-live="polite"></p><a class="button" data-vibe-link href="services.html">Explore the menu ↗</a></div>';
  const categories = document.querySelector('.category-section'); categories.before(vibe);
  const filters = {
    bridal: ['HD Bridal', 'Air Brush Bridal', 'Engagement Makeup', 'HD Engagement Makeup', 'Engagement Airbrush', 'Reception Makeup'],
    party: ['Day Party Makeup', 'Haldi Mehandi Makeup', 'HD Makeup', 'Engagement Makeup', 'Reception Makeup'],
    casual: ['Bleach', 'D-Tan', 'Cleanup', 'Fruit Cleanup', 'Gold Facial', 'Threading', 'Forehead & Chin', 'Upper Lips', 'Hair Wash', 'Hair Trimming', 'Hair Spa']
  };
  const rows = [...document.querySelectorAll('.service-row')];
  function chooseVibe(value) {
    if (!Object.hasOwn(filters, value)) value = 'all';
    vibe.querySelectorAll('[data-vibe]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.vibe === value)));
    rows.forEach(row => { row.hidden = value !== 'all' && !filters[value].includes(row.querySelector('[data-service]')?.dataset.service); });
    document.querySelectorAll('.menu-group').forEach(group => { group.hidden = ![...group.querySelectorAll('.service-row')].some(row => !row.hidden); });
    vibe.querySelector('.vibe-status').textContent = value === 'all' ? 'Showing the complete menu.' : `${value[0].toUpperCase() + value.slice(1)} ideas${rows.length ? ': ' + rows.filter(row => !row.hidden).length + ' services shown below.' : ' selected. Open the menu to explore.'}`;
    vibe.querySelector('[data-vibe-link]').href = `services.html${value === 'all' ? '' : '?vibe=' + value}#menu-list`;
    if (rows.length) vibe.querySelector('[data-vibe-link]').href = '#menu-list';
  }
  document.querySelector('.menu-section')?.setAttribute('id', 'menu-list');
  vibe.addEventListener('click', event => { const button = event.target.closest('[data-vibe]'); if (button) chooseVibe(button.dataset.vibe); });
  chooseVibe(new URLSearchParams(location.search).get('vibe') || 'all');
  document.querySelectorAll('.category-nav a, .category-card[href^="#"]').forEach(link => link.addEventListener('click', () => chooseVibe('all')));

  const panels = document.createElement('section'); panels.className = 'app-panels';
  panels.innerHTML = '<div class="interactive-shell"><p class="eyebrow ink">Your Zeva journal</p><h2>Make every visit yours.</h2><div class="panel-grid"><article class="app-panel loyalty-card"><p class="eyebrow">Zeva Makeup Studio &amp; Salon</p><h3>Digital loyalty card</h3><p>Keep your own record of visits on this device.</p><div class="stamp-row" aria-label="Visit marks"></div><p class="visit-status" aria-live="polite"></p><div class="panel-actions"><button class="app-button" type="button" data-visit="add">Mark a visit</button><button class="app-button" type="button" data-visit="undo">Undo last mark</button></div><p class="app-small">Visit marks are self-reported and stored on this device. Zeva verifies visits, eligibility and any conditions before applying a reward.</p></article><article class="app-panel"><h3>Your beauty notes</h3><p>Keep notes from your experience in a private board on this device.</p><form class="note-form"><label for="zeva-note">Your note</label><textarea id="zeva-note" maxlength="280" required placeholder="What would you like to remember?"></textarea><button class="app-button" type="submit">Save note</button></form><div class="notes-board" aria-live="polite"></div><p class="app-small">Notes are stored in this browser only and are not published reviews.</p></article></div></div>';
  const reviews = document.createElement('section'); reviews.className = 'app-panels';
  reviews.innerHTML = '<div class="interactive-shell"><p class="eyebrow ink">From the community</p><h2>Client experiences.</h2><p class="reviews-empty">Zeva has not added published reviews here yet.</p><div class="review-board notes-board"></div></div>';

  async function refreshBusinessContent() {
    try {
      const response = await fetch('assets/data/business-content.json', {cache:'no-store'}); if (!response.ok) return;
      const data = await response.json();
      const board = reviews.querySelector('.review-board'); board.replaceChildren();
      const items = Array.isArray(data.reviews) ? data.reviews.filter(item => item && typeof item.quote === 'string' && typeof item.author === 'string') : [];
      reviews.querySelector('.reviews-empty').hidden = items.length > 0;
      items.slice(0, 12).forEach(item => { const card=document.createElement('article'); card.className='note-card'; const quote=document.createElement('p'); quote.textContent='“'+item.quote+'”'; const author=document.createElement('strong'); author.textContent=item.author; card.append(quote,author); board.append(card); });
      tickerText.textContent = typeof data.availability === 'string' && data.availability.trim() ? '✦  '+data.availability+'  ·  Confirm availability with Zeva  ✦' : '✦  Personalised appointments  ·  Availability confirmed by Zeva  ·  Explore services & prices  ✦';
      const offer=panels.querySelector('.loyalty-offer'); if (offer) offer.textContent=typeof data.loyaltyOffer === 'string' && data.loyaltyOffer.trim() ? data.loyaltyOffer+' Ask Zeva to confirm eligibility.' : 'Ask Zeva about current benefits.';
    } catch { /* Keep the honest empty states if the content feed is unavailable. */ }
  }
  const benefit=document.createElement('p'); benefit.className='loyalty-offer app-small'; benefit.textContent='Ask Zeva about current benefits.'; panels.querySelector('.stamp-row').after(benefit);
  refreshBusinessContent(); setInterval(refreshBusinessContent, 300000);
  const insertion = document.querySelector('.socials-section') || document.querySelector('.process-section') || document.querySelector('footer'); insertion.before(panels, reviews);
  let visits = Number(store.get('zeva-visits', 0)); if (!Number.isSafeInteger(visits) || visits < 0) visits = 0;
  const stamps = panels.querySelector('.stamp-row');
  function renderVisits() {
    stamps.replaceChildren();
    const marked = visits > 0 && visits % 10 === 0 ? 10 : visits % 10;
    for (let i=0; i<10; i++) {
      const mark = document.createElement('span');
      mark.className = 'stamp' + (i < marked ? ' is-filled' : '') + (i === 4 || i === 9 ? ' stamp-reward' : '');
      mark.textContent = i < marked ? '✦' : String(i+1);
      mark.setAttribute('aria-label', `Visit ${i+1}${i < marked ? ', marked' : ', unmarked'}${i === 4 ? ', 50% off milestone' : i === 9 ? ', complimentary makeover milestone' : ''}`);
      stamps.append(mark);
    }
    panels.querySelector('.visit-status').textContent = `${visits} ${visits === 1 ? 'visit' : 'visits'} marked on this device. ${marked} of 10 spaces marked on this card.`;
    store.set('zeva-visits', visits);
  }
  panels.addEventListener('click', event => { const button = event.target.closest('[data-visit]'); if (!button) return; visits = button.dataset.visit === 'add' ? Math.min(9999, visits + 1) : Math.max(0, visits - 1); renderVisits(); }); renderVisits();
  let notes = store.get('zeva-notes', []); if (!Array.isArray(notes)) notes = []; notes = notes.filter(note => typeof note === 'string').slice(0, 20);
  function renderNotes() { const board = panels.querySelector('.notes-board'); board.replaceChildren(); if (!notes.length) { const p=document.createElement('p'); p.className='empty-note'; p.textContent='Your notes will appear here.'; board.append(p); } notes.forEach((note, index) => { const card=document.createElement('article'); card.className='note-card'; const p=document.createElement('p'); p.textContent=note; const del=document.createElement('button'); del.type='button'; del.textContent='Remove'; del.setAttribute('aria-label', `Remove note ${index+1}`); del.addEventListener('click', () => { notes.splice(index,1); renderNotes(); }); card.append(p,del); board.append(card); }); store.set('zeva-notes',notes); }
  panels.querySelector('.note-form').addEventListener('submit', event => { event.preventDefault(); const field=panels.querySelector('#zeva-note'); const value=field.value.trim(); if (!value) return; notes.unshift(value); notes=notes.slice(0,20); field.value=''; renderNotes(); }); renderNotes();

  const receipt=document.createElement('aside'); receipt.className='receipt'; receipt.hidden=true; receipt.setAttribute('aria-label','Selected services receipt');
  receipt.innerHTML='<header><strong>ZEVA / YOUR SELECTION</strong><span class="receipt-count"></span></header><p class="receipt-items"></p><footer><button type="button" class="receipt-clear">Clear</button><button type="button" class="receipt-book">Continue booking ↗</button></footer>';
  document.body.append(receipt);
  const qr=document.createElement('section'); qr.className='qr-panel'; qr.setAttribute('aria-label','WhatsApp booking QR code');
  qr.innerHTML='<strong>Scan to continue in WhatsApp</strong><p>Review the request in WhatsApp before sending. The code contains the details you enter; keep it private. Zeva confirms availability.</p><img alt="QR code for your WhatsApp appointment request" hidden><p class="qr-status" aria-live="polite">Choose a service to generate a QR code.</p><a class="qr-link" target="_blank" rel="noopener noreferrer" hidden>Open the same WhatsApp request ↗</a>';
  form.querySelector('.quick-form').append(qr);
  function makeUrl() {
    const data=new FormData(form); const lines=['Hello Zeva! I would like to request an appointment.', 'Services: '+plan.join(', ')];
    for (const [key,label] of [['name','Name'],['date','Preferred date'],['time','Preferred time'],['type','Appointment type'],['details','Additional details']]) { const value=String(data.get(key)||'').trim(); if(value) lines.push(label+': '+value); }
    return 'https://wa.me/918353909431?text='+encodeURIComponent(lines.join('\n'));
  }
  function renderPlan() {
    receipt.hidden=!plan.length; receipt.querySelector('.receipt-count').textContent=`${plan.length} selected`; receipt.querySelector('.receipt-items').textContent=plan.join(' · ');
    document.querySelectorAll('.plan-add').forEach(button => { const selected=plan.includes(button.dataset.service); button.textContent=selected?'Added ✓':'Add to plan'; button.setAttribute('aria-pressed',String(selected)); });
    choices.forEach(choice => { choice.checked=plan.includes(choice.value); }); modal.querySelector('.service-picker')?.dispatchEvent(new Event('selectionchange')); store.set('zeva-plan',plan); renderQr();
  }
  function renderQr() {
    const img=qr.querySelector('img'), status=qr.querySelector('.qr-status'), link=qr.querySelector('.qr-link');
    if (!plan.length) { img.hidden=true; link.hidden=true; status.textContent='Choose a service to generate a QR code.'; return; }
    const url=makeUrl(); link.href=url; link.hidden=false;
    try { const code=qrcode(0,'M'); code.addData(url); code.make(); img.src=code.createDataURL(4,16); img.hidden=false; status.textContent='Your selected services and entered details are included.'; }
    catch { img.hidden=true; status.textContent='This request is too long for a QR code. Use the WhatsApp link below or shorten the details.'; }
  }
  rows.forEach(row => { const book=row.querySelector('[data-service]'); if (!book) return; const add=document.createElement('button'); add.type='button'; add.className='plan-add'; add.dataset.service=book.dataset.service; add.addEventListener('click', () => { plan=plan.includes(add.dataset.service) ? plan.filter(x=>x!==add.dataset.service) : [...plan,add.dataset.service]; renderPlan(); }); row.querySelector('dd').append(add); });
  modal.querySelector('.service-choices')?.addEventListener('change', () => { plan=choices.filter(choice=>choice.checked).map(choice=>choice.value); renderPlan(); });
  document.querySelectorAll('[data-open-booking][data-service]').forEach(button => button.addEventListener('click', () => { if (!plan.includes(button.dataset.service)) plan.push(button.dataset.service); renderPlan(); }));
  receipt.querySelector('.receipt-clear').addEventListener('click', () => { plan=[]; renderPlan(); });
  receipt.querySelector('.receipt-book').addEventListener('click', () => { if (!modal.open) { const first=document.querySelector('[data-open-booking]'); first.click(); } renderPlan(); });
  form.addEventListener('input', renderQr); form.addEventListener('change', renderQr);
  renderPlan();
})();
