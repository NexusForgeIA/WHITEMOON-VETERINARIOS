import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  text: string
  className?: string
  delay?: number
}

/**
 * El titular no aparece: se enfoca. Cada palabra entra por separado desde
 * blur(10px), con 100 ms de retraso sobre la anterior, así que la frase se
 * lee de izquierda a derecha al mismo ritmo al que se leería en voz alta.
 */
export default function BlurText({ text, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        rowGap: '0.1em',
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{ duration: 0.7, delay: delay + i * 0.1, ease: 'easeOut' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
