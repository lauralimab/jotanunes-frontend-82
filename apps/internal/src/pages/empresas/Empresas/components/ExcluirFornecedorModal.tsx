import { useEffect, useRef, useState } from "react";
import { deleteCompany } from "../../../../shared/api/company";
import type { Company } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import styles from "./ExcluirFornecedorModal.module.css";

type Props = { company: Company; onClose: () => void; onDeleted: () => void };

export default function ExcluirFornecedorModal({ company, onClose, onDeleted }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function close() {
    if (!submittingRef.current) onClose();
  }

  async function confirmDelete() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      await deleteCompany(company.id);
      onDeleted();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível excluir o fornecedor. Tente novamente.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <dialog ref={dialogRef} className={`modal-box ${styles.dialog}`} aria-labelledby="excluir-fornecedor-title" aria-describedby="excluir-fornecedor-description" aria-busy={submitting}
      onCancel={event => { event.preventDefault(); close(); }}>
      <header className={styles.header}>
        <h3 id="excluir-fornecedor-title">Excluir fornecedor</h3>
        <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar confirmação" disabled={submitting} onClick={close}><Icon name="x" size={18} /></button>
      </header>
      <p id="excluir-fornecedor-description" className={styles.description}>Deseja excluir <strong>{company.corporateName || company.tradeName || "este fornecedor"}</strong>? Esta ação não pode ser desfeita.</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <footer className={styles.footer}>
        <button type="button" className="btn btn-secondary" disabled={submitting} onClick={close} autoFocus>Cancelar</button>
        <button type="button" className="btn btn-danger" disabled={submitting} onClick={() => void confirmDelete()}><Icon name="trash" size={16} />{submitting ? "Excluindo..." : "Excluir fornecedor"}</button>
      </footer>
    </dialog>
  );
}
