import { useRef, useState, type FormEvent } from "react";
import { deleteWorkSite } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Icon from "../../../shared/components/Icon";
import WorkSiteDialog from "./WorkSiteDialog";
import styles from "../obras.module.css";

export default function DeleteWorkSiteModal({ workSite, onClose, onDeleted }: { workSite: WorkSite; onClose: () => void; onDeleted: () => void }) {
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError("");
    try { await deleteWorkSite(workSite.id); onDeleted(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível excluir a obra."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <WorkSiteDialog title="Excluir obra" busy={busy} onClose={onClose}>
    <form className={styles.form} onSubmit={submit} aria-busy={busy}>
      <div className={styles.body}>{error && <p role="alert" className={styles.error}>{error}</p>}<p className={styles.description}>Deseja excluir <strong>{workSite.name}</strong>? Esta ação não pode ser desfeita.</p></div>
      <footer className={styles.footer}><button autoFocus type="button" className="btn btn-secondary" disabled={busy} onClick={onClose}>Cancelar</button><button type="submit" className="btn btn-danger" disabled={busy}><Icon name="trash" size={16} />{busy ? "Excluindo..." : "Excluir obra"}</button></footer>
    </form>
  </WorkSiteDialog>;
}
