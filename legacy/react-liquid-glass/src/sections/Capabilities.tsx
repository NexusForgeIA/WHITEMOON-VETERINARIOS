import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import FadingVideo from '../components/FadingVideo'
import BlurText from '../components/BlurText'
import {
  ArrowUpRight,
  PhoneIcon,
  PulseHeartIcon,
  ScalpelIcon,
  StethoscopeIcon,
} from '../components/Icons'
import { CLINIC, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from '../site'

const CARE_VIDEO = `${import.meta.env.BASE_URL}media/care.mp4`

type Servicio = {
  icon: ReactNode
  tags: string[]
  title: string
  body: string
}

const SERVICIOS: Servicio[] = [
  {
    icon: <StethoscopeIcon className="h-5 w-5 text-white/90" />,
    tags: ['Consulta', 'Vacunación', 'Medicina interna'],
    title: 'Medicina y consulta',
    body: 'Revisión completa sin prisa: exploración, analítica en la propia clínica y un plan de vacunación y desparasitación pensado para la edad y la raza de tu animal.',
  },
  {
    icon: <ScalpelIcon className="h-5 w-5 text-white/90" />,
    tags: ['Quirófano', 'Ecografía', 'Radiología digital'],
    title: 'Cirugía y diagnóstico',
    body: 'Quirófano propio con monitorización anestésica continua, ecografía y radiología digital. Te enseñamos las imágenes y te explicamos qué vemos antes de decidir nada.',
  },
  {
    icon: <PulseHeartIcon className="h-5 w-5 text-white/90" />,
    tags: ['Urgencias 24 h', 'A domicilio', 'Seguimiento'],
    title: 'Urgencias y bienestar',
    body: 'Alguien descuelga a las cuatro de la mañana. Urgencias las 24 horas, visitas a domicilio y acompañamiento en los cuidados paliativos y el final de la vida.',
  },
]

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
}
const ease = { duration: 0.8, ease: 'easeOut' } as const

export default function Capabilities() {
  return (
    <section
      id="servicios"
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <FadingVideo
        src={CARE_VIDEO}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/50 to-black/88" />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
        <header className="mb-auto">
          <p className="mb-6 font-body text-sm text-white/80">// Servicios</p>
          <h2 className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
            <BlurText
              text="Todo lo que necesita"
              className="!justify-start"
            />
            <BlurText
              text="bajo un mismo techo"
              delay={0.25}
              className="!justify-start text-white/60"
            />
          </h2>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICIOS.map((s, i) => (
            <motion.article
              key={s.title}
              {...blurIn}
              whileInView={blurIn.animate}
              initial={blurIn.initial}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...ease, delay: 0.15 * i }}
              className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]">
                  {s.icon}
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-white/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1" />

              <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">
                {s.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* CIERRE — todo desemboca en el mismo teléfono. */}
        <motion.footer
          {...blurIn}
          whileInView={blurIn.animate}
          initial={blurIn.initial}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...ease, delay: 0.2 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row"
        >
          <p className="font-heading text-2xl italic tracking-tight text-white md:text-3xl">
            Clínica Veterinaria {CLINIC} · Madrid
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={PHONE_TEL}
              className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <PhoneIcon className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 font-body text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              data-open-chat
              className="flex items-center gap-2 font-body text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              Pedir cita
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </motion.footer>

        <p className="mt-8 text-center font-body text-[11px] font-light leading-relaxed text-white/45">
          Web de demostración creada por{' '}
          <a
            href="https://whitemoon.es"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-white/70"
          >
            WhiteMoon Agencia IA
          </a>
          . La clínica, los datos de contacto y las imágenes son ilustrativos.
        </p>
      </div>
    </section>
  )
}
