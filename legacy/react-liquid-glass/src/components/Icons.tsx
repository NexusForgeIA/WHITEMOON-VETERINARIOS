type IconProps = { className?: string }

/* Set propio: seis trazos sueltos pesan menos que cualquier librería de
   iconos y quedan afinados al mismo grosor que la tipografía. */

export function ArrowUpRight({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}

export function Play({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  )
}

export function ClockIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function GlobeIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  )
}

/** Estetoscopio — medicina interna y consulta. */
export function StethoscopeIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3v6a4 4 0 0 0 8 0V3" />
      <path d="M4 3h2" />
      <path d="M12 3h2" />
      <path d="M9 13v2a5 5 0 0 0 10 0v-1" />
      <circle cx="19" cy="10" r="2.2" />
    </svg>
  )
}

/** Bisturí sobre monitor — cirugía y diagnóstico por imagen. */
export function ScalpelIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3.5 20.5 10 12 12l-1.5-1.5L14 3.5Z" />
      <path d="m10.5 10.5-7 7" />
      <path d="M3.5 17.5 3 21l3.5-.5" />
    </svg>
  )
}

/** Corazón con pulso — urgencias y bienestar. */
export function PulseHeartIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 8.6a4.6 4.6 0 0 0-8.5-2.5 4.6 4.6 0 0 0-8.5 2.5c0 1.3.5 2.5 1.3 3.4h3.4l1.4-2.6 2.1 5 1.6-2.9h5.9c.8-.9 1.3-2.1 1.3-3.4Z" />
      <path d="M4.8 12c1.9 2.6 5.1 5 7.2 6.9 2.1-1.9 5.3-4.3 7.2-6.9" />
    </svg>
  )
}

/** Huella — marca de la clínica en las stat cards. */
export function PawIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="7" cy="8" rx="2.1" ry="2.7" />
      <ellipse cx="12" cy="6.2" rx="2.1" ry="2.9" />
      <ellipse cx="17" cy="8" rx="2.1" ry="2.7" />
      <ellipse cx="19.6" cy="13" rx="1.9" ry="2.3" />
      <path d="M12 11.4c2.7 0 5.3 2.3 5.3 4.8 0 2.1-1.6 3.4-3.6 3.4-1 0-1.2-.4-1.7-.4s-.7.4-1.7.4c-2 0-3.6-1.3-3.6-3.4 0-2.5 2.6-4.8 5.3-4.8Z" />
    </svg>
  )
}

export function PhoneIcon({ className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.2 3h3l1.5 4-2 1.4a12 12 0 0 0 6.9 6.9l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.2 5.2 2 2 0 0 1 6.2 3Z" />
    </svg>
  )
}
