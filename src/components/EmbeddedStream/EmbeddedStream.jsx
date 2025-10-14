import "./_embedded-stream.scss";

export default function EmbeddedStream({ src }) {
  return (
    <div className="embedded-stream">
      <iframe
        src={src}
        className="embedded-stream__iframe"
        title="Embedded Stream"
        allowFullScreen
        scrolling="no"
      />
    </div>
  );
}
