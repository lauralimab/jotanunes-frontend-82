import { useEffect, useId, useState } from "react";
import { getWorkSite } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Icon from "../../../shared/components/Icon";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import WorkSiteDialog from "./WorkSiteDialog";
import { formatWorkSiteDate } from "../formatters";
import styles from "../obras.module.css";

type Props = { workSiteId: number; onClose: () => void };

export default function WorkSiteDetailModal({ workSiteId, onClose }: Props) {
  const id = useId();
  const [result, setResult] = useState<{ workSite: WorkSite | null; error?: unknown } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getWorkSite(workSiteId, controller.signal).then(workSite => {
      if (!controller.signal.aborted) setResult({ workSite });
    }).catch(error => { if (!controller.signal.aborted) setResult({ workSite: null, error }); });
    return () => controller.abort();
  }, [workSiteId]);

  const loading = result === null;
  const workSite = result?.workSite;
  const sections = [
    { title: "Informações da obra", icon: "crane", fields: [
      { label: "Código da obra", value: workSite ? `#${workSite.id}` : "", width: 55 },
      { label: "Período de renovação", value: workSite ? `${workSite.renewalPeriodDays} dia(s)` : "", width: 85 },
    ] },
    { title: "Informações do cadastro", icon: "calendar", fields: [
      { label: "Cadastrada em", value: workSite ? formatWorkSiteDate(workSite.createdAt) : "", width: 85 },
      { label: "Última atualização", value: workSite ? formatWorkSiteDate(workSite.updatedAt) : "", width: 85 },
    ] },
  ];

  return <WorkSiteDialog title="Detalhes da obra" busy={false} onClose={onClose} className={styles.detailDialog}>
    <div className={styles.body} aria-busy={loading}>
      {result && !workSite ? <ErrorState error={result.error} compact /> : <>
        <div className={styles.detailSummary}>
          <Skeleton loading={loading} width="3rem" height="3rem" borderRadius={12}><span className={styles.detailIcon} aria-hidden="true"><Icon name="crane" size={24} /></span></Skeleton>
          <div className={styles.detailName}>
            <h4><Skeleton loading={loading} width="min(100%, 14rem)" height={22}>{workSite?.name}</Skeleton></h4>
            <div className={styles.detailCode}><Skeleton loading={loading} width={70} height={15}>{workSite && `Obra #${workSite.id}`}</Skeleton></div>
          </div>
        </div>
        <div className={styles.details}>{sections.map((section, index) => <section key={section.title} className={styles.detailCard} aria-labelledby={`${id}-section-${index}`}>
          <h4 id={`${id}-section-${index}`} className={styles.sectionTitle}><Skeleton loading={loading} width={16} height={16}><span className={styles.sectionIcon} aria-hidden="true"><Icon name={section.icon} size={16} /></span></Skeleton><Skeleton loading={loading}>{section.title}</Skeleton></h4>
          <div className={styles.detailFields}>{section.fields.map(field => <div key={field.label}>
            <div className={styles.detailLabel}><Skeleton loading={loading}>{field.label}</Skeleton></div>
            <div className={styles.detailValue}><Skeleton loading={loading} width={field.width} height={17}>{field.value}</Skeleton></div>
          </div>)}</div>
        </section>)}</div>
      </>}
    </div>
    <footer className={styles.footer}>
      <button type="button" className="btn btn-secondary" onClick={onClose}>Fechar</button>
    </footer>
  </WorkSiteDialog>;
}
