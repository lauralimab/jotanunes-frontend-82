import { useEffect, useState } from "react";
import { getWorkSite } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import Icon from "../../../shared/components/Icon";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import Toast from "../../../shared/components/Toast";
import WorkSiteFormModal from "../components/WorkSiteFormModal";
import DeleteWorkSiteModal from "../components/DeleteWorkSiteModal";
import { formatWorkSiteDate } from "../formatters";
import styles from "../obras.module.css";

export default function ObraDetalhePage({ workSiteId, onBack }: { workSiteId: number; onBack: () => void }) {
  const [result, setResult] = useState<{ id: number; workSite: WorkSite | null; error: unknown } | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getWorkSite(workSiteId, controller.signal).then(workSite => {
      if (!controller.signal.aborted) setResult({ id: workSiteId, workSite, error: null });
    }).catch(error => { if (!controller.signal.aborted) setResult({ id: workSiteId, workSite: null, error }); });
    return () => controller.abort();
  }, [workSiteId]);
  const loading = result?.id !== workSiteId;
  const workSite = !loading ? result.workSite : null;
  return <>
    <Header title="Detalhes da Obra" actions={<button type="button" className="btn btn-secondary btn-sm" onClick={onBack}><Icon name="chevron-left" size={15} />Voltar</button>} />
    <PageWrapper>
      {loading ? <section className={`card ${styles.card}`} role="status" aria-label="Carregando dados da obra" aria-busy="true"><div className={styles.detailHeader}><div className={styles.detailName}><Skeleton width={48} height={48} borderRadius={12} /><Skeleton width={230} height={24} /></div><div className={styles.actions}><Skeleton width={100} height={32} /><Skeleton width={110} height={32} /></div></div><div className={styles.details}>{Array.from({ length: 3 }, (_, index) => <div key={index}><Skeleton width={130} height={12} /><div style={{ marginTop: 8 }}><Skeleton width={100} height={16} /></div></div>)}</div></section>
        : result.error ? <ErrorState error={result.error} /> : workSite && <section className={`card ${styles.card}`}>
          <header className={styles.detailHeader}><div className={styles.detailName}><span className={styles.detailIcon}><Icon name="mappin" size={24} /></span><div><h2>{workSite.name}</h2><div className={styles.secondary}>Obra #{workSite.id}</div></div></div><div className={styles.actions}><button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}><Icon name="edit" size={15} />Editar obra</button><button type="button" className="btn btn-primary btn-sm" onClick={() => setDeleting(true)}><Icon name="trash" size={15} />Excluir obra</button></div></header>
          <div className={styles.details}><div><div className={styles.detailLabel}>Período de renovação</div><div className={styles.detailValue}>{workSite.renewalPeriodDays} dia(s)</div></div><div><div className={styles.detailLabel}>Cadastrada em</div><div className={styles.detailValue}>{formatWorkSiteDate(workSite.createdAt)}</div></div><div><div className={styles.detailLabel}>Atualizada em</div><div className={styles.detailValue}>{formatWorkSiteDate(workSite.updatedAt)}</div></div></div>
        </section>}
    </PageWrapper>
    {workSite && editing && <WorkSiteFormModal workSite={workSite} onClose={() => setEditing(false)} onSaved={updated => { setResult({ id: workSiteId, workSite: updated, error: null }); setEditing(false); setSuccess(true); }} />}
    {workSite && deleting && <DeleteWorkSiteModal workSite={workSite} onClose={() => setDeleting(false)} onDeleted={onBack} />}
    {success && <Toast message="Obra atualizada com sucesso!" onClose={() => setSuccess(false)} />}
  </>;
}
