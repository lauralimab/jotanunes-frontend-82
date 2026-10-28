import { useEffect, useRef, useState } from "react";
import { deleteCompany } from "../../../../shared/api/company";
import type { Company } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import styles from "./ExcluirFornecedorModal.module.css";
import confirmationStyles from "../../../../shared/components/ConfirmationModal.module.css";

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
    <dialog ref={dialogRef} className={`modal-box ${styles.dialog}`} aria-labelledby="excluir-fornecedor-title" aria-describedby="excluir-fornecedor-impact" aria-busy={submitting}
      onCancel={event => { event.preventDefault(); close(); }}>
      <header className={styles.header}>
        <div className={confirmationStyles.actionHeading}>
          <span className={confirmationStyles.actionIcon} aria-hidden="true"><Icon name="trash" size={21} /></span>
          <div><h3 id="excluir-fornecedor-title">Excluir fornecedor</h3><p className={confirmationStyles.subtitle}>Confirmar exclusão do fornecedor</p></div>
        </div>
        <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar confirmação" disabled={submitting} onClick={close}><Icon name="x" size={18} /></button>
      </header>
      <div id="excluir-fornecedor-impact" className={`${confirmationStyles.impact} ${confirmationStyles.impactWarning}`}>
        <span className={confirmationStyles.impactIcon} aria-hidden="true"><Icon name="alert" size={19} /></span>
        <div><h4>Após a exclusão</h4><p>O fornecedor <strong>{company.corporateName || company.tradeName || "selecionado"}</strong> será excluído. Esta ação não pode ser desfeita.</p></div>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <footer className={styles.footer}>
        <button type="button" className="btn btn-secondary" disabled={submitting} onClick={close} autoFocus>Cancelar</button>
        <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => void confirmDelete()}>{submitting ? "Excluindo..." : "Excluir fornecedor"}</button>
      </footer>
    </dialog>
  );
}
