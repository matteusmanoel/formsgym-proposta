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
      { from: 'user',  text: 'Oi! Vi vocês no Instagram e queria saber como funciona.',           time: '18:12' },
      { from: 'agent', text: 'Oi! Sou a Ana, da Forms Gym 😊',                                    time: '18:12' },
      { from: 'agent', text: 'Aqui o treino vem com avaliação física gratuita e acompanhamento — não é ficha entregue e tchau.', time: '18:12' },
      { from: 'agent', text: 'O que você tá buscando?',                                           time: '18:12', tag: 'perfil' },
      { from: 'user',  text: 'Quero perder peso e ter mais disposição. Nunca treinei direito.',    time: '18:13' },
      { from: 'agent', text: 'Faz sentido começar por uma aula experimental gratuita.',            time: '18:13' },
      { from: 'agent', text: 'Você conhece o espaço, faz a avaliação e a equipe já fica por dentro do que você me contou — sem compromisso de matrícula.', time: '18:13', tag: 'interesse' },
      { from: 'agent', text: 'Quer que eu veja um horário?',                                      time: '18:13' },
      { from: 'user',  text: 'Quero sim! Pode ser quinta de manhã.',                              time: '18:14' },
      { from: 'agent', text: 'Quinta de manhã estão livres: 7h · 8h · 9h · 10h 🕘',              time: '18:14' },
      { from: 'agent', text: 'Qual fica melhor pra você?',                                        time: '18:14' },
      { from: 'user',  text: '9h.',                                                               time: '18:15' },
      { from: 'agent', text: 'Tá reservado! 🎉',                                                  time: '18:15' },
      { from: 'agent', text: 'Camila · quinta · 9h\nChegar 10 minutinhos antes pra avaliação.',   time: '18:15', tag: 'agendamento' },
      { from: 'agent', text: 'A recepção já fica por dentro. Se precisar mudar, é só me chamar.', time: '18:15' },
      { from: 'note',  text: 'Matrícula, se rolar, fica com a equipe no dia — o agente não fecha plano.' },
    ],
    backstage: {
      perfil:      { icon: '💡', text: 'Objetivo: perda de peso e disposição · iniciante' },
      interesse:   { icon: '📌', text: 'Aceitou aula experimental, sem pressão de matrícula' },
      agendamento: { icon: '✅', text: 'Quinta 9h · contexto enviado à recepção' },
    },
    summary: {
      'O que a equipe recebe': 'Camila · quinta 9h · iniciante · perda de peso',
      'Próxima ação': 'Receber, avaliação e fechar presencial',
    },
  },
  preco: {
    label: 'Quanto custa?',
    messages: [
      { from: 'user',  text: 'Oi, quanto custa a academia?',                                      time: '14:02' },
      { from: 'agent', text: 'Oi! Sou a Ana 😊',                                                  time: '14:02' },
      { from: 'agent', text: 'A aula experimental é gratuita.',                                   time: '14:02' },
      { from: 'agent', text: 'Preço de plano eu pego direto da tabela da academia. Qual é o seu objetivo?', time: '14:02', tag: 'preco' },
      { from: 'note',  text: 'Ana não cita valor de mensalidade — evita comprometer preço antes que a equipe apresente a tabela.' },
      { from: 'user',  text: 'Quero emagrecer. Posso conhecer antes de fechar?',                  time: '14:03' },
      { from: 'agent', text: 'Claro! Então o primeiro passo é a aula experimental, não a matrícula.', time: '14:03' },
      { from: 'agent', text: 'Tenho terça 19h, quarta 7h ou sábado 9h. Qual encaixa?',            time: '14:03' },
      { from: 'user',  text: 'Terça às 19h.',                                                     time: '14:04' },
      { from: 'agent', text: 'Reservado! ✅',                                                      time: '14:04' },
      { from: 'agent', text: 'Terça, 19h, aula experimental.',                                    time: '14:04', tag: 'agendamento' },
      { from: 'agent', text: 'A equipe fica sabendo que você quer emagrecer e preferiu conhecer antes de fechar. No dia, uma pessoa apresenta a tabela.', time: '14:04' },
    ],
    backstage: {
      preco:       { icon: '💰', text: 'Preço respondido sem valor inventado' },
      agendamento: { icon: '✅', text: 'Terça 19h · fechamento fica com a equipe presencial' },
    },
    summary: {
      'O que a equipe recebe': 'Pediu valor, quer emagrecer, aula terça 19h',
    },
  },
  inseguro: {
    label: 'Quero começar, mas estou inseguro',
    messages: [
      { from: 'user',  text: 'Quero começar, mas tenho medo de não conseguir manter.',            time: '09:20' },
      { from: 'agent', text: 'Isso é mais comum do que parece 🙂',                                time: '09:20' },
      { from: 'agent', text: 'Me conta o que aconteceu da última vez que você tentou?',           time: '09:20' },
      { from: 'user',  text: 'Fui numa academia grande, ninguém me orientou e parei em três semanas.', time: '09:21', tag: 'perfil' },
      { from: 'agent', text: 'Faz sentido ter parado assim.',                                     time: '09:21' },
      { from: 'agent', text: 'Aqui é diferente: avaliação física, um caminho pensado pra você e alguém acompanhando sua evolução.', time: '09:21', tag: 'acolhimento' },
      { from: 'agent', text: 'A aula experimental serve pra você sentir isso antes de decidir — sem pressão nenhuma.',            time: '09:21' },
      { from: 'user',  text: 'Pode ser sábado de manhã. Meu nome é Fernanda.',                    time: '09:22' },
      { from: 'agent', text: 'Sábado, 9h, tá livre pra você, Fernanda! 🎉',                       time: '09:23', tag: 'agendamento' },
      { from: 'agent', text: 'A equipe já sabe que você parou antes por falta de orientação — então começa pela avaliação, não por papo de vendas.', time: '09:23' },
    ],
    backstage: {
      perfil:      { icon: '💡', text: 'Experiência anterior sem suporte · parou em 3 semanas' },
      acolhimento: { icon: '❤️', text: 'Convite sem pressão de matrícula' },
      agendamento: { icon: '✅', text: 'Fernanda · sábado 9h · contexto repassado' },
    },
    summary: {
      'Contexto para a equipe': 'Fernanda · sábado 9h · parou antes por falta de orientação',
    },
  },
  reagendar: {
    label: 'Reagendar aula',
    messages: [
      { from: 'user',  text: 'Oi, preciso mudar minha aula experimental de quinta às 9h.',        time: '16:40' },
      { from: 'agent', text: 'Oi, Marcos! Achei a aula de quinta, 9h.',                           time: '16:40', tag: 'anterior' },
      { from: 'agent', text: 'Quer só mudar o horário ou prefere outro dia?',                     time: '16:40' },
      { from: 'user',  text: 'Sexta no fim da tarde, se tiver.',                                  time: '16:41' },
      { from: 'agent', text: 'Tem 17h e 19h na sexta.',                                           time: '16:41' },
      { from: 'agent', text: 'A quinta 9h fica guardada até você escolher — não cancelo os dois ao mesmo tempo.', time: '16:41' },
      { from: 'user',  text: 'Sexta às 19h então.',                                               time: '16:42' },
      { from: 'agent', text: 'Feito! ✅',                                                          time: '16:42' },
      { from: 'agent', text: 'Quinta 9h liberada · sexta 19h é sua agora.',                       time: '16:42', tag: 'agenda' },
      { from: 'agent', text: 'A recepção já recebe a troca. Se precisar ajustar de novo, é só chamar.', time: '16:42' },
    ],
    backstage: {
      anterior: { icon: '📅', text: 'Aula localizada: quinta 9h · Marcos' },
      agenda:   { icon: '✅', text: 'Quinta 9h liberada · sexta 19h reservada' },
    },
    summary: {
      'O que a equipe recebe': 'Reagendamento atualizado · quinta livre · sexta 19h Marcos',
    },
  },
  cancelar: {
    label: 'Cancelar aula',
    messages: [
      { from: 'user',  text: 'Preciso cancelar minha aula de sábado às 9h.',                     time: '11:05' },
      { from: 'agent', text: 'Fernanda, só pra ter certeza: é a experimental de sábado, 9h?',    time: '11:05', tag: 'confirma' },
      { from: 'user',  text: 'Isso. Não vou conseguir ir.',                                       time: '11:06' },
      { from: 'agent', text: 'Cancelado! Sábado 9h voltou pra agenda.',                           time: '11:06', tag: 'cancelada' },
      { from: 'agent', text: 'Se quiser marcar outro dia, me fala. Se preferir deixar pra depois, tudo bem 🙂', time: '11:06' },
      { from: 'user',  text: 'Pode deixar. Qualquer dia eu chamo.',                               time: '11:07' },
      { from: 'agent', text: 'Combinado! Quando quiser retomar é só chamar por aqui.',            time: '11:07' },
      { from: 'note',  text: 'A equipe fica sabendo que a aula saiu da agenda e que Fernanda não pediu novo horário.' },
    ],
    backstage: {
      confirma:   { icon: '🗓️', text: 'Confirmação antes de cancelar: sábado 9h' },
      cancelada:  { icon: '✅', text: 'Sábado 9h liberado · remarque oferecida sem pressão' },
    },
    summary: {
      'O que a equipe recebe': 'Fernanda cancelou e não quis remarcar agora',
    },
  },
  pagamento: {
    label: 'Renovação de plano',
    messages: [
      { from: 'user',  text: 'Meu plano venceu. Como eu renovo?',                                time: '15:10' },
      { from: 'agent', text: 'Oi! Deixa eu verificar aqui no seu cadastro.',                     time: '15:10' },
      { from: 'agent', text: 'Encontrei uma renovação pendente 😊',                               time: '15:11' },
      { from: 'agent', text: 'Link de renovação:\nhttps://formsgym.com.br/renovar',               time: '15:11', tag: 'link' },
      { from: 'agent', text: 'Qualquer dúvida no valor ou se quiser contestar, me fala que eu chamo alguém da equipe.', time: '15:11' },
      { from: 'user',  text: 'Achei estranho. Prefiro falar com alguém.',                        time: '15:12' },
      { from: 'agent', text: 'Claro! Já aviso a equipe agora 👋',                                 time: '15:12', tag: 'humano' },
      { from: 'note',  text: 'O agente não negocia valor nem confirma que o pagamento foi feito — isso fica com a equipe.' },
    ],
    backstage: {
      link:   { icon: '🔗', text: 'Link de renovação enviado · valor vem do sistema' },
      humano: { icon: '👤', text: 'Contestação transferida · agente não confirma pagamento' },
    },
    summary: {
      'O que a equipe recebe': 'Renovação contestada · precisa de atendimento humano',
    },
  },
  cobranca: {
    label: 'Plano vencido',
    messages: [
      { from: 'agent', text: 'Oi, Lucas! Tudo bem?',                                             time: '10:05' },
      { from: 'agent', text: 'Seu plano venceu ontem e a academia pediu pra eu te avisar.',      time: '10:05' },
      { from: 'agent', text: 'Fica tranquilo — a ideia é só você ter a opção de renovar antes de perder o acesso.', time: '10:05', tag: 'aviso' },
      { from: 'agent', text: 'Link de renovação:\nhttps://formsgym.com.br/renovar',               time: '10:05' },
      { from: 'agent', text: 'Se tiver qualquer dúvida no valor, me fala que eu chamo alguém agora.', time: '10:05' },
      { from: 'user',  text: 'Esse valor não tá certo, acho que tenho desconto.',                time: '10:07' },
      { from: 'agent', text: 'Entendido! Vou passar pra equipe agora.',                          time: '10:07', tag: 'humano' },
      { from: 'agent', text: 'Uma pessoa entra em contato pra resolver com você.',               time: '10:07' },
      { from: 'note',  text: 'O agente não negocia desconto nem confirma pendência — passa direto para a equipe.' },
    ],
    backstage: {
      aviso:  { icon: '📣', text: 'Aviso proativo de vencimento · sem cobrar direto' },
      humano: { icon: '👤', text: 'Contestação repassada · agente não negocia desconto' },
    },
    summary: {
      'O que o agente fez': 'Avisou, enviou link, transferiu contestação à equipe',
    },
  },
  pagamento_pendente: {
    label: 'Mensalidade atrasada',
    messages: [
      { from: 'agent', text: 'Oi, Juliana! 👋',                                                   time: '09:00' },
      { from: 'agent', text: 'A academia me pediu pra te dar um aviso: a mensalidade deste mês ainda não apareceu no sistema.', time: '09:00' },
      { from: 'agent', text: 'Pode ser só um delay do banco, mas preferi te avisar antes de virar pendência.', time: '09:00', tag: 'aviso' },
      { from: 'agent', text: 'Link de pagamento:\nhttps://formsgym.com.br/mensalidade',           time: '09:00' },
      { from: 'user',  text: 'Paguei ontem! Pode checar?',                                       time: '09:03' },
      { from: 'agent', text: 'Ah, deve ser o delay mesmo! 😊',                                    time: '09:04' },
      { from: 'agent', text: 'Vou repassar pra equipe financeira conferir. Se der qualquer problema, eles entram em contato. Obrigada!', time: '09:04', tag: 'repassado' },
      { from: 'note',  text: 'O agente não confirma nem nega o pagamento — quem verifica é o sistema financeiro da academia.' },
    ],
    backstage: {
      aviso:     { icon: '⏰', text: 'Aviso preventivo · sem pressão de cobrança' },
      repassado: { icon: '✅', text: 'Confirmação repassada à equipe financeira' },
    },
    summary: {
      'O que o agente fez': 'Avisou com leveza, recebeu confirmação, repassou à equipe',
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
  pace: 1.7,
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
const dialogChatEl   = document.getElementById('demo-dialog-chat');

/* Helper: append to whichever chat is currently active */
function appendToChat(el) {
  const isDialogOpen = demoDialog && demoDialog.open;
  const target = isDialogOpen ? dialogChatEl : chatEl;
  target.appendChild(el);
  target.scrollTop = target.scrollHeight;
}

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
  const sel = '.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill, .wa-typing-wrap, .wa-annotation, .wa-finish-cta';
  chatEl.querySelectorAll(sel).forEach(el => el.remove());
  if (dialogChatEl) dialogChatEl.querySelectorAll(sel).forEach(el => el.remove());
  if (emptyEl) emptyEl.hidden = false;
  if (backstageTags) backstageTags.innerHTML = '';
  if (summaryEl) summaryEl.hidden = true;
  demoState.step = -1;
  demoState.done = false;
}

function activeChat() {
  return (demoDialog && demoDialog.open) ? dialogChatEl : chatEl;
}

function showTyping() {
  removeTyping();
  const wrapper = document.createElement('div');
  wrapper.className = 'wa-msg-wrapper from-agent wa-typing-wrap';
  wrapper.innerHTML = '<div class="wa-typing" aria-hidden="true"><span></span><span></span><span></span></div>';
  const chat = activeChat();
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  chatEl.querySelectorAll('.wa-typing-wrap').forEach(el => el.remove());
  if (dialogChatEl) dialogChatEl.querySelectorAll('.wa-typing-wrap').forEach(el => el.remove());
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

  const isDialogOpen = demoDialog && demoDialog.open;

  if (isDialogOpen) {
    // Mobile: show CTA button inside conversation
    const cta = document.createElement('div');
    cta.className = 'wa-finish-cta';
    cta.innerHTML = `
      <a href="https://wa.me/5545988230845?text=${encodeURIComponent('Olá! Vi a proposta e quero implementar o atendimento inteligente na Forms Gym.')}" target="_blank" rel="noopener" class="wa-finish-cta-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.372 0 0 5.373 0 12c0 2.118.554 4.1 1.522 5.823L.044 23.51a.5.5 0 00.614.614l5.688-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm0 21.818a9.808 9.808 0 01-5.006-1.373l-.36-.213-3.722.967.99-3.614-.234-.373A9.79 9.79 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.397 9.818-9.819 9.818z"/></svg>
        Quero Implementar
      </a>`;
    dialogChatEl.appendChild(cta);
    dialogChatEl.scrollTop = dialogChatEl.scrollHeight;
  } else {
    // Desktop: show summary panel as before
    addSimTag('📋 Ficha enviada para a recepção');
    renderSummary();
    if (summaryEl) summaryEl.hidden = false;
  }
}

/* ─── Render message ─── */
function renderMessage(msg) {
  if (emptyEl) emptyEl.hidden = true;

  if (msg.isSystem) {
    const el = document.createElement('div');
    el.className = 'wa-system-pill';
    el.innerHTML = `<span>${escapeHtml(msg.text)}</span>`;
    appendToChat(el);
    return;
  }

  if (msg.from === 'note') {
    const el = document.createElement('div');
    el.className = 'wa-annotation';
    el.innerHTML = `<span>${escapeHtml(msg.text)}</span>`;
    appendToChat(el);
    return;
  }

  // Play tone on message appear
  if (!prefersReducedMotion()) {
    playTone(msg.from === 'user' ? 'user' : 'agent');
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
  appendToChat(wrapper);
}

function addSimTag(text) {
  const el = document.createElement('div');
  el.className = 'wa-sim-tag';
  el.innerHTML = `<div class="wa-sim-tag-inner">${escapeHtml(text)}</div>`;
  appendToChat(el);
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
    if (dialogSelect) dialogSelect.value = demoState.scenario;
    playScenario();
  });
});

/* ═══════════════════════════════════════════════
   CONTROL BUTTONS
   ═══════════════════════════════════════════════ */
if (btnReset) btnReset.addEventListener('click', playScenario);

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
  // val-math removed from LP
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
   AUDIO TONES (Web AudioContext — no external files)
   ═══════════════════════════════════════════════ */
let audioCtx = null;
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioUnlocked = true;
  } catch (_) { /* unsupported */ }
}

// Activate audio on first user gesture
['click', 'touchstart', 'keydown'].forEach(evt =>
  document.addEventListener(evt, unlockAudio, { once: true, passive: true })
);

function playTone(type) {
  if (prefersReducedMotion() || !audioUnlocked || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'user') {
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.08);
    } else {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.1);
    }
  } catch (_) { /* silently fail */ }
}

/* ═══════════════════════════════════════════════
   MOBILE DEMO DIALOG
   ═══════════════════════════════════════════════ */
const demoDialog   = document.getElementById('demo-dialog');
const demoOpenBtn  = document.getElementById('demo-open-btn');
const demoCloseBtn = document.getElementById('demo-dialog-close');
const dialogSelect = document.getElementById('dialog-scenario-select');
const btnResetDialog = document.getElementById('btn-reset-dialog');

function openDemoDialog() {
  if (!demoDialog) return;
  // Reset dialog chat and start fresh for the current scenario
  if (dialogChatEl) {
    dialogChatEl.querySelectorAll('.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill, .wa-typing-wrap, .wa-annotation, .wa-finish-cta').forEach(el => el.remove());
  }
  demoDialog.showModal();
  // Restart playback so messages go into dialogChatEl
  playScenario();
}

function closeDemoDialog() {
  if (!demoDialog) return;
  demoDialog.close();
}

if (demoOpenBtn) {
  demoOpenBtn.addEventListener('click', () => { unlockAudio(); openDemoDialog(); });
}
if (demoCloseBtn) {
  demoCloseBtn.addEventListener('click', closeDemoDialog);
}
if (demoDialog) {
  // Close on backdrop click
  demoDialog.addEventListener('click', (e) => { if (e.target === demoDialog) closeDemoDialog(); });
}
if (btnResetDialog) {
  btnResetDialog.addEventListener('click', () => {
    if (dialogChatEl) dialogChatEl.querySelectorAll('.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill, .wa-typing-wrap, .wa-annotation, .wa-finish-cta').forEach(el => el.remove());
    playScenario();
  });
}
if (dialogSelect) {
  dialogSelect.addEventListener('change', () => {
    demoState.scenario = dialogSelect.value;
    // Sync tab selection on desktop
    document.querySelectorAll('.scenario-tab').forEach(t => {
      const active = t.dataset.scenario === demoState.scenario;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    if (dialogChatEl) dialogChatEl.querySelectorAll('.wa-msg-wrapper, .wa-sim-tag, .wa-system-pill, .wa-typing-wrap, .wa-annotation, .wa-finish-cta').forEach(el => el.remove());
    playScenario();
  });
}

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
