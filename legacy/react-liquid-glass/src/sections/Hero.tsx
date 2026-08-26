import { motion } from 'framer-motion'
import FadingVideo from '../components/FadingVideo'
import BlurText from '../components/BlurText'
import {
  ArrowUpRight,
  ClockIcon,
  GlobeIcon,
  PhoneIcon,
} from '../components/Icons'
import { CLINIC, PHONE_DISPLAY, PHONE_TEL } from '../site'

const HERO_VIDEO = `${import.meta.env.BASE_URL}media/hero.mp4`

const NAV = [
  { label: 'Clínica', href: '#clinica' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Equipo', href: '#servicios' },
  { label: 'Urgencias', href: PHONE_TEL },
  { label: 'Contacto', href: PHONE_TEL },
]

const ESPECIALIDADES = ['Traumatología', 'Cardiología', 'Dermatología', 'Oftalmología']

/** Todas las piezas entran igual: desenfocadas, un poco más abajo y opacas. */
const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
}
const ease = { duration: 0.8, ease: 'easeOut' } as const

export default function Hero() {
  return (
    <section id="clinica" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black md:h-screen md:min-h-0">
      {/* El vídeo va sobredimensionado al 120 % y anclado arriba: así el
          encuadre conserva la cara del animal aunque la pantalla sea ancha. */}
      <FadingVideo
        src={HERO_VIDEO}
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: '120%', height: '120%' }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.6)_100%)]" />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* NAVBAR */}
        <nav className="fixed left-0 right-0 top-4 z-50 flex items-center justify-between px-8 lg:px-16">
          <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
            <span className="font-heading text-2xl italic leading-none text-white">
              {CLINIC.charAt(0)}
            </span>
          </div>

          <div className="liquid-glass hidden items-center rounded-full px-1.5 py-1.5 md:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 font-body text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              data-open-chat
              className="ml-1 flex items-center gap-1 rounded-full bg-white px-4 py-2 font-body text-sm font-medium text-black transition-transform hover:scale-[1.03]"
            >
              Pedir cita
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-12 w-12" aria-hidden="true" />
        </nav>

        {/* MAIN */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center [@media(max-height:800px)]:pt-16">
          <motion.div
            {...blurIn}
            transition={{ ...ease, delay: 0.4 }}
            className="liquid-glass flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
          >
            <span className="shrink-0 whitespace-nowrap rounded-full bg-white px-2.5 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-black">
              24 h
            </span>
            <span className="font-body text-sm font-light text-white/90">
              Urgencias abiertas ahora mismo en Madrid centro
            </span>
          </motion.div>

          <BlurText
            text="Cuidamos de quien no sabe explicarse"
            delay={0.55}
            className="mt-6 max-w-3xl font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem] [@media(max-height:800px)]:mt-4 [@media(max-height:800px)]:max-w-[34rem] [@media(max-height:800px)]:lg:text-[4.25rem]"
          />

          <motion.p
            {...blurIn}
            transition={{ ...ease, delay: 0.8 }}
            className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base"
          >
            Clínica Veterinaria {CLINIC} — medicina interna, cirugía y diagnóstico por
            imagen en el centro de Madrid. Equipo propio, quirófano en la propia clínica
            y seguimiento del caso hasta el alta.
          </motion.p>

          <motion.div
            {...blurIn}
            transition={{ ...ease, delay: 1.1 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-6"
          >
            <button
              type="button"
              data-open-chat
              className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              Pedir cita
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href={PHONE_TEL}
              className="flex items-center gap-2 font-body text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              Llamar al {PHONE_DISPLAY}
            </a>
          </motion.div>

          <motion.div
            {...blurIn}
            transition={{ ...ease, delay: 1.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4 [@media(max-height:800px)]:mt-5"
          >
            <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5 text-left">
              <ClockIcon className="h-6 w-6 text-white/80" />
              <p className="mt-4 font-heading text-4xl italic leading-none tracking-[-1px] text-white">
                24 h
              </p>
              <p className="mt-1.5 font-body text-xs font-light leading-snug text-white/80">
                Urgencias todos los días del año, festivos incluidos
              </p>
            </div>
            <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5 text-left">
              <GlobeIcon className="h-6 w-6 text-white/80" />
              <p className="mt-4 font-heading text-4xl italic leading-none tracking-[-1px] text-white">
                Domicilio
              </p>
              <p className="mt-1.5 font-body text-xs font-light leading-snug text-white/80">
                Atención a domicilio para animales que no pueden desplazarse
              </p>
            </div>
          </motion.div>
        </main>

        {/* TRUST BAR */}
        <motion.div
          {...blurIn}
          transition={{ ...ease, delay: 1.4 }}
          className="flex flex-col items-center gap-4 pb-8 [@media(max-height:800px)]:gap-3 [@media(max-height:800px)]:pb-5"
        >
          <div className="liquid-glass rounded-full px-5 py-2">
            <p className="font-body text-xs font-light text-white/90">
              Más de 4.000 familias de Madrid nos confían su animal
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 px-4 font-heading text-2xl italic tracking-tight text-white/70 md:gap-16 md:text-3xl [@media(max-height:800px)]:md:text-2xl">
            {ESPECIALIDADES.map((e) => (
              <span key={e}>{e}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
