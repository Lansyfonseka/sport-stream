import React, { useRef, useState, useEffect } from "react";
import "./_embedded-stream.scss";

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState(src);

  

  useEffect(() => {
    const timeout = setTimeout(() => {
      const handleIframeClick = () => {
    const iframe = iframeRef.current;

    if (iframe && iframe.contentWindow) {
      const playButton = iframe.contentWindow.document.querySelector('button')
      
      if (playButton) {
        playButton.click();
      } else {
        console.log('Кнопка не найдена внутри iframe');
      }
    }
  };
      setTimeout(() => setIframeSrc(`${src}?t=${new Date().getTime()}`), 2000)
    }, 5000);
    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <div className="embedded-stream">
      <iframe
        ref={iframeRef}
        src={iframeSrc}  // Используем динамическое значение src
        className="embedded-stream__iframe"
        title="Embedded Stream"
        allowFullScreen
        scrolling="no"
        allow="autoplay"
      />
      <div className="embedded-stream__mask"></div>
      <div className="embedded-stream__border embedded-stream__border--left"></div>
      <div className="embedded-stream__border embedded-stream__border--right"></div>

      {showLoader && (
        <div className="embedded-stream__loader">
          <div className="embedded-stream__spinner"></div>
          <p className="embedded-stream__loader-text">...טוען ערוץ</p>
        </div>
      )}

      <button onClick={handleIframeClick}>Кликнуть по кнопке внутри iframe</button>
    </div>
  );
}
