import { useEffect, useId, useRef, type ReactNode } from "react";
import Icon from "./Icon";
import styles from "./Modal.module.css";
import confirmationStyles from "./ConfirmationModal.module.css";

export default function Modal({ title, subtitle, icon, className = "", busy, onClose, children }: { title: string; subtitle?: string; icon?: string; className?: string; busy: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} className={`modal-box ${styles.dialog} ${className}`} aria-labelledby={id} aria-describedby={subtitle ? `${id}-subtitle` : undefined} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <header className={`${styles.header} ${icon ? styles.headerWithIcon : ""}`}>
      <div className={confirmationStyles.actionHeading}>
        {icon && <span className={confirmationStyles.actionIcon} aria-hidden="true"><Icon name={icon} size={21} /></span>}
        <div><h3 id={id}>{title}</h3>{subtitle && <p id={`${id}-subtitle`} className={confirmationStyles.subtitle}>{subtitle}</p>}</div>
      </div>
      <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar modal" disabled={busy} onClick={onClose}><Icon name="x" size={18} /></button>
    </header>
    {children}
  </dialog>;
}
