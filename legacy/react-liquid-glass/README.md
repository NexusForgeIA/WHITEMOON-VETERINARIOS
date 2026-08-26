# Clínica Veterinaria Lundé — demo WhiteMoon

Landing de una sola página (Hero + Servicios) en React + Vite + TypeScript +
Tailwind + Framer Motion, con estética *liquid glass* sobre fondo negro y vídeos
de fondo self-hosted.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173/WHITEMOON-VETERINARIOS/
npm run build    # compila a /docs
npm run preview  # sirve /docs tal y como lo verá GitHub Pages
```

## Despliegue

GitHub Pages sirve la rama `main` desde `/docs`, así que **la carpeta `docs/`
se commitea**: `npm run build` antes de cada PR o el sitio publicado se queda
atrás. El `base` de Vite es `/WHITEMOON-VETERINARIOS/`, el prefijo del repo.

URL: https://nexusforgeia.github.io/WHITEMOON-VETERINARIOS/

## Asistente de citas

`public/chatbot.js` es un widget autónomo (sin dependencias, fuera del bundle)
que se inyecta a sí mismo y capta el lead contra la Edge Function `vet-notify`
(`supabase/functions/vet-notify`). Solo envía con nombre **y** teléfono de 9+
dígitos: el mismo guard que aplica la función, que responde 400 sin ambos.
Cualquier botón de la página con `data-open-chat` lo abre.

## Vídeos

`public/media/hero.mp4` y `public/media/care.mp4` están self-hosted a propósito
—nada depende de un CDN ajeno— y vienen de Mixkit (licencia libre, uso comercial
sin atribución).

## Histórico

`legacy/index.html` es la demo estática anterior, conservada como referencia.
No se publica.
