// === LOADER ===
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader-overlay');
    if (loader) loader.classList.add('hidden');
  }, 1400);
});

// === SCROLL PROGRESS ===
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

// === BACK TO TOP ===
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// === TYPEWRITER ===
(function typewriter() {
  const roles = ['Full-Stack Developer', 'AI Engineer', 'Backend Architect', 'LLM Systems Builder'];
  const el = document.getElementById('typewriter');
  if (!el) return;
  let roleIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const current = roles[roleIdx];
    el.textContent = current.slice(0, charIdx);
    if (!deleting && charIdx < current.length) { charIdx++; setTimeout(tick, 80); }
    else if (!deleting && charIdx === current.length) { deleting = true; setTimeout(tick, 1800); }
    else if (deleting && charIdx > 0) { charIdx--; setTimeout(tick, 45); }
    else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(tick, 300); }
  }
  setTimeout(tick, 500);
})();

// === ACTIVE NAV ON SCROLL ===
(function trackActiveNav() {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });
})();

// === ANIMATED COUNTERS ===
(function initCounters() {
  function animateNum(el) {
    const target = parseInt(el.dataset.target);
    const is100 = target === 100;
    let cur = 0;
    const step = Math.max(1, target / 60);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        el.textContent = target + (is100 ? '%' : '+');
        clearInterval(timer); return;
      }
      el.textContent = Math.floor(cur) + (is100 ? '%' : '+');
    }, 25);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.metric-num[data-target]').forEach(animateNum);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  const grid = document.querySelector('.metrics-grid');
  if (grid) obs.observe(grid);
})();

// === MOBILE MENU ===

function toggleMobileMenu() {
  const menu = document.getElementById('nav-mobile-menu');
  const btn = document.getElementById('nav-hamburger');
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobileMenu() {
  document.getElementById('nav-mobile-menu').classList.remove('open');
  document.getElementById('nav-hamburger').classList.remove('open');
  document.body.style.overflow = '';
}

// === NAVBAR SCROLL ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// === FOOTER YEAR ===
document.getElementById('footer-year').textContent = new Date().getFullYear();

// === CANVAS PARTICLES ===
(function initParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('particles');
  container.appendChild(canvas);
  let W, H, particles;
  function resize() {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + .5,
      dx: (Math.random() - .5) * .4,
      dy: (Math.random() - .5) * .4,
      opacity: Math.random() * .6 + .2
    };
  }
  function init() { resize(); particles = Array.from({ length: 80 }, mkParticle); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${p.opacity})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${.15 * (1 - dist / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', init);
  init(); draw();
})();

// === DEMO CHAT ANIMATION ===
(function animateDemo() {
  const responses = [
    "The RAG Assistant is Malick's flagship project — an AI system that lets you upload PDFs, indexes them with vector embeddings (ChromaDB), and answers questions via streaming LLM responses. Built with FastAPI + Docker.",
    "Key tech: OpenAI / Mistral, LangChain, ChromaDB, FastAPI, Docker. Full production deployment.",
    "Ask me more — I know all 4 projects in detail! 🚀"
  ];
  let idx = 0;
  const typingEl = document.getElementById('demo-typing');
  const body = document.getElementById('demo-chat-body');
  function addResponse() {
    if (idx >= responses.length) return;
    typingEl.style.display = 'flex';
    setTimeout(() => {
      typingEl.style.display = 'none';
      const msg = document.createElement('div');
      msg.className = 'chat-msg bot';
      msg.innerHTML = `<span class="chat-avatar">🤖</span><span>${responses[idx++]}</span>`;
      body.insertBefore(msg, typingEl);
      body.scrollTop = body.scrollHeight;
      if (idx < responses.length) setTimeout(addResponse, 3500);
    }, 1500);
  }
  setTimeout(addResponse, 2000);
})();

// === ARCHITECTURE MODAL ===
const modalData = {
  rag: {
    title: '🧠 AI RAG Assistant — Architecture',
    steps: [
      { n: '1', h: 'Document Ingestion', p: 'PDF upload via FastAPI → text extraction → chunking into semantic segments' },
      { n: '2', h: 'Vector Embeddings', p: 'OpenAI / sentence-transformers generate embeddings → stored in ChromaDB / FAISS' },
      { n: '3', h: 'Semantic Retrieval', p: 'User query is embedded → cosine similarity search → top-k relevant chunks retrieved' },
      { n: '4', h: 'LLM Generation', p: 'Context + query sent to LLM (GPT-4 / Mistral) → streaming SSE response via FastAPI' },
      { n: '5', h: 'Deployment', p: 'Docker Compose: FastAPI + ChromaDB + Nginx reverse proxy. CI/CD ready.' },
    ]
  },
  agrisen: {
    title: '🌾 AgriSen AI Platform — Architecture',
    steps: [
      { n: '1', h: 'Image Capture', p: 'Farmer uploads crop photo via mobile/web interface or drone integration' },
      { n: '2', h: 'Computer Vision', p: 'TensorFlow CNN model detects disease type, severity, affected area (bounding box)' },
      { n: '3', h: 'LLM Recommendations', p: 'Detection result passed to LLM → generates agronomic advice, treatment plan' },
      { n: '4', h: 'Analytics Dashboard', p: 'Time-series metrics, heatmaps, zone-level health scores, export reports' },
      { n: '5', h: 'Alert System', p: 'Threshold-based push alerts + weekly AI summary reports per farm zone' },
    ]
  },
  banking: {
    title: '💳 Banking System — Architecture',
    steps: [
      { n: '1', h: 'Auth Layer', p: 'JWT authentication + role-based access control (admin, user, auditor)' },
      { n: '2', h: 'Account Service', p: 'Automated account creation, KYC validation, multi-currency support' },
      { n: '3', h: 'Transaction Engine', p: 'ACID-compliant transfers, idempotency keys, transaction ledger' },
      { n: '4', h: 'Async Processing', p: 'Laravel Horizon queues: notifications, reconciliation jobs, audit logs' },
      { n: '5', h: 'Multi-DB & Monitoring', p: 'PostgreSQL (transactions) + Redis (cache/sessions) + Telescope monitoring' },
    ]
  }
};

function openModal(key) {
  const data = modalData[key];
  if (!data) return;
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <h2>${data.title}</h2>
    <div class="modal-arch">
      ${data.steps.map(s => `
        <div class="arch-step">
          <div class="arch-num">${s.n}</div>
          <div class="arch-text"><h4>${s.h}</h4><p>${s.p}</p></div>
        </div>`).join('')}
    </div>`;
  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// === AI ASSISTANT ===
let aiOpen = false;

function toggleAssistant() {
  aiOpen = !aiOpen;
  const panel = document.getElementById('ai-panel');
  panel.classList.toggle('open', aiOpen);
}

function openAssistant() {
  aiOpen = true;
  document.getElementById('ai-panel').classList.add('open');
  document.getElementById('ai-input').focus();
}

const KB = {
  agrisen: "AgriSen est le projet phare de Malick — une plateforme IA agricole combinant vision par ordinateur (TensorFlow) pour le diagnostic des cultures et des recommandations LLM (OpenAI API). Stack : React.js, Node.js, MySQL/MongoDB, Python Flask, Cloudinary. Objectif : aider les agriculteurs sénégalais à réduire les pertes et améliorer la productivité.",
  bankodc: "BankODC est une application backend Java/Spring Boot complète : création automatique de clients et comptes bancaires, génération de numéros de compte, envoi email/SMS, sécurisation JWT, persistance JPA/PostgreSQL. Déployé sur Render avec Docker.",
  banque: "BANQUE est un système bancaire distribué Laravel avec 3 bases de données : Railway (données clients/comptes), Neon (comptes bloqués via Jobs), MongoDB (transactions). Jobs asynchrones via Laravel Horizon, emails/SMS automatiques, monitoring. Déployé sur Render.",
  maxitsa: "MAXITSA est une solution de paiement et transfert d'argent : création de comptes clients, consultation de solde, transactions sécurisées, back-office commercial. Développé en PHP OOP avec API REST, MySQL/PostgreSQL, Docker + Nginx.",
  cargo: "Gestion des Cargaisons est une API RESTful TypeScript/Node.js pour la gestion de cargaisons, transporteurs et expéditions. Architecture propre : DTOs, Services, Repositories, Middleware JWT. Déployé avec Docker pour la CI/CD.",
  gsalaire: "G-Salaire est une application web de gestion des employés, de la paie, du pointage et des salaires mensuels. Interface React.js + API Node.js + MySQL avec Prisma ORM.",
  jootaaybi: "JOOTAAYBI est un clone WhatsApp 100% vanilla JavaScript : inscription, contacts, chat privé & groupes, envoi de médias, statuts, profil. Frontend : HTML, TailwindCSS, JS vanilla, JSON Server.",
  portfolio: "Ce portfolio contient un assistant IA (celui que vous utilisez !) pour présenter les projets, compétences et parcours de Malick. Développé en React.js + Node.js avec intégration API IA et prompt engineering.",
  etudiants: "Application de gestion académique Laravel : inscriptions, notes, absences et résultats des étudiants. Architecture MVC, base MySQL.",
  stack: "Compétences de Malick Teuw — Frontend: React, Angular, TypeScript, Tailwind, Flutter. Backend: Laravel (PHP), Spring Boot (Java), Node.js/Express, Python. IA/ML: TensorFlow, OpenAI API, HuggingFace, LLM/RAG, Deep Learning. DevOps: Docker, Nginx, Render, Railway, AWS, GitHub Actions. BDD: PostgreSQL, MySQL, MongoDB, Supabase, Firebase.",
  hire: "Pourquoi recruter Malick Teuw ? Il maîtrise l'ensemble de la stack web — du frontend React jusqu'au backend distribué (Laravel, Spring Boot, Node.js) et l'IA (TensorFlow, OpenAI). Il a 9 projets concrets déployés en production. Formé à l'Orange Digital Center (Sonatel Académie) et certifié ISEP-Thies. Rigoureux, autonome, passionné d'IA appliquée.",
  contact: "Contact : Email : malickteuw.devweb@gmail.com | WhatsApp/Tél : +221 77-171-90-13 | Portfolio : malickteuw.vercel.app | GitHub : github.com/malickteuw",
  formation: "Malick Teuw a suivi : Formation Full-Stack Developer à l'Orange Digital Center (Sonatel Académie) 2025, Certification CCP Développement Web à ISEP-Thies (2024), Baccalauréat mention Assez Bien (2022-2023), plusieurs certifications Coursera et Force-N en IA et développement web."
};

function getAIResponse(question) {
  const q = question.toLowerCase();
  if (/agrisen|agricol|culture|plante|récolte|farming|crop|tensorflow/.test(q)) return KB.agrisen;
  if (/bankodc|spring|java/.test(q)) return KB.bankodc;
  if (/banque|laravel|horizon|multi.?db|mongodb/.test(q)) return KB.banque;
  if (/maxitsa|paiement|transfert|payment/.test(q)) return KB.maxitsa;
  if (/cargo|cargaison|typescript/.test(q)) return KB.cargo;
  if (/salaire|paie|employé|gsalaire/.test(q)) return KB.gsalaire;
  if (/jootaaybi|whatsapp|messagerie/.test(q)) return KB.jootaaybi;
  if (/portfolio|assistant|chatbot|chat/.test(q)) return KB.portfolio;
  if (/étudiant|académique|scolaire/.test(q)) return KB.etudiants;
  if (/stack|compétence|technolog|maîtris|skill|framework/.test(q)) return KB.stack;
  if (/recrut|hire|embauche|pourquoi|why|profil/.test(q)) return KB.hire;
  if (/contact|email|whatsapp|téléphone|phone|atteindre/.test(q)) return KB.contact;
  if (/format|certif|diplôme|école|étude|parcours/.test(q)) return KB.formation;
  if (/projet|project|build|travail|work/.test(q)) return "Malick Teuw a 9 projets concrets : AgriSen (IA agricole), BankODC (Spring Boot), BANQUE (Laravel multi-DB), MAXITSA (paiements), Cargaisons (TypeScript), G-Salaire (React+Node), Gestion Étudiants (Laravel), JOOTAAYBI (clone WhatsApp), Portfolio IA. Posez-moi des questions sur l'un d'eux !";
  return "Malick Teuw est un développeur Full-Stack & IA passionné, formé à l'Orange Digital Center (Sonatel Académie). Il maîtrise React, Laravel, Spring Boot, Node.js, TensorFlow et l'intégration LLM. Il a 9 projets déployés. Demandez-moi ses projets, ses compétences ou ses coordonnées !";
}


function appendAIMsg(role, text) {
  const msgs = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.innerHTML = role === 'bot'
    ? `<span class="ai-msg-avatar">🤖</span><div class="ai-msg-bubble">${text}</div>`
    : `<div class="ai-msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping() {
  const msgs = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = 'ai-msg bot';
  div.id = 'ai-typing-indicator';
  div.innerHTML = `<span class="ai-msg-avatar">🤖</span><div class="ai-msg-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function sendMessage() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  // Remove suggestions
  const sugg = document.querySelector('.ai-suggestions');
  if (sugg) sugg.remove();
  appendAIMsg('user', text);
  const typing = appendTyping();
  setTimeout(() => {
    typing.remove();
    appendAIMsg('bot', getAIResponse(text));
  }, 900 + Math.random() * 400);
}

function sendSuggestion(btn) {
  const text = btn.textContent;
  const sugg = document.querySelector('.ai-suggestions');
  if (sugg) sugg.remove();
  appendAIMsg('user', text);
  const typing = appendTyping();
  setTimeout(() => {
    typing.remove();
    appendAIMsg('bot', getAIResponse(text));
  }, 900 + Math.random() * 400);
}

// === INTERSECTION OBSERVER FADE-IN ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1 });
document.querySelectorAll('.project-card, .about-card, .stack-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});
