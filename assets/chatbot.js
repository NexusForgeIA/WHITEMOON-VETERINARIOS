/* ============================================================
   ASISTENTE DE CITAS — Clínica Veterinaria WhiteMoon
   JS puro, sin dependencias. Se inyecta a sí mismo sobre la
   página y cualquier elemento con [data-open-chat] lo abre.

   Flujo: servicio → día (agenda mensual) → hora → nombre →
   teléfono → envío.

   El lead viaja a la Edge Function vet-notify, que inserta en
   leads_web con service role y avisa por Telegram server-side.
   Aquí no hay ninguna clave.

   DEMO: los tramos horarios se generan en cliente y no se
   consulta disponibilidad real. La cita queda sujeta a
   confirmación de la clínica y así se le dice al usuario.
   ============================================================ */
(function () {
  'use strict';

  if (window.__wmChat) return;

  var NOTIFY_URL = 'https://mlaqtniujnvfxcvcourm.supabase.co/functions/v1/vet-notify';
  var TEL_TXT = '643 199 580';

  /* ---------- Agenda (demo) ---------- */
  // L-V, mañana y tarde, en tramos de 30 minutos.
  var TRAMOS = [
    { etiqueta: 'Mañana', desde: 10 * 60, hasta: 13 * 60 + 30 },
    { etiqueta: 'Tarde', desde: 16 * 60, hasta: 19 * 60 + 30 }
  ];
  var PASO = 30;
  // Margen mínimo para pedir hora hoy: nadie reserva para dentro de 10 min.
  var MARGEN_MIN = 90;
  var MESES_VISTA = 6;

  var DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  var SERVICIOS = [
    { k: 'consul', t: 'Consulta y medicina general' },
    { k: 'vacun', t: 'Vacunación y prevención' },
    { k: 'cirug', t: 'Cirugía' },
    { k: 'urgen', t: 'Urgencias 24 h' },
    { k: 'diagn', t: 'Diagnóstico y análisis' },
    { k: 'peluq', t: 'Peluquería y bienestar' }
  ];

  /* ---------- Utilidades de fecha ---------- */

  function hoy() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function mismoDia(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  // Lunes = 0 … Domingo = 6. getDay() da domingo = 0, que descoloca la rejilla.
  function diaSemanaLunes(d) { return (d.getDay() + 6) % 7; }

  function formatoLargo(d) {
    return d.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function formatoCorto(d) {
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function isoLocal(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function hhmm(min) {
    return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
  }

  /**
   * Tramos libres de un día. Devuelve [] si el día no es hábil, si ya pasó,
   * o si es hoy y no queda ninguna hora con margen suficiente. La lista vacía
   * es justo lo que usa el calendario para deshabilitar el día, así que la
   * regla de "hoy ya no da tiempo" no hay que escribirla dos veces.
   */
  function tramosDe(fecha) {
    var wd = diaSemanaLunes(fecha);
    if (wd > 4) return [];                 // sábado y domingo, cerrado
    if (fecha < hoy()) return [];

    var esHoy = mismoDia(fecha, new Date());
    var ahora = new Date();
    var corte = esHoy ? ahora.getHours() * 60 + ahora.getMinutes() + MARGEN_MIN : -1;

    var salida = [];
    TRAMOS.forEach(function (bloque) {
      var horas = [];
      for (var m = bloque.desde; m <= bloque.hasta; m += PASO) {
        if (m > corte) horas.push(hhmm(m));
      }
      if (horas.length) salida.push({ etiqueta: bloque.etiqueta, horas: horas });
    });
    return salida;
  }

  function hayHueco(fecha) {
    return tramosDe(fecha).length > 0;
  }

  /* ============================================================
     Lead — mismo guard que la Edge Function
     Solo es válido con nombre Y teléfono de 9+ dígitos; sin
     ambos, vet-notify responde 400 y no inserta nada.
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
      fecha: d.fecha || '',
      hora: d.hora || '',
      fechaISO: d.fechaISO || '',
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

  /* ---------- Iconos ---------- */

  var IC_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z"/></svg>';
  var IC_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var IC_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg>';
  var IC_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>';
  var IC_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';

  /* ---------- Montaje ---------- */

  var host = document.createElement('div');
  host.innerHTML =
    '<button class="cb-fab" id="cb-fab" data-open-chat aria-label="Abrir el asistente para pedir cita">' +
      IC_CHAT + '<span>Pedir cita</span><span class="live" aria-hidden="true"></span>' +
    '</button>' +
    '<div class="cb" id="cb" role="dialog" aria-modal="false" aria-labelledby="cb-title" aria-hidden="true">' +
      '<div class="cb-head">' +
        '<picture>' +
          '<source srcset="assets/logo.webp" type="image/webp">' +
          '<img src="assets/logo.png" width="180" height="82" alt="">' +
        '</picture>' +
        '<div>' +
          '<p class="cb-name" id="cb-title">Asistente WhiteMoon</p>' +
          '<p class="cb-sub">Pedir cita · respuesta inmediata</p>' +
        '</div>' +
        '<button class="cb-x" id="cb-x" type="button" aria-label="Cerrar el asistente">' + IC_X + '</button>' +
      '</div>' +
      '<div class="cb-log" id="cb-log" role="log" aria-live="polite" aria-label="Conversación"></div>' +
      '<div class="cb-panel" id="cb-panel"></div>' +
      '<form class="cb-form" id="cb-form">' +
        '<label class="sr-only" for="cb-input">Escribe tu respuesta</label>' +
        '<input class="cb-input" id="cb-input" type="text" autocomplete="off" placeholder="Escribe aquí...">' +
        '<button class="cb-send" id="cb-send" type="submit" aria-label="Enviar">' + IC_SEND + '</button>' +
      '</form>' +
      '<p class="cb-foot">Demo WhiteMoon · solicitud de cita sujeta a confirmación</p>' +
    '</div>';
  document.body.appendChild(host);

  var $ = function (s) { return host.querySelector(s); };
  var cb = $('#cb'), fab = $('#cb-fab'), log = $('#cb-log'), panel = $('#cb-panel');
  var input = $('#cb-input'), send = $('#cb-send');

  cb.inert = true;

  /* ---------- Estado ---------- */

  var greeted = false;
  var estado = 'inicio';
  // Mes que muestra el calendario. Se normaliza a día 1 a medianoche: si se
  // dejara la hora actual, `vista <= mesActual` sería falso en el propio mes
  // y el botón de "mes anterior" quedaría activo para navegar al pasado.
  var vista = (function () {
    var t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  })();
  var lead = nuevoLead();

  function nuevoLead() {
    return { servicio: '', fecha: '', fechaISO: '', hora: '', nombre: '', telefono: '', mensaje: '' };
  }

  /* ---------- Mensajes ---------- */

  function say(txt, who) {
    var m = document.createElement('div');
    m.className = 'cb-msg ' + who;
    m.textContent = txt;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function bot(txt, delay) {
    setTimeout(function () { say(txt, 'bot'); }, delay || 320);
  }

  function limpiarPanel() { panel.innerHTML = ''; }

  function panelBase(etiqueta) {
    limpiarPanel();
    var box = document.createElement('div');
    box.className = 'cb-panel-in';
    if (etiqueta) {
      var l = document.createElement('p');
      l.className = 'cb-panel-lbl';
      l.textContent = etiqueta;
      box.appendChild(l);
    }
    panel.appendChild(box);
    return box;
  }

  // El campo de texto solo tiene sentido cuando toca escribir: mientras se
  // elige día u hora se bloquea para que nadie teclee a ciegas.
  function modoEntrada(activo, placeholder) {
    input.disabled = !activo;
    send.disabled = !activo;
    input.placeholder = placeholder || 'Escribe aquí...';
    if (activo) setTimeout(function () { input.focus(); }, 120);
  }

  /* ---------- Paso 1: servicio ---------- */

  function pedirServicio() {
    estado = 'servicio';
    var box = panelBase('¿Qué necesitas?');
    var chips = document.createElement('div');
    chips.className = 'cb-chips';
    SERVICIOS.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cb-chip';
      b.textContent = s.t;
      b.addEventListener('click', function () { eligeServicio(s); });
      chips.appendChild(b);
    });
    box.appendChild(chips);
    modoEntrada(true, 'O escríbelo aquí...');
  }

  function eligeServicio(s) {
    lead.servicio = s.t;
    say(s.t, 'usr');
    bot('Perfecto. Elige el día que mejor te venga.', 260);
    setTimeout(pedirFecha, 320);
  }

  /* ---------- Paso 2: día (agenda mensual) ---------- */

  function pedirFecha() {
    estado = 'fecha';
    modoEntrada(false, 'Elige un día en el calendario');
    pintaCalendario();
  }

  function pintaCalendario() {
    var box = panelBase(null);

    var t = hoy();
    var mesActual = new Date(t.getFullYear(), t.getMonth(), 1);
    var limite = new Date(t.getFullYear(), t.getMonth() + MESES_VISTA, 1);

    /* Cabecera de navegación */
    var nav = document.createElement('div');
    nav.className = 'cb-cal-nav';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'cb-cal-btn';
    prev.innerHTML = IC_PREV;
    prev.setAttribute('aria-label', 'Mes anterior');
    prev.disabled = vista <= mesActual;
    prev.addEventListener('click', function () {
      vista = new Date(vista.getFullYear(), vista.getMonth() - 1, 1);
      pintaCalendario();
    });

    var titulo = document.createElement('p');
    titulo.className = 'cb-cal-month';
    titulo.setAttribute('aria-live', 'polite');
    // es-ES devuelve "agosto de 2026"; con text-transform:capitalize salía
    // "Agosto De 2026", así que la mayúscula se pone solo en la inicial.
    var etiquetaMes = vista.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    titulo.textContent = etiquetaMes.charAt(0).toUpperCase() + etiquetaMes.slice(1);

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'cb-cal-btn';
    next.innerHTML = IC_NEXT;
    next.setAttribute('aria-label', 'Mes siguiente');
    next.disabled = vista >= limite;
    next.addEventListener('click', function () {
      vista = new Date(vista.getFullYear(), vista.getMonth() + 1, 1);
      pintaCalendario();
    });

    nav.appendChild(prev);
    nav.appendChild(titulo);
    nav.appendChild(next);
    box.appendChild(nav);

    /* Rejilla */
    var grid = document.createElement('div');
    grid.className = 'cb-cal-grid';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Días disponibles de ' + etiquetaMes);

    DIAS_CORTOS.forEach(function (d, i) {
      var c = document.createElement('span');
      c.className = 'cb-cal-wd';
      c.setAttribute('aria-hidden', 'true');
      c.textContent = d;
      c.title = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][i];
      grid.appendChild(c);
    });

    var primero = new Date(vista.getFullYear(), vista.getMonth(), 1);
    var huecos = diaSemanaLunes(primero);
    for (var h = 0; h < huecos; h++) {
      var vacio = document.createElement('span');
      vacio.className = 'cb-cal-day is-empty';
      vacio.setAttribute('aria-hidden', 'true');
      grid.appendChild(vacio);
    }

    var ultimo = new Date(vista.getFullYear(), vista.getMonth() + 1, 0).getDate();
    for (var n = 1; n <= ultimo; n++) {
      (function (dia) {
        var fecha = new Date(vista.getFullYear(), vista.getMonth(), dia);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cb-cal-day';
        b.textContent = String(dia);
        if (mismoDia(fecha, new Date())) b.classList.add('is-today');

        if (!hayHueco(fecha)) {
          b.disabled = true;
          b.setAttribute('aria-label', formatoLargo(fecha) + ', sin horas disponibles');
        } else {
          b.setAttribute('aria-label', formatoLargo(fecha));
          b.addEventListener('click', function () { eligeFecha(fecha); });
        }
        grid.appendChild(b);
      })(n);
    }

    box.appendChild(grid);

    var nota = document.createElement('p');
    nota.className = 'cb-cal-note';
    nota.textContent = 'Consulta de lunes a viernes. Para urgencias, llama al ' + TEL_TXT + '.';
    box.appendChild(nota);
  }

  function eligeFecha(fecha) {
    lead.fecha = formatoLargo(fecha);
    lead.fechaISO = isoLocal(fecha);
    say(formatoCorto(fecha), 'usr');
    bot('Muy bien. ¿A qué hora te viene mejor?', 260);
    setTimeout(function () { pedirHora(fecha); }, 320);
  }

  /* ---------- Paso 3: hora ---------- */

  function pedirHora(fecha) {
    estado = 'hora';
    modoEntrada(false, 'Elige una hora');

    var box = panelBase('Horas libres · ' + formatoCorto(fecha));
    var grid = document.createElement('div');
    grid.className = 'cb-slots';

    tramosDe(fecha).forEach(function (bloque) {
      var sep = document.createElement('p');
      sep.className = 'cb-slots-sep';
      sep.textContent = bloque.etiqueta;
      grid.appendChild(sep);

      bloque.horas.forEach(function (h) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cb-slot';
        b.textContent = h;
        b.setAttribute('aria-label', h + ' del ' + formatoCorto(fecha));
        b.addEventListener('click', function () { eligeHora(h); });
        grid.appendChild(b);
      });
    });

    box.appendChild(grid);

    var atras = document.createElement('button');
    atras.type = 'button';
    atras.className = 'cb-back';
    atras.textContent = 'Elegir otro día';
    atras.addEventListener('click', function () {
      say('Prefiero otro día', 'usr');
      pedirFecha();
    });
    box.appendChild(atras);
  }

  function eligeHora(h) {
    lead.hora = h;
    say(h, 'usr');
    limpiarPanel();
    estado = 'nombre';
    bot('Anotado: ' + lead.fecha + ' a las ' + h + '.\n\n¿A nombre de quién ponemos la cita?', 300);
    modoEntrada(true, 'Tu nombre');
  }

  /* ---------- Apertura y cierre ---------- */

  function openChat() {
    cb.classList.add('open');
    cb.inert = false;
    cb.setAttribute('aria-hidden', 'false');
    fab.style.display = 'none';
    $('#cb-x').focus();
    if (!greeted) {
      greeted = true;
      bot('Hola, soy el asistente de la Clínica Veterinaria WhiteMoon.\n\nTe busco hueco en un minuto.', 250);
      setTimeout(pedirServicio, 620);
    }
  }

  function closeChat() {
    cb.classList.remove('open');
    cb.inert = true;
    cb.setAttribute('aria-hidden', 'true');
    fab.style.display = '';
    fab.focus();
  }

  // Delegación en document: los botones [data-open-chat] del HTML existen
  // antes que este script, pero delegar cubre también cualquiera que se
  // añada después sin tener que volver a enlazarlos.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-open-chat]') : null;
    if (t) { e.preventDefault(); openChat(); }
  });
  $('#cb-x').addEventListener('click', closeChat);
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cb.classList.contains('open')) closeChat();
  });

  /* ---------- Entrada de texto ---------- */

  $('#cb-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    say(txt, 'usr');

    if (estado === 'servicio') {
      // Escribió en vez de pulsar: se intenta casar con un servicio.
      var t = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      var hit = SERVICIOS.filter(function (s) { return t.indexOf(s.k) >= 0; })[0];
      if (hit) {
        limpiarPanel();
        eligeServicio(hit);
        return;
      }
      bot('Puedo ayudarte con consulta, vacunación, cirugía, urgencias, diagnóstico o peluquería. Elige una opción de abajo.');
      return;
    }

    if (estado === 'nombre') {
      lead.nombre = txt;
      estado = 'telefono';
      bot('Gracias, ' + txt + '. ¿Un teléfono para confirmarte la cita?');
      modoEntrada(true, 'Tu teléfono');
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
        modoEntrada(true, 'Tu nombre');
        return;
      }

      lead.mensaje = lead.servicio + ' · ' + lead.fecha + ' a las ' + lead.hora;
      enviarLead(lead);

      estado = 'fin';
      modoEntrada(false, 'Conversación terminada');
      bot('Listo, ' + lead.nombre + '.\n\n' +
          '🩺 ' + lead.servicio + '\n' +
          '📅 ' + lead.fecha + '\n' +
          '🕐 ' + lead.hora + '\n\n' +
          'Te llamamos al ' + lead.telefono + ' para confirmarla: la cita queda ' +
          'sujeta a confirmación de la clínica.\n\n' +
          'Si es urgente, llama ya al ' + TEL_TXT + '.', 420);

      setTimeout(function () {
        var box = panelBase(null);
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cb-chip';
        b.textContent = 'Pedir otra cita';
        b.addEventListener('click', function () {
          lead = nuevoLead();
          say('Pedir otra cita', 'usr');
          pedirServicio();
        });
        box.appendChild(b);
      }, 900);
      return;
    }

    bot('Si quieres otra cita, pulsa "Pedir otra cita". Para urgencias, llama al ' + TEL_TXT + '.');
  });

  window.__wmChat = { open: openChat, close: closeChat };
})();
