// === CONFIGURATION ===
const PARTICLE_COUNT = 150;
const STAR_COLORS = ['#00f5ff', '#ff00aa', '#ffd700', '#00ff88', '#ff6b6b'];

// === STATE VARIABLES ===
let particles = [];
let isPlaying = false;
let currentSection = 'home';
let gameCards = [];
let flippedCards = [];
let moves = 0;
let canFlip = true;

// === TYPING ANIMATION ===
const typingPhrases = [
  "Prepare for an interactive journey through STEM, Creativity, and Code.",
  "Explore the universe of digital possibilities.",
  "Where imagination meets technology."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  const element = document.getElementById('typing-text');
  if (!element) return;
  
  const currentPhrase = typingPhrases[phraseIndex];
  
  if (isDeleting) {
    element.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    element.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 60;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    delay = 500;
  }

  setTimeout(typeText, delay);
}

// === WELCOME CANVAS (STARS) ===
function initWelcomeCanvas() {
  const canvas = document.getElementById('welcome-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.1,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
    });
  }

  function animate() {
    // Check if canvas is still valid
    if (canvas.width === 0 || canvas.height === 0) return requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(3, 0, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, Math.max(0.5, star.radius), 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = canvas.height;
        star.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// === PARTICLE CANVAS (MAIN APP) ===
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
    });
  }

  function animate() {
    if (canvas.width === 0 || canvas.height === 0) return requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(3, 0, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 - dist / 800})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// === SITE ENTRY ===
function enterSite() {
  const welcome = document.getElementById('welcome-screen');
  const app = document.getElementById('app-container');
  
  if (!welcome || !app) return;

  welcome.style.opacity = '0';
  welcome.style.transition = 'opacity 0.8s';
  
  setTimeout(() => {
    welcome.style.display = 'none';
    app.classList.remove('hidden');
    initParticleCanvas();
  }, 800);
}

// === NAVIGATION ===
function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.section');
  const navBtns = document.querySelectorAll('.nav-links button');

  sections.forEach(s => s.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
  
  const activeBtn = document.querySelector(`.nav-links button[onclick="navigateTo('${sectionId}')"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  currentSection = sectionId;
  
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('open');
}

function toggleMobileNav() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.toggle('open');
}

// === CUSTOMIZATION PANEL ===
function togglePanel() {
  const panel = document.getElementById('custom-panel');
  if (panel) panel.classList.toggle('open');
}

function updateFont(font) {
  document.body.style.fontFamily = font;
}

function updateTextSize(size) {
  const sizeVal = document.getElementById('size-val');
  if (sizeVal) sizeVal.textContent = size;
  document.body.style.fontSize = size + 'px';
}

function updateTheme(theme) {
  const root = document.documentElement;
  const themes = {
    cyan: { accent: '#00f5ff', glow: 'rgba(0,245,255,0.5)' },
    green: { accent: '#00ff88', glow: 'rgba(0,255,136,0.5)' },
    gold: { accent: '#ffd700', glow: 'rgba(255,215,0,0.5)' }
  };
  if (themes[theme]) {
    root.style.setProperty('--accent-cyan', themes[theme].accent);
    root.style.setProperty('--glow-cyan', `0 0 30px ${themes[theme].glow}`);
  }
}

function toggleHighContrast(enabled) {
  if (enabled) {
    document.body.style.filter = 'contrast(1.3)';
  } else {
    document.body.style.filter = '';
  }
}

// === MEMORY GAME ===
const gameSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function initGame() {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  gameCards = [...gameSymbols, ...gameSymbols].sort(() => Math.random() - 0.5);
  flippedCards = [];
  moves = 0;
  canFlip = true;
  
  const movesSpan = document.getElementById('moves');
  if (movesSpan) movesSpan.textContent = moves;

  gameCards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    const movesSpan = document.getElementById('moves');
    if (movesSpan) movesSpan.textContent = moves;
    
    canFlip = false;

    const [c1, c2] = flippedCards;
    if (c1.dataset.symbol === c2.dataset.symbol) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      flippedCards = [];
      canFlip = true;
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.textContent = '';
        c2.textContent = '';
        flippedCards = [];
        canFlip = true;
      }, 800);
    }
  }
}

// === MUSIC PLAYER ===
function toggleMusic() {
  const btn = document.getElementById('play-btn');
  isPlaying = !isPlaying;
  btn.innerHTML = isPlaying ? '&#x23F8;' : '&#x25B6;';
  
  if (isPlaying) {
    startVisualizer();
  }
}

function prevTrack() {
  console.log('Previous track');
}

function nextTrack() {
  console.log('Next track');
}

function startVisualizer() {
  const canvas = document.getElementById('visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw() {
    if (!isPlaying) return;

    ctx.fillStyle = 'rgba(3, 0, 20, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barCount = 20;
    const barWidth = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * canvas.height * 0.8;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#00f5ff');
      gradient.addColorStop(1, '#ff00aa');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeCanvas();
  typeText();
  initGame();
});
