import { useEffect, useState } from "react";
import { getCompanies } from "../../../../shared/api/company";
import { CompanyStatus } from "../../../../shared/types/company";
import Skeleton from "../../../../shared/components/Skeleton";
import styles from "../dashboard.module.css";

const supplierStatuses = [
  { status: CompanyStatus.PendingDocumentation, label: "Pendentes", color: "#a16207", description: "Aguardando regularização documental." },
  { status: CompanyStatus.Eligible, label: "Aptos", color: "#15803d", description: "Fornecedores com status apto na plataforma." },
  { status: CompanyStatus.NotEligible, label: "Não aptos", color: "#c2410c", description: "Fornecedores com status não apto." },
  { status: CompanyStatus.Blocked, label: "Bloqueados", color: "#c01a2b", description: "Fornecedores com status bloqueado." },
];
type SupplierStatusCount = (typeof supplierStatuses)[number] & { count: number };

export default function StatusFornecedoresCard() {
  const [counts, setCounts] = useState<SupplierStatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    let active = true;
    Promise.all(supplierStatuses.map(({ status }) => getCompanies({ pageNumber: 1, pageSize: 1, status })))
      .then(pages => {
        if (active) setCounts(supplierStatuses.map((item, index) => ({ ...item, count: pages[index].totalCount })).sort((a, b) => b.count - a.count));
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <section className={`card ${styles.statusCard}`} aria-labelledby="supplier-status-title" aria-busy={loading}>
    <div className={styles.heading}>
      <div><h3 id="supplier-status-title">Status dos fornecedores</h3><p className={styles.description}>Panorama geral da base de fornecedores cadastrados na plataforma.</p></div>
      <div className={styles.statusTotal}>Total de fornecedores<strong aria-live="polite"><Skeleton loading={loading} width={60} height={29}>{error ? "—" : total.toLocaleString("pt-BR")}</Skeleton></strong></div>
    </div>
    {error ? <p className={styles.statusError} role="status">Não foi possível carregar o panorama de fornecedores no momento.</p> : <div className={styles.statusGrid}>
      {(loading ? supplierStatuses.map(item => ({ ...item, count: 0 })) : counts).map(item => {
        const percentage = total > 0 ? item.count / total * 100 : 0;
        return <div key={item.status}>
          <div className={styles.statusLabel}><span><Skeleton loading={loading}>{item.label}</Skeleton></span><span style={{ color: item.color }}><Skeleton loading={loading} width={75} height={17}>{item.count.toLocaleString("pt-BR")} <small>({Math.round(percentage)}%)</small></Skeleton></span></div>
          <div className="progress-bar-track">{loading ? <Skeleton width="100%" height={6} borderRadius={999} /> : <div className="progress-bar-fill" style={{ width: `${Math.min(percentage, 100)}%`, background: item.color }} />}</div>
          <p className={styles.description}><Skeleton loading={loading}>{item.description}</Skeleton></p>
        </div>;
      })}
    </div>}
  </section>;
}
