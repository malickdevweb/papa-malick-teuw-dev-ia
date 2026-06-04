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
    const current = (window._typewriterRoles || roles)[roleIdx % (window._typewriterRoles || roles).length];
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
      msg.className = 'ai-msg bot';
      msg.innerHTML = `<span class="ai-msg-avatar"><i class="fa-solid fa-robot"></i></span><div class="ai-msg-bubble">${responses[idx++]}</div>`;
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
  m91: "M91 Infinity Group est une plateforme corporate premium et full-stack développée par Malick. Elle regroupe l'Immobilier, la Tech, le Web et une Academy. Design haut de gamme et SEO optimisé, déployée sur Vercel.",
  wego: "Wego Elite (Wigo) est une super-app PWA similaire à Yango (mobilité VTC, restaurants, hôtels et services 360°) développée par Malick pour une entreprise étrangère. Le code est privé mais le projet est déployé en production.",
  stack: "Compétences de Malick Teuw — Frontend: React, Angular, TypeScript, Tailwind, Flutter. Backend: Laravel (PHP), Spring Boot (Java), Node.js/Express, Python. IA/ML: TensorFlow, OpenAI API, HuggingFace, LLM/RAG, Deep Learning. DevOps: Docker, Nginx, Render, Railway, AWS, GitHub Actions. BDD: PostgreSQL, MySQL, MongoDB, Supabase, Firebase.",
  hire: "Pourquoi recruter Malick Teuw ? Il maîtrise l'ensemble de la stack web — du frontend React jusqu'au backend distribué (Laravel, Spring Boot, Node.js) et l'IA (TensorFlow, OpenAI). Il a 11 projets concrets déployés en production. Formé à l'Orange Digital Center (Sonatel Académie) et certifié ISEP-Thies. Rigoureux, autonome, passionné d'IA appliquée.",
  contact: "Contact : Email : malickteuw.devweb@gmail.com | WhatsApp/Tél : +221 77-171-90-13 | Portfolio : malickteuw.vercel.app | GitHub : github.com/malickteuw",
  formation: "Malick Teuw a suivi : Formation Full-Stack Developer à l'Orange Digital Center (Sonatel Académie) 2025, Certification CCP Développement Web à ISEP-Thies (2024), Baccalauréat mention Assez Bien (2022-2023), plusieurs certifications Coursera et Force-N en IA et développement web."
};

// Remplacez par votre VRAIE clé Mistral (⚠️ NE PAS POUSSER SUR GITHUB PUBLIC)
const MISTRAL_API_KEY = "qb00iolWIoj9GhDYBAOxElFjZWcyeRYt"; 

async function streamAIResponse(question, typingIndicator, msgsContainerId = 'ai-messages', isDemo = false) {
  const msgs = document.getElementById(msgsContainerId);
  const msgClassPrefix = isDemo ? 'demo' : 'ai';
  
  if (MISTRAL_API_KEY === "VOTRE_CLE_MISTRAL_ICI") {
    typingIndicator.remove();
    appendBotMsg("⚠️ **Attention :** Insérez votre clé d'API Mistral (ligne 269) pour activer l'IA.", msgsContainerId, isDemo);
    return;
  }

  const systemPrompt = `Tu es l'assistant IA exclusif et officiel du portfolio de Papa Malick TEUW. Tu es un modèle très performant.
  TA MISSION: Répondre aux questions des recruteurs avec assurance, professionnalisme et précision. Tu dois agir comme le meilleur ambassadeur de Malick, en mettant en avant son profil pour décrocher le poste de "Développeur IA - Spécialiste LLM" (particulièrement visé à la SAT Dakar). Utilise un formatage Markdown (gras, puces) élégant.
  
  CONTEXTE STRICT DU PROFIL DE MALICK:
  - Identité : Papa Malick TEUW, basé à Dakar, Sénégal. Contact: malickteuw.devweb@gmail.com / +221 77 171 90 13.
  - Formation : Sonatel Académie (Orange Digital Center) 2025, Certif ISEP-Thies 2024, Certifs IA Coursera & Force-N.
  - Compétences IA : LLM, OpenAI, Mistral, Ollama, LangChain, LangGraph, RAG, ChromaDB, FAISS, TensorFlow.
  - Compétences Dev : Python, FastAPI, React.js, Node.js, Laravel, Spring Boot, Flutter.
  - Compétences DevOps / Cloud : AWS, Terraform, Docker, Jenkins, GitHub Actions.
  
  PROJETS PHARES À METTRE EN AVANT:
  1. PMT-AGENT-IA : Plateforme AI-OS Entreprise à "double cerveau" (LangGraph + Ollama), RAG via FastAPI/ChromaDB. Déployé sur AWS avec Terraform.
  2. AgriSen : IA Agricole (TensorFlow pour la détection de maladies des plantes + LLM pour les recommandations).
  3. Assistant IA RAG : Interrogation de PDFs via architecture microservices conteneurisée.
  4. Backend Distribué : BANQUE (Laravel/Horizon multi-DB) et BankODC (Spring Boot/JWT).
  
  RÈGLE D'OR (STRICTE): Si on te pose une question hors du cadre professionnel de Malick (ex: cuisine, sport, devinettes, etc.), tu DOIS refuser catégoriquement avec politesse et dire : "Je suis l'assistant IA personnel de Papa Malick Teuw, conçu **exclusivement** pour présenter son expertise professionnelle. Je suis spécialisé dans ses compétences en **LLM, RAG, Python, React et DevOps**. Souhaitez-vous que je vous détaille l'un de ses 11 projets ?"`;

  const div = document.createElement('div');
  div.className = `${msgClassPrefix}-msg bot`;
  div.innerHTML = `<span class="${msgClassPrefix}-msg-avatar ${isDemo ? 'demo-avatar' : ''}"><i class="fa-solid fa-robot"></i></span><div class="${msgClassPrefix}-msg-bubble ${isDemo ? 'demo-bubble' : ''}"></div>`;
  const bubble = div.querySelector(`.${msgClassPrefix}-msg-bubble`) || div.querySelector('.demo-bubble');

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.2,
        stream: true
      })
    });

    typingIndicator.remove(); // Supprime l'indicateur de frappe
    msgs.appendChild(div);    // Ajoute la vraie bulle de message

    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr.trim() === "[DONE]") return;
          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices[0].delta.content || "";
            fullText += delta;
            bubble.innerHTML = fullText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            msgs.scrollTop = msgs.scrollHeight;
          } catch (e) {}
        }
      }
    }
  } catch (error) {
    console.error("Erreur API Mistral:", error);
    if(typingIndicator.parentNode) typingIndicator.remove();
    if(!div.parentNode) msgs.appendChild(div);
    bubble.innerHTML = "Désolé, mon serveur IA est temporairement indisponible.";
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function appendUserMsg(text, containerId = 'ai-messages', isDemo = false) {
  const msgs = document.getElementById(containerId);
  const div = document.createElement('div');
  const prefix = isDemo ? 'demo' : 'ai';
  div.className = `${prefix}-msg user`;
  div.innerHTML = `<div class="${prefix}-msg-bubble ${isDemo ? 'demo-bubble' : ''}">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendBotMsg(text, containerId = 'ai-messages', isDemo = false) {
  const msgs = document.getElementById(containerId);
  const div = document.createElement('div');
  const prefix = isDemo ? 'demo' : 'ai';
  div.className = `${prefix}-msg bot`;
  div.innerHTML = `<span class="${prefix}-msg-avatar ${isDemo ? 'demo-avatar' : ''}"><i class="fa-solid fa-robot"></i></span><div class="${prefix}-msg-bubble ${isDemo ? 'demo-bubble' : ''}">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping(containerId = 'ai-messages', isDemo = false) {
  const msgs = document.getElementById(containerId);
  const div = document.createElement('div');
  const prefix = isDemo ? 'demo' : 'ai';
  div.className = `${prefix}-msg bot`;
  div.id = `${prefix}-typing-indicator`;
  div.innerHTML = `<span class="${prefix}-msg-avatar ${isDemo ? 'demo-avatar' : ''}"><i class="fa-solid fa-robot"></i></span><div class="${prefix}-msg-bubble ${isDemo ? 'demo-bubble' : ''}"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  const sugg = document.querySelector('.ai-suggestions');
  if (sugg) sugg.remove();
  
  appendUserMsg(text);
  const typing = appendTyping();
  
  await streamAIResponse(text, typing);
}

async function sendSuggestion(btn) {
  const text = btn.textContent;
  const sugg = document.querySelector('.ai-suggestions');
  if (sugg) sugg.remove();
  
  appendUserMsg(text);
  const typing = appendTyping();
  
  await streamAIResponse(text, typing);
}

// === LIVE DEMO CHAT LOGIC ===
async function sendDemoMessage() {
  const input = document.getElementById('demo-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  
  const sugg = document.querySelector('.demo-suggestions');
  if (sugg) sugg.remove();
  
  appendUserMsg(text, 'demo-chat-body', true);
  const typing = appendTyping('demo-chat-body', true);
  
  await streamAIResponse(text, typing, 'demo-chat-body', true);
}

async function demoSuggest(btn) {
  const text = btn.textContent;
  const sugg = document.querySelector('.demo-suggestions');
  if (sugg) sugg.remove();
  
  appendUserMsg(text, 'demo-chat-body', true);
  const typing = appendTyping('demo-chat-body', true);
  
  await streamAIResponse(text, typing, 'demo-chat-body', true);
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

// === I18N TRANSLATION SYSTEM ===
const translations = {
  fr: {
    "nav.about": "À propos",
    "nav.projects": "Projets",
    "nav.experience": "Expérience",
    "nav.hire": "Recrutez-moi",
    "hero.badge": "Disponible — Orange Digital Center 2025",
    "hero.title": "Je construis des <span class=\"gradient-text\">systèmes IA</span><br>qui passent à l'échelle",
    "hero.sub": "Je conçois et déploie des systèmes LLM de qualité industrielle, des pipelines RAG et des backends distribués qui résolvent des problèmes concrets.",
    "hero.stat1": "Projets livrés",
    "hero.stat2": "Ans d'expérience",
    "hero.stat3": "Systèmes intégrés",
    "hero.opentowork": "Disponible",
    "about.title": "Je ne fais pas que coder.<br>J' <span class=\"gradient-text\">architecture des systèmes.</span>",
    "about.p1": "Développeur Web Full-Stack passionné par l'IA et les technologies émergentes. Je transforme des idées en interfaces simples, efficaces et augmentées par l'intelligence artificielle.",
    "about.p2": "De la gestion bancaire distribuée à la vision par ordinateur agricole — chaque projet que je livre est conçu pour avoir un impact réel en production.",
    "about.status_title": "En cours de construction",
    "about.status_desc": "AgriSen AI — TensorFlow + OpenAI + React.js · Déploiement cloud",
    "about.card1_title": "IA & LLM",
    "about.card1_desc": "TensorFlow, OpenAI API, RAG pipelines — de l'idée à l'API production",
    "about.card2_title": "Architecture Backend",
    "about.card2_desc": "Laravel, Spring Boot, Node.js — systèmes distribués, async, microservices",
    "about.card3_title": "Mise en Production",
    "about.card3_desc": "Docker, CI/CD, Render, AWS — pas que sur localhost",
    "about.card4_title": "Python & Architecture",
    "about.card4_desc": "Automatisation, conception de solutions logicielles et algorithmiques avec Python",
    "projects.title": "13 Projets <span class=\"gradient-text\">Concrets</span>",
    "projects.sub": "Du backend bancaire distribué à la plateforme IA agricole — chaque projet est déployé, documenté et démonstrable.",
    "experience.title": "Mon <span class=\"gradient-text\">Parcours</span>",
    "stack.title": "Ce que je <span class=\"gradient-text\">Maîtrise</span>",
    "contact.title": "Construisons quelque chose<br><span class=\"gradient-text\">d'Exceptionnel</span>",
    "contact.sub": "Disponible pour des postes Full-Stack, Backend et IA. Discutons !",
    "_typewriter": ["Développeur Full-Stack", "Ingénieur IA", "Architecte Backend", "Bâtisseur de systèmes LLM"]
  },
  en: {
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.hire": "Hire Me",
    "hero.badge": "Available — Orange Digital Center 2025",
    "hero.title": "Building <span class=\"gradient-text\">AI-Powered</span><br>Systems That Scale",
    "hero.sub": "I design and deploy industrial-grade LLM systems, RAG pipelines, and distributed backends that solve real-world problems.",
    "hero.stat1": "Projects Built",
    "hero.stat2": "Years Building",
    "hero.stat3": "Integrated Systems",
    "hero.opentowork": "Open to work",
    "about.title": "I don't just code.<br>I <span class=\"gradient-text\">architect systems.</span>",
    "about.p1": "Full-Stack Web Developer passionate about AI and emerging technologies. I turn ideas into simple, efficient, AI-augmented interfaces.",
    "about.p2": "From distributed banking to agricultural computer vision — every project I deliver is designed for real production impact.",
    "about.status_title": "Currently Building",
    "about.status_desc": "AgriSen AI — TensorFlow + OpenAI + React.js · Cloud deployment",
    "about.card1_title": "AI & LLM",
    "about.card1_desc": "TensorFlow, OpenAI API, RAG pipelines — from idea to production API",
    "about.card2_title": "Backend Architecture",
    "about.card2_desc": "Laravel, Spring Boot, Node.js — distributed systems, async, microservices",
    "about.card3_title": "Production Deployment",
    "about.card3_desc": "Docker, CI/CD, Render, AWS — not just on localhost",
    "about.card4_title": "Python & Architecture",
    "about.card4_desc": "Automation, software and algorithmic solution design with Python",
    "projects.title": "13 <span class=\"gradient-text\">Concrete</span> Projects",
    "projects.sub": "From distributed banking backend to AI agricultural platform — each project is deployed, documented, and demonstrable.",
    "experience.title": "My <span class=\"gradient-text\">Journey</span>",
    "stack.title": "What I <span class=\"gradient-text\">Master</span>",
    "contact.title": "Let's Build Something<br><span class=\"gradient-text\">Exceptional</span>",
    "contact.sub": "Available for Full-Stack, Backend, and AI positions. Let's talk!",
    "_typewriter": ["Full-Stack Developer", "AI Engineer", "Backend Architect", "LLM Systems Builder"]
  },
  es: {
    "nav.about": "Acerca de",
    "nav.projects": "Proyectos",
    "nav.experience": "Experiencia",
    "nav.hire": "Contrátame",
    "hero.badge": "Disponible — Orange Digital Center 2025",
    "hero.title": "Construyo <span class=\"gradient-text\">sistemas IA</span><br>que escalan",
    "hero.sub": "Diseño y despliego sistemas LLM de grado industrial, pipelines RAG y backends distribuidos que resuelven problemas reales.",
    "hero.stat1": "Proyectos creados",
    "hero.stat2": "Años construyendo",
    "hero.stat3": "Sistemas integrados",
    "hero.opentowork": "Disponible",
    "about.title": "No solo codifico.<br>Yo <span class=\"gradient-text\">arquitecto sistemas.</span>",
    "about.p1": "Desarrollador Web Full-Stack apasionado por la IA y las tecnologías emergentes. Transformo ideas en interfaces simples, eficientes y potenciadas por inteligencia artificial.",
    "about.p2": "Desde la banca distribuida hasta la visión por computadora agrícola — cada proyecto que entrego está diseñado para un impacto real en producción.",
    "about.status_title": "Construyendo ahora",
    "about.status_desc": "AgriSen AI — TensorFlow + OpenAI + React.js · Despliegue cloud",
    "about.card1_title": "IA & LLM",
    "about.card1_desc": "TensorFlow, OpenAI API, RAG pipelines — de la idea a la API en producción",
    "about.card2_title": "Arquitectura Backend",
    "about.card2_desc": "Laravel, Spring Boot, Node.js — sistemas distribuidos, async, microservicios",
    "about.card3_title": "Despliegue en Producción",
    "about.card3_desc": "Docker, CI/CD, Render, AWS — no solo en localhost",
    "about.card4_title": "Python & Arquitectura",
    "about.card4_desc": "Automatización, diseño de soluciones de software y algorítmicas con Python",
    "projects.title": "13 Proyectos <span class=\"gradient-text\">Concretos</span>",
    "projects.sub": "Del backend bancario distribuido a la plataforma IA agrícola — cada proyecto está desplegado, documentado y demostrable.",
    "experience.title": "Mi <span class=\"gradient-text\">Trayectoria</span>",
    "stack.title": "Lo que <span class=\"gradient-text\">Domino</span>",
    "contact.title": "Construyamos algo<br><span class=\"gradient-text\">Excepcional</span>",
    "contact.sub": "Disponible para puestos Full-Stack, Backend e IA. ¡Hablemos!",
    "_typewriter": ["Desarrollador Full-Stack", "Ingeniero IA", "Arquitecto Backend", "Constructor de sistemas LLM"]
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'fr';

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });
  document.documentElement.lang = lang;
  // Update typewriter roles
  if (t._typewriter) {
    window._typewriterRoles = t._typewriter;
  }
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio-lang', lang);
  applyTranslations(lang);
  // Update button label
  const labels = { fr: 'FR', en: 'EN', es: 'ES' };
  const curr = document.getElementById('lang-current');
  if (curr) curr.textContent = labels[lang] || lang.toUpperCase();
  // Update active state
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase().includes(
      lang === 'fr' ? 'français' : lang === 'en' ? 'english' : 'español'
    ));
  });
  // Close dropdown
  closeLangMenu();
}

function toggleLangMenu() {
  const dd = document.getElementById('lang-dropdown');
  dd.classList.toggle('open');
}

function closeLangMenu() {
  const dd = document.getElementById('lang-dropdown');
  if (dd) dd.classList.remove('open');
}

// Close lang dropdown on outside click
document.addEventListener('click', (e) => {
  const sw = document.getElementById('lang-switcher');
  if (sw && !sw.contains(e.target)) closeLangMenu();
});

// Apply saved language on load
window.addEventListener('load', () => {
  switchLang(currentLang);
});
