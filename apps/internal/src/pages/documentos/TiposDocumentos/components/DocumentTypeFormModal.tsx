import { useId, useRef, useState, type FormEvent } from "react";
import { createDocumentType, updateDocumentType } from "../../../../shared/api/documentType";
import type { DocumentType, DocumentTypeUpdateRequest } from "../../../../shared/types/documentType";
import Modal from "../../../../shared/components/Modal";
import Select from "../../../../shared/components/Select";
import Switch from "../../../../shared/components/Switch";
import { documentCategories, documentSubjects, documentApplicabilities } from "../documentTypeOptions";
import styles from "../tiposDocumentos.module.css";

export default function DocumentTypeFormModal({ documentType, onClose, onSaved }: { documentType?: DocumentType; onClose: () => void; onSaved: (item: DocumentType) => void }) {
  const id = useId();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState(String(documentType?.category ?? ""));
  const [appliesTo, setAppliesTo] = useState(String(documentType?.appliesTo ?? ""));
  const [subject, setSubject] = useState(String(documentType?.subject ?? ""));
  const [conditional, setConditional] = useState(documentType?.isConditional ?? false);
  const clearError = (name: string) => setErrors(current => ({ ...current, [name]: "" }));
  const fieldError = (name: string) => errors[name] ? <span id={`${id}-${name}`} className={styles.fieldError}>{errors[name]}</span> : null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const code = documentType?.code ?? String(data.get("code") ?? "").trim().toUpperCase();
    const conditionDescription = conditional ? String(data.get("conditionDescription") ?? "").trim() : null;
    const next: Record<string, string> = {};
    if (!code || code.length > 50) next.code = "Informe um código com até 50 caracteres.";
    if (!name || name.length > 150) next.name = "Informe um nome com até 150 caracteres.";
    if (!["1", "2"].includes(category)) next.category = "Selecione a categoria.";
    if (!["1", "2", "3"].includes(appliesTo)) next.appliesTo = "Selecione o tipo de fornecedor.";
    if (!["1", "2"].includes(subject)) next.subject = "Selecione a quem o documento pertence.";
    if (conditional && (!conditionDescription || conditionDescription.length > 300)) next.conditionDescription = "Descreva a condição com até 300 caracteres.";
    setErrors(next); setError("");
    if (Object.keys(next).length) { requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    const payload: DocumentTypeUpdateRequest = { name, category: Number(category) as DocumentTypeUpdateRequest["category"], appliesTo: Number(appliesTo) as DocumentTypeUpdateRequest["appliesTo"], subject: Number(subject) as DocumentTypeUpdateRequest["subject"], requiresExpirationDate: data.get("requiresExpirationDate") === "on", isConditional: conditional, conditionDescription };
    submitting.current = true; setBusy(true);
    try { onSaved(documentType ? await updateDocumentType(documentType.id, payload) : await createDocumentType({ ...payload, code })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar o tipo de documento."); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Modal title={documentType ? "Editar tipo de documento" : "Novo tipo de documento"} subtitle={documentType ? "Atualizar as regras deste documento" : "Cadastrar um documento exigido dos fornecedores"} icon={documentType ? "edit" : "doc"} className={styles.dialog} busy={busy} onClose={onClose}>
    <form noValidate className={styles.form} onSubmit={submit} aria-busy={busy} onInput={event => { if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) clearError(event.target.name); }}>
      <div className={styles.body}>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <div className={styles.fields}>
          <label className={styles.field}><span>Código *</span><input autoFocus={!documentType} className="input-base" name="code" placeholder="Ex.: CERTIDAO_FGTS" defaultValue={documentType?.code ?? ""} maxLength={50} disabled={busy || Boolean(documentType)} required aria-invalid={Boolean(errors.code)} aria-describedby={`${id}-code-hint${errors.code ? ` ${id}-code` : ""}`} /><span id={`${id}-code-hint`} className={styles.hint}>{documentType ? "O código não pode ser alterado após o cadastro." : "Identificador único, salvo em letras maiúsculas."}</span>{fieldError("code")}</label>
          <label className={styles.field}><span>Nome *</span><input autoFocus={Boolean(documentType)} className="input-base" name="name" placeholder="Ex.: Certidão Negativa FGTS" defaultValue={documentType?.name ?? ""} maxLength={150} required disabled={busy} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name` : undefined} />{fieldError("name")}</label>
          <div className={styles.field}><span>Categoria *</span><Select label="Categoria" name="category" value={category} options={documentCategories} onChange={value => { setCategory(value); clearError("category"); }} disabled={busy} required invalid={Boolean(errors.category)} describedBy={errors.category ? `${id}-category` : undefined} />{fieldError("category")}</div>
          <div className={styles.field}><span>Tipo de fornecedor *</span><Select label="Tipo de fornecedor" name="appliesTo" value={appliesTo} options={documentApplicabilities} onChange={value => { setAppliesTo(value); clearError("appliesTo"); }} disabled={busy} required invalid={Boolean(errors.appliesTo)} describedBy={errors.appliesTo ? `${id}-appliesTo` : undefined} />{fieldError("appliesTo")}</div>
          <div className={`${styles.field} ${styles.full}`}><span>Documento de *</span><Select label="Documento de" name="subject" value={subject} options={documentSubjects} onChange={value => { setSubject(value); clearError("subject"); }} disabled={busy} required invalid={Boolean(errors.subject)} describedBy={errors.subject ? `${id}-subject` : undefined} />{fieldError("subject")}</div>
          <Switch className={styles.full} name="requiresExpirationDate" defaultChecked={documentType?.requiresExpirationDate ?? false} disabled={busy} label="Exigir data de validade" />
          <Switch className={styles.full} checked={conditional} onChange={event => { setConditional(event.target.checked); clearError("conditionDescription"); }} disabled={busy} label="Documento condicional" />
          {conditional && <label className={`${styles.field} ${styles.full}`}><span>Descrição da condição *</span><textarea className="input-base" name="conditionDescription" rows={3} placeholder="Ex.: Exigido apenas para funcionários que trabalham em altura" defaultValue={documentType?.conditionDescription ?? ""} maxLength={300} required disabled={busy} aria-invalid={Boolean(errors.conditionDescription)} aria-describedby={errors.conditionDescription ? `${id}-conditionDescription` : undefined} />{fieldError("conditionDescription")}</label>}
        </div>
      </div>
      <footer className={styles.footer}><button type="button" className="btn btn-secondary" disabled={busy} onClick={onClose}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Salvando..." : documentType ? "Salvar alterações" : "Cadastrar tipo"}</button></footer>
    </form>
  </Modal>;
}
