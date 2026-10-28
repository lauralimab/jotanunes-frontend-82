import { useId, useRef, useState, type FormEvent } from "react";
import { createWorkSite, updateWorkSite } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import WorkSiteDialog from "./WorkSiteDialog";
import { validateWorkSite } from "./workSiteValidation";
import styles from "../obras.module.css";

export default function WorkSiteFormModal({ workSite, onClose, onSaved }: { workSite?: WorkSite; onClose: () => void; onSaved: (workSite: WorkSite) => void }) {
  const id = useId();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const { payload, errors: nextErrors } = validateWorkSite(String(data.get("name") ?? ""), String(data.get("renewalPeriodDays") ?? ""));
    setErrors(nextErrors); setError("");
    if (Object.keys(nextErrors).length) {
      const field = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (field instanceof HTMLInputElement) field.focus();
      return;
    }
    submitting.current = true; setBusy(true);
    try { onSaved(workSite ? await updateWorkSite(workSite.id, payload) : await createWorkSite(payload)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar a obra."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <WorkSiteDialog title={workSite ? "Editar obra" : "Nova obra"} busy={busy} onClose={onClose}>
    <form noValidate className={styles.form} onSubmit={submit} aria-busy={busy} onInput={event => { if (event.target instanceof HTMLInputElement) { const name = event.target.name; setErrors(current => ({ ...current, [name]: "" })); } }}>
      <div className={styles.body}>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.fields}>
          <label className={styles.field}><span>Nome da obra *</span><input autoFocus className="input-base" name="name" maxLength={100} placeholder="Ex.: Residencial Jardim das Flores" defaultValue={workSite?.name ?? ""} disabled={busy} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />{errors.name && <span id={`${id}-name-error`} className={styles.fieldError}>{errors.name}</span>}</label>
          <label className={styles.field}><span>Período de renovação (dias) *</span><input className="input-base" name="renewalPeriodDays" inputMode="numeric" maxLength={10} placeholder="Ex.: 30" defaultValue={workSite?.renewalPeriodDays ?? 30} disabled={busy} required aria-invalid={Boolean(errors.renewalPeriodDays)} aria-describedby={`${id}-period-hint${errors.renewalPeriodDays ? ` ${id}-period-error` : ""}`} /><span id={`${id}-period-hint`} className={styles.hint}>Período utilizado para calcular a renovação dos documentos vinculados à obra.</span>{errors.renewalPeriodDays && <span id={`${id}-period-error`} className={styles.fieldError}>{errors.renewalPeriodDays}</span>}</label>
        </div>
      </div>
      <footer className={styles.footer}><button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Salvando..." : workSite ? "Salvar alterações" : "Cadastrar obra"}</button></footer>
    </form>
  </WorkSiteDialog>;
}
