import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import "./_player.scss";

const isIOS =
  typeof window !== "undefined" &&
  /iP(hone|od|ad)/.test(window.navigator.userAgent);

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function HlsPlayer({
  src,
  className = "",
  autoPlay = true,
  muted = false,
  loop = false,
  playsInline = true,
  videoProps = {},
  prebufferSeconds = 15,
  bufferConfig = {},
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const [waiting, setWaiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const defaultConfig = {
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: 40,
      maxMaxBufferLength: 180,
      liveSyncDuration: 15,
      liveMaxLatencyDuration: 30,
      liveDurationInfinity: true,
      autoStartLoad: false,
      startFragPrefetch: true,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 1200,
      manifestLoadingRetryDelay: 2000,
      maxFragLookUpTolerance: 0.3,
      ...bufferConfig,
    };

    if (!Hls.isSupported()) return;

    const hls = new Hls(defaultConfig);
    hlsRef.current = hls;

    const safePlay = () => video.play().catch(() => {});

    const getBufferedAhead = () => {
      const t = video.currentTime;
      const b = video.buffered;
      for (let i = 0; i < b.length; i++) {
        if (t >= b.start(i) && t <= b.end(i)) return b.end(i) - t;
      }
      return 0;
    };

    let prebufferTimer = null;
    const startPrebufferWatch = () => {
      clearInterval(prebufferTimer);
      if (!autoPlay || prebufferSeconds <= 0) {
        safePlay();
        return;
      }
      setWaiting(true);
      prebufferTimer = setInterval(() => {
        const ahead = getBufferedAhead();
        if (ahead >= prebufferSeconds) {
          clearInterval(prebufferTimer);
          prebufferTimer = null;
          setWaiting(false);
          safePlay();
        }
      }, 250);
    };

    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(src);
      hls.startLoad(-1);
      startPrebufferWatch();
    });

    const onVis = () => {
      if (document.visibilityState === "visible" && !waiting && autoPlay) {
        safePlay();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const container = containerRef.current;

    let onFSChange;
    if (container && !isIOS) {
      const fsEl = () =>
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      const exitFS = () =>
        document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();

      const enterContainerFS = () => {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen)
          container.webkitRequestFullscreen();
        else if (container.mozRequestFullScreen)
          container.mozRequestFullScreen();
        else if (container.msRequestFullscreen)
          container.msRequestFullscreen();
      };

      onFSChange = async () => {
        if (fsEl() === video) {
          await exitFS();
          enterContainerFS();
        }
        setIsFullscreen(!!fsEl());
      };

      document.addEventListener("fullscreenchange", onFSChange);
      document.addEventListener("webkitfullscreenchange", onFSChange);
      document.addEventListener("mozfullscreenchange", onFSChange);
      document.addEventListener("msfullscreenchange", onFSChange);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVis);

      if (!isIOS && onFSChange) {
        document.removeEventListener("fullscreenchange", onFSChange);
        document.removeEventListener("webkitfullscreenchange", onFSChange);
        document.removeEventListener("mozfullscreenchange", onFSChange);
        document.removeEventListener("msfullscreenchange", onFSChange);
      }

      clearInterval(prebufferTimer);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        try {
          video.load();
        } catch {}
      }
    };
  }, [src, autoPlay, prebufferSeconds, JSON.stringify(bufferConfig)]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isIOS) return;

    const handleBeginFS = () => {
      setIsFullscreen(true);
    };

    const handleEndFS = () => {
      setIsFullscreen(false);
    };

    video.addEventListener("webkitbeginfullscreen", handleBeginFS);
    video.addEventListener("webkitendfullscreen", handleEndFS);

    return () => {
      video.removeEventListener("webkitbeginfullscreen", handleBeginFS);
      video.removeEventListener("webkitendfullscreen", handleEndFS);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const showControlsTemporarily = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    container.addEventListener("mousemove", showControlsTemporarily);
    container.addEventListener("touchstart", showControlsTemporarily);
    container.addEventListener("click", showControlsTemporarily);

    return () => {
      container.removeEventListener("mousemove", showControlsTemporarily);
      container.removeEventListener("touchstart", showControlsTemporarily);
      container.removeEventListener("click", showControlsTemporarily);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className={`hls-player ${className}`}>
      {/* *** Новый текстовый постер *** */}
      {(waiting || !isPlaying) && (
        <div className="hls-player__loading-overlay">
          טעינה, אנא המתן
        </div>
      )}

      <video
        ref={videoRef}
        className="hls-player__video"
        controls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="auto"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onDurationChange={(e) => setDuration(e.target.duration)}
        onVolumeChange={(e) => {
          setVolume(e.target.volume);
          setIsMuted(e.target.muted);
        }}
        onClick={() => {
          const video = videoRef.current;
          if (video) {
            if (video.paused) video.play();
            else video.pause();
          }
        }}
        {...videoProps}
      />

      <a
        href="https://heylink.me/PrinceBet77"
        target="_blank"
        rel="noopener noreferrer"
        className={`hls-player__watermark ${
          showControls
            ? "hls-player__watermark--controls-visible"
            : "hls-player__watermark--controls-hidden"
        }`}
      >
        <img src="/Newlogo.png" alt="Logo" />
      </a>

      <div
        className={`hls-player__controls ${
          showControls
            ? "hls-player__controls--visible"
            : "hls-player__controls--hidden"
        }`}
      >
        <div className="hls-player__progress-container">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const video = videoRef.current;
              if (video) video.currentTime = parseFloat(e.target.value);
            }}
            className="hls-player__progress"
          />
        </div>

        <div className="hls-player__controls-row">
          <button
            type="button"
            className="hls-player__btn"
            onClick={() => {
              const video = videoRef.current;
              if (video) {
                if (video.paused) video.play();
                else video.pause();
              }
            }}
            title={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="hls-player__volume-container">
            <button
              type="button"
              className="hls-player__btn"
              onClick={() => {
                const video = videoRef.current;
                if (video) video.muted = !video.muted;
              }}
              title={isMuted ? "Включить звук" : "Выключить звук"}
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : volume < 0.5 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const video = videoRef.current;
                if (video) {
                  video.volume = parseFloat(e.target.value);
                  if (video.volume > 0) video.muted = false;
                }
              }}
              className="hls-player__volume-slider"
            />
          </div>

          <div className="hls-player__time">{formatTime(currentTime)}</div>

          <div className="hls-player__spacer"></div>

          <button
            type="button"
            className="hls-player__btn"
            onClick={() => {
              const container = containerRef.current;
              const video = videoRef.current;
              if (!video) return;

              if (isIOS) {
                if (!isFullscreen) {
                  const anyVideo = video;
                  if (typeof anyVideo.webkitEnterFullscreen === "function") {
                    anyVideo.webkitEnterFullscreen();
                  }
                } else {
                  const anyVideo = video;
                  if (typeof anyVideo.webkitExitFullscreen === "function") {
                    anyVideo.webkitExitFullscreen();
                  }
                }
                return;
              }

              if (!container) return;

              if (isFullscreen) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen)
                  document.webkitExitFullscreen();
                else if (document.msExitFullscreen)
                  document.msExitFullscreen();
              } else {
                if (container.requestFullscreen) container.requestFullscreen();
                else if (container.webkitRequestFullscreen)
                  container.webkitRequestFullscreen();
                else if (container.mozRequestFullScreen)
                  container.mozRequestFullScreen();
                else if (container.msRequestFullscreen)
                  container.msRequestFullscreen();
              }
            }}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
