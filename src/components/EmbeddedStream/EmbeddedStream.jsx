import { useEffect, useRef, useState } from "react"
import { useTickWithAction } from '../../hooks/useTick'
import sound from './../../assets/silent.wav'
import "./_embedded-stream.scss"

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null)
  const containerRef = useRef(null)
  const [iframeSrc, setIframeSrc] = useState(src)
  const [isResizing, setIsResizing] = useState(false)
  const [soundState, setSoundState] = useState(new Audio(sound))

  const [style, setStyle] = useState({ transform: "translateY(0px)", height: "200px" })

  function play(sound) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Princebet.tv',
      })
    }
    sound.loop = true
    sound.volume = 0.02
    sound.play()
  }
  const applyOffset = (iframe) => {
    if (!iframe.current) return
    setStyle({ transform: "translateY(-100px)", height: "calc(100% + 200px)" })
  }
  useTickWithAction(2000, applyOffset, [iframeRef])
  useTickWithAction(200, play, [soundState])



  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeSrc(`${src}?t=${new Date().getTime()}`)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [src])


  useEffect(() => {
    let resizeTimeout
    let lastWidth = window.innerWidth

    const handleResize = () => {
      if (document.fullscreenElement) return

      const currentWidth = window.innerWidth
      if (currentWidth === lastWidth) return
      lastWidth = currentWidth

      if (iframeRef.current) {
        setIsResizing(true)
        setIframeSrc(`${src}?t=${new Date().getTime()}`)
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          setIsResizing(false)
        }, 3000)
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)

      clearTimeout(resizeTimeout)
    }
  }, [src])

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    let lastClickTime = 0
    const DOUBLE_CLICK_DELAY = 300 // мс

    // 🔹 Перенаправляем hover-события вниз
    const forwardHoverEvent = (e) => {


      container.style.pointerEvents = 'none'
      setTimeout(() => {
        container.style.pointerEvents = 'auto'
      }, 100)

    }

    const handleClick = (e) => {
      const now = Date.now()

      if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
        e.preventDefault()
        e.stopPropagation()
        console.log('Двойной клик заблокирован')
      } else {
        // 🔹 Пропускаем одиночный клик “вниз”
        container.style.pointerEvents = 'none'
        setTimeout(() => {
          container.style.pointerEvents = 'auto'
        }, 100)
      }

      lastClickTime = now
    }

    container.addEventListener('mousedown', handleClick)
    container.addEventListener('dblclick', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Двойной клик заблокирован через dblclick')
    })

    // наведение и движение мыши
    container.addEventListener('mousemove', forwardHoverEvent)
    container.addEventListener('mouseenter', forwardHoverEvent)
    container.addEventListener('mouseleave', forwardHoverEvent)
    container.addEventListener('mouseover', forwardHoverEvent)

    return () => {
      container.removeEventListener('mousedown', handleClick)
      container.removeEventListener('dblclick', handleClick)
      container.removeEventListener('mousemove', forwardHoverEvent)
      container.removeEventListener('mouseenter', forwardHoverEvent)
      container.removeEventListener('mouseleave', forwardHoverEvent)
      container.removeEventListener('mouseover', forwardHoverEvent)
    }
  }, [containerRef])

  return (
    <div className="embedded-stream">
      <div ref={containerRef} className="embedded-stream__clickBlocker" />

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={style}
        className="embedded-stream__iframe"
        title="Embedded Stream"
        allowFullScreen
        scrolling="no"
        allow="autoplay; fullscreen"
      />
      <div className="embedded-stream__blur-corner">
        <img src="/princebet77_logo.svg" />
      </div>
      <div className="embedded-stream__blur-corner-fullscreen" />

      {(showLoader || isResizing) && (
        <div className="embedded-stream__loader">
          <div className="embedded-stream__spinner" />
          <p className="embedded-stream__loader-text">...טוען ערוץ</p>
        </div>
      )}
    </div>
  )
}
