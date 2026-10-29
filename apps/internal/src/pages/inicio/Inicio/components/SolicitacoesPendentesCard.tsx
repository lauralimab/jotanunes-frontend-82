import { useEffect, useRef, useState } from "react";
import Icon from "../../../../shared/components/Icon";
import { dashboardMocks } from "../dashboardMocks";
import styles from "../dashboard.module.css";

type PendingRequest = (typeof dashboardMocks.pendingRequests)[number];

function RequestSummary({ request, onView }: { request: PendingRequest; onView?: () => void }) {
  const initials = request.supplier.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  return <article className={styles.pendingItem}>
    <span className={styles.pendingAvatar} aria-hidden="true">{initials}</span>
    <div className={styles.pendingContent}>
      <h4 className={`${styles.pendingName} ${styles.truncatedName}`} title={request.supplier}>{request.supplier}</h4><p className={styles.description}>Obra: {request.workSite}</p>
      <dl className={styles.pendingFacts}>
        <div><dt>Documentos faltantes:</dt><dd>{request.missingDocuments}</dd></div>
        <div><dt>Funcionários regulares:</dt><dd>{request.regularWorkers}/{request.requiredWorkers}</dd></div>
      </dl>
    </div>
    {onView && <button type="button" className={`btn btn-ghost btn-icon ${styles.pendingAction}`} title="Ver solicitação" aria-label={`Ver solicitação de ${request.supplier}`} onClick={onView}><Icon name="chevron-right" size={18} /></button>}
  </article>;
}

function PendingRequestsDialog({ request, onClose }: { request: PendingRequest | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} className={`modal-box ${styles.dialog}`} aria-labelledby="pending-dialog-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className={styles.heading}><div><h3 id="pending-dialog-title">{request ? `Solicitação #${request.id}` : "Solicitações com pendências"}</h3><p className={styles.description}>Dados demonstrativos — integração de solicitações pendente.</p></div><button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar modal" onClick={onClose}><Icon name="x" size={18} /></button></header>
    {(request ? [request] : dashboardMocks.pendingRequests).map(item => <RequestSummary key={item.id} request={item} />)}
  </dialog>;
}

export default function SolicitacoesPendentesCard() {
  const [view, setView] = useState<{ request: PendingRequest | null } | null>(null);
  return <>
    <section className={`card ${styles.pendingCard}`} aria-labelledby="pending-requests-title">
      <div className={styles.heading}><div><h3 id="pending-requests-title">Solicitações com pendências</h3><p className={styles.description}>Solicitações que necessitam de regularização.</p></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setView({ request: null })}>Ver todas</button></div>
      <div className={styles.pendingList} tabIndex={0} role="region" aria-label="Listagem de solicitações com pendências">{dashboardMocks.pendingRequests.map(request => <RequestSummary key={request.id} request={request} onView={() => setView({ request })} />)}</div>
    </section>
    {view && <PendingRequestsDialog request={view.request} onClose={() => setView(null)} />}
  </>;
}
