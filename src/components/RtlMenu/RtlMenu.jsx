import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./_rtlMenu.scss";


const menu = [
    {titel: 'Live betting', icon: "boll", url: 'https://heylink.me/nextbet7/'},
    {titel: 'E-sports', icon: "rocket", url: 'https://heylink.me/nextbet7/'},
    {titel: 'Specials', icon: "coins", url: 'https://heylink.me/nextbet7/'},
    {titel: 'Telegram', icon: "diamond", url: 'https://heylink.me/nextbet7/'},
    {titel: 'WhatsApp', icon: "cash", url: 'https://heylink.me/nextbet7/'}
  ]

/**
 * Props:
 *  - items: Array<{ id:string, label:string, onSelect?:()=>void, disabled?:boolean, divider?:boolean }>
 *  - children: ReactNode (область, на которой перехватываем правый клик)
 *  - className?: string (доп. класс для контейнера меню)
 */
export default function RltMenu({ items = [], children, className = "" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [focusIndex, setFocusIndex] = useState(0);
  const menuRef = useRef(null);
  const targetRef = useRef(null);

  // Открыть по правому клику
  const onContextMenu = (e) => {
    e.preventDefault();
    setOpen(true);
    setFocusIndex(0);
    setPos({ x: e.clientX, y: e.clientY });
  };

  // Клавиатурный вызов (ContextKey или Shift+F10)
  const onKeyDownTarget = (e) => {
    if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
      e.preventDefault();
      const rect = targetRef.current?.getBoundingClientRect();
      const x = rect ? rect.left + 8 : 16;
      const y = rect ? rect.top + 8 : 16;
      setOpen(true);
      setFocusIndex(0);
      setPos({ x, y });
    }
  };

  // Закрытия: клик вне, колесо/скролл, resize, Escape
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    const onWheel = () => setOpen(false);
    const onResize = () => setOpen(false);
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (["ArrowDown", "ArrowUp", "Home", "End", "Enter"].includes(e.key)) {
        e.preventDefault();
        const enabled = items.filter((i) => !i.divider && !i.disabled);
        if (!enabled.length) return;
        let idx = focusIndex;
        if (e.key === "ArrowDown") idx = (idx + 1) % enabled.length;
        if (e.key === "ArrowUp") idx = (idx - 1 + enabled.length) % enabled.length;
        if (e.key === "Home") idx = 0;
        if (e.key === "End") idx = enabled.length - 1;
        if (e.key === "Enter") {
          enabled[idx].onSelect?.();
          setOpen(false);
          return;
        }
        setFocusIndex(idx);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, focusIndex, items]);

  // Автопозиционирование в пределах окна
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const m = menuRef.current.getBoundingClientRect();
    const margin = 8;
    let x = pos.x;
    let y = pos.y;
    if (x + m.width + margin > window.innerWidth) x = Math.max(margin, window.innerWidth - m.width - margin);
    if (y + m.height + margin > window.innerHeight) y = Math.max(margin, window.innerHeight - m.height - margin);
    // если координаты изменились — обновим
    if (x !== pos.x || y !== pos.y) setPos({ x, y });
  }, [open, pos.x, pos.y]);

  // Прокидываем хендлеры на таргет
  const child = (
    <div
      ref={targetRef}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDownTarget}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {children}
    </div>
  );

  return (
    <>
      {child}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={`cmenu ${className}`}
          style={{ position: "fixed", left: pos.x, top: pos.y }}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={`d-${i}`} className="cmenu__divider" />
            ) : (
              <button
                key={item.id || i}
                role="menuitem"
                className={`cmenu__item${item.disabled ? " is-disabled" : ""}`}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                data-focus={i === focusIndex}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
}

