import { useEffect, useRef, useState } from "react"
import { useTick } from '../../hooks/useTick'
import sound from './../../assets/silent.wav'
import "./_embedded-stream.scss"

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null)
  const [iframeSrc, setIframeSrc] = useState(src)
  const containerRef = useState(null)
  const [isResizing, setIsResizing] = useState(false)
  const [soundState, setSoundState] = useState(new Audio(sound))
  const tick = useTick(200)
  const scrollTick = useTick(2000)

  useEffect(() => {
    applyOffset()
  }, [scrollTick])

  const applyOffset = () => {
    if (!iframeRef.current) return
    iframeRef.current.style.transform = `translateY(-${100}px)`
    iframeRef.current.style.height = `calc(100% + ${200}px)`
  }



  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Princebet.tv',
      })
    }
    soundState.loop = true
    soundState.volume = 0.02
    soundState.play()
  }, [tick])
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

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [src])

  return (
    <div ref={containerRef} className="embedded-stream">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
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

      <div className="embedded-stream__clickBlocker" />
      {(showLoader || isResizing) && (
        <div className="embedded-stream__loader">
          <div className="embedded-stream__spinner" />
          <p className="embedded-stream__loader-text">...טוען ערוץ</p>
        </div>
      )}
    </div>
  )
}
