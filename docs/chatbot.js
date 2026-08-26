/* ============================================================
   ASISTENTE LUNDÉ — captación de cita
   Widget autónomo: se inyecta a sí mismo (estilos + DOM) sobre
   cualquier página, sin dependencias y fuera del bundle de React.
   La conversación y el envío del lead son los mismos que ya
   estaban probados en el repo: Edge Function vet-notify, que
   inserta en leads_web con service role y avisa por Telegram
   server-side. Aquí no viaja ninguna clave.
   ============================================================ */
(function () {
  'use strict';

  if (window.__lundeChat) return;

  var NOTIFY_URL = 'https://mlaqtniujnvfxcvcourm.supabase.co/functions/v1/vet-notify';
  var TEL_TXT = '643 19 95 80';

  /* ---------- Estilos ---------- */
  var CSS = [
    '.cb-fab{position:fixed;bottom:22px;right:22px;z-index:9998;height:52px;padding:0 20px 0 16px;border-radius:999px;',
    'background:rgba(255,255,255,.06);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.22);',
    'color:#fff;cursor:pointer;display:flex;align-items:center;gap:10px;font-family:"Barlow",sans-serif;font-size:.85rem;font-weight:500;',
    'box-shadow:0 10px 40px rgba(0,0,0,.55),inset 0 1px 1px rgba(255,255,255,.18);transition:transform .25s ease,border-color .25s ease}',
    '.cb-fab:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.45)}',
    '.cb-fab svg{width:18px;height:18px}',
    '.cb-fab .live{width:7px;height:7px;border-radius:50%;background:#fff;animation:cbPulse 2s ease-in-out infinite}',
    '@keyframes cbPulse{0%,100%{opacity:1}50%{opacity:.25}}',

    '.cb{position:fixed;bottom:86px;right:22px;z-index:9999;width:370px;max-width:calc(100vw - 28px);',
    'max-height:min(620px,calc(100svh - 120px));background:rgba(10,10,12,.86);-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px);',
    'border:1px solid rgba(255,255,255,.16);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;',
    'font-family:"Barlow",sans-serif;color:#fff;box-shadow:0 28px 70px rgba(0,0,0,.75),inset 0 1px 1px rgba(255,255,255,.14);',
    'opacity:0;transform:translateY(14px) scale(.97);pointer-events:none;transition:opacity .4s ease,transform .4s ease}',
    '.cb.open{opacity:1;transform:none;pointer-events:auto}',
    '.cb-head{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1)}',
    '.cb-ring{width:34px;height:34px;flex-shrink:0;border-radius:50%;display:grid;place-items:center;',
    'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.25);font-family:"Instrument Serif",serif;font-style:italic;font-size:1.1rem;line-height:1}',
    '.cb-name{font-size:.9rem;font-weight:500;margin:0}',
    '.cb-sub{font-size:.72rem;color:rgba(255,255,255,.55);margin:0}',
    '.cb-x{margin-left:auto;background:transparent;border:0;cursor:pointer;color:rgba(255,255,255,.55);display:grid;place-items:center;',
    'width:32px;height:32px;border-radius:50%;transition:color .25s ease,background .25s ease}',
    '.cb-x:hover{color:#fff;background:rgba(255,255,255,.08)}',
    '.cb-x svg{width:15px;height:15px}',
    '.cb-log{flex:1;min-height:130px;max-height:240px;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px}',
    '.cb-msg{max-width:86%;padding:10px 14px;border-radius:14px;font-size:.85rem;line-height:1.6;white-space:pre-line}',
    '.cb-msg.bot{background:rgba(255,255,255,.07);border-bottom-left-radius:4px;align-self:flex-start}',
    '.cb-msg.usr{background:#fff;color:#0b0b0e;font-weight:500;border-bottom-right-radius:4px;align-self:flex-end}',
    '.cb-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 20px}',
    '.cb-chips:not(:empty){padding-bottom:16px}',
    '.cb-chip{background:transparent;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:7px 14px;font-family:inherit;',
    'font-size:.78rem;color:#fff;cursor:pointer;transition:border-color .25s ease,background .25s ease}',
    '.cb-chip:hover{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.06)}',
    '.cb-form{display:flex;gap:8px;padding:12px 20px 16px;border-top:1px solid rgba(255,255,255,.1)}',
    '.cb-input{flex:1;min-width:0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.18);border-radius:999px;',
    'padding:11px 16px;font-family:inherit;font-size:.85rem;color:#fff;outline:none;transition:border-color .25s ease}',
    '.cb-input::placeholder{color:rgba(255,255,255,.42)}',
    '.cb-input:focus{border-color:rgba(255,255,255,.5)}',
    '.cb-send{width:40px;height:40px;flex-shrink:0;border-radius:50%;border:0;background:#fff;color:#0b0b0e;cursor:pointer;',
    'display:grid;place-items:center;transition:transform .25s ease}',
    '.cb-send:hover{transform:scale(1.06)}',
    '.cb-send svg{width:16px;height:16px}',
    '.cb-foot{padding:0 20px 16px;font-size:.66rem;color:rgba(255,255,255,.45);text-align:center;margin:0}',
    '.cb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '@media(max-width:760px){.cb{right:12px;left:12px;width:auto;bottom:80px}.cb-fab{right:12px;bottom:14px}}',
    '@media(prefers-reduced-motion:reduce){.cb,.cb-fab,.cb-send,.cb-chip{transition:none}.cb-fab .live{animation:none}}'
  ].join('');

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg>';

  /* ============================================================
     Lead — mismo guard que la Edge Function
     Un lead solo es válido con nombre Y teléfono (>= 9 dígitos).
     vet-notify responde 400 si falta alguno de los dos, así que
     validar aquí evita mandar basura y perder la conversación.
     ============================================================ */
  function leadValido(d) {
    var nombre = (d.nombre || '').trim();
    var digits = (d.telefono || '').replace(/\D/g, '');
    return nombre !== '' && digits.length >= 9;
  }

  // text/plain evita el preflight CORS y permite reutilizar el mismo cuerpo en
  // sendBeacon; la Edge Function lo lee con req.json() igualmente.
  function enviarLead(d) {
    var body = JSON.stringify({
      nombre: d.nombre,
      telefono: d.telefono,
      servicio: d.servicio || 'cita',
      mensaje: d.mensaje || ''
    });
    try {
      if (navigator.sendBeacon &&
          navigator.sendBeacon(NOTIFY_URL, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return;
    } catch (e) { /* seguimos con fetch */ }
    try {
      fetch(NOTIFY_URL, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: body
      }).catch(function () {});
    } catch (e) { /* nunca interrumpe la conversación */ }
  }

  /* ---------- Montaje ---------- */
  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var host = document.createElement('div');
  host.innerHTML =
    '<button class="cb-fab" id="cb-fab" data-open-chat aria-label="Abrir el asistente para pedir cita">' +
      ICON_CHAT + ' Pedir cita <span class="live" aria-hidden="true"></span>' +
    '</button>' +
    '<div class="cb" id="cb" role="dialog" aria-modal="false" aria-labelledby="cb-title" aria-hidden="true">' +
      '<div class="cb-head">' +
        '<span class="cb-ring" aria-hidden="true">L</span>' +
        '<div><p class="cb-name" id="cb-title">Asistente Lundé</p>' +
        '<p class="cb-sub">Pedir cita · respuesta inmediata</p></div>' +
        '<button class="cb-x" id="cb-x" aria-label="Cerrar el asistente">' + ICON_X + '</button>' +
      '</div>' +
      '<div class="cb-log" id="cb-log" role="log" aria-live="polite" aria-label="Conversación"></div>' +
      '<div class="cb-chips" id="cb-chips"></div>' +
      '<form class="cb-form" id="cb-form">' +
        '<label class="cb-sr" for="cb-input">Escribe tu respuesta</label>' +
        '<input class="cb-input" id="cb-input" type="text" autocomplete="off" placeholder="Escribe aquí...">' +
        '<button class="cb-send" type="submit" aria-label="Enviar">' + ICON_SEND + '</button>' +
      '</form>' +
      '<p class="cb-foot">Demo WhiteMoon · solicitud de cita, no una reserva confirmada</p>' +
    '</div>';
  document.body.appendChild(host);

  var $ = function (s) { return host.querySelector(s); };
  var cb = $('#cb'), fab = $('#cb-fab'), log = $('#cb-log'), chips = $('#cb-chips'), input = $('#cb-input');

  /* ---------- Conversación ---------- */
  var greeted = false, estado = 'inicio';
  var lead = { servicio: '', nombre: '', telefono: '', mensaje: '' };

  var SERVICIOS = [
    { k: 'consul', t: 'Consulta general' },
    { k: 'vacun',  t: 'Vacunación' },
    { k: 'cirug',  t: 'Cirugía' },
    { k: 'urgen',  t: 'Urgencias 24h' },
    { k: 'domic',  t: 'Visita a domicilio' },
    { k: 'diagn',  t: 'Diagnóstico y análisis' }
  ];

  function say(txt, who) {
    var m = document.createElement('div');
    m.className = 'cb-msg ' + who;
    m.textContent = txt;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function bot(txt, delay) { setTimeout(function () { say(txt, 'bot'); }, delay || 320); }

  function setChips(items) {
    chips.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cb-chip';
      b.textContent = it.t;
      b.addEventListener('click', function () { pickServicio(it); });
      chips.appendChild(b);
    });
  }

  function pickServicio(it) {
    lead.servicio = it.t;
    lead.mensaje = it.t;
    say(it.t, 'usr');
    chips.innerHTML = '';
    estado = 'nombre';
    bot('Perfecto: ' + it.t + '.\n¿A nombre de quién ponemos la cita?');
    setTimeout(function () { input.focus(); }, 400);
  }

  function openChat() {
    cb.classList.add('open');
    cb.setAttribute('aria-hidden', 'false');
    fab.style.display = 'none';
    $('#cb-x').focus();
    if (!greeted) {
      greeted = true;
      estado = 'servicio';
      bot('Hola, soy el asistente de la Clínica Veterinaria Lundé.\n\n¿Para qué necesitas la cita?', 250);
      setTimeout(function () { setChips(SERVICIOS); }, 600);
    }
  }
  function closeChat() {
    cb.classList.remove('open');
    cb.setAttribute('aria-hidden', 'true');
    fab.style.display = '';
    fab.focus();
  }

  // Delegación en document: los botones [data-open-chat] los pinta React
  // después de que este script se ejecute, así que enlazarlos uno a uno
  // dejaría muertos los de la página.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-open-chat]') : null;
    if (t) { e.preventDefault(); openChat(); }
  });
  $('#cb-x').addEventListener('click', closeChat);
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cb.classList.contains('open')) closeChat();
  });

  $('#cb-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    say(txt, 'usr');

    if (estado === 'nombre') {
      lead.nombre = txt;
      estado = 'telefono';
      bot('Gracias, ' + txt + '. ¿Un teléfono para confirmarte la hora?');
      return;
    }

    if (estado === 'telefono') {
      if (txt.replace(/\D/g, '').length < 9) {
        bot('Ese número no parece completo. ¿Lo repites?');
        return;
      }
      lead.telefono = txt;

      // Sin nombre no se envía nada: se vuelve a pedir.
      if (!leadValido(lead)) {
        estado = 'nombre';
        bot('Antes de cerrarla necesito tu nombre. ¿A nombre de quién la ponemos?');
        return;
      }

      enviarLead(lead);
      estado = 'fin';
      bot('Listo, ' + lead.nombre + '. Hemos registrado tu solicitud de cita para ' +
          lead.servicio + '.\n\nTe llamamos en breve al ' + lead.telefono +
          ' para confirmar la hora.\n\nSi es urgente, llama ya al ' + TEL_TXT + '.', 420);
      setTimeout(function () { lead = { servicio: '', nombre: '', telefono: '', mensaje: '' }; }, 600);
      return;
    }

    if (estado === 'servicio') {
      // Escribió en vez de pulsar un chip: se intenta casar con un servicio.
      var t = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      var hit = SERVICIOS.filter(function (s) { return t.indexOf(s.k) >= 0; })[0];
      if (hit) { pickServicio(hit); return; }
      bot('Puedo ayudarte con consulta, vacunación, cirugía, urgencias, visita a domicilio o diagnóstico. Elige una opción abajo.');
      setTimeout(function () { setChips(SERVICIOS); }, 500);
      return;
    }

    bot('Si quieres otra cita, pulsa "Pedir cita". Para urgencias, llama al ' + TEL_TXT + '.');
  });

  window.__lundeChat = { open: openChat, close: closeChat };
})();
