import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Props = {
  src: string | string[]
  className?: string
  style?: CSSProperties
}

/**
 * Vídeo de fondo que nunca corta en seco: entra con un fundido de 500 ms al
 * tener datos y se apaga en 550 ms cuando quedan menos de 0,55 s de metraje.
 * Con un solo src rebobina y vuelve a entrar; con una lista, encadena al
 * siguiente clip en bucle.
 */
export default function FadingVideo({ src, className = '', style }: Props) {
  const list = Array.isArray(src) ? src : [src]
  const single = list.length === 1
  const ref = useRef<HTMLVideoElement>(null)
  const [index, setIndex] = useState(0)

  // El opacity se manipula a mano —y no vía estado de React— porque el fundido
  // se dispara desde eventos del vídeo a 60 fps: pasar por el render de React
  // en cada timeupdate sería tirar frames a la basura.
  useEffect(() => {
    const video = ref.current
    if (!video) return

    let raf = 0
    video.style.opacity = '0'
    video.style.transition = 'opacity 500ms ease-in-out'

    const fadeIn = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        video.style.transition = 'opacity 500ms ease-in-out'
        video.style.opacity = '1'
      })
    }

    const onLoadedData = () => {
      fadeIn()
      void video.play().catch(() => {})
    }

    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime
      if (!Number.isFinite(remaining)) return
      if (remaining <= 0.55) {
        video.style.transition = 'opacity 550ms ease-in-out'
        video.style.opacity = '0'
      }
    }

    const onEnded = () => {
      if (single) {
        video.currentTime = 0
        void video.play().catch(() => {})
        fadeIn()
        return
      }
      setIndex((i) => (i + 1) % list.length)
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)

    // Si el clip ya estaba cacheado el evento loadeddata pudo dispararse antes
    // de montar el listener: readyState lo confirma sin esperar.
    if (video.readyState >= 2) onLoadedData()

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [index, single, list.length])

  return (
    <video
      ref={ref}
      key={list[index]}
      src={list[index]}
      className={className}
      style={{ opacity: 0, ...style }}
      autoPlay
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
