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
import WorkSiteSuppliers from "../components/WorkSiteSuppliers";
import ContextDocumentsSection from "../components/ContextDocumentsSection";
import CreateSupplyRequestModal from "../../empresas/EmpresaDetalhe/components/CreateSupplyRequestModal";
import { formatWorkSiteDate } from "../formatters";
import styles from "../obras.module.css";

type Props = {
  workSiteId: number;
  onBack: () => void;
  onOpenSupplier: (companyId: number) => void;
  onAnalyzeDocument: (documentId: number, search: string, page: number, sort: "document" | "supplier" | "status", order: "asc" | "desc") => void;
  initialDocumentSearch?: string;
  initialDocumentPage?: number;
  initialDocumentOrder?: "asc" | "desc";
  initialDocumentSort?: "document" | "supplier" | "status";
};

export default function ObraDetalhePage({ workSiteId, onBack, onOpenSupplier, onAnalyzeDocument, initialDocumentSearch, initialDocumentPage, initialDocumentOrder, initialDocumentSort }: Props) {
  const [result, setResult] = useState<{ workSite: WorkSite | null; error?: unknown } | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creatingSupplyRequest, setCreatingSupplyRequest] = useState(false);
  const [supplierRefreshKey, setSupplierRefreshKey] = useState(0);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getWorkSite(workSiteId, controller.signal)
      .then(workSite => { if (!controller.signal.aborted) setResult({ workSite }); })
      .catch(error => { if (!controller.signal.aborted) setResult({ workSite: null, error }); });
    return () => controller.abort();
  }, [workSiteId]);

  const loading = result === null;
  const workSite = result?.workSite;
  const actions = <>
    <button type="button" className="btn btn-secondary btn-sm" onClick={onBack}>← Voltar</button>
    {workSite && <>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}><Icon name="edit" size={14} />Editar obra</button>
      <button type="button" className="btn btn-primary btn-sm" onClick={() => setDeleting(true)}><Icon name="trash" size={14} />Excluir obra</button>
    </>}
  </>;

  return <>
    <Header title="Detalhes da Obra" actions={actions} />
    <PageWrapper>
      {result?.error ? <ErrorState error={result.error} /> : <>
        <section className={`card ${styles.workSiteIdentity}`} aria-busy={loading}>
          <Skeleton loading={loading} width={64} height={64} borderRadius={12}>
            <span className={styles.detailIcon} aria-hidden="true"><Icon name="crane" size={27} /></span>
          </Skeleton>
          <div className={styles.detailName}>
            <h2><Skeleton loading={loading} width="min(100%, 24rem)" height={26}>{workSite?.name}</Skeleton></h2>
            <div className={styles.detailCode}><Skeleton loading={loading} width={90} height={16}>{workSite && `Obra #${workSite.id}`}</Skeleton></div>
          </div>
        </section>

        <div className={styles.workSiteInfoGrid} aria-busy={loading}>
          <section className={`card ${styles.workSiteInfoCard}`}>
            <h3 className={styles.sectionTitle}><span className={styles.sectionIcon} aria-hidden="true"><Icon name="crane" size={16} /></span>Informações da obra</h3>
            <dl className={styles.detailFields}>
              <div><dt className={styles.detailLabel}>Código / identificador</dt><dd className={styles.detailValue}><Skeleton loading={loading} width={80} height={17}>{workSite ? `#${workSite.id}` : ""}</Skeleton></dd></div>
              <div><dt className={styles.detailLabel}>Período de renovação</dt><dd className={styles.detailValue}><Skeleton loading={loading} width={100} height={17}>{workSite ? `${workSite.renewalPeriodDays} dia(s)` : ""}</Skeleton></dd></div>
            </dl>
          </section>

          <section className={`card ${styles.workSiteInfoCard}`}>
            <h3 className={styles.sectionTitle}><span className={styles.sectionIcon} aria-hidden="true"><Icon name="calendar" size={16} /></span>Informações do cadastro</h3>
            <dl className={styles.detailFields}>
              <div><dt className={styles.detailLabel}>Data de cadastro</dt><dd className={styles.detailValue}><Skeleton loading={loading} width={100} height={17}>{workSite ? formatWorkSiteDate(workSite.createdAt) : ""}</Skeleton></dd></div>
              <div><dt className={styles.detailLabel}>Última atualização</dt><dd className={styles.detailValue}><Skeleton loading={loading} width={100} height={17}>{workSite ? formatWorkSiteDate(workSite.updatedAt) : ""}</Skeleton></dd></div>
            </dl>
          </section>
        </div>
        {workSite && <ContextDocumentsSection key={`worksite-${workSite.id}`} workSiteId={workSite.id} initialSearch={initialDocumentSearch} initialPage={initialDocumentPage} initialOrder={initialDocumentOrder} initialSort={initialDocumentSort} onAnalyze={onAnalyzeDocument} />}
        {workSite && <WorkSiteSuppliers workSiteId={workSite.id} refreshKey={supplierRefreshKey} onSelect={onOpenSupplier} onCreateRequest={() => setCreatingSupplyRequest(true)} />}
      </>}
    </PageWrapper>
    {workSite && editing && <WorkSiteFormModal workSite={workSite} onClose={() => setEditing(false)} onSaved={updated => { setResult({ workSite: updated }); setEditing(false); }} />}
    {workSite && deleting && <DeleteWorkSiteModal workSite={workSite} onClose={() => setDeleting(false)} onDeleted={onBack} />}
    {workSite && creatingSupplyRequest && <CreateSupplyRequestModal mode="worksite" workSite={workSite} onClose={() => setCreatingSupplyRequest(false)} onCreated={() => { setSupplierRefreshKey(current => current + 1); setShowRequestSuccess(true); }} />}
    {showRequestSuccess && <Toast message="Solicitação criada com sucesso!" onClose={() => setShowRequestSuccess(false)} />}
  </>;
}
