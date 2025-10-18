import React, { useRef, useState, useEffect } from "react";
import "./_embedded-stream.scss";

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null);
  const [needUserInteraction, setNeedUserInteraction] = useState(false);


  const handlePlayClick = () => {
    setNeedUserInteraction(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNeedUserInteraction(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [src]);

  return (
    <div className="embedded-stream">
      <iframe
        ref={iframeRef}
        src={src}
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

      {needUserInteraction && (
        <div className="embedded-stream__play-overlay" onClick={handlePlayClick}>
          <button className="embedded-stream__play-button">▶️ הפעל את השידור</button>
        </div>
      )}
    </div>
  );
}
