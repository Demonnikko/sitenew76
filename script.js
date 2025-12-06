/* === GLOBAL & INIT === */
window.addEventListener("DOMContentLoaded", () => {
    
    // PRELOADER
    const preloader = document.getElementById('preloader');
    if(preloader) {
        window.addEventListener("load", () => preloader.classList.add('hide'));
    }

    // HOME PAGE LOGIC
    if (document.body.classList.contains('page-home')) {
        initHomeAnimations();
        initThreeJS();
        initGame();
        updateServices();
    }
    
    // AFISHA PAGE LOGIC
    if (document.body.classList.contains('page-afisha')) {
        initAfishaSwipers();
        gsap.from(".afisha-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    }

    // SCHOOL PAGE LOGIC
    if (document.body.classList.contains('page-school')) {
        initSchoolTimer();
        gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    }

    // COMMON ANIMATIONS (Reveal on scroll)
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".gs-reveal").forEach(elem => {
        gsap.from(elem, { 
            scrollTrigger: { trigger: elem, start: "top 85%" }, 
            y: 40, opacity: 0, duration: 0.8, ease: "power3.out" 
        });
    });

    // INPUT MASK
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            if (!x[2] && x[1] !== '') { e.target.value = '+7 (' + x[1]; }
            else { e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : ''); }
        });
    });
});

/* === NAVIGATION === */
function toggleMenu(){ 
    document.getElementById('mobileMenu').classList.toggle('open'); 
    const burger = document.querySelector('.burger');
    if(burger) burger.classList.toggle('active'); 
}

/* === MODALS COMMON === */
function openVideo(){ 
    const m = document.getElementById('modalVideo');
    if(m) {
        m.classList.add('open'); 
        document.getElementById('vidContainer').innerHTML = '<iframe src="https://rutube.ru/play/embed/a692a6ad3b922abc4cfad5be5898431b?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>'; 
    }
}
function closeVideo(){ 
    const m = document.getElementById('modalVideo');
    if(m) {
        m.classList.remove('open'); 
        document.getElementById('vidContainer').innerHTML = ''; 
    }
}
// Story Viewer
function openReview(el) {
    const src = el.querySelector('video').src;
    const v = document.getElementById('storyVideo');
    v.src = src; 
    document.getElementById('storyViewer').classList.add('active');
    v.play();
}
function closeReview() {
    document.getElementById('storyViewer').classList.remove('active');
    document.getElementById('storyVideo').pause();
}

/* === HOME SPECIFIC === */
function initHomeAnimations() {
    // Force Scroll Top
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
        onComplete: () => {
            document.body.classList.add('loaded'); 
            const c = document.querySelector('.curtain-wrapper');
            if(c) {
               c.classList.add('finished');
               setTimeout(() => c.style.display = 'none', 1000);
            }
        }
    });

    tl.to(".curtain-text", { opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
      .to(".curtain-subtext", { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=1")
      .to(".curtain-panel.left", { xPercent: -100, duration: 2.5, ease: "power2.inOut" }, "+=0.5")
      .to(".curtain-panel.right", { xPercent: 100, duration: 2.5, ease: "power2.inOut" }, "<")
      .to(".curtain-content", { opacity: 0, scale: 1.2, duration: 1.5, ease: "power2.in" }, "<")
      .to(".curtain-bg", { opacity: 0, duration: 1 }, "-=2.0")
      .to({}, { duration: 3, onUpdate: function() { if(typeof heroParticlesMaterial !== 'undefined' && heroParticlesMaterial) { gsap.to(heroParticlesMaterial.uniforms.uProgress, { value: 1, duration: 4, ease: "power2.out" }); } } }, "-=2.0")
      .from(".hero-title", { y: 100, opacity: 0, duration: 1, ease: "power3.out" }, "-=1.5")
      .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.8")
      .from(".hero-btns", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
}

/* === CALCULATOR (HOME) === */
const travel={ "Вологодская":{fee:9000,cities:{Вологда:9000,Череповец:15000,Сокол:12000}}, "Владимирская":{fee:10000,cities:{Владимир:10000,Ковров:10000,Муром:17000,"Гусь хрустальный":13500}}, "Ивановская":{fee:5000,cities:{Иваново:2000,Кинешма:3500,Шуя:3000,Тейково:2500}}, "Костромская":{fee:3000,cities:{Кострома:2000,Шарья:6000,Нерехта:2000}}, "Ярославская":{fee:1000,cities:{Ярославль:0,Рыбинск:2000,Тутаев:2000,Углич:2000,Ростов:2000}} };
const services={
  close: { "Микромагия (30 мин)": 13000, "Микромагия (1 час)": 20000, "Микромагия (2 часа)": 30000, "Микромагия (3 часа)": 36000 },
  std: { "Взрослое шоу (20 мин)": 17500, "Взрослое шоу (30 мин)": 23750, "Взрослое шоу (40 мин)": 30000 },
  spec: { "Свадебное шоу (20 мин)": 26250, "Свадебное шоу (30 мин)": 32500 },
  kids: { "Детское шоу (30 мин)": 11250, "Детское шоу (40 мин)": 13750 },
  conc: { "Концерт «СЕКРЕТ» (мини)": 150000, "Концерт «СЕКРЕТ» (полный)": 300000 }
};
const catNames = { close: "Микромагия (Welcome)", std: "Сценическое шоу (Банкет)", spec: "Свадьбы и Корпоративы", kids: "Детские праздники", conc: "Концертные шоу" };
let selectedServices = [];

function updateCities(){
    const area = document.getElementById('area').value;
    const citySel = document.getElementById('city');
    citySel.innerHTML='<option disabled selected>Город</option>';
    citySel.disabled=false;
    Object.keys(travel[area].cities).forEach(c=>citySel.add(new Option(c,c)));
}

function updateServices(){
  const grid = document.getElementById('svcOptions');
  if(!grid) return;
  grid.innerHTML='';
  selectedServices = []; 
  
  Object.keys(services).forEach(catKey => {
    const wrapper = document.createElement('div'); wrapper.className = 'svc-category-group';
    const header = document.createElement('div'); header.className = 'svc-group-title'; header.innerText = catNames[catKey]; wrapper.appendChild(header);
    const g = document.createElement('div'); g.className = 'svc-grid';
    Object.keys(services[catKey]).forEach(sName => {
      const btn = document.createElement('div'); btn.className = 'svc-btn';
      btn.innerHTML = `<span class="svc-name">${sName}</span><span class="svc-cost">${services[catKey][sName].toLocaleString()} ₽</span>`;
      btn.onclick = () => toggleService(btn, sName, services[catKey][sName]);
      g.appendChild(btn);
    });
    wrapper.appendChild(g); grid.appendChild(wrapper);
  });
}
function toggleService(btn, name, price) {
  const idx = selectedServices.findIndex(s => s.name === name);
  if (idx > -1) { selectedServices.splice(idx, 1); btn.classList.remove('selected'); } 
  else { selectedServices.push({name, price}); btn.classList.add('selected'); }
}
function nextStep(n){
  const area = document.getElementById('area');
  const city = document.getElementById('city');
  const date = document.getElementById('date');
  if(n===2 && (!area.value||!city.value)){alert('Выберите регион и город');return;}
  if(n===2 && date.value) {
      if (new Date(date.value) <= new Date().setHours(0,0,0,0)) { alert('Бронирование возможно только с завтрашнего дня.'); return; }
  }
  document.querySelectorAll('.wizard-step').forEach(e=>e.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
  document.getElementById('wizProgress').style.width=(n*33)+'%';
  if (n===3) document.getElementById('calc').scrollIntoView({behavior: 'smooth'});
}
function calcResult(){
  if (selectedServices.length === 0) { alert('Выберите хотя бы одну услугу'); return; }
  let base = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const road = travel[document.getElementById('area').value].cities[document.getElementById('city').value];
  if(document.getElementById('area').value==='Ярославская' && document.getElementById('city').value==='Ярославль') base+=1000;
  
  const g = parseInt(document.getElementById('gRange').value); 
  const gFee = g>50 ? (g-50)*50 : 0;
  
  const isGameWinner = localStorage.getItem('game_win') === 'true';
  const isBundle = selectedServices.length >= 2;
  let discPercent = 0; let discReason = 'Нет';
  if (isGameWinner) { discPercent = 20; discReason = '20% (Победа)'; }
  else if (isBundle) { discPercent = 10; discReason = '10% (Пакет услуг)'; }

  const totalRaw = base + road + gFee;
  const disc = Math.round(totalRaw * (discPercent / 100));
  const total = totalRaw - disc;

  document.getElementById('rSvc').innerHTML = selectedServices.map(s => s.name).join('<br>');
  document.getElementById('rRoad').innerText=road.toLocaleString()+' ₽';
  document.getElementById('rGuest').innerText=gFee.toLocaleString()+' ₽';
  document.getElementById('rDisc').innerText=disc?`-${disc} ₽ (${discReason})`:'0 ₽';
  document.getElementById('rTotal').innerText=total.toLocaleString()+' ₽';
  
  nextStep(3);
}

/* === AFISHA SWIPER === */
function initAfishaSwipers() {
    new Swiper('.mySwiper', {
        pagination: { el: '.swiper-pagination', clickable: true },
        effect: 'coverflow', 
        coverflowEffect: { rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: false },
        on: {
            slideChange: function () {
                const vid = this.slides[1].querySelector('video');
                if (this.activeIndex === 1 && vid) { vid.currentTime = 0; vid.play(); }
                else if (vid) vid.pause();
            }
        }
    });
}

/* === SCHOOL TIMER === */
function initSchoolTimer() {
    const deadline = Date.now() + 3*24*60*60*1000;
    function tick(){
      const diff = deadline - Date.now();
      if(diff<=0) return;
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const dEl = document.getElementById('d');
      if(dEl) {
          dEl.innerText = String(d).padStart(2,'0');
          document.getElementById('h').innerText = String(h).padStart(2,'0');
          document.getElementById('m').innerText = String(m).padStart(2,'0');
      }
      requestAnimationFrame(tick);
    }
    tick();
}

/* === GAME === */
function initGame() {
    const deck = document.getElementById('gameDeck');
    const msg = document.getElementById('gameMsg');
    if (!deck) return;
    deck.innerHTML = '';
    
    const lastPlayed = parseInt(localStorage.getItem('game_timestamp')) || 0;
    const hasWon = localStorage.getItem('game_win') === 'true';
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; 

    if (now - lastPlayed < cooldown) {
        deck.innerHTML = `<div style="padding:20px; border:1px solid #333; border-radius:10px;"><h3>${hasWon ? 'Скидка Ваша!' : 'Попытка потрачена'}</h3><p style="color:#888; font-size:0.8rem;">Приходите завтра</p></div>`;
        return;
    }

    const winIdx = Math.floor(Math.random() * 3);
    const suits = ['♠', '♥', '♣', '♦'];
    const ranks = ['J', 'Q', 'K', 'A'];

    for (let i = 0; i < 3; i++) {
        const isWin = (i === winIdx);
        const suit = isWin ? '♠' : suits[Math.floor(Math.random()*4)];
        const rank = isWin ? 'A' : ranks[Math.floor(Math.random()*4)];
        const card = document.createElement('div'); card.className = 'card-play';
        card.innerHTML = `<div class="face back"></div><div class="face front" style="color:${['♠','♣'].includes(suit)?'#000':'#c00'}">${rank}${suit}</div>`;
        card.onclick = () => {
            if (deck.classList.contains('played')) return;
            deck.classList.add('played');
            localStorage.setItem('game_timestamp', Date.now());
            document.querySelectorAll('.card-play').forEach(el => el.classList.add('flipped'));
            if (isWin) {
                msg.innerText = 'ПОБЕДА! Скидка 20%';
                localStorage.setItem('game_win', 'true');
            } else {
                msg.innerText = 'Увы, повезет в любви.';
                localStorage.setItem('game_win', 'false');
            }
        };
        deck.appendChild(card);
    }
}

/* === THREE.JS PARTICLES === */
let heroParticlesMaterial;
function initThreeJS() {
  const container = document.getElementById('hero-particles-container'); if (!container) return;
  const scene = new THREE.Scene();
  const width = container.offsetWidth; const height = container.offsetHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); camera.position.z = 100;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  const img = new Image(); 
  img.crossOrigin = "Anonymous"; 
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
