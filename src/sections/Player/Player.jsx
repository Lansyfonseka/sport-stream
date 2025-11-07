import Hls from "hls.js"
import { useEffect, useRef, useState } from "react"
import ErrorLoadMedia from "../../assets/error-loading-media.webp"
import WatermarkLogo from "../../assets/NEXTBETLOGO.png"
import "./_player.scss"

/**
 * HLS-плеер с «толстым» буфером и пребуферингом.
 * - Увеличенные maxBufferLength / maxMaxBufferLength
 * - Держим отступ от live-края (liveSyncDuration / liveMaxLatencyDuration)
 * - autoStartLoad=false + старт загрузки раньше, воспроизведение — после накопления N сек
 */
export default function HlsPlayer({
  src,
  className = "",
  controls = true,
  autoPlay = true,
  muted = false,
  loop = false,
  poster = ErrorLoadMedia,
  playsInline = true,
  videoProps = {},
  prebufferSeconds = 15,
  bufferConfig = {},
}) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // базовый «толстый» конфиг
    const defaultConfig = {
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 40,           // можно 20–60
      maxMaxBufferLength: 180,       // можно 120–300
      liveSyncDuration: 15,          // целевая задержка от live-края (15 секунд)
      liveMaxLatencyDuration: 30,    // максимум, прежде чем «догонять» (30 секунд)
      liveDurationInfinity: true,
      autoStartLoad: false,
      startFragPrefetch: true,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 1200,
      manifestLoadingRetryDelay: 2000,
      maxFragLookUpTolerance: 0.3,
      ...bufferConfig,
    }

    if (!Hls.isSupported()) return

    const hls = new Hls(defaultConfig)
    hlsRef.current = hls

    const safePlay = () => video.play().catch(() => { })

    const getBufferedAhead = () => {
      const t = video.currentTime
      const b = video.buffered
      for (let i = 0; i < b.length; i++) {
        if (t >= b.start(i) && t <= b.end(i)) return b.end(i) - t
      }
      return 0
    }

    let prebufferTimer = null
    const startPrebufferWatch = () => {
      clearInterval(prebufferTimer)
      if (!autoPlay || prebufferSeconds <= 0) {
        // без пребуфера — просто play
        safePlay()
        return
      }
      setWaiting(true)
      prebufferTimer = setInterval(() => {
        const ahead = getBufferedAhead()
        // как только набрали нужный запас — стартуем
        if (ahead >= prebufferSeconds) {
          clearInterval(prebufferTimer)
          prebufferTimer = null
          setWaiting(false)
          safePlay()
        }
      }, 250)
    }

    hls.attachMedia(video)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(src)
      // начинаем подкачку сразу, но без play
      hls.startLoad(-1) // -1 = с подходящего места
      startPrebufferWatch()
    })

    hls.on(Hls.Events.FRAG_LOADED, (_e, d) =>
      console.log('FRAG_LOADED', d.frag?.sn, d.stats?.loaded)
    )
    hls.on(Hls.Events.BUFFER_APPENDING, (_e, d) =>
      console.log('BUFFER_APPENDING', d.type, d.startPTS, d.endPTS)
    )

    hls.on(Hls.Events.ERROR, (_e, data) => {
      console.warn('[HLS ERROR]', data.type, data.details)
      if (!data.fatal) return
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad()
          break
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError()
          break
        default:
          hls.destroy()
          break
      }
    })

    // если вкладка стала активной — пробуем воспроизвести
    const onVis = () => {
      if (document.visibilityState === 'visible' && !waiting && autoPlay) {
        safePlay()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      clearInterval(prebufferTimer)
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
      if (video) {
        video.pause()
        video.removeAttribute("src")
        try { video.load() } catch { }
      }
    }
  }, [src, autoPlay, prebufferSeconds, JSON.stringify(bufferConfig)])

  return (
    <div className={`hls-player ${className}`}>
      <video
        ref={videoRef}
        className="hls-player__video"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
        playsInline={playsInline}
        preload="auto"
        crossOrigin="anonymous"
        {...videoProps}
      />
      {/* Watermark logo */}
      <a 
        href="https://heylink.me/PrinceBet77" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hls-player__watermark"
      >
        <img src={WatermarkLogo} alt="Logo" />
      </a>
      {/* Индикатор ожидания буфера — опционально */}
      {/* {waiting && <div className="hls-player__overlay">Буферизация…</div>} */}
    </div>
  )
}
