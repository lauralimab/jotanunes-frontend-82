import { useEffect, useId, useRef, type ReactNode } from "react";
import Icon from "../../../shared/components/Icon";
import styles from "../obras.module.css";

export default function WorkSiteDialog({ title, busy, onClose, children }: { title: string; busy: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} className={`modal-box ${styles.dialog}`} aria-labelledby={id} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <header className={styles.modalHeader}><h3 id={id}>{title}</h3><button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar modal" disabled={busy} onClick={onClose}><Icon name="x" size={18} /></button></header>
    {children}
  </dialog>;
}
