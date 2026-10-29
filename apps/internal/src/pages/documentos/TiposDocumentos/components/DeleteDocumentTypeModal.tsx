import { useRef, useState, type FormEvent } from "react";
import { deactivateDocumentType } from "../../../../shared/api/documentType";
import type { DocumentType } from "../../../../shared/types/documentType";
import Modal from "../../../../shared/components/Modal";
import Icon from "../../../../shared/components/Icon";
import confirmationStyles from "../../../../shared/components/ConfirmationModal.module.css";
import styles from "../tiposDocumentos.module.css";

export default function DeleteDocumentTypeModal({ documentType, onClose, onDeleted }: { documentType: DocumentType; onClose: () => void; onDeleted: (item: DocumentType) => void }) {
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError("");
    try { onDeleted(await deactivateDocumentType(documentType.id)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível excluir o tipo de documento."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Modal title="Excluir tipo de documento" subtitle="Confirmar exclusão do documento" icon="trash" busy={busy} onClose={onClose}>
    <form className={styles.form} onSubmit={submit} aria-busy={busy}>
      <div className={styles.body}>
        <div className={`${confirmationStyles.impact} ${confirmationStyles.impactWarning} ${styles.notice}`}><span className={confirmationStyles.impactIcon} aria-hidden="true"><Icon name="alert" size={19} /></span><div><h4>Após a exclusão</h4><p>O tipo de documento <strong>{documentType.name}</strong> será removido do catálogo e deixará de aparecer nas opções de documentos aplicáveis aos fornecedores.</p></div></div>
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </div>
      <footer className={styles.footer}><button autoFocus type="button" className="btn btn-secondary" disabled={busy} onClick={onClose}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Excluindo..." : "Excluir tipo"}</button></footer>
    </form>
  </Modal>;
}
