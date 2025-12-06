/* === CONTENT GENERATION === */
window.addEventListener("DOMContentLoaded", () => {
  
  // 1. СРАЗУ СКРОЛЛИМ НАВЕРХ
  if (history.scrollRestoration) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  // 2. АНИМАЦИЯ
  const tl = gsap.timeline({
      onComplete: () => {
          document.body.classList.add('loaded'); // Разблокируем скролл
          const c = document.querySelector('.curtain-wrapper');
          if(c) {
             c.style.opacity = 0;
             setTimeout(() => c.style.display = 'none', 1000);
          }
      }
  });

  tl.to(".curtain-text", { opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
    .to(".curtain-subtext", { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=1")
    // Opening Curtains
    .to(".curtain-panel.left", { xPercent: -100, duration: 2.5, ease: "power2.inOut" }, "+=0.5")
    .to(".curtain-panel.right", { xPercent: 100, duration: 2.5, ease: "power2.inOut" }, "<")
    .to(".curtain-content", { opacity: 0, scale: 1.2, duration: 1.5, ease: "power2.in" }, "<")
    // BG Fade out (reveals site)
    .to(".curtain-bg", { opacity: 0, duration: 1 }, "-=2.0")
    // Magic Particles Start
    .to({}, { duration: 3, onUpdate: function() { if(typeof heroParticlesMaterial !== 'undefined' && heroParticlesMaterial) { gsap.to(heroParticlesMaterial.uniforms.uProgress, { value: 1, duration: 4, ease: "power2.out" }); } } }, "-=2.0")
    // Content Animation
    .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=1.5")
    .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8")
    .from(".hero-btns", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");

  // FAQ DATA
  const faqData = [
    { q: "За сколько бронировать дату?", a: "Обычно за 1–2 недели; популярные даты — за месяц и раньше." },
    { q: "Сколько длится программа?", a: "Частные шоу — 20–40 мин, микромагия — до 3 ч, концерт — 1–2 ч." },
    { q: "Какой размер задатка?", a: "50 % от согласованной суммы. Остальное — в день мероприятия." },
    { q: "Выезжаете в другие регионы?", a: "Да, работаю в нескольких областях и выезжаю по стране." },
    { q: "Можно персонализировать трюк?", a: "Да! Подготовим номер под вашего именинника/бренд/событие." },
    { q: "Нужна ли сцена?", a: "Чаще нет. Для больших залов и концертной программы — по согласованию." },
    // Hidden Questions
    { q: "Что по звуку и аппаратуре?", a: "С ведущим — всё готово. Без ведущего нужна активная колонка/микрофон." },
    { q: "Сколько занимает подготовка?", a: "Около 30 мин; для концертной программы — до 1 ч." },
    { q: "Способы оплаты?", a: "Безнал, СБП, наличные. Предусмотрен договор и чек." },
    { q: "Какой возраст для детских шоу?", a: "Для детей 8+; для младших — по согласованию." },
    { q: "Можно снимать фото/видео?", a: "Да, съёмка приветствуется." },
    { q: "Есть ли официальное оформление?", a: "Да, работаю по договору (ИП, Самозанятость)." },
    { q: "Возможна площадка под открытым небом?", a: "Летом при безветренной погоде." },
    { q: "Безопасны ли спецэффекты?", a: "Используются только сертифицированные и безопасные эффекты." },
    { q: "Можно ли интегрировать бренд?", a: "Да, интегрируем лого и смыслы бренда в интерактив." },
    { q: "Что если дата переносится?", a: "Перенос возможен при наличии свободного слота." },
    { q: "Какой формат аудитории?", a: "От 10 до 500+ человек." },
    { q: "Проводите мастер-классы?", a: "Да: 60 мин обучения + реквизит в подарок." }
  ];

  const container = document.getElementById('faqContainer');
  const VISIBLE_COUNT = 6;

  let html = faqData.map((f, i) => {
    const isHidden = i >= VISIBLE_COUNT ? 'hidden' : '';
    return `<details class="faq-item ${isHidden}"><summary>${f.q}</summary><div>${f.a}</div></details>`;
  }).join('');

  if (faqData.length > VISIBLE_COUNT) {
    html += `<div class="faq-controls"><button class="btn btn-glass" onclick="showAllFaq(this)">Показать все вопросы (${faqData.length}) <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></button></div>`;
  }
  container.innerHTML = html;

  // Gallery
  const galGrid = document.getElementById('galGrid');
  for(let i=1; i<=6; i++){
    const img = document.createElement('img'); 
    img.src = `images/${i}.jpg`;
    img.onerror = () => img.src = `https://via.placeholder.com/300x200/111/333?text=Photo+${i}`;
    img.onclick = () => { document.getElementById('lbImg').src=img.src; document.getElementById('modalImg').classList.add('open'); };
    galGrid.appendChild(img);
  }

  // Init Logic
  initThreeJS();
  initHeroParticles();
  updateServices();
  initGame();

  gsap.utils.toArray(".card").forEach((card, i) => {
    gsap.to(card, { scrollTrigger: { trigger: card, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, delay: i*0.1, ease: "power3.out" });
  });
  gsap.utils.toArray(".gs-reveal").forEach(elem => {
    gsap.from(elem, { scrollTrigger: { trigger: elem, start: "top 80%" }, y: 40, opacity: 0, duration: 1, ease: "power3.out" });
  });
  
  // Date Picker Min Date Fix
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    dateInput.min = d.toISOString().split('T')[0];
  }
});

// FAQ LOGIC
window.showAllFaq = function(btn) {
  const hiddenItems = document.querySelectorAll('.faq-item.hidden');
  hiddenItems.forEach(item => {
    item.classList.remove('hidden');
    item.classList.add('fade-in');
  });
  btn.style.display = 'none';
}

/* === STORY VIEWER LOGIC === */
function openReview(el) {
  const vidSrc = el.querySelector('video').src;
  const viewer = document.getElementById('storyViewer');
  const viewVid = document.getElementById('storyVideo');
  viewVid.src = vidSrc;
  viewer.classList.add('active');
  viewVid.currentTime = 0; viewVid.play(); viewVid.muted = false;
}
function closeReview() {
  const viewer = document.getElementById('storyViewer');
  const viewVid = document.getElementById('storyVideo');
  viewer.classList.remove('active');
  setTimeout(() => { viewVid.pause(); viewVid.src = ""; }, 300);
}

/* === VIDEO PROMO LOGIC === */
function openVideo(){ 
  document.getElementById('modalVideo').classList.add('open'); 
  // Вставьте сюда вашу ссылку на промо
  document.getElementById('vidContainer').innerHTML = '<iframe src="https://rutube.ru/play/embed/a692a6ad3b922abc4cfad5be5898431b?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>'; 
}
function closeVideo(){ 
  document.getElementById('modalVideo').classList.remove('open'); 
  document.getElementById('vidContainer').innerHTML = ''; 
}

/* === AUDIO UX === */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playHoverSound() {
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime+0.1);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.1);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+0.1);
}
function playClickSound() {
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
  osc.type = 'triangle'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime+0.15);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.15);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime+0.15);
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a, button, .card, input, select, .card-play, .svc-btn').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
    el.addEventListener('click', playClickSound);
  });
});

/* === TELEGRAM BOT === */
const TG_TOKEN = "7838972787:AAHaLNVe6xqEnzE5qy5Uh2TwSb66LWYIUhI";
const CHAT_ID = 'ВСТАВЬ_СЮДА_ЦИФРЫ_CHAT_ID'; 

// MAIN FORM
document.getElementById('tgForm').onsubmit = async (e) => {
  e.preventDefault();
  if(document.getElementById('hp_website').value) return;
  const btn = e.target.querySelector('button');
  const oldText = btn.innerText;
  if(CHAT_ID.includes('CHAT_ID')) { alert('Вставь CHAT_ID в код!'); return; }
  btn.innerText = 'Отправка...'; btn.disabled = true;
  const fData = new FormData(e.target);
  const bonuses = document.getElementById('formBonuses').value || 'Нет';
  const services = document.getElementById('formServices').value || 'Не выбрано';
  const text = `🔥 *Заявка ШОУ*\n\n👤 ${fData.get('name')}\n📱 ${fData.get('phone')}\n🎩 Услуги: ${services}\n🎁 Бонусы: ${bonuses}\n📝 Инфо: ${fData.get('msg')}`;
  sendToTg(text, btn, oldText);
};

// SCHOOL FORM
document.getElementById('schoolForm').onsubmit = async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const oldText = btn.innerText;
  if(CHAT_ID.includes('CHAT_ID')) { alert('Вставь CHAT_ID в код!'); return; }
  btn.innerText = 'Отправка...'; btn.disabled = true;
  const fData = new FormData(e.target);
  const text = `🎓 *Заявка ШКОЛА*\n\n👤 ${fData.get('parent')}\n📱 ${fData.get('phone')}\n👶 Возраст: ${fData.get('age')}`;
  sendToTg(text, btn, oldText);
};

async function sendToTg(text, btn, oldText) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
    });
    if(res.ok) {
      btn.innerText = 'Успешно!'; btn.style.background = '#28a745'; setTimeout(()=>{btn.innerText=oldText; btn.disabled=false; btn.style.background=''}, 3000);
      if(typeof ym !== 'undefined') ym(104290205,'reachGoal','order_submit');
    } else throw new Error();
  } catch (err) {
    alert('Ошибка отправки.'); btn.innerText = oldText; btn.disabled = false;
  }
}

/* === SCHOOL MODAL LOGIC === */
function openSchoolModal() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.querySelector('.burger').classList.remove('active');
  document.getElementById('schoolModal').classList.add('open');
}
function closeSchoolModal() {
  document.getElementById('schoolModal').classList.remove('open');
}

/* === WIZARD LOGIC === */
function toggleMenu(){ document.getElementById('mobileMenu').classList.toggle('open'); document.querySelector('.burger').classList.toggle('active'); }
const travel={ "Вологодская":{fee:9000,cities:{Вологда:9000,Череповец:15000,Сокол:12000}}, "Владимирская":{fee:10000,cities:{Владимир:10000,Ковров:10000,Муром:17000,"Гусь хрустальный":13500}}, "Ивановская":{fee:5000,cities:{Иваново:2000,Кинешма:3500,Шуя:3000,Тейково:2500}}, "Костромская":{fee:3000,cities:{Кострома:2000,Шарья:6000,Нерехта:2000}}, "Ярославская":{fee:1000,cities:{Ярославль:0,Рыбинск:2000,Тутаев:2000,Углич:2000,Ростов:2000}} };
const services={
  close: { "Микромагия (30 мин)": 13000, "Микромагия (1 час)": 20000, "Микромагия (2 часа)": 30000, "Микромагия (3 часа)": 36000 },
  std: { "Взрослое шоу (20 мин)": 17500, "Взрослое шоу (30 мин)": 23750, "Взрослое шоу (40 мин)": 30000 },
  spec: { "Свадебное шоу (20 мин)": 26250, "Свадебное шоу (30 мин)": 32500 },
  kids: { "Детское шоу (30 мин)": 11250, "Детское шоу (40 мин)": 13750 },
  conc: { "Концерт «СЕКРЕТ» (мини)": 150000, "Концерт «СЕКРЕТ» (полный)": 300000 }
};
const catNames = { close: "Микромагия (Welcome)", std: "Сценическое шоу (Банкет)", spec: "Свадьбы и Корпоративы", kids: "Детские праздники", conc: "Концертные шоу" };
const els={area:document.getElementById('area'),city:document.getElementById('city'),svcGrid:document.getElementById('svcOptions'),date:document.getElementById('date'),gRange:document.getElementById('gRange')};
Object.keys(travel).forEach(k=>els.area.add(new Option(k,k)));
function updateCities(){els.city.innerHTML='<option disabled selected>Город</option>';els.city.disabled=false;Object.keys(travel[els.area.value].cities).forEach(c=>els.city.add(new Option(c,c)));}
let selectedServices = [];
function updateServices(){
  els.svcGrid.innerHTML='';
  selectedServices = []; 
  Object.keys(services).forEach(catKey => {
    const wrapper = document.createElement('div'); wrapper.className = 'svc-category-group';
    const header = document.createElement('div'); header.className = 'svc-group-title'; header.innerText = catNames[catKey]; wrapper.appendChild(header);
    const grid = document.createElement('div'); grid.className = 'svc-grid';
    Object.keys(services[catKey]).forEach(sName => {
      const sPrice = services[catKey][sName];
      const btn = document.createElement('div'); btn.className = 'svc-btn';
      btn.innerHTML = `<span class="svc-name">${sName}</span><span class="svc-cost">${sPrice.toLocaleString()} ₽</span>`;
      btn.onclick = () => toggleService(btn, sName, sPrice);
      grid.appendChild(btn);
    });
    wrapper.appendChild(grid); els.svcGrid.appendChild(wrapper);
  });
}
function toggleService(btn, name, price) {
  const idx = selectedServices.findIndex(s => s.name === name);
  if (idx > -1) { selectedServices.splice(idx, 1); btn.classList.remove('selected'); } else { selectedServices.push({name, price}); btn.classList.add('selected'); }
  playClickSound();
}
function nextStep(n){
  if(n===2 && (!els.area.value||!els.city.value)){alert('Выберите регион и город');return;}
  
  // === NEW DATE VALIDATION ===
  if(n===2 && els.date.value) {
      const selected = new Date(els.date.value);
      const now = new Date();
      now.setHours(0,0,0,0); 
      if (selected <= now) {
          alert('Бронирование возможно только с завтрашнего дня.');
          return; 
      }
  }

  document.querySelectorAll('.wizard-step').forEach(e=>e.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
  document.getElementById('wizProgress').style.width=(n*33)+'%';
  
  // AUTO SCROLL FIX
  if (n===3) {
      document.getElementById('calc').scrollIntoView({behavior: 'smooth'});
  }
}
function calcResult(){
  if (selectedServices.length === 0) { alert('Выберите хотя бы одну услугу'); return; }
  let base = selectedServices.reduce((sum, s) => sum + s.price, 0);
  let road=travel[els.area.value].cities[els.city.value];
  if(els.area.value==='Ярославская'&&els.city.value==='Ярославль') base+=1000;
  let g=parseInt(els.gRange.value); let gFee=g>50?(g-50)*50:0;
  let coef=1; if(els.date.value){const d=new Date(els.date.value);if(d.getMonth()===11&&d.getDate()>15)coef=1.5;}
  const raw=(base+road+gFee)*coef;
  const isGameWinner = localStorage.getItem('game_win') === 'true';
  const isBundle = selectedServices.length >= 2;
  let discPercent = 0; let discReason = 'Нет';
  if (isGameWinner) { discPercent = 20; discReason = '20% (Победа)'; }
  else if (isBundle) { discPercent = 10; discReason = '10% (Пакет услуг)'; }
  const disc = Math.round(raw * (discPercent / 100)); const total = raw - disc;
  document.getElementById('rSvc').innerHTML = selectedServices.map(s => s.name).join('<br>');
  document.getElementById('rRoad').innerText=road.toLocaleString()+' ₽';
  document.getElementById('rGuest').innerText=gFee.toLocaleString()+' ₽';
  document.getElementById('rCoef').innerText=coef>1?'x'+coef:'1.0';
  document.getElementById('rDisc').innerText=disc?`-${disc} ₽ (${discReason})`:'0 ₽';
  document.getElementById('rTotal').innerText=total.toLocaleString()+' ₽';
  /* BONUS TIERS UPDATED */
  const bContainer = document.getElementById('bonusContainer'); bContainer.innerHTML = ''; 
  let activeBonuses = [];
  if (total >= 35000) { activeBonuses.push("🔥 Опасный трюк"); bContainer.innerHTML += `<div class="bonus-item bonus-tier-3"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg><div class="bonus-text"><strong>Экстрим</strong>Опасный трюк в подарок!</div><div class="gift-badge">БЕСПЛАТНО</div></div>`; }
  if (total >= 20000) { activeBonuses.push("🎁 Персональный фокус"); bContainer.innerHTML += `<div class="bonus-item bonus-tier-2"><svg class="icon-svg" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg><div class="bonus-text"><strong>VIP</strong>Персональный фокус</div><div class="gift-badge">БЕСПЛАТНО</div></div>`; }
  if (total >= 15000) { activeBonuses.push("🎫 2 Билета"); bContainer.innerHTML += `<div class="bonus-item bonus-tier-1"><svg class="icon-svg" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg><div class="bonus-text"><strong>Бонус</strong>2 Билета на концертное шоу <span class="bonus-note">(Город и дату уточняйте)</span></div><div class="gift-badge">БЕСПЛАТНО</div></div>`; }
  document.getElementById('formBonuses').value = activeBonuses.join(', ');
  document.getElementById('formServices').value = selectedServices.map(s => s.name).join(', ') + ` [${discReason}]`;
  nextStep(3);
}

/* === GAME LOGIC (FIXED) === */
const deck = document.getElementById('gameDeck');
const msg = document.getElementById('gameMsg');
const suits = ['♠', '♥', '♣', '♦'];
const ranks = ['J', 'Q', 'K', 'A'];
function initGame() {
  if (!deck) return;
  deck.innerHTML = ''; 
  const lastPlayed = parseInt(localStorage.getItem('game_timestamp')) || 0;
  const hasWon = localStorage.getItem('game_win') === 'true';
  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;
  const timePassed = now - lastPlayed;
  
  if (timePassed >= cooldown) { localStorage.removeItem('game_win'); } 

  if (lastPlayed && timePassed < cooldown) {
    const hoursLeft = Math.ceil((cooldown - timePassed) / (1000 * 60 * 60));
    deck.innerHTML = `<div style="padding:30px; border:1px solid #333; border-radius:16px; background:rgba(255,255,255,0.05); backdrop-filter:blur(5px);"><h3 style="margin-bottom:10px; color:#fff;">⏳ Магия восстанавливается</h3><p style="color:#888; font-size:0.9rem;">${hasWon ? 'Вы уже выиграли свою скидку!' : 'Попытка потрачена.'} <br> Следующий шанс через <strong>${hoursLeft} ч.</strong></p></div>`;
    if (hasWon) msg.innerHTML = '<span style="color:var(--gold-primary)">Скидка 20% активирована</span>';
    return;
  }
  const winIdx = Math.floor(Math.random() * 3);
  for (let i = 0; i < 3; i++) {
    const isWin = (i === winIdx);
    let rSuit, rRank;
    do { rSuit = suits[Math.floor(Math.random() * 4)]; rRank = ranks[Math.floor(Math.random() * 4)]; } while (rSuit === '♠' && rRank === 'A');
    const suit = isWin ? '♠' : rSuit; const rank = isWin ? 'A' : rRank;
    const card = document.createElement('div'); card.className = 'card-play';
    card.innerHTML = `<div class="face back"></div><div class="face front" style="color:${['♠', '♣'].includes(suit) ? '#000' : '#c00'}">${rank}${suit}</div>`;
    card.onclick = () => {
      if (deck.classList.contains('played')) return;
      localStorage.setItem('game_timestamp', Date.now()); deck.classList.add('played');
      document.querySelectorAll('.card-play').forEach(el => el.classList.add('flipped'));
      if (isWin) {
        msg.innerHTML = '<span style="color:var(--gold-primary); text-shadow:0 0 10px var(--gold-primary);">✨ ПОБЕДА! Скидка 20%</span>';
        localStorage.setItem('game_win', 'true');
      } else {
        msg.textContent = 'Увы, магия не сработала. Попробуйте завтра.';
        localStorage.setItem('game_win', 'false');
      }
      if(typeof calcResult === 'function') setTimeout(calcResult, 1000);
    };
    deck.appendChild(card);
  }
}

/* === THREE.JS HERO PARTICLES (FIXED FOR CORS) === */
let heroParticlesMaterial;
function initHeroParticles() {
  const container = document.getElementById('hero-particles-container'); if (!container) return;
  const scene = new THREE.Scene();
  const width = container.offsetWidth; const height = container.offsetHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); camera.position.z = 100;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  const img = new Image(); 
  img.crossOrigin = "Anonymous"; // FIX CORS
  img.src = 'images/hero-portrait.png'; 
  
  img.onload = () => {
    const imageCanvas = document.createElement('canvas'); const ctx = imageCanvas.getContext('2d');
    const particleDensity = window.innerWidth < 768 ? 6 : 4;
    const iw = img.width; const ih = img.height;
    imageCanvas.width = iw; imageCanvas.height = ih;
    ctx.drawImage(img, 0, 0); const data = ctx.getImageData(0, 0, iw, ih).data;
    const geometry = new THREE.BufferGeometry();
    const positions = []; const colors = []; const randoms = [];
    const ratio = window.innerWidth < 768 ? 0.15 : 0.25; 
    for (let y = 0; y < ih; y += particleDensity) {
      for (let x = 0; x < iw; x += particleDensity) {
        const i = (y * iw + x) * 4;
        const r = data[i] / 255; const g = data[i + 1] / 255; const b = data[i + 2] / 255; const a = data[i + 3];
        if (a > 20 && (r+g+b) > 0.1) {
          const px = (x - iw / 2) * ratio; const py = -(y - ih / 2) * ratio - 10;
          positions.push(px, py, 0); colors.push(r, g, b);
          randoms.push((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400);
        }
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 3));
    heroParticlesMaterial = new THREE.ShaderMaterial({
      vertexShader: `uniform float uTime; uniform float uProgress; attribute vec3 aRandom; varying vec3 vColor; void main() { vColor = color; vec3 pos = mix(aRandom, position, uProgress); pos.x += sin(uTime * 2.0 + position.y) * 0.5 * uProgress; pos.z += cos(uTime * 1.5 + position.x) * 0.5 * uProgress; vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_PointSize = (3.0 * uProgress + 1.0) * (50.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `varying vec3 vColor; void main() { float dist = length(gl_PointCoord - vec2(0.5)); if (dist > 0.5) discard; gl_FragColor = vec4(vColor, 1.0); }`,
      uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(geometry, heroParticlesMaterial);
    if(window.innerWidth > 768) particles.position.x = 25; else particles.position.y = 10;
    scene.add(particles);
    const clock = new THREE.Clock();
    function animate() { requestAnimationFrame(animate); const time = clock.getElapsedTime(); heroParticlesMaterial.uniforms.uTime.value = time; renderer.render(scene, camera); }
    animate();
  };
  window.addEventListener('resize', () => { const w = container.offsetWidth; const h = container.offsetHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); });
}
initHeroParticles();

/* === BACKGROUND PARTICLES (Original) === */
const initThreeJS = () => {
  const canvas = document.querySelector('#webgl-canvas');
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x000000, 0.001);
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); camera.position.z = 10;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const isMobile = window.innerWidth < 768; const count = isMobile ? 800 : 3000;
  const particlesGeo = new THREE.BufferGeometry(); const posArray = new Float32Array(count * 3);
  for(let i=0; i<count*3; i++) posArray[i] = (Math.random() - 0.5) * 40;
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const material = new THREE.PointsMaterial({ size: 0.05, color: 0xD4AF37, transparent: true, opacity: 0.8 });
  const particlesMesh = new THREE.Points(particlesGeo, material); scene.add(particlesMesh);
  let mouseX = 0; let mouseY = 0;
  document.addEventListener('mousemove', (event) => { mouseX = event.clientX - window.innerWidth / 2; mouseY = event.clientY - window.innerHeight / 2; });
  const clock = new THREE.Clock();
  const animate = () => { const elapsedTime = clock.getElapsedTime(); particlesMesh.rotation.y += 0.05 * (mouseX * 0.001 - particlesMesh.rotation.y); particlesMesh.rotation.x += 0.05 * (mouseY * 0.001 - particlesMesh.rotation.x); particlesMesh.rotation.z = elapsedTime * 0.02; renderer.render(scene, camera); requestAnimationFrame(animate); };
  animate();
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
};

/* === INPUT MASK === */
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', (e) => {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    if (!x[2] && x[1] !== '') { e.target.value = '+7 (' + x[1]; }
    else { e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : ''); }
  });
});
