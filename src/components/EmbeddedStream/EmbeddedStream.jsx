import { useEffect, useRef, useState } from "react";
import "./_embedded-stream.scss";

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState(src);
  const containerRef = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeSrc(`${src}?t=${new Date().getTime()}`);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [src]);

  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      if (document.fullscreenElement) return;

      if (iframeRef.current) {
        setIsResizing(true);
        setIframeSrc(`${src}?t=${new Date().getTime()}`);

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setIsResizing(false);
        }, 3000);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [src]);

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
  );
}
