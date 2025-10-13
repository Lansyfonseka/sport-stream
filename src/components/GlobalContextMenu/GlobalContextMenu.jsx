import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import './_globalContextMenu.scss';

/**
 * Props:
 *  - items: Array<{id,label,onSelect,disabled?,divider?}> | (evt:MouseEvent)=>Array<...>
 *  - disableOnSelectors?: string[]   // на этих селекторах оставляем нативный контекст
 *  - className?: string              // доп. классы для меню
 */
export default function GlobalContextMenu({
  items,
  disableOnSelectors = ["input", "textarea", "[contenteditable=true]"],
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [focusIndex, setFocusIndex] = useState(0);
  const menuRef = useRef(null);

  // Проверка whitelisting
  const allowNative = (target) =>
    disableOnSelectors.some((sel) => target.closest?.(sel));

  // Вешаем перехват на весь документ
  useEffect(() => {
    const onContext = (e) => {
      if (allowNative(e.target)) return; // разрешаем нативное
      e.preventDefault();
      setOpen(true);
      setFocusIndex(0);
      setPos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("contextmenu", onContext);
    return () => document.removeEventListener("contextmenu", onContext);
  }, [disableOnSelectors]);

  // Закрытия и навигация по меню
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);

      const list = resolveItems(items);
      const enabled = list.filter((i) => !i.divider && !i.disabled);

      if (["ArrowDown", "ArrowUp", "Home", "End", "Enter"].includes(e.key)) {
        e.preventDefault();
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
    const onWheel = () => setOpen(false);
    const onResize = () => setOpen(false);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [open, focusIndex, items]);

  // Автопозиционирование
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const m = menuRef.current.getBoundingClientRect();
    const margin = 8;
    let x = pos.x, y = pos.y;
    if (x + m.width + margin > window.innerWidth)  x = Math.max(margin, window.innerWidth - m.width - margin);
    if (y + m.height + margin > window.innerHeight) y = Math.max(margin, window.innerHeight - m.height - margin);
    if (x !== pos.x || y !== pos.y) setPos({ x, y });
  }, [open, pos.x, pos.y]);

  // Собираем пункты (если функция — передаём последний MouseEvent через window.__lastContextEvent)
  const resolveItems = (it) => {
    if (typeof it === "function") {
      const evt = window.__lastContextEvent || null;
      return it(evt) || [];
    }
    return it || [];
  };

  // Сохраняем последний MouseEvent, чтобы уметь формировать динамическое меню
  useEffect(() => {
    const save = (e) => (window.__lastContextEvent = e);
    document.addEventListener("contextmenu", save, { capture: true });
    return () => document.removeEventListener("contextmenu", save, { capture: true });
  }, []);

  const list = useMemo(() => resolveItems(items), [items, open]);

  // Рендер порталом
  return open
    ? createPortal(
        <div
          ref={menuRef}
          className={`gcmenu ${className}`}
          role="menu"
          style={{ position: "fixed", left: pos.x, top: pos.y }}
        >
          <a href="https://nextbet7.tv/" target="_self">
            <div class="icon">
              <i class="fas fa-"></i>
            </div>
            <div class="text"></div>
          </a>
          <a href="https://heylink.me/nextbet7/" target="_blank">
            <div class="icon">
              <i class="fas fa-fas fa-futbol"></i>
            </div>
            <div class="text">הימורים בשידור חי</div>
          </a>
          <a href="https://heylink.me/nextbet7/" target="_blank">
            <div class="icon">
              <i class="fas fa-fas fa-rocket"></i>
            </div><div class="text">ספורט אלקטרוני</div>
          </a>
          <a href="https://heylink.me/nextbet7/" target="_blank">
            <div class="icon">
              <i class="fas fa-fas fa-coins"></i>
            </div><div class="text"> מבצעים</div>
          </a>
          <a href="https://heylink.me/nextbet7/" target="_blank">
            <div class="icon">
              <i class="fas fa-fas fa-gem"></i>
            </div>
            <div class="text">ערוץ מבצעים - טלגרם </div>
          </a>
          <a href="https://heylink.me/nextbet7/" target="_blank">
            <div class="icon">
              <i class="fas fa-fas fa-money-bill	"></i>
            </div>
            <div class="text"> ווטסאפ - הרשמה 24/7  </div>
          </a>
          {/* {list.map((item, i) =>
            item.divider ? (
              <div key={`d-${i}`} className="gcmenu__divider" />
            ) : (
              <button
                key={item.id || i}
                role="menuitem"
                className={`gcmenu__item${item.disabled ? " is-disabled" : ""}`}
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
          )} */}
        </div>,
        document.body
      )
    : null;
}
