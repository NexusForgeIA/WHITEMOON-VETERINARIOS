/* ============================================================
   NORA — Asistente virtual de Clínica Veterinaria San Marcos
   100% local (sin APIs ni URLs externas). Deriva a WhatsApp.
   ============================================================ */
(function () {
  "use strict";

  var WHATSAPP = "34643199580";
  var TEL = "+34912345678";

  /* ---------- Estilos (autoinyectados) ---------- */
  var css = `
  .nora-fab{position:fixed;right:22px;bottom:22px;z-index:950;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#10b981,#0e9b6e);color:#04130d;border:none;border-radius:100px;padding:14px 20px;font-family:'Sora',system-ui,sans-serif;font-weight:600;font-size:.95rem;cursor:pointer;box-shadow:0 14px 36px -10px rgba(16,185,129,.6);transition:.25s}
  .nora-fab:hover{transform:translateY(-2px)}
  .nora-fab svg{width:22px;height:22px}
  .nora-fab .ping{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#34d399;border:2px solid #0a0f0d}
  .nora-panel{position:fixed;right:22px;bottom:22px;z-index:960;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 40px));background:#0e1512;border:1px solid #2a3a32;border-radius:18px;box-shadow:0 30px 80px -30px rgba(0,0,0,.85);display:none;flex-direction:column;overflow:hidden;font-family:'Sora',system-ui,sans-serif}
  .nora-panel.open{display:flex;animation:noraUp .28s ease}
  @keyframes noraUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  .nora-head{display:flex;align-items:center;gap:12px;padding:16px 18px;background:linear-gradient(135deg,#10b981,#0e9b6e);color:#04130d}
  .nora-head .av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.25);display:grid;place-items:center;font-size:1.2rem}
  .nora-head b{font-size:1rem;display:block;line-height:1.2}
  .nora-head small{font-size:.74rem;opacity:.85;display:flex;align-items:center;gap:5px}
  .nora-head .od{width:7px;height:7px;border-radius:50%;background:#04130d}
  .nora-head .x{margin-left:auto;background:rgba(0,0,0,.15);border:none;color:#04130d;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:1.1rem;line-height:1}
  .nora-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;background:#0a0f0d}
  .nora-msg{max-width:84%;padding:11px 15px;border-radius:14px;font-size:.92rem;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}
  .nora-msg.bot{background:#18201c;color:#e8f0ec;border:1px solid #243029;border-bottom-left-radius:4px;align-self:flex-start}
  .nora-msg.me{background:linear-gradient(135deg,#10b981,#0e9b6e);color:#04130d;border-bottom-right-radius:4px;align-self:flex-end;font-weight:500}
  .nora-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 18px 12px;background:#0a0f0d}
  .nora-chip{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);color:#34d399;border-radius:100px;padding:7px 13px;font-size:.8rem;font-weight:500;cursor:pointer;font-family:inherit;transition:.2s}
  .nora-chip:hover{background:rgba(16,185,129,.18)}
  .nora-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 16px;background:#18201c;border:1px solid #243029;border-radius:14px}
  .nora-typing span{width:7px;height:7px;border-radius:50%;background:#5b6b63;animation:noraBlink 1.2s infinite}
  .nora-typing span:nth-child(2){animation-delay:.2s}.nora-typing span:nth-child(3){animation-delay:.4s}
  @keyframes noraBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}
  .nora-foot{display:flex;gap:8px;padding:12px;border-top:1px solid #243029;background:#0e1512}
  .nora-foot input{flex:1;background:#0a0f0d;border:1px solid #2a3a32;border-radius:11px;padding:11px 14px;color:#f2f6f4;font-family:inherit;font-size:.92rem;outline:none}
  .nora-foot input:focus{border-color:#10b981}
  .nora-foot button{background:linear-gradient(135deg,#10b981,#0e9b6e);border:none;border-radius:11px;width:44px;cursor:pointer;color:#04130d;display:grid;place-items:center}
  .nora-foot button svg{width:18px;height:18px}
  @media(max-width:480px){.nora-panel{right:0;bottom:0;width:100vw;height:100svh;border-radius:0}.nora-fab{right:16px;bottom:16px}}
  `;
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- DOM ---------- */
  var fab = document.createElement("button");
  fab.className = "nora-fab";
  fab.setAttribute("aria-label", "Abrir asistente NORA");
  fab.innerHTML = '<span class="ping"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Habla con NORA';

  var panel = document.createElement("div");
  panel.className = "nora-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistente NORA");
  panel.innerHTML =
    '<div class="nora-head">' +
      '<div class="av">🐾</div>' +
      '<div><b>NORA</b><small><span class="od"></span>Asistente · San Marcos</small></div>' +
      '<button class="x" aria-label="Cerrar">✕</button>' +
    '</div>' +
    '<div class="nora-body" id="noraBody"></div>' +
    '<div class="nora-chips" id="noraChips"></div>' +
    '<form class="nora-foot" id="noraForm">' +
      '<input id="noraInput" type="text" placeholder="Escribe tu mensaje…" autocomplete="off" aria-label="Mensaje">' +
      '<button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
    '</form>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var body = panel.querySelector("#noraBody");
  var chips = panel.querySelector("#noraChips");
  var form = panel.querySelector("#noraForm");
  var input = panel.querySelector("#noraInput");

  /* ---------- Estado ---------- */
  var estado = "inicio";          // inicio | esperando_nombre | esperando_telefono | fin
  var leadNombre = "";
  var leadTelefono = "";
  var greeted = false;

  var CHIPS = ["Pedir cita", "Urgencias 24h", "Precios", "Vacunas"];

  function pintarChips() {
    chips.innerHTML = "";
    CHIPS.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "nora-chip";
      b.type = "button";
      b.textContent = c;
      b.addEventListener("click", function () { enviar(c); });
      chips.appendChild(b);
    });
  }

  function addMsg(text, who) {
    var el = document.createElement("div");
    el.className = "nora-msg " + who;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function botSay(text) { addMsg(text, "bot"); }

  function typing(show) {
    var t = panel.querySelector(".nora-typing");
    if (show) {
      if (t) return;
      t = document.createElement("div");
      t.className = "nora-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
    } else if (t) { t.remove(); }
  }

  function enviarWhatsApp(nombre, telefono) {
    var msg = encodeURIComponent(
      "Hola, soy " + nombre + " (tel: " + telefono +
      "). Quiero pedir cita en la Clínica Veterinaria San Marcos."
    );
    window.open("https://wa.me/" + WHATSAPP + "?text=" + msg, "_blank");
  }

  /* ---------- Motor conversacional ---------- */
  function procesarMensaje(texto) {
    var t = texto.toLowerCase().trim();

    // Captura de nombre
    if (estado === "esperando_nombre") {
      leadNombre = texto.trim();
      estado = "esperando_telefono";
      return "Encantada, " + leadNombre + " 🐾 ¿Me dejas un teléfono de contacto para confirmar la cita?";
    }

    // Captura de teléfono → WhatsApp
    if (estado === "esperando_telefono") {
      leadTelefono = texto.trim();
      estado = "fin";
      setTimeout(function () { enviarWhatsApp(leadNombre, leadTelefono); }, 600);
      return "¡Perfecto, " + leadNombre + "! Te abro WhatsApp para terminar de concretar tu cita con el equipo. Si no se abre, llámanos al 91 234 56 78. 🐶🐱";
    }

    // Intención de cita
    if (t.indexOf("cita") > -1 || t.indexOf("reserv") > -1 || t.indexOf("consulta") > -1 || t.indexOf("pedir") > -1) {
      estado = "esperando_nombre";
      return "¡Genial! Te ayudo a pedir cita 🐾 ¿Cómo te llamas?";
    }

    // Precios
    if (t.indexOf("precio") > -1 || t.indexOf("coste") > -1 || t.indexOf("cuesta") > -1 || t.indexOf("cuánto") > -1 || t.indexOf("cuanto") > -1) {
      return "La consulta general cuesta 35 € e incluye exploración completa. Vacunas, cirugía o pruebas se presupuestan aparte, siempre antes de hacerlas. ¿Quieres que te ayude a pedir cita?";
    }

    // Vacunas
    if (t.indexOf("vacuna") > -1 || t.indexOf("desparasit") > -1) {
      return "Diseñamos un calendario de vacunación personalizado: polivalente y rabia en perros, trivalente y leucemia en gatos. ¿Te preparo una cita para revisarlo?";
    }

    // Urgencias
    if (t.indexOf("urgenc") > -1 || t.indexOf("urgente") > -1 || t.indexOf("emergenc") > -1) {
      return "⚠️ Atendemos urgencias 24 h todos los días. Si es una emergencia, llama YA al 91 234 56 78 y vente a Calle Mayor 45. Estamos en el centro de Madrid.";
    }

    // Cirugía
    if (t.indexOf("cirug") > -1 || t.indexOf("operaci") > -1 || t.indexOf("operar") > -1 || t.indexOf("esteriliz") > -1) {
      return "Contamos con quirófano propio y monitorización anestésica para esterilizaciones, tejidos blandos y traumatología. ¿Quieres una valoración previa? Te ayudo a pedir cita.";
    }

    // Peluquería
    if (t.indexOf("peluquer") > -1 || t.indexOf("baño") > -1 || t.indexOf("bano") > -1 || t.indexOf("corte") > -1) {
      return "Ofrecemos peluquería canina y felina: baño, corte e higiene con productos específicos y sin estrés. ¿Reservamos un hueco?";
    }

    // Cachorros / primeras visitas
    if (t.indexOf("cachorro") > -1 || t.indexOf("gatito") > -1 || t.indexOf("cría") > -1 || t.indexOf("cria") > -1 || t.indexOf("primera") > -1) {
      return "La primera visita ideal de un cachorro o gatito es entre las 6 y 8 semanas, para iniciar vacunas y desparasitación. ¿Te busco una cita?";
    }

    // Tipo de mascota / bienvenida
    if (t.indexOf("perro") > -1 || t.indexOf("gato") > -1 || t.indexOf("exótic") > -1 || t.indexOf("exotic") > -1 || t.indexOf("conejo") > -1 || t.indexOf("ave") > -1 || t.indexOf("hurón") > -1 || t.indexOf("huron") > -1 || t.indexOf("reptil") > -1) {
      return "Atendemos perros, gatos y también exóticos (conejos, hurones, aves y reptiles) con veterinarios especialistas. Cuéntame qué necesita tu mascota o dime \"pedir cita\".";
    }

    // Saludo
    if (t.indexOf("hola") > -1 || t.indexOf("buenas") > -1 || t.indexOf("buenos") > -1) {
      return "¡Hola! 🐾 Soy NORA, de la Clínica Veterinaria San Marcos. ¿Quieres pedir cita, consultar precios o tienes una urgencia?";
    }

    // Por defecto
    return "Puedo ayudarte con citas, vacunas, urgencias, cirugía o peluquería. Dime \"pedir cita\" y te lo gestiono, o llama al 91 234 56 78. 🐶🐱";
  }

  function enviar(texto) {
    if (!texto || !texto.trim()) return;
    addMsg(texto, "me");
    input.value = "";
    typing(true);
    var reply = procesarMensaje(texto);
    setTimeout(function () {
      typing(false);
      botSay(reply);
    }, 600);
  }

  /* ---------- Apertura / cierre ---------- */
  function abrir() {
    panel.classList.add("open");
    fab.style.display = "none";
    if (!greeted) {
      greeted = true;
      pintarChips();
      setTimeout(function () {
        botSay("¡Hola! 🐾 Soy NORA, la asistente de la Clínica Veterinaria San Marcos. Puedo ayudarte con citas, vacunas, urgencias y más. ¿En qué puedo ayudarte?");
      }, 300);
    }
    setTimeout(function () { input.focus(); }, 350);
  }
  function cerrar() {
    panel.classList.remove("open");
    fab.style.display = "flex";
  }

  fab.addEventListener("click", abrir);
  panel.querySelector(".x").addEventListener("click", cerrar);
  form.addEventListener("submit", function (e) { e.preventDefault(); enviar(input.value); });
})();
