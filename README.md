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

## Rendimiento

Nada se sirve desde un tercero. Las fuentes están **self-hosted** en
`assets/fonts` (subset latin): antes eran una cadena de tres saltos
—HTML → fonts.googleapis.com → fonts.gstatic.com— que bloqueaba el render unos
2,1 s. De Fraunces se fija el peso 600, el único que se usa, y baja de 67 KB a
18 KB; Inter es variable y un solo fichero cubre 400, 500 y 600. Las dos van
con `<link rel="preload">` porque el CSS que las declara las descubriría
demasiado tarde, y con `crossorigin` aunque sean del mismo origen: las fuentes
se piden siempre en modo CORS y sin él se descargarían dos veces.

Las fotos se sirven al tamaño en que se ven, no al que vinieron:

- **Hero** — art direction real. En móvil el hueco es apaisado (5:4) y en
  escritorio vertical (4:5), así que hay un recorte para cada uno en dos
  anchos. Es el LCP: nunca `lazy`, con `fetchpriority="high"` y precargado con
  `imagesrcset`/`imagesizes` para que empiece antes de que el CSS termine.
- **Tarjetas** — 400w y 720w con `sizes` que describe la rejilla real
  (1 columna hasta 720 px, 2 hasta 1040, 3 por encima). Todas `lazy`.

Con eso el hero en móvil pasó de 262 KB a 60 KB.

Dos avisos del informe se quedan sin arreglar a propósito:

- **Cache TTL de 10 minutos.** Lo fija GitHub Pages y no expone control de
  cabeceras. No es accionable desde el repo.
- **`chatbot.js` sin minificar** (~2 KB, ~20 ms). Minificar exigiría un paso de
  compilación, que es justo lo que este repo no tiene; el peso 0 que le da
  Lighthouse no compensa perder el fuente legible.

## Diseño

Blanco médico: fondo blanco/hueso, superficies con sombras suaves, tipografía
Fraunces en titulares e Inter en el cuerpo.

**Sobre el teal.** El teal de marca `#20a89a` da **2,95:1** sobre blanco, así que
no llega a AA ni para texto ni como color de botón. En la página solo aparece
como detalle decorativo (el punto que late en el badge del hero). Todo lo
interactivo —botones, enlaces, iconos, foco— usa `#0e7c72`, que da **5,07:1**
sobre blanco y aguanta texto blanco encima con ese mismo ratio.

Medido sobre los colores computados de la página: 0 fallos de contraste AA.

El logo es **180x82**, no cuadrado. Se declara con esas medidas y se dimensiona
por altura (`height` fijo, `width: auto`); forzarlo a un cuadrado lo deformaba.

En la cabecera la imagen del logo lleva `alt=""` a propósito: el nombre está
escrito al lado, y si la imagen también lo dijera, el nombre accesible del
enlace dejaría de coincidir con su texto visible.

## Asistente de citas

`assets/chatbot.js` se inyecta a sí mismo y lo abre cualquier elemento con
`data-open-chat`. El flujo es: servicio → **día** (agenda mensual navegable,
días pasados y fines de semana deshabilitados) → **hora** (L-V, 10:00–13:30 y
16:00–19:30 en tramos de 30 min) → nombre → teléfono.

El lead va por `sendBeacon` con `keepalive` a la Edge Function `vet-notify`, que
inserta en `leads_web` con service role y avisa por Telegram server-side. En el
cliente no hay ninguna clave. Solo se envía con **nombre y teléfono de 9+
dígitos**: el mismo guard que aplica la función, que responde 400 sin ambos.

Mientras está cerrado, el panel lleva `visibility: hidden` e `inert`: si solo
fuera invisible, sus botones y su campo seguirían en el orden de tabulación
—y con `aria-hidden="true"` encima eso es exactamente lo que denuncia la
auditoría de accesibilidad.

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
