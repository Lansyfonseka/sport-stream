import "./_player.scss";
import ErrorLoadMedia from '../../assets/error-loading-media.webp';
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsPlayer({
  src,
  className = "",
  controls = true,
  autoPlay = true,
  muted = true,
  loop = false,
  poster = ErrorLoadMedia,
  playsInline = true,
  hlsConfig,
  videoProps = {},
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.load();
    } else if (Hls.isSupported()) {
      if (!hlsRef.current) {
        hlsRef.current = new Hls(hlsConfig);
        hlsRef.current.attachMedia(video);
      }
      hlsRef.current.loadSource(src);
    }

    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        try {
          video.load();
        } catch {}
      }
    };
  }, [src, hlsConfig]);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

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
        preload="metadata"
        crossOrigin="anonymous"
        {...videoProps}
      />
    </div>
  );
}
