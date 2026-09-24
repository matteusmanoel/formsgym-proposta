/* ═══════════════════════════════════════════════
   FORMS GYM — PROPOSTA COMERCIAL
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── INVESTMENT CONSTANTS ─── */
const SETUP_FEE       = 6900;
const BOLETO          = 1150;
const MONTHLY_FEE     = 2490;
const MONTHS          = 6;
const DUE_NOW         = BOLETO + MONTHLY_FEE;                 // 3640
const SETUP_CHECK     = MONTHS * BOLETO;                      // 6900
const MONTHLY_SIX     = MONTHS * MONTHLY_FEE;                 // 14940
const OPTION_A_TOTAL  = SETUP_FEE + MONTHLY_SIX;              // 21840
const OPTION_B_TOTAL  = 19870;
const SAVINGS         = OPTION_A_TOTAL - OPTION_B_TOTAL;      // 1970

if (SETUP_CHECK !== SETUP_FEE || DUE_NOW !== 3640 || OPTION_A_TOTAL !== 21840) {
  console.error('Conferência financeira da proposta falhou.');
}

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
  novo: {
    label: 'Novo interessado',
    messages: [
      { from: 'user', text: 'Oi! Vi vocês no Instagram e queria saber como funciona a academia.', time: '18:12' },
      { from: 'agent', text: 'Oi! Aqui é a Ana, da Forms Gym.\n\nA gente trabalha com acompanhamento de verdade: avaliação física gratuita, um plano feito para você e alguém olhando a sua evolução. Não é ficha entregue e tchau.\n\nMe conta o que você está buscando agora?', time: '18:12', tag: 'perfil' },
      { from: 'user', text: 'Quero perder peso e ter mais disposição. Nunca treinei direito.', time: '18:13' },
      { from: 'agent', text: 'Faz sentido começar por uma aula experimental gratuita. Você conhece o espaço, faz a avaliação e a equipe já recebe o que você me contou — sem compromisso de matrícula.\n\nQuer que eu veja um horário?', time: '18:13', tag: 'interesse' },
      { from: 'user', text: 'Quero sim. Pode ser quinta de manhã.', time: '18:14' },
      { from: 'agent', text: 'Consultando horários simulados de quinta de manhã…', time: '18:14', isSystem: true },
      { from: 'agent', text: 'Na quinta de manhã, nesta simulação, estão livres:\n\n7h · 8h · 9h · 10h\n\nQual fica melhor?', time: '18:14' },
      { from: 'user', text: '9h.', time: '18:15' },
      { from: 'agent', text: 'Aula experimental reservada nesta simulação.\n\nCamila · quinta · 9h\nObjetivo: perda de peso e disposição\nChegar 10 minutos antes para a avaliação.\n\nA recepção já recebe esse contexto. Se precisar mudar o horário, é só me chamar. A matrícula, se fizer sentido, acontece com a equipe no dia.', time: '18:15', tag: 'agendamento' },
    ],
    backstage: {
      perfil: { icon: '💡', text: 'Objetivo: perda de peso e disposição · iniciante' },
      interesse: { icon: '📌', text: 'Aceitou aula experimental, sem pressão de matrícula' },
      agendamento: { icon: '✅', text: 'Simulação · quinta 9h · contexto enviado à recepção' },
    },
    summary: {
      'O que a pessoa viu': 'Convite para aula gratuita e horário confirmado na conversa',
      'O que a equipe recebe': 'Camila · quinta 9h · iniciante · perda de peso',
      'Próxima ação': 'Receber, fazer a avaliação e conduzir o fechamento presencial',
      'Limite': 'O agente não matriculou e não inventou preço de plano',
    },
  },
  preco: {
    label: 'Quanto custa?',
    messages: [
      { from: 'user', text: 'Oi, quanto custa a academia?', time: '14:02' },
      { from: 'agent', text: 'Oi! Aqui é a Ana, da Forms Gym.\n\nA aula experimental é gratuita. Os planos são mensais, trimestrais e semestrais, e eu só informo o valor que está na tabela aprovada pela academia — não invento preço no meio da conversa.\n\nSe você me disser o objetivo, eu explico o caminho e, se quiser, já deixo um horário para você conhecer antes de escolher o plano.', time: '14:02', tag: 'preco' },
      { from: 'user', text: 'Quero emagrecer. Pode ser um plano mensal, mas prefiro ver a academia antes.', time: '14:03' },
      { from: 'agent', text: 'Perfeito. Então o próximo passo é a aula experimental, não a matrícula.\n\nTenho, nesta simulação, terça 19h, quarta 7h ou sábado 9h. Qual encaixa?', time: '14:03' },
      { from: 'user', text: 'Terça às 19h.', time: '14:04' },
      { from: 'agent', text: 'Reservado nesta simulação: terça, 19h, aula experimental.\n\nA equipe recebe que você quer emagrecer, pediu preço e preferiu conhecer antes de fechar. No dia, uma pessoa apresenta a tabela oficial e tira a dúvida do plano.', time: '14:04', tag: 'agendamento' },
    ],
    backstage: {
      preco: { icon: '💰', text: 'Pergunta de preço respondida sem valor inventado' },
      agendamento: { icon: '✅', text: 'Terça 19h · fechamento fica com a equipe presencial' },
    },
    summary: {
      'O que a pessoa viu': 'Aula gratuita é de graça; preço de plano só da tabela aprovada',
      'O que a equipe recebe': 'Pediu valor, quer emagrecer, aula terça 19h',
      'Próxima ação': 'Apresentar a tabela oficial na aula. Não deixar o agente negociar plano.',
    },
  },
  inseguro: {
    label: 'Quero começar, mas estou inseguro',
    messages: [
      { from: 'user', text: 'Quero começar, mas tenho medo de não conseguir manter.', time: '09:20' },
      { from: 'agent', text: 'Isso é mais comum do que parece. Me conta o que aconteceu da última vez que você tentou?', time: '09:20' },
      { from: 'user', text: 'Fui numa academia grande, ninguém me orientou e parei em três semanas.', time: '09:21', tag: 'perfil' },
      { from: 'agent', text: 'Aqui a proposta é outra: avaliação física, um caminho para você e acompanhamento enquanto você evolui. A gente chama isso de pegar na mão.\n\nUma aula experimental gratuita serve justamente para você sentir isso antes de decidir. Sem pressão.', time: '09:21', tag: 'acolhimento' },
      { from: 'user', text: 'Pode ser sábado de manhã. Meu nome é Fernanda.', time: '09:22' },
      { from: 'agent', text: 'Consultando sábado de manhã nesta simulação…', time: '09:22', isSystem: true },
      { from: 'agent', text: 'Sábado, 9h, está livre para você, Fernanda.\n\nAula experimental reservada. A equipe já sabe que você parou antes por falta de orientação — então a recepção começa pela avaliação, não por um discurso de venda.', time: '09:23', tag: 'agendamento' },
    ],
    backstage: {
      perfil: { icon: '💡', text: 'Experiência anterior sem suporte · parou em 3 semanas' },
      acolhimento: { icon: '❤️', text: 'Convite sem pressão de matrícula' },
      agendamento: { icon: '✅', text: 'Fernanda · sábado 9h · contexto de insegurança repassado' },
    },
    summary: {
      'Nome': 'Fernanda',
      'Aula': 'Sábado · 9h · simulação',
      'Contexto para a equipe': 'Desistiu antes por falta de orientação. Mostrar a avaliação na chegada.',
      'Limite': 'Matrícula só se ela quiser, com uma pessoa',
    },
  },
  reagendar: {
    label: 'Reagendar aula',
    messages: [
      { from: 'user', text: 'Oi, preciso mudar minha aula experimental de quinta às 9h.', time: '16:40' },
      { from: 'agent', text: 'Oi, Marcos. Achei sua aula experimental de quinta, 9h.\n\nQuer outro dia ou só outro horário na quinta?', time: '16:40', tag: 'anterior' },
      { from: 'user', text: 'Sexta no fim da tarde, se tiver.', time: '16:41' },
      { from: 'agent', text: 'Olhando a sexta à tarde nesta simulação…', time: '16:41', isSystem: true },
      { from: 'agent', text: 'Sexta tem 17h e 19h. A quinta 9h continua sua até você escolher — não cancelo os dois.', time: '16:41' },
      { from: 'user', text: 'Pode ser sexta às 19h.', time: '16:42' },
      { from: 'agent', text: 'Pronto, nesta simulação:\n\nQuinta 9h · liberada\nSexta 19h · sua aula experimental\n\nA recepção recebe a troca. Se a sexta não servir, a gente ajusta de novo.', time: '16:42', tag: 'agenda' },
    ],
    backstage: {
      anterior: { icon: '📅', text: 'Aula localizada: quinta 9h · Marcos' },
      agenda: { icon: '✅', text: 'Quinta 9h liberada · sexta 19h reservada' },
    },
    summary: {
      'Estado da agenda': 'Quinta 9h livre · sexta 19h ocupada por Marcos',
      'O que a equipe recebe': 'Reagendamento pedido pelo aluno, já atualizado na simulação',
      'Se a integração não existir': 'A recepção confirma a troca no SCA',
    },
  },
  cancelar: {
    label: 'Cancelar aula',
    messages: [
      { from: 'user', text: 'Preciso cancelar minha aula de sábado às 9h.', time: '11:05' },
      { from: 'agent', text: 'Fernanda, só para eu não cancelar a aula errada: é a experimental de sábado, 9h?', time: '11:05', tag: 'confirma' },
      { from: 'user', text: 'Isso. Não vou conseguir ir.', time: '11:06' },
      { from: 'agent', text: 'Cancelei nesta simulação. Sábado 9h voltou para a agenda.\n\nSe quiser outro dia, eu te mostro opções. Se preferir deixar para depois, tudo bem — sem insistência.', time: '11:06', tag: 'cancelada' },
      { from: 'user', text: 'Pode deixar. Qualquer dia eu chamo.', time: '11:07' },
      { from: 'agent', text: 'Combinado. Quando quiser retomar, a conversa continua daqui. A equipe fica sabendo que a aula saiu da agenda e que você não pediu um novo horário.', time: '11:07' },
    ],
    backstage: {
      confirma: { icon: '🗓️', text: 'Confirmação antes de cancelar: sábado 9h' },
      cancelada: { icon: '✅', text: 'Sábado 9h liberado · remarque oferecida sem pressão' },
    },
    summary: {
      'Estado da agenda': 'Sábado 9h livre',
      'O que a equipe recebe': 'Fernanda cancelou e não quis remarcar agora',
      'Tom': 'Sem cobrança e sem novo convite insistente',
    },
  },
  pagamento: {
    label: 'Renovação de plano',
    messages: [
      { from: 'user', text: 'Meu plano venceu. Como eu renovo?', time: '15:10' },
      { from: 'agent', text: 'Consultando a fonte autorizada da academia, nesta simulação…', time: '15:10', isSystem: true },
      { from: 'agent', text: 'Encontrei uma renovação pendente no cadastro simulado. O valor e o link abaixo são fictícios — esta página não cobra nada e eu não confirmo pagamento.\n\nLink de demonstração, que não funciona de verdade:\nhttps://exemplo.invalid/formsgym-renovacao-simulada\n\nSe o valor não bater, ou se você quiser contestar, eu chamo uma pessoa da equipe.', time: '15:11', tag: 'link' },
      { from: 'user', text: 'Achei estranho. Prefiro falar com alguém.', time: '15:12' },
      { from: 'agent', text: 'Certo. Parei por aqui e passei para uma pessoa.\n\nEla recebe o histórico, a pendência simulada e o pedido de contestação. Eu não negocio dívida e não digo que o pagamento foi feito.', time: '15:12', tag: 'humano' },
    ],
    backstage: {
      link: { icon: '🔗', text: 'Link fictício · valor não decidido pelo agente' },
      humano: { icon: '👤', text: 'Contestação transferida · pagamento não confirmado' },
    },
    summary: {
      'O que a pessoa viu': 'Link claramente falso, em exemplo.invalid',
      'O que a equipe recebe': 'Renovação contestada · precisa de atendimento humano',
      'Limite': 'Sem cobrança real, sem negociação de dívida, sem confirmação de pagamento',
    },
  },
};

/* ═══════════════════════════════════════════════
   DEMO STATE MACHINE
   ═══════════════════════════════════════════════ */

const demoState = {
  scenario: 'novo',
  step: -1,
  done: false,
  pace: 1,
};

let playGeneration = 0;
let playTimer = null;
let cancelWait = null;

/* DOM refs */
const chatEl         = document.getElementById('wa-chat-messages');
const emptyEl        = document.getElementById('wa-empty');
const btnReset       = document.getElementById('btn-reset');
const demoStatus     = document.getElementById('demo-status');
const backstageTags  = document.getElementById('backstage-tags');
const summaryEl      = document.getElementById('demo-summary');
const summaryContent = document.getElementById('summary-content');

function getCurrentMessages() {
  return CENARIOS[demoState.scenario].messages;
}

function setDemoStatus(text) {
  if (demoStatus) demoStatus.textContent = text;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let releaseWait = null;

function messageDelay(msg, isFirst) {
  const pace = prefersReducedMotion() ? 0.35 : demoState.pace;
  let base;
  if (isFirst) base = 420;
  else if (msg.isSystem) base = 900;
  else {
    const chars = (msg.text || '').length;
    base = msg.from === 'user'
      ? Math.min(1500, 560 + chars * 8)
      : Math.min(2200, 780 + chars * 12);
  }
  return Math.max(140, Math.round(base * pace));
}

function cancelPlayback() {
  playGeneration += 1;
  if (playTimer) clearTimeout(playTimer);
  playTimer = null;
  if (cancelWait) {
    const cancel = cancelWait;
    cancelWait = null;
    cancel();
  }
  removeTyping();
}

function wait(ms, generation) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (err) => {
      if (settled) return;
      settled = true;
      playTimer = null;
      cancelWait = null;
      releaseWait = null;
      if (err) reject(err);
      else resolve();
    };
    cancelWait = () => finish(new Error('cancelled'));
    releaseWait = () => finish();
    playTimer = setTimeout(() => {
      if (generation !== playGeneration) finish(new Error('cancelled'));
      else finish();
    }, ms);
  });
}

function clearConversation() {
  chatEl.querySelectorAll('.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill, .wa-typing-wrap').forEach(el => el.remove());
  if (emptyEl) emptyEl.hidden = false;
  backstageTags.innerHTML = '';
  summaryEl.hidden = true;
  demoState.step = -1;
  demoState.done = false;
}

function showTyping() {
  removeTyping();
  const wrapper = document.createElement('div');
  wrapper.className = 'wa-msg-wrapper from-agent wa-typing-wrap';
  wrapper.innerHTML = '<div class="wa-typing" aria-hidden="true"><span></span><span></span><span></span></div>';
  chatEl.appendChild(wrapper);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function removeTyping() {
  chatEl.querySelectorAll('.wa-typing-wrap').forEach(el => el.remove());
}

async function runPlayback(generation) {
  const msgs = getCurrentMessages();
  setDemoStatus('Conversa em andamento…');
  try {
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      const delay = messageDelay(msg, i === 0);
      const isAgent = msg.from === 'agent' && !msg.isSystem && !prefersReducedMotion();
      if (isAgent && i > 0) {
        const think = Math.min(900, Math.max(450, Math.floor(delay * 0.4)));
        await wait(Math.max(200, delay - think), generation);
        if (generation !== playGeneration) return;
        showTyping();
        await wait(think, generation);
        removeTyping();
      } else {
        await wait(delay, generation);
      }
      if (generation !== playGeneration) return;
      demoState.step = i;
      showStep(i);
    }
    await wait(prefersReducedMotion() ? 200 : 700, generation);
    if (generation !== playGeneration) return;
    finishDemo();
  } catch (_) {
    /* playback cancelled by scenario change or restart */
  }
}

function playScenario() {
  cancelPlayback();
  clearConversation();
  const generation = playGeneration;
  runPlayback(generation);
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
}

function finishDemo() {
  demoState.done = true;
  setDemoStatus('Conversa concluída. Reinicie ou escolha outro cenário.');
  addSimTag('📋 Ficha enviada para a recepção');
  renderSummary();
  summaryEl.hidden = false;
}

/* ─── Render message ─── */
function renderMessage(msg) {
  if (emptyEl) emptyEl.hidden = true;
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
    document.querySelectorAll('.scenario-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    demoState.scenario = tab.dataset.scenario;
    playScenario();
  });
});

/* ═══════════════════════════════════════════════
   CONTROL BUTTONS
   ═══════════════════════════════════════════════ */
btnReset.addEventListener('click', playScenario);
document.getElementById('btn-advance').addEventListener('click', advanceDemo);
document.querySelectorAll('.pace-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    demoState.pace = Number(btn.dataset.pace) || 1;
    document.querySelectorAll('.pace-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ═══════════════════════════════════════════════
   INVESTMENT RENDER
   ═══════════════════════════════════════════════ */
function renderInvestment() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('val-setup', brl(SETUP_FEE));
  set('val-boleto', brl(BOLETO));
  set('val-monthly-a', brl(MONTHLY_FEE));
  set('val-now', brl(DUE_NOW));
  set('val-total-b', brl(OPTION_B_TOTAL));
  set('val-savings', `Economia de ${brl(SAVINGS)}`);
  set('val-math', `${MONTHS} × ${brl(BOLETO)} = ${brl(SETUP_CHECK)} de implantação. ${MONTHS} × ${brl(MONTHLY_FEE)} = ${brl(MONTHLY_SIX)} de mensalidades. Os seis primeiros pagamentos somam ${brl(OPTION_A_TOTAL)}. Não é um financiamento único de ${brl(OPTION_A_TOTAL)} em seis vezes.`);
}

function advanceDemo() {
  if (demoState.done) return;
  removeTyping();
  if (releaseWait) releaseWait();
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
function boot() {
  renderInvestment();
  playScenario();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
