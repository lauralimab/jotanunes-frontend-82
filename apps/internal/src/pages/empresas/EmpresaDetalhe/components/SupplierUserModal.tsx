import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { activateCompanyUser, createCompanyUser, deactivateCompanyUser, resetCompanyUserPassword } from "../../../../shared/api/company";
import type { SupplierUser } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import styles from "./SupplierUsers.module.css";
import confirmationStyles from "../../../../shared/components/ConfirmationModal.module.css";

export type UserAction = { type: "create" } | { type: "reset" | "activate" | "deactivate"; user: SupplierUser };
type Props = { companyId: number; action: UserAction; onClose: () => void; onSaved: (user: SupplierUser) => void };
const titles = { create: "Novo usuário", reset: "Redefinir senha", activate: "Ativar usuário", deactivate: "Inativar usuário" };
const presentation = {
  create: { icon: "users", subtitle: "Cadastrar acesso ao Portal do Fornecedor" },
  reset: { icon: "key", subtitle: "Definir uma nova senha temporária" },
  activate: { icon: "user-check", subtitle: "Confirmar ativação de acesso" },
  deactivate: { icon: "user-minus", subtitle: "Confirmar inativação de acesso" },
};

export default function SupplierUserModal({ companyId, action, onClose, onSaved }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submittingRef = useRef(false);
  const id = useId();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const needsPassword = action.type === "create" || action.type === "reset";
  const isAccessAction = action.type === "activate" || action.type === "deactivate";

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  function close() { if (!submittingRef.current) onClose(); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const temporaryPassword = String(data.get("temporaryPassword") ?? "");
    const nextErrors: Record<string, string> = {};
    if (action.type === "create") {
      if (!name) nextErrors.name = "Informe o nome.";
      else if (name.length > 100) nextErrors.name = "Use no máximo 100 caracteres.";
      if (!email) nextErrors.email = "Informe o e-mail.";
      else if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Informe um e-mail válido com até 100 caracteres.";
    }
    if (needsPassword) {
      if (!temporaryPassword.trim() || temporaryPassword.length < 8) nextErrors.temporaryPassword = "A senha temporária deve ter pelo menos 8 caracteres.";
      if (String(data.get("passwordConfirmation") ?? "") !== temporaryPassword) nextErrors.passwordConfirmation = "As senhas devem ser iguais.";
    }
    setErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) {
      const input = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (input instanceof HTMLInputElement) input.focus();
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      let user: SupplierUser;
      switch (action.type) {
        case "create": user = await createCompanyUser(companyId, { name, email, temporaryPassword }); break;
        case "reset": user = await resetCompanyUserPassword(companyId, action.user.id, { temporaryPassword }); break;
        case "activate": user = await activateCompanyUser(companyId, action.user.id); break;
        case "deactivate": user = await deactivateCompanyUser(companyId, action.user.id); break;
      }
      onSaved(user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível concluir a operação. Tente novamente.");
    } finally { submittingRef.current = false; setSubmitting(false); }
  }

  return (
    <dialog ref={dialogRef} className={`modal-box ${styles.dialog} ${styles.confirmationDialog}`} aria-labelledby={`${id}-title`} aria-describedby={`${id}-impact`} onCancel={event => { event.preventDefault(); close(); }}>
      <header className={styles.modalHeader}>
        <div className={confirmationStyles.actionHeading}>
          <span className={`${confirmationStyles.actionIcon} ${action.type === "activate" ? confirmationStyles.activationIcon : ""}`} aria-hidden="true"><Icon name={presentation[action.type].icon} size={21} /></span>
          <div><h3 id={`${id}-title`}>{titles[action.type]}</h3>
            <p className={confirmationStyles.subtitle}>{presentation[action.type].subtitle}</p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar formulário" disabled={submitting} onClick={close}><Icon name="x" size={18} /></button>
      </header>
      <form noValidate onSubmit={submit} aria-busy={submitting} onInput={event => { if (event.target instanceof HTMLInputElement) { const name = event.target.name; setErrors(current => ({ ...current, [name]: "" })); } }}>
        <div id={`${id}-impact`} className={`${confirmationStyles.impact} ${isAccessAction ? action.type === "activate" ? confirmationStyles.impactPositive : confirmationStyles.impactWarning : confirmationStyles.impactInfo}`}>
          <span className={confirmationStyles.impactIcon} aria-hidden="true"><Icon name={action.type === "activate" ? "check" : action.type === "deactivate" ? "alert" : "info"} size={19} /></span>
          <div><h4>{action.type === "create" ? "Após o cadastro" : action.type === "reset" ? "Após a redefinição" : action.type === "activate" ? "Após a ativação" : "Após a inativação"}</h4>
            <p>{action.type === "create" ? "O novo usuário deverá alterar a senha temporária no primeiro acesso ao Portal do Fornecedor." : action.type === "reset" ? <><strong>{action.user.name}</strong> deverá utilizar a nova senha temporária e alterá-la no próximo acesso.</> : action.type === "activate" ? <><strong>{action.user.name}</strong> poderá acessar normalmente o Portal do Fornecedor.</> : <><strong>{action.user.name}</strong> não poderá mais acessar o Portal do Fornecedor. O acesso poderá ser reativado posteriormente.</>}</p>
          </div>
        </div>
        {needsPassword && <div className={styles.fields}>
          {action.type === "create" && <>
            <label className={styles.field}>Nome *<input className="input-base" name="name" placeholder="Ex.: João da Silva" autoComplete="name" maxLength={100} required disabled={submitting} autoFocus aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />{errors.name && <span id={`${id}-name-error`} className={styles.error}>{errors.name}</span>}</label>
            <label className={styles.field}>E-mail *<input className="input-base" name="email" type="email" placeholder="usuario@empresa.com" autoComplete="email" maxLength={100} required disabled={submitting} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} />{errors.email && <span id={`${id}-email-error`} className={styles.error}>{errors.email}</span>}</label>
          </>}
          {needsPassword && <>
            <label className={styles.field}>Senha temporária *<input className="input-base" name="temporaryPassword" type="password" placeholder="Mínimo de 8 caracteres" autoComplete="new-password" required disabled={submitting} autoFocus={action.type === "reset"} aria-invalid={Boolean(errors.temporaryPassword)} aria-describedby={errors.temporaryPassword ? `${id}-password-error` : undefined} />{errors.temporaryPassword && <span id={`${id}-password-error`} className={styles.error}>{errors.temporaryPassword}</span>}</label>
            <label className={styles.field}>Confirmar senha temporária *<input className="input-base" name="passwordConfirmation" type="password" placeholder="Repita a senha temporária" autoComplete="new-password" required disabled={submitting} aria-invalid={Boolean(errors.passwordConfirmation)} aria-describedby={errors.passwordConfirmation ? `${id}-confirmation-error` : undefined} />{errors.passwordConfirmation && <span id={`${id}-confirmation-error`} className={styles.error}>{errors.passwordConfirmation}</span>}</label>
          </>}
        </div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <footer className={styles.footer}>
          <button type="button" className="btn btn-secondary" onClick={close} disabled={submitting} autoFocus={!needsPassword}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Salvando..." : action.type === "create" ? "Criar usuário" : action.type === "reset" ? "Redefinir senha" : titles[action.type]}</button>
        </footer>
      </form>
    </dialog>
  );
}
