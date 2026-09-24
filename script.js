/* ═══════════════════════════════════════════════
   FORMS GYM — PROPOSTA COMERCIAL
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── INVESTMENT CONSTANTS ─── */
const SETUP_FEE      = 6900;
const MONTHLY_FEE    = 2490;
const MONTHS         = 6;
const OPTION_A_TOTAL = SETUP_FEE + (MONTHS * MONTHLY_FEE); // 21840
const OPTION_B_TOTAL = 19870;                               // fixed price
const SAVINGS        = OPTION_A_TOTAL - OPTION_B_TOTAL;     // 1970

/* ─── WHATSAPP CONFIG ─── */
const WA_NUMBER = '5545988230845';

const WA_MSG_A = encodeURIComponent(
  'Olá! 🙌 Acabei de ver a proposta da Forms Gym e quero seguir com a Opção A — Implantação + Mensalidade mensal! ' +
  'Vamos dar o próximo passo? 🚀💪'
);
const WA_MSG_B = encodeURIComponent(
  'Olá! 🔥🎉 Acabei de ver a proposta da Forms Gym e quero seguir com a Opção B — Investimento à vista com desconto! ' +
  'Vamos dar o próximo passo? 🚀💪'
);

const WA_URL_A = `https://wa.me/${WA_NUMBER}?text=${WA_MSG_A}`;
const WA_URL_B = `https://wa.me/${WA_NUMBER}?text=${WA_MSG_B}`;

/* ─── PRESENTER MODE (URL-based only) ─── */
const PRESENTER_MODE = new URLSearchParams(window.location.search).get('backstage') === '1';

/* ─── HELPER: Format BRL ─── */
function brl(n) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/* ═══════════════════════════════════════════════
   DEMO SCENARIOS
   Each message: { from, text, time, tag?, isSystem? }
   isSystem = true → renders as a centered action pill
   ═══════════════════════════════════════════════ */

const CENARIOS = {

  /* ── CENÁRIO 1: Quanto custa? ── */
  preco: {
    label: 'Quanto custa?',
    messages: [
      { from: 'user',  text: 'Oi! Quanto custa a academia? 👀', time: '14:32' },
      { from: 'agent', text: 'Oi! 😊 Boa tarde!\n\nAqui é a Ana, da Forms Gym. Que bom que você entrou em contato!\n\nAntes de falar em valores, me conta rapidinho: você já tem experiência com academia, ou está pensando em começar do zero?', time: '14:32' },
      { from: 'user',  text: 'Já treinei antes, mas parei há uns 6 meses', time: '14:33', tag: 'perfil' },
      { from: 'agent', text: 'Então você sabe bem como é essa sensação de "precisar voltar" né? 😄\n\nBoa notícia: retomar é muito mais fácil quando o corpo já tem o histórico.\n\nNossos planos são mensais, trimestrais e semestrais — mas antes de qualquer decisão, que tal conhecer a academia em uma aula experimental gratuita? Você testa o ambiente e a equipe sem nenhum compromisso. 💪', time: '14:33' },
      { from: 'user',  text: 'Tá bom, pode ser essa semana!', time: '14:34', tag: 'interesse' },
      { from: 'agent', text: '🔍 Consultando a agenda desta semana...', time: '14:34', isSystem: true },
      { from: 'agent', text: 'Ótimo! Temos estas opções disponíveis:\n\n📅 Terça · 8h ou 10h\n📅 Quarta · 7h ou 19h\n📅 Quinta · 9h ou 18h\n📅 Sábado · 9h\n\nQual horário funciona melhor pra você?', time: '14:34' },
      { from: 'user',  text: 'Quinta às 9h está perfeito!', time: '14:35' },
      { from: 'agent', text: '✅ Confirmado!\n\n📋 Aula Experimental · Forms Gym\n📅 Quinta-feira\n🕘 9h00\n📍 Cascavel, PR\n\nChega com 10 minutinhos de antecedência para fazer seu cadastro. A equipe já vai estar te esperando! 🏋️\n\nNos vemos na quinta! 😊', time: '14:35', tag: 'agendamento' },
    ],
    backstage: {
      'perfil':      { icon: '💡', text: 'Perfil: aluno retornante · parou há 6 meses' },
      'interesse':   { icon: '📌', text: 'Intenção confirmada: aceita aula experimental esta semana' },
      'agendamento': { icon: '✅', text: 'AGENDADO · Quinta-feira 9h · cadastro pendente na chegada' },
    },
    summary: {
      'Status':           '✅ Aula experimental agendada',
      'Perfil':           'Aluno retornante — parou há 6 meses',
      'Agendamento':      'Quinta-feira · 9h00',
      'Contexto':         'Apresentar avaliação física na chegada — mostrar o diferencial de acompanhamento é o ponto de conversão.',
      'Ação da recepção': 'Receber já com cadastro pronto. Reagendar se necessário via WhatsApp.',
    }
  },

  /* ── CENÁRIO 2: Quero começar, mas estou inseguro ── */
  inseguro: {
    label: 'Quero começar, mas estou inseguro',
    messages: [
      { from: 'user',  text: 'Oi, quero começar a malhar mas tenho medo de não conseguir manter... 😔', time: '09:15' },
      { from: 'agent', text: 'Olá! Aqui é a Ana, da Forms Gym! 😊\n\nEssa preocupação é muito mais comum do que você imagina — e faz todo sentido tê-la.\n\nMe conta: em algum momento você já tentou começar e não deu certo? O que aconteceu?', time: '09:15' },
      { from: 'user',  text: 'Fui numa academia grande, não tinha ninguém pra me orientar e acabei desanimando depois de 3 semanas', time: '09:16', tag: 'perfil' },
      { from: 'agent', text: 'Faz todo sentido. Academia grande, lotada, sem ninguém te guiando... vira um lugar que te faz sentir mais perdido do que motivado.\n\nAqui na Forms Gym é diferente: você começa com uma avaliação física gratuita, a equipe monta um planejamento pra você e acompanha de verdade enquanto você evolui.\n\nChamamos isso de "pegar na mão". Não é figura de linguagem. 💪', time: '09:17', tag: 'acolhimento' },
      { from: 'agent', text: 'O que acha de vir para uma aula experimental gratuita? Sem pressão, sem compromisso — só pra você vivenciar o ambiente antes de decidir qualquer coisa.', time: '09:17' },
      { from: 'user',  text: 'Sim, adoraria conhecer! 😊', time: '09:18', tag: 'interesse' },
      { from: 'agent', text: 'Que ótimo! 🙌 Para eu agendar certinho, qual é o seu nome?', time: '09:18' },
      { from: 'user',  text: 'Fernanda!', time: '09:19' },
      { from: 'agent', text: '🔍 Verificando horários disponíveis, Fernanda...', time: '09:19', isSystem: true },
      { from: 'agent', text: 'Ótima escolha, Fernanda! 😊\n\nTemos esses horários livres pra você esta semana:\n\n📅 Quarta · 10h ou 19h\n📅 Sexta · 8h ou 18h\n📅 Sábado · 9h\n\nQual encaixa melhor na sua rotina?', time: '09:19' },
      { from: 'user',  text: 'Sábado às 9h seria perfeito', time: '09:20' },
      { from: 'agent', text: '✅ Perfeito, Fernanda!\n\n📋 Aula Experimental · Forms Gym\n👤 Fernanda\n📅 Sábado\n🕘 9h00\n📍 Cascavel, PR\n\nChega um pouquinho antes para a gente te cadastrar e já fazer a avaliação inicial. A equipe estará preparada pra te receber! 💪\n\nVamos juntos nessa! 🏋️', time: '09:21', tag: 'agendamento' },
    ],
    backstage: {
      'perfil':      { icon: '💡', text: 'Perfil: iniciante · experiência negativa anterior (sem suporte)' },
      'acolhimento': { icon: '❤️', text: 'Abordagem: acolhimento + diferencial de acompanhamento' },
      'interesse':   { icon: '📌', text: 'Aceito convite para aula experimental' },
      'agendamento': { icon: '✅', text: 'AGENDADO · Fernanda · Sábado 9h' },
    },
    summary: {
      'Status':           '✅ Aula experimental agendada',
      'Nome':             'Fernanda',
      'Agendamento':      'Sábado · 9h00',
      'Perfil':           'Iniciante com experiência negativa anterior (academia sem apoio)',
      'Contexto':         'Este aluno desanimou antes por falta de orientação. Apresente a avaliação física logo na chegada.',
      'Ação da recepção': 'Receber pelo nome. Mostrar estrutura. Reagendar via WhatsApp se necessário.',
    }
  },

  /* ── CENÁRIO 3: Quero fazer uma aula ── */
  aula: {
    label: 'Quero fazer uma aula',
    messages: [
      { from: 'user',  text: 'Oi! Quero fazer uma aula experimental 🏋️', time: '11:05' },
      { from: 'agent', text: 'Que ótimo! Bem-vindo(a) à Forms Gym! 😊\n\nAula experimental é gratuita e sem compromisso — o melhor jeito de conhecer como a gente trabalha.\n\nMe conta: você tem algum objetivo específico? Ganhar massa, perder peso, condicionamento geral?', time: '11:05' },
      { from: 'user',  text: 'Quero perder peso e ganhar disposição', time: '11:06', tag: 'perfil' },
      { from: 'agent', text: 'Perfeito — esses dois objetivos andam juntos e você vai sentir resultado mais rápido do que imagina com o treino certo. 💪\n\nPra eu agendar sua aula e passar as informações pra equipe te receber bem, qual é o seu nome?', time: '11:06' },
      { from: 'user',  text: 'Marcos!', time: '11:07', tag: 'nome' },
      { from: 'agent', text: 'Marcos, qual dia e período funciona melhor pra você?', time: '11:07' },
      { from: 'user',  text: 'Quinta de manhã seria perfeito', time: '11:08' },
      { from: 'agent', text: '🔍 Consultando a agenda de quinta-feira de manhã...', time: '11:08', isSystem: true },
      { from: 'agent', text: 'Ótimo, Marcos! Na quinta de manhã temos:\n\n🕖 7h00 · disponível\n🕗 8h00 · disponível\n🕘 9h00 · disponível\n🕙 10h00 · disponível\n\nQual horário prefere?', time: '11:09' },
      { from: 'user',  text: '9h está ótimo!', time: '11:09' },
      { from: 'agent', text: '✅ Agendado, Marcos!\n\n📋 Aula Experimental · Forms Gym\n👤 Marcos\n📅 Quinta-feira\n🕘 9h00\n🎯 Perda de peso + condicionamento\n\nChega 10 minutinhos antes para a gente te cadastrar e já fazer a avaliação inicial. A equipe estará te esperando! 🏋️🔥\n\nNos vemos na quinta! 💪', time: '11:10', tag: 'agendamento' },
    ],
    backstage: {
      'perfil':      { icon: '💡', text: 'Objetivo: perda de peso + condicionamento' },
      'nome':        { icon: '👤', text: 'Nome coletado: Marcos' },
      'agendamento': { icon: '✅', text: 'AGENDADO · Marcos · Quinta-feira 9h · recepção notificada' },
    },
    summary: {
      'Status':           '✅ Aula experimental agendada',
      'Nome':             'Marcos',
      'Agendamento':      'Quinta-feira · 9h00',
      'Objetivo':         'Perda de peso + ganho de condicionamento',
      'Contexto':         'Motivado, sabe o que quer. Apresentar avaliação física na chegada.',
      'Ação da recepção': 'Receber pelo nome. Se necessário, reagendar via WhatsApp assumindo a conversa.',
    }
  }
};

/* ═══════════════════════════════════════════════
   DEMO STATE MACHINE
   ═══════════════════════════════════════════════ */

const demoState = {
  scenario: 'preco',
  step: -1,
  done: false,
};

/* DOM refs */
const chatEl        = document.getElementById('wa-chat-messages');
const emptyEl       = document.getElementById('wa-empty');
const btnPlay       = document.getElementById('btn-play');
const btnStep       = document.getElementById('btn-step');
const btnReset      = document.getElementById('btn-reset');
const backstageTags = document.getElementById('backstage-tags');
const summaryEl     = document.getElementById('demo-summary');
const summaryContent= document.getElementById('summary-content');

function getCurrentMessages() {
  return CENARIOS[demoState.scenario].messages;
}

function resetDemo() {
  demoState.step = -1;
  demoState.done = false;

  const msgs = chatEl.querySelectorAll('.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill');
  msgs.forEach(m => m.remove());
  if (emptyEl) emptyEl.hidden = false;

  backstageTags.innerHTML = '';
  summaryEl.hidden = true;

  btnPlay.disabled  = false;
  btnPlay.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Iniciar`;
  btnStep.disabled  = true;
  btnReset.disabled = true;

  document.querySelectorAll('.scenario-tab').forEach(t => { t.disabled = false; });
}

function startDemo() {
  if (demoState.step >= 0) return;
  if (emptyEl) emptyEl.hidden = true;

  demoState.step = 0;
  demoState.done = false;

  btnPlay.disabled  = true;
  btnPlay.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Em andamento`;
  btnStep.disabled  = false;
  btnReset.disabled = false;

  document.querySelectorAll('.scenario-tab').forEach(t => { t.disabled = true; });

  showStep(0);
}

function stepDemo() {
  if (demoState.done) return;
  if (demoState.step < 0) { startDemo(); return; }

  const msgs = getCurrentMessages();
  const next = demoState.step + 1;

  if (next >= msgs.length) {
    finishDemo();
  } else {
    demoState.step = next;
    showStep(next);
  }
}

function showStep(index) {
  const msgs = getCurrentMessages();
  const msg  = msgs[index];
  if (!msg) return;

  renderMessage(msg);

  if (msg.tag) {
    const tagDef = CENARIOS[demoState.scenario].backstage[msg.tag];
    if (tagDef) addBackstageTag(tagDef);
  }

  const isLast = index >= msgs.length - 1;
  if (isLast) {
    btnStep.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ver resumo`;
    btnStep.onclick = finishDemo;
  }
}

function finishDemo() {
  demoState.done = true;
  btnStep.disabled = true;
  btnStep.innerHTML = `✓ Conversa concluída`;
  addSimTag('📋 Ficha enviada para a recepção');
  renderSummary();
  summaryEl.hidden = false;
  setTimeout(() => summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
}

/* ─── Render message ─── */
function renderMessage(msg) {
  if (msg.isSystem) {
    const el = document.createElement('div');
    el.className = 'wa-system-pill';
    el.innerHTML = `<span>${escapeHtml(msg.text)}</span>`;
    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
    return;
  }

  const isUser = msg.from === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `wa-msg-wrapper from-${msg.from}`;

  const bubble = document.createElement('div');
  bubble.className = `wa-bubble ${isUser ? 'wa-bubble-user' : 'wa-bubble-agent'}`;

  let html = '';
  if (!isUser) html += `<div class="wa-bubble-sender">Ana</div>`;
  html += `<div class="wa-bubble-text">${escapeHtml(msg.text)}</div>`;
  html += `<div class="wa-bubble-meta"><span class="wa-bubble-time">${msg.time || now()}</span>`;
  if (isUser) {
    html += `<span class="wa-tick" aria-hidden="true">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path d="M11.07.34L4.5 6.91 2.43 4.84 1.02 6.25 4.5 9.73l7.98-7.98L11.07.34z" fill="#53BDEB"/>
        <path d="M14.07.34L7.5 6.91l-.72-.72L5.37 7.6 7.5 9.73l7.98-7.98L14.07.34z" fill="#53BDEB"/>
      </svg></span>`;
  }
  html += '</div>';

  bubble.innerHTML = html;
  wrapper.appendChild(bubble);
  chatEl.appendChild(wrapper);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addSimTag(text) {
  const el = document.createElement('div');
  el.className = 'wa-sim-tag';
  el.innerHTML = `<div class="wa-sim-tag-inner">${escapeHtml(text)}</div>`;
  chatEl.appendChild(el);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addBackstageTag(def) {
  const tag = document.createElement('div');
  tag.className = 'backstage-tag';
  tag.innerHTML = `<span class="backstage-tag-icon">${def.icon}</span><span>${escapeHtml(def.text)}</span>`;
  backstageTags.appendChild(tag);
}

function renderSummary() {
  const s = CENARIOS[demoState.scenario].summary;
  summaryContent.innerHTML = Object.entries(s).map(([k, v]) => `
    <div class="summary-field">
      <div class="summary-field-label">${escapeHtml(k)}</div>
      <div class="summary-field-value">${escapeHtml(v)}</div>
    </div>
  `).join('');
}

/* ─── Helpers ─── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\n/g, '<br>');
}
function now() {
  const d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

/* ═══════════════════════════════════════════════
   SCENARIO TABS
   ═══════════════════════════════════════════════ */
document.querySelectorAll('.scenario-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.disabled) return;
    document.querySelectorAll('.scenario-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    demoState.scenario = tab.dataset.scenario;
    resetDemo();
  });
});

/* ═══════════════════════════════════════════════
   CONTROL BUTTONS
   ═══════════════════════════════════════════════ */
btnPlay.addEventListener('click', startDemo);
btnStep.addEventListener('click', stepDemo);
btnReset.addEventListener('click', resetDemo);

/* ═══════════════════════════════════════════════
   INVESTMENT RENDER
   ═══════════════════════════════════════════════ */
function renderInvestment() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('val-total-a',       brl(OPTION_A_TOTAL));
  set('val-total-b',       brl(OPTION_B_TOTAL));
  set('val-savings',       `Economia de ${brl(SAVINGS)}`);
  set('val-monthly-a',     brl(MONTHLY_FEE) + '/mês');
  set('val-setup',         brl(SETUP_FEE));
  set('val-months',        MONTHS.toString());

  // Set WhatsApp href on CTA buttons
  const btnA = document.getElementById('cta-wa-a');
  const btnB = document.getElementById('cta-wa-b');
  if (btnA) btnA.href = WA_URL_A;
  if (btnB) btnB.href = WA_URL_B;
}

/* ═══════════════════════════════════════════════
   PRESENTER MODE (URL-based: ?backstage=1)
   ═══════════════════════════════════════════════ */
const presenterPanel = document.getElementById('presenter-panel');

if (PRESENTER_MODE && presenterPanel) {
  document.body.classList.add('presenter-mode');
  // Show panel by default when accessing via secret URL
  presenterPanel.classList.add('open');

  // Toggle with P key
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      presenterPanel.classList.toggle('open');
    }
  });
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   NAV: ACTIVE SECTION HIGHLIGHT
   ═══════════════════════════════════════════════ */
const navLinks  = document.querySelectorAll('.nav-links a');
const sections  = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) link.classList.add('active');
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('main-nav')?.offsetHeight || 68;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════
   NAV SCROLL OPACITY
   ═══════════════════════════════════════════════ */
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  mainNav.style.background = window.scrollY > 20
    ? 'rgba(10,10,16,0.96)'
    : 'rgba(10,10,16,0.88)';
}, { passive: true });

/* ═══════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderInvestment();
  resetDemo();
});

if (document.readyState !== 'loading') {
  renderInvestment();
  resetDemo();
}
