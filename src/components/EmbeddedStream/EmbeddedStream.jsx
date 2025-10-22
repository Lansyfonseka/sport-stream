import { useEffect, useRef, useState } from "react";
import "./_embedded-stream.scss";

export default function EmbeddedStream({ src, showLoader }) {
  const iframeRef = useRef(null);
  const [iframeSrc, setIframeSrc] = useState(src);
  const containerRef = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  // Проверка на iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeSrc(`${src}?t=${new Date().getTime()}`);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [src]);

  useEffect(() => {
    let resizeTimeout;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (document.fullscreenElement) return;

      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidth) return;
      lastWidth = currentWidth;

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
      {!isIOS ? (
        <>
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
        </>
      ) : (
        <div className="embedded-stream__ios-block">
          <div className="embedded-stream__ios-block-content">
            <p className="embedded-stream__ios-block-text">
              שידור לא זמין במכשירי iOS
            </p>
            <p className="embedded-stream__ios-block-subtext">
              אנא השתמש במכשיר אחר לצפייה. מומלץ להשתמש במכשיר אנדרואיד.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
