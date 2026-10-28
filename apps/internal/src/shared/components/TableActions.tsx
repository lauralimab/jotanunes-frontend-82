import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Icon from "./Icon";
import Skeleton from "./Skeleton";
import styles from "./TableActions.module.css";

type TableAction = { label: string; icon: string; onClick?: () => void; disabled?: boolean; danger?: boolean; ariaLabel?: string };

export function TableActionsSkeleton({ count }: { count: number }) {
  return <div className={styles.actions}>{Array.from({ length: count > 2 ? 1 : count }, (_, index) => <Skeleton key={index} width="2rem" height="2rem" borderRadius={6} />)}</div>;
}

export default function TableActions({ actions, label = "Ações da linha", forceMenu = false }: { actions: TableAction[]; label?: string; forceMenu?: boolean }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>({});

  function close(restoreFocus = false) {
    if (menu.current?.matches(":popover-open")) menu.current.hidePopover();
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  function show(last = false) {
    if (!trigger.current || !menu.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const width = Math.min(224, window.innerWidth - 16);
    const height = Math.min(actions.length * 38 + 12, 280);
    const upwards = window.innerHeight - rect.bottom < height + 12 && rect.top > height;
    setPosition({ width, left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)), top: upwards ? undefined : rect.bottom + 4, bottom: upwards ? window.innerHeight - rect.top + 4 : undefined, maxHeight: Math.max(80, Math.min(280, upwards ? rect.top - 12 : window.innerHeight - rect.bottom - 12)) });
    menu.current.showPopover();
    setOpen(true);
    const items = menu.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    items[last ? items.length - 1 : 0]?.focus();
  }

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (event.type === "scroll" && event.target instanceof Node && menu.current?.contains(event.target)) return;
      if (menu.current?.matches(":popover-open")) menu.current.hidePopover();
    };
    window.addEventListener("resize", dismiss);
    document.addEventListener("scroll", dismiss, true);
    return () => { window.removeEventListener("resize", dismiss); document.removeEventListener("scroll", dismiss, true); };
  }, [open]);

  function handleMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); close(true); return; }
    if (event.key === "Tab") { close(true); return; }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const items = [...(menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
    items[next]?.focus();
  }

  if (!forceMenu && actions.length <= 2) return <div className={styles.actions}>{actions.map(action => <button key={action.label} type="button" className={`${styles.button} ${action.danger ? styles.danger : ""}`} title={action.label} aria-label={action.ariaLabel ?? action.label} disabled={action.disabled} onClick={action.onClick}><Icon name={action.icon} size={16} /></button>)}</div>;

  return <>
    <button ref={trigger} type="button" className={styles.button} title={label} aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={id}
      onClick={() => open ? close() : show()} onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); show(event.key === "ArrowUp"); } }}><Icon name="more-horizontal" size={18} /></button>
    <div ref={menu} id={id} className={styles.menu} style={position} popover="auto" role="menu" aria-label={label} onToggle={event => setOpen(event.currentTarget.matches(":popover-open"))} onKeyDown={handleMenuKey}>
      {actions.map(action => <button key={action.label} type="button" role="menuitem" className={`${styles.item} ${action.danger ? styles.danger : ""}`} aria-label={action.ariaLabel ?? action.label} disabled={action.disabled} onClick={() => { close(true); action.onClick?.(); }}><Icon name={action.icon} size={16} /><span>{action.label}</span></button>)}
    </div>
  </>;
}
