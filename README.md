# Clínica Veterinaria WhiteMoon — demo

Landing de una página en **HTML/CSS/JS puro**. Sin framework, sin build, sin
dependencias: se abre `index.html` y ya está.

```
index.html          la página entera
assets/
  styles.css        estilos
  app.js            reveals al hacer scroll + sombra de la cabecera
  chatbot.js        asistente de citas con agenda mensual
  logo.webp/.png    marca WhiteMoon
  img/*.webp|.jpg   fotos (WebP con fallback JPG)
supabase/functions/vet-notify/   Edge Function que recibe el lead
legacy/             versiones anteriores, NO publicadas
```

## Despliegue

GitHub Pages sirve la rama `main` desde la **raíz**. No hay paso de compilación:
lo que está en el repo es lo que se publica.

URL: https://nexusforgeia.github.io/WHITEMOON-VETERINARIOS/

## Diseño

Blanco médico: fondo blanco/hueso, superficies con sombras suaves, tipografía
Fraunces en titulares e Inter en el cuerpo.

**Sobre el teal.** El teal de marca `#20a89a` da **2,95:1** sobre blanco, así que
no llega a AA ni para texto ni como color de botón. En la página solo aparece
como detalle decorativo (el punto que late en el badge del hero). Todo lo
interactivo —botones, enlaces, iconos, foco— usa `#0e7c72`, que da **5,07:1**
sobre blanco y aguanta texto blanco encima con ese mismo ratio.

Medido sobre los colores computados de la página: 0 fallos de contraste AA.

## Asistente de citas

`assets/chatbot.js` se inyecta a sí mismo y lo abre cualquier elemento con
`data-open-chat`. El flujo es: servicio → **día** (agenda mensual navegable,
días pasados y fines de semana deshabilitados) → **hora** (L-V, 10:00–13:30 y
16:00–19:30 en tramos de 30 min) → nombre → teléfono.

El lead va por `sendBeacon` con `keepalive` a la Edge Function `vet-notify`, que
inserta en `leads_web` con service role y avisa por Telegram server-side. En el
cliente no hay ninguna clave. Solo se envía con **nombre y teléfono de 9+
dígitos**: el mismo guard que aplica la función, que responde 400 sin ambos.

**Es una demo.** Los tramos se generan en cliente y no se consulta
disponibilidad real; por eso el mensaje de cierre dice que la cita queda sujeta
a confirmación de la clínica.

Un día se deshabilita solo si `tramosDe()` devuelve una lista vacía, así que la
regla de «hoy ya no da tiempo» (margen de 90 min) no está escrita dos veces.

## Histórico

- `legacy/dark-static/` — primera demo, estática y oscura.
- `legacy/react-liquid-glass/` — versión React + Vite con estética *liquid
  glass*. Se conserva como referencia; los vídeos de fondo se borraron por peso
  (siguen en el historial de git).
