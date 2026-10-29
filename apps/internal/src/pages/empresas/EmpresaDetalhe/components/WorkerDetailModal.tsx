import { useEffect, useId, useRef, useState } from "react";
import { getWorker } from "../../../../shared/api/worker";
import ApiError from "../../../../shared/api/ApiError";
import type { Worker } from "../../../../shared/types/worker";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import StatusBadge from "../../../../shared/components/StatusBadge";
import ErrorState from "../../../../shared/components/ErrorState";
import { formatWorkerCpf, formatWorkerDate } from "./workerFormatters";
import styles from "./SupplierWorkers.module.css";

type Props = { workerId: number; companyId: number; onClose: () => void };
type DetailState = { worker: Worker; error?: never } | { worker?: never; error: unknown };

export default function WorkerDetailModal({ workerId, companyId, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [result, setResult] = useState<DetailState | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getWorker(workerId, controller.signal).then(worker => {
      if (controller.signal.aborted) return;
      if (worker.companyId !== companyId) throw new ApiError("http", "Funcionário não encontrado para este fornecedor.", 404);
      setResult({ worker });
    }).catch(error => { if (!controller.signal.aborted) setResult({ error }); });
    return () => controller.abort();
  }, [workerId, companyId]);

  const worker = result?.worker;
  const loading = result === null;
  const initials = worker?.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toLocaleUpperCase("pt-BR") || "—";
  const sections = [
    { title: "Identificação", icon: "doc", fields: [
      { label: "CPF", value: worker ? formatWorkerCpf(worker) : "", width: 120 },
      { label: "Código do funcionário", value: worker ? `#${worker.id}` : "", width: 55 },
    ] },
    { title: "Vínculo", icon: "companies", fields: [
      { label: "Fornecedor vinculado", value: worker?.companyCorporateName || "—", width: "85%" },
    ] },
    { title: "Informações do cadastro", icon: "calendar", fullWidth: true, fields: [
      { label: "Cadastrado em", value: worker ? formatWorkerDate(worker.createdAt) : "", width: 85 },
      { label: "Última atualização", value: worker ? formatWorkerDate(worker.updatedAt) : "", width: 85 },
    ] },
  ];

  return <dialog ref={ref} className={`modal-box ${styles.dialog}`} aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className={styles.modalHeader}>
      <h3 id={`${id}-title`}>Detalhes do funcionário</h3>
      <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar detalhes do funcionário" onClick={onClose}><Icon name="x" size={18} /></button>
    </header>
    <div className={styles.modalBody} aria-busy={loading}>
      {result && !worker ? <ErrorState error={result.error} compact /> : <>
        <div className={styles.identity}>
          <Skeleton loading={loading} width="3rem" height="3rem" borderRadius={12}><div className={styles.avatar} aria-hidden="true">{initials}</div></Skeleton>
          <div className={styles.identityText}>
            <h4><Skeleton loading={loading} width="min(100%, 12rem)" height={20}>{worker?.name}</Skeleton></h4>
            <div className={styles.identityCode}><Skeleton loading={loading} width={105} height={15}>{worker && `Funcionário #${worker.id}`}</Skeleton></div>
          </div>
          <div className={styles.identityStatus}><Skeleton loading={loading} width={65} height={22} borderRadius={999}><StatusBadge status={worker?.active ? "active" : "inactive"} /></Skeleton></div>
        </div>
        <div className={styles.details}>{sections.map((section, index) => <section key={section.title} className={`${styles.detailCard} ${section.fullWidth ? styles.fullWidth : ""}`} aria-labelledby={`${id}-section-${index}`}>
          <h4 id={`${id}-section-${index}`} className={styles.sectionTitle}>
            <Skeleton loading={loading} width={16} height={16}><span className={styles.sectionIcon} aria-hidden="true"><Icon name={section.icon} size={16} /></span></Skeleton>
            <Skeleton loading={loading}>{section.title}</Skeleton>
          </h4>
          <div className={`${styles.detailFields} ${section.fullWidth ? styles.registrationFields : ""}`}>
            {section.fields.map(detail => <div key={detail.label}>
              <div className={styles.detailLabel}><Skeleton loading={loading}>{detail.label}</Skeleton></div>
              <div className={styles.detailValue}><Skeleton loading={loading} width={detail.width} height={17}>{detail.value}</Skeleton></div>
            </div>)}
          </div>
        </section>)}</div>
      </>}
    </div>
    <footer className={styles.footer}><button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button></footer>
  </dialog>;
}
