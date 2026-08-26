import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el sitio bajo /WHITEMOON-VETERINARIOS/, así que el base
// path tiene que llevar el prefijo del repositorio. El build va a /docs porque
// Pages está configurado en la rama main con origen /docs (build legacy, sin
// Actions): basta con commitear la carpeta para publicar.
export default defineConfig({
  plugins: [react()],
  base: '/WHITEMOON-VETERINARIOS/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
})
