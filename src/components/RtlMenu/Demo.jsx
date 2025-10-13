import RltMenu from "./RtlMenu";
import { useState } from "react";

export default function Demo() {
  const [status, setStatus] = useState("scheduled");

  const items = [
    { id: "live", label: "Go Live", onSelect: () => setStatus("live") },
    { id: "sched", label: "Mark Scheduled", onSelect: () => setStatus("scheduled") },
    { divider: true },
    { id: "copy", label: "Copy Link", onSelect: () => navigator.clipboard.writeText(location.href) },
    { id: "del", label: "Delete", onSelect: () => alert("Deleted!") },
  ];

  return (
    <RltMenu items={items}>
      <div style={{
        padding: 24, border: "1px dashed #253055", borderRadius: 12,
        userSelect: "none"
      }}>
        Право-кликни по этому блоку → моё контекстное меню. <b>Status: {status}</b>
      </div>
    </RltMenu>
  );
}
