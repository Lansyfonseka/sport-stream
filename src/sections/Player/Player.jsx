import Hls from "hls.js"
import { useEffect, useRef } from "react"
import ErrorLoadMedia from "../../assets/error-loading-media.webp"
import "./_player.scss"

export default function HlsPlayer({
  src,
  className = "",
  controls = true,
  autoPlay = true,
  muted = true,
  loop = false,
  poster = ErrorLoadMedia,
  playsInline = true,
  hlsConfig = {},
  videoProps = {},
}) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // конфигурация по умолчанию, если не передана снаружи
    const defaultHlsConfig = {
      enableWorker: true,                // использует web worker для декодирования
      lowLatencyMode: true,              // уменьшает задержку для live
      backBufferLength: 90,              // хранить не более 90 сек в буфере
      liveSyncDuration: 3,               // держать отставание в 3 сек от live edge
      liveMaxLatencyDuration: 10,        // максимум 10 сек от live edge
      xhrSetup: (xhr) => {
        xhr.withCredentials = false
      },
      debug: false,
    }

    const config = { ...defaultHlsConfig, ...hlsConfig }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      video.load()
      video.play().catch(() => { })
    } else if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
      hlsRef.current = new Hls(config)
      hlsRef.current.attachMedia(video)
      hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
        hlsRef.current.loadSource(src)
      })

      // обработка ошибок
      hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
        console.warn("HLS Error:", data.type, data.details, data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hlsRef.current.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hlsRef.current.recoverMediaError()
              break
            default:
              hlsRef.current.destroy()
              break
          }
        }
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      if (video) {
        video.pause()
        video.removeAttribute("src")
        try {
          video.load()
        } catch { }
      }
    }
  }, [src, hlsConfig])

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
    </div>
  )
}
