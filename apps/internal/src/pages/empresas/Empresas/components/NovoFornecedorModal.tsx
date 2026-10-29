import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { createCompany, updateCompany } from "../../../../shared/api/company";
import { getAddressByCep, type CepAddress } from "../../../../shared/api/cep";
import type { Company, CompanyCreateRequest, CompanyUpdateRequest, SupplierType } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import Select from "../../../../shared/components/Select";
import Switch from "../../../../shared/components/Switch";
import styles from "./NovoFornecedorModal.module.css";

const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

type Props = {
  onClose: () => void;
  onSaved: (company: Company) => void;
  initialCompany?: Company;
};

const MAX_TEXT_LENGTH = 100;
const fieldMaxLengths: Record<string, number> = { cnpj: 18, phone: 15, zipCode: 9 };

function Field({ label, name, required = true, error, maxLength = fieldMaxLengths[name] ?? MAX_TEXT_LENGTH, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  return (
    <label className={styles.field}>
      <span>{label}{required && " *"}</span>
      <input className="input-base" name={name} required={required} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? name + "-error" : undefined} {...props} />
      {error && <span id={name + "-error"} className={styles.fieldError}>{error}</span>}
    </label>
  );
}

function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits.slice(0, 2)
    + (digits.length > 2 ? "." + digits.slice(2, 5) : "")
    + (digits.length > 5 ? "." + digits.slice(5, 8) : "")
    + (digits.length > 8 ? "/" + digits.slice(8, 12) : "")
    + (digits.length > 12 ? "-" + digits.slice(12, 14) : "");
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return "(" + digits;
  const subscriber = digits.slice(2);
  const prefixLength = digits.length > 10 ? 5 : 4;
  return `(${digits.slice(0, 2)}) ${subscriber.slice(0, prefixLength)}`
    + (subscriber.length > prefixLength ? "-" + subscriber.slice(prefixLength) : "");
}

function applyMask(event: ChangeEvent<HTMLInputElement>, mask: (value: string) => string) {
  const input = event.currentTarget;
  const digitsBeforeCursor = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, "").length;
  const masked = mask(input.value);
  input.value = masked;
  let cursor = 0;
  let digitCount = 0;
  while (cursor < masked.length && digitCount < digitsBeforeCursor) {
    if (/\d/.test(masked[cursor])) digitCount++;
    cursor++;
  }
  input.setSelectionRange(cursor, cursor);
}

function handleCnpjChange(event: ChangeEvent<HTMLInputElement>) {
  applyMask(event, maskCnpj);
}

function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
  applyMask(event, maskPhone);
}

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.slice(0, 5) + (digits.length > 5 ? "-" + digits.slice(5) : "");
}

function validCnpj(value: string): boolean {
  if (!/^\d{14}$/.test(value) || /^(\d)\1+$/.test(value)) return false;
  const digits = [...value].map(Number);
  return [
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  ].every((weights, index) => {
    const remainder = weights.reduce((sum, weight, position) => sum + digits[position] * weight, 0) % 11;
    return digits[12 + index] === (remainder < 2 ? 0 : 11 - remainder);
  });
}


const steps = ["Dados da empresa", "Contato", "Endereço"];
const stepFields = [
  ["cnpj", "supplierType", "corporateName", "tradeName", "stateRegistration"],
  ["responsibleName", "email", "phone"],
  ["zipCode", "street", "number", "complement", "neighborhood", "city", "state"],
];
type FieldErrors = Record<string, string>;

function validateFields(data: FormData, fields: string[], withoutNumber = false): FieldErrors {
  const errors: FieldErrors = {};
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const requiredMessages: Record<string, string> = {
    cnpj: "Informe o CNPJ.", supplierType: "Selecione o tipo de fornecedor.",
    corporateName: "Informe a razão social.", tradeName: "Informe o nome fantasia.",
    responsibleName: "Informe o responsável.", email: "Informe o e-mail.",
    phone: "Informe o telefone com DDD.", zipCode: "Informe o CEP.",
    street: "Informe o logradouro.", number: "Informe o número ou marque a opção Sem número.",
    neighborhood: "Informe o bairro.", city: "Informe a cidade.", state: "Selecione o estado.",
  };

  for (const name of fields) {
    const text = value(name);
    const maxLength = fieldMaxLengths[name] ?? MAX_TEXT_LENGTH;
    const rawLength = String(data.get(name) ?? "").length;
    if (name !== "supplierType" && name !== "state" && rawLength > maxLength) {
      errors[name] = `Use no máximo ${maxLength} caracteres.`;
    } else if (!text) {
      if (requiredMessages[name]) errors[name] = requiredMessages[name];
    } else if (name === "cnpj" && (!/^[\d./\s-]+$/.test(text) || !validCnpj(text.replace(/\D/g, "")))) {
      errors[name] = "Informe um CNPJ válido.";
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      errors[name] = "Informe um e-mail válido.";
    } else if (name === "phone" && (!/^[\d\s()+.-]+$/.test(text) || ![10, 11].includes(text.replace(/\D/g, "").length))) {
      errors[name] = "Informe um telefone com DDD de 10 ou 11 dígitos.";
    } else if (name === "zipCode" && !/^\d{5}-?\d{3}$/.test(text)) {
      errors[name] = "Informe um CEP com 8 dígitos.";
    } else if (name === "number" && !/^\d+$/.test(text) && !(withoutNumber && text === "S/N")) {
      errors[name] = "Digite apenas números ou marque a opção Sem número.";
    } else if (name === "supplierType" && !["1", "2"].includes(text)) {
      errors[name] = "Selecione um tipo de fornecedor válido.";
    } else if (name === "state" && !states.includes(text)) {
      errors[name] = "Selecione uma UF válida.";
    }
  }
  return errors;
}

export default function NovoFornecedorModal({ onClose, onSaved, initialCompany }: Props) {
  const isEditing = Boolean(initialCompany);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submittingRef = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(() => ({
    street: initialCompany?.address.street ?? "",
    number: initialCompany?.address.number === "S/N" ? "" : initialCompany?.address.number ?? "",
    complement: initialCompany?.address.complement ?? "",
    neighborhood: initialCompany?.address.neighborhood ?? "",
    city: initialCompany?.address.city ?? "",
    state: initialCompany?.address.state ?? "",
  }));
  const [withoutNumber, setWithoutNumber] = useState(initialCompany?.address.number === "S/N");
  const cepRequestRef = useRef<AbortController | null>(null);
  const cepValueRef = useRef("");
  const autoFilledRef = useRef<CepAddress | null>(null);
  const editedAddressRef = useRef(new Set<string>());

  useEffect(() => () => cepRequestRef.current?.abort(), []);

  function changeAddress(name: keyof typeof address, value: string) {
    editedAddressRef.current.add(name);
    setAddress(current => ({ ...current, [name]: value }));
    setFieldErrors(current => ({ ...current, [name]: "" }));
  }

  async function lookupCep(cep: string) {
    if (cep.length !== 8) return;
    cepRequestRef.current?.abort();
    const controller = new AbortController();
    cepRequestRef.current = controller;
    editedAddressRef.current.clear();
    try {
      const result = await getAddressByCep(cep, controller.signal);
      if (controller.signal.aborted || submittingRef.current) return;
      if (!result) return;
      const edited = new Set(editedAddressRef.current);
      setAddress(current => ({
        ...current,
        ...Object.fromEntries(Object.entries(result).filter(([name]) => !edited.has(name))),
      }));
      autoFilledRef.current = result;
      setFieldErrors(current => {
        const next = { ...current };
        for (const [name, value] of Object.entries(result)) {
          if (value && !edited.has(name)) delete next[name];
        }
        return next;
      });
    } catch {
      // Falhas de busca não interrompem o preenchimento manual do endereço.
    }
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    applyMask(event, maskCep);
    const cep = event.currentTarget.value.replace(/\D/g, "");
    if (cep === cepValueRef.current) return;
    cepValueRef.current = cep;
    cepRequestRef.current?.abort();
    const previous = autoFilledRef.current;
    if (previous) {
      setAddress(current => ({
        ...current,
        ...Object.fromEntries(Object.entries(previous).filter(([name, value]) => current[name as keyof typeof current] === value).map(([name]) => [name, ""])),
      }));
      autoFilledRef.current = null;
    }
    if (cep.length === 8) void lookupCep(cep);
  }

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


  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    const field = dialogRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(
      `[data-step="${step}"] input, [data-step="${step}"] select`,
    );
    field?.focus();
  }, [step]);

  function close() {
    if (!submittingRef.current) onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (withoutNumber) data.set("number", "S/N");
    const text = (name: string) => String(data.get(name) ?? "").trim();

    const fields = (step === steps.length - 1 ? stepFields.flat() : stepFields[step])
      .filter(name => !isEditing || (name !== "cnpj" && name !== "supplierType"));
    const nextErrors = validateFields(data, fields, withoutNumber);
    setFieldErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0];
      const invalidStep = stepFields.findIndex(names => names.includes(firstInvalid));
      if (invalidStep !== step) setStep(invalidStep);
      const control = form.elements.namedItem(firstInvalid);
      if (control instanceof HTMLInputElement && control.type !== "hidden") control.focus();
      else form.querySelector<HTMLButtonElement>(`[data-select-name="${firstInvalid}"]`)?.focus();
      return;
    }

    if (step < steps.length - 1) {
      setStep(current => current + 1);
      return;
    }

    const cnpj = text("cnpj").replace(/\D/g, "");
    const phone = text("phone").replace(/\D/g, "");

    const updatePayload: CompanyUpdateRequest = {
      corporateName: text("corporateName"),
      tradeName: text("tradeName"),
      stateRegistration: text("stateRegistration") || null,
      email: text("email"),
      phone,
      responsibleName: text("responsibleName"),
      address: {
        street: text("street"),
        number: text("number"),
        complement: text("complement") || null,
        neighborhood: text("neighborhood"),
        city: text("city"),
        state: text("state"),
        zipCode: text("zipCode").replace(/\D/g, ""),
      },
    };

    submittingRef.current = true;
    cepRequestRef.current?.abort();
    setIsSubmitting(true);
    setError("");
    try {
      const company = initialCompany
        ? await updateCompany(initialCompany.id, updatePayload)
        : await createCompany({
          ...updatePayload,
          cnpj,
          supplierType: Number(text("supplierType")) as SupplierType,
        } satisfies CompanyCreateRequest);
      onSaved(company);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao salvar os dados do fornecedor. Tente novamente.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <dialog ref={dialogRef} className={`modal-box ${styles.dialog} ${step === 2 ? styles.addressStep : ""}`} aria-labelledby="novo-fornecedor-title" aria-describedby="novo-fornecedor-description"
      onCancel={event => { event.preventDefault(); close(); }}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <span className={styles.icon}><Icon name="building" size={22} /></span>
          <div>
            <h3 id="novo-fornecedor-title">{isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}</h3>
            <p id="novo-fornecedor-description">{isEditing ? "Atualize os dados do fornecedor." : "Preencha os dados abaixo para cadastrar o fornecedor."}</p>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-icon" aria-label={isEditing ? "Fechar edição" : "Fechar cadastro"} onClick={close} disabled={isSubmitting}><Icon name="x" size={18} /></button>
      </header>
      <ol className={styles.steps} aria-label="Etapas do cadastro">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? styles.currentStep : index < step ? styles.completedStep : undefined} aria-current={index === step ? "step" : undefined}>
            <span className={styles.stepNumber}>{index < step ? <Icon name="check" size={14} /> : index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <form noValidate className={styles.form} onSubmit={handleSubmit} aria-busy={isSubmitting} onInput={event => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
          const name = target.name;
          setFieldErrors(current => ({ ...current, [name]: "" }));
        }
      }}>
        <div ref={bodyRef} className={styles.body}>
          {error && <div className={styles.error} role="alert">{error}</div>}
          <fieldset hidden={step !== 0} data-step={0} disabled={isSubmitting} className={styles.section}>
            <legend>Dados da empresa</legend>
            <div className={styles.grid}>
              <Field label="CNPJ" name="cnpj" error={fieldErrors.cnpj} placeholder="00.000.000/0000-00" inputMode="numeric" onChange={handleCnpjChange} defaultValue={initialCompany ? maskCnpj(initialCompany.cnpj) : undefined} disabled={isSubmitting || isEditing} autoFocus />
              <div className={styles.field}><span>Tipo de fornecedor *</span>
                <Select name="supplierType" label="Tipo de fornecedor" placeholder="Selecione o tipo" required disabled={isSubmitting || isEditing} defaultValue={initialCompany ? String(initialCompany.supplierType) : undefined}
                  options={[{ value: "1", label: "Material" }, { value: "2", label: "Mão de obra" }]}
                  invalid={Boolean(fieldErrors.supplierType)} describedBy={fieldErrors.supplierType ? "supplierType-error" : undefined}
                  onChange={() => setFieldErrors(current => ({ ...current, supplierType: "" }))} />
                {fieldErrors.supplierType && <span id="supplierType-error" className={styles.fieldError}>{fieldErrors.supplierType}</span>}
              </div>
              <Field label="Razão social" placeholder="Ex.: Jotanunes Construtora Ltda." name="corporateName" error={fieldErrors.corporateName} autoComplete="organization" defaultValue={initialCompany?.corporateName} />
              <Field label="Nome fantasia" placeholder="Ex.: Jotanunes" name="tradeName" error={fieldErrors.tradeName} defaultValue={initialCompany?.tradeName} />
              <Field label="Inscrição estadual" placeholder="Ex.: 123456789" name="stateRegistration" error={fieldErrors.stateRegistration} required={false} defaultValue={initialCompany?.stateRegistration ?? ""} />
            </div>
          </fieldset>
          <fieldset hidden={step !== 1} data-step={1} disabled={isSubmitting} className={styles.section}>
            <legend>Contato</legend>
            <div className={styles.grid}>
              <Field label="Responsável" name="responsibleName" error={fieldErrors.responsibleName} autoComplete="name" placeholder="Ex.: João da Silva" defaultValue={initialCompany?.responsibleName} />
              <Field label="E-mail" name="email" error={fieldErrors.email} type="email" autoComplete="email" placeholder="contato@empresa.com" defaultValue={initialCompany?.email} />
              <Field label="Telefone com DDD" name="phone" error={fieldErrors.phone} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 99999-9999" onChange={handlePhoneChange} defaultValue={initialCompany ? maskPhone(initialCompany.phone) : undefined} />
            </div>
          </fieldset>
          <fieldset hidden={step !== 2} data-step={2} disabled={isSubmitting} className={styles.section}>
            <legend>Endereço</legend>
            <div className={styles.grid}>
              <div className={styles.cepField}>
                <Field label="CEP" name="zipCode" error={fieldErrors.zipCode} autoComplete="postal-code" inputMode="numeric" placeholder="Ex.: 01001-000" onChange={handleCepChange} defaultValue={initialCompany ? maskCep(initialCompany.address.zipCode) : undefined} />
              </div>
              <div className={styles.field}><span>Estado *</span>
                <Select name="state" label="Estado" placeholder="Selecione a UF (ex.: SP)" required disabled={isSubmitting} value={address.state}
                  options={states.map(state => ({ value: state, label: state }))}
                  invalid={Boolean(fieldErrors.state)} describedBy={fieldErrors.state ? "state-error" : undefined}
                  onChange={value => changeAddress("state", value)} />
                {fieldErrors.state && <span id="state-error" className={styles.fieldError}>{fieldErrors.state}</span>}
              </div>
              <Field label="Cidade" name="city" error={fieldErrors.city} autoComplete="address-level2" placeholder="Ex.: São Paulo" value={address.city} onChange={event => changeAddress("city", event.target.value)} />
              <Field label="Bairro" name="neighborhood" error={fieldErrors.neighborhood} placeholder="Ex.: Centro" value={address.neighborhood} onChange={event => changeAddress("neighborhood", event.target.value)} />
              <Field label="Logradouro" name="street" error={fieldErrors.street} autoComplete="address-line1" placeholder="Ex.: Praça da Sé" value={address.street} onChange={event => changeAddress("street", event.target.value)} />
              <Field label="Complemento" name="complement" error={fieldErrors.complement} autoComplete="address-line2" placeholder="Ex.: Sala 2, bloco A" required={false} value={address.complement} onChange={event => changeAddress("complement", event.target.value)} />
              <div className={styles.numberField}>
                <Field label="Número" name="number" error={fieldErrors.number} placeholder={withoutNumber ? "Sem número" : "Ex.: 123"} inputMode="numeric" required={!withoutNumber} disabled={withoutNumber} value={withoutNumber ? "" : address.number} onChange={event => { applyMask(event, value => value.replace(/\D/g, "").slice(0, MAX_TEXT_LENGTH)); changeAddress("number", event.currentTarget.value); }} />
                <Switch className={styles.withoutNumber} checked={withoutNumber} onChange={event => { setWithoutNumber(event.target.checked); setFieldErrors(current => ({ ...current, number: "" })); }} label="Este endereço não possui número" />
              </div>
            </div>
          </fieldset>
        </div>
        <footer className={styles.footer}>
          <button type="button" className="btn btn-secondary" onClick={close} disabled={isSubmitting}>Cancelar</button>
          <div className={styles.navigation}>
            {step > 0 && <button type="button" className="btn btn-secondary" disabled={isSubmitting} onClick={() => { setStep(current => current - 1); setFieldErrors({}); setError(""); }}>Voltar</button>}
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {step === steps.length - 1 && <Icon name={isEditing ? "check" : "plus"} size={15} />}
              {isSubmitting ? (isEditing ? "Salvando..." : "Cadastrando...") : step === steps.length - 1 ? (isEditing ? "Salvar alterações" : "Cadastrar fornecedor") : "Continuar"}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
