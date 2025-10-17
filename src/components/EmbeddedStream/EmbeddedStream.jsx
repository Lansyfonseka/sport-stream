import "./_embedded-stream.scss";

export default function EmbeddedStream({ src, showLoader }) {
  return (
    <div className="embedded-stream">
      <iframe
        src={src}
        className="embedded-stream__iframe"
        title="Embedded Stream"
        allowFullScreen
        scrolling="no"
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
    </div>
  );
}
