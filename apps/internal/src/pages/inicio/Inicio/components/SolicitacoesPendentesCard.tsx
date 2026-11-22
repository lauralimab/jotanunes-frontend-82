import type { SupplyRequest } from "../../../../shared/types/supplyRequest";
import Icon from "../../../../shared/components/Icon";
import styles from "../dashboard.module.css";

function RequestSummary({ request, onSelectSupplier }: { request: SupplyRequest; onSelectSupplier: (companyId: number) => void }) {
  const initials = request.companyCorporateName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const missingDocuments = request.pending
    ? request.pending.missingOnboardingCount + request.pending.missingRecurringCompanyCount
    : 0;

  return <button type="button" className={`${styles.pendingItem} ${styles.pendingItemButton}`} onClick={() => onSelectSupplier(request.companyId)} aria-label={`Abrir fornecedor ${request.companyCorporateName}`}>
    <span className={styles.pendingAvatar} aria-hidden="true">{initials}</span>
    <div className={styles.pendingContent}>
      <h4 className={`${styles.pendingName} ${styles.truncatedName}`} title={request.companyCorporateName}>{request.companyCorporateName}</h4>
      <p className={styles.description}>Obra: {request.workSiteName}</p>
      <dl className={styles.pendingFacts}>
        <div><dt>Documentos pendentes:</dt><dd>{missingDocuments}</dd></div>
        {request.requiredWorkerCount !== null && <div><dt>Funcionários regulares:</dt><dd>{request.pending ? `${request.pending.workersUpToDate}/${request.requiredWorkerCount}` : `—/${request.requiredWorkerCount}`}</dd></div>}
      </dl>
    </div>
    <Icon name="chevron-right" size={18} />
  </button>;
}

export default function SolicitacoesPendentesCard({ requests, loading, error, onSelectSupplier }: { requests: SupplyRequest[]; loading: boolean; error: boolean; onSelectSupplier: (companyId: number) => void }) {
  return <section className={`card ${styles.pendingCard}`} aria-labelledby="pending-requests-title" aria-busy={loading}>
      <div className={styles.heading}><div><h3 id="pending-requests-title">Solicitações com pendências</h3><p className={styles.description}>Solicitações que necessitam de regularização.</p></div></div>
      <div className={styles.pendingList} tabIndex={0} role="region" aria-label="Listagem de solicitações com pendências">
        {loading && <p className={styles.description}>Carregando solicitações…</p>}
        {error && <p className={styles.description} role="alert">Não foi possível carregar as solicitações.</p>}
        {!loading && !error && requests.slice(0, 6).map(request => <RequestSummary key={request.id} request={request} onSelectSupplier={onSelectSupplier} />)}
        {!loading && !error && requests.length === 0 && <p className={styles.description}>Não há solicitações com pendências.</p>}
      </div>
  </section>;
}
