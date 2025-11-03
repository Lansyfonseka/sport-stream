import Hls from "hls.js"
import { useEffect, useRef } from "react"
import ErrorLoadMedia from "../../assets/error-loading-media.webp"
import "./_player.scss"

/**
 * Универсальный HLS-плеер с автоматическим восстановлением
 * и обработкой битых сегментов. Работает как в Live, так и VOD.
 */
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
    console.log('asdasdasda')
    // 🧠 Конфигурация HLS
    const defaultConfig = {
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 60,
      liveSyncDuration: 3,
      liveMaxLatencyDuration: 10,
      fragLoadingMaxRetry: 3,       // макс. попыток загрузки фрагмента
      fragLoadingRetryDelay: 1000,  // задержка между попытками
      manifestLoadingRetryDelay: 2000,
      maxFragLookUpTolerance: 0.2,
      startPosition: -1,
      autoStartLoad: true,
      xhrSetup: (xhr) => {
        xhr.withCredentials = false
      },
      debug: false,
    }
    console.log('asdasdasda')
    const config = { ...defaultConfig, ...hlsConfig }

    // ⚙️ Инициализация Hls.js
    if (Hls.isSupported()) {
      console.log('supported')
      const hls = new Hls(config)
      hlsRef.current = hls

      hls.attachMedia(video)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("[HLS] Media attached")
        hls.loadSource(src)
      })

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        console.log(`[HLS] Манифест загружен (${data.levels.length} качеств)`)
        if (autoPlay) {
          video.play().catch((err) => console.warn("Автоплей заблокирован:", err))
        }
      })
      hls.on(Hls.Events.FRAG_LOADED, (_e, d) => console.log('FRAG_LOADED', d.frag?.sn, d.stats?.loaded))
      hls.on(Hls.Events.BUFFER_APPENDING, (_e, d) => console.log('BUFFER_APPENDING', d.type, d.startPTS, d.endPTS))
      // 🚑 Обработка ошибок
      hls.on(Hls.Events.ERROR, (event, data) => {
        const { type, details, fatal } = data
        console.warn("[HLS ERROR]", type, details)

        if (fatal) {
          switch (type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("[HLS] Network error → повторная загрузка")
              hls.startLoad()
              break

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("[HLS] Media error → восстановление")
              hls.recoverMediaError()
              break

            case Hls.ErrorTypes.OTHER_ERROR:
              console.warn("[HLS] Другие ошибки → перезапуск плеера")
              hls.destroy()
              setTimeout(() => {
                const newHls = new Hls(config)
                newHls.attachMedia(video)
                newHls.loadSource(src)
                hlsRef.current = newHls
              }, 1000)
              break

            default:
              console.error("[HLS] Неустранимая ошибка, уничтожаем")
              hls.destroy()
              break
          }
        } else if (details === "fragLoadError" || details === "bufferAppendError") {
          // ⛔️ Битый фрагмент — пропускаем
          console.warn("[HLS] Битый сегмент — пропуск")
          try {
            const current = video.currentTime
            video.currentTime = current + 6 // перейти на следующий кусок
          } catch { }
        }
      })
    } else {
      console.log('NOT')
    }

    // 🧹 Очистка
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
  }, [src])

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
