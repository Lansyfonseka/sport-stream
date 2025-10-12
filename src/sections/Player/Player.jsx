import './_player.scss';
// import { useState } from 'react';
// import VideoJS from "./VideoJS";
// import "video.js/dist/video-js.css";


// export default function Player() {
//   const [srcIndex, setSrcIndex] = useState(0);

//   const sources = [
//     // HLS (m3u8) — поддерживается из коробки через VHS
//     { src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", type: "application/x-mpegURL" },
//     // MP4 как запасной вариант
//     { src: "https://banlamasikerim.xatli.xyz/7011/index.m3u8", type: "video/mp4" },
//   ];

//   const options = {
//     controls: true,
//     autoplay: "muted", // автозапуск с mute — безопасно для браузеров
//     responsive: true,
//     fluid: true,       // адаптивный контейнер
//     preload: "auto",
//     poster: "https://dummyimage.com/1280x720/0a1020/ffffff&text=Video.js",
//     sources: [sources[srcIndex]],
//   };

//   return (
//     <div className='s-player'>
//       <VideoJS
//         options={options}
//         onReady={(player) => {
//           // можно подписаться на события
//           player.on("play", () => console.log("▶ play"));
//           player.on("error", () => console.log("⚠ error", player.error()));
//         }}
//       />
//       <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//         <button onClick={() => setSrcIndex(0)}>HLS</button>
//         <button onClick={() => setSrcIndex(1)}>MP4</button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const urlStream = 'https://content.jwplatform.com/manifests/yp342SRmf.m3u8'

export default function HlsPlayer({
  src,
  className = "",         // сюда передаём ваш класс с размерами
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  poster,
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
        try { video.load(); } catch {}
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