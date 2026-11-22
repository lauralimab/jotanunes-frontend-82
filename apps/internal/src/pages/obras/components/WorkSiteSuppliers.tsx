import { useEffect, useState } from "react";
import { getCompany } from "../../../shared/api/company";
import { getSupplyRequests } from "../../../shared/api/supplyRequest";
import type { Company } from "../../../shared/types/company";
import type { SupplyRequest } from "../../../shared/types/supplyRequest";
import Icon from "../../../shared/components/Icon";
import Skeleton from "../../../shared/components/Skeleton";
import styles from "./WorkSiteSuppliers.module.css";

const REQUESTS_PAGE_SIZE = 50;
function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 14 ? digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : value || "—";
}

type WorkSiteSupplier = { company: Company; requests: SupplyRequest[] };

async function loadWorkSiteCompanies(workSiteId: number): Promise<WorkSiteSupplier[]> {
  const firstPage = await getSupplyRequests({ workSiteId, pageNumber: 1, pageSize: REQUESTS_PAGE_SIZE });
  const laterPages = await Promise.all(Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
    getSupplyRequests({ workSiteId, pageNumber: index + 2, pageSize: REQUESTS_PAGE_SIZE }),
  ));
  const requests = [firstPage, ...laterPages].flatMap(page => page.items);
  const companyIds = [...new Set(requests.map(request => request.companyId))];
  const companies = await Promise.all(companyIds.map(id => getCompany(id)));
  const requestsByCompany = new Map<number, SupplyRequest[]>();
  for (const request of requests) requestsByCompany.set(request.companyId, [...(requestsByCompany.get(request.companyId) ?? []), request]);
  return companies.map(company => ({ company, requests: requestsByCompany.get(company.id) ?? [] })).sort((a, b) => a.company.corporateName.localeCompare(b.company.corporateName, "pt-BR"));
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map(part => part[0]).join("").slice(0, 2).toLocaleUpperCase("pt-BR") || "?";
}

function SupplierCardSkeleton() {
  return <div className={`card ${styles.supplierCard}`} aria-hidden="true">
    <div className={styles.supplierHeader}><Skeleton width={44} height={44} borderRadius={12} /><div className={styles.supplierInfo}><Skeleton width="85%" height={16} /><Skeleton width="60%" height={13} /></div><Skeleton width={18} height={18} /></div>
    <div className={styles.supplierFooter}><Skeleton width={72} height={20} borderRadius={999} /><Skeleton width={120} height={13} /></div>
  </div>;
}

export default function WorkSiteSuppliers({ workSiteId, refreshKey, onSelect, onCreateRequest }: { workSiteId: number; refreshKey: number; onSelect: (companyId: number) => void; onCreateRequest: () => void }) {
  const [result, setResult] = useState<{ workSiteId: number; refreshKey: number; suppliers: WorkSiteSupplier[]; error?: unknown } | null>(null);

  useEffect(() => {
    let active = true;
    loadWorkSiteCompanies(workSiteId)
      .then(suppliers => { if (active) setResult({ workSiteId, refreshKey, suppliers }); })
      .catch(error => { if (active) setResult({ workSiteId, refreshKey, suppliers: [], error }); });
    return () => { active = false; };
  }, [workSiteId, refreshKey]);

  const state = result?.workSiteId === workSiteId && result.refreshKey === refreshKey ? result : null;
  const loading = state === null;

  return <section className={`card ${styles.section}`} aria-labelledby={`worksite-suppliers-${workSiteId}`} aria-busy={loading}>
    <div className={styles.sectionHeading}>
      <div><h2 id={`worksite-suppliers-${workSiteId}`}>Fornecedores da obra</h2><p>Fornecedores vinculados a esta obra.</p></div>
      <div className={styles.headingActions}>
        {!loading && !state?.error && <span className={styles.count}>{state?.suppliers.length.toLocaleString("pt-BR")} fornecedor(es)</span>}
        <button type="button" className="btn btn-primary btn-sm" onClick={onCreateRequest}><Icon name="plus" size={14} />Nova solicitação</button>
      </div>
    </div>

    {state?.error ? <div className={styles.error} role="alert">{state.error instanceof Error ? state.error.message : "Não foi possível carregar os fornecedores desta obra."}</div> : <>
      <div className={styles.supplierGrid}>
        {loading ? Array.from({ length: 3 }, (_, index) => <SupplierCardSkeleton key={index} />) : state.suppliers.map(({ company, requests }) => {
          const name = company.corporateName || company.tradeName || "Fornecedor";
          const openRequestCount = requests.filter(request => request.status === 1).length;
          return <article key={company.id} className={`card ${styles.supplierCard}`} aria-label={name}>
            <button type="button" className={styles.cardLink} aria-label={`Abrir detalhes de ${name}`} onClick={() => onSelect(company.id)} />
            <div className={styles.supplierHeader}>
              <span className={styles.avatar} aria-hidden="true">{getInitials(name)}</span>
              <div className={styles.supplierInfo}>
                <h3 title={name}>{name}</h3>
                <p className={styles.cnpj}>{company.formattedCnpj || formatCnpj(company.cnpj)}</p>
              </div>
              <span className={styles.arrow} aria-hidden="true"><Icon name="chevron-right" size={18} /></span>
            </div>
            <footer className={styles.supplierFooter}>
              <span className={`${styles.typeBadge} ${company.supplierType === 2 ? styles.typeBadgeLabor : ""}`}>{company.supplierType === 1 ? "Material" : company.supplierType === 2 ? "M\u00e3o de obra" : "Tipo indispon\u00edvel"}</span>
              <span className={styles.openRequests}>{openRequestCount} {openRequestCount === 1 ? "solicita\u00e7\u00e3o aberta" : "solicita\u00e7\u00f5es abertas"}</span>
            </footer>
          </article>;
        })}
      </div>
      {!loading && !state?.suppliers.length && <p className={styles.empty} role="status">Nenhum fornecedor vinculado a esta obra.</p>}
    </>}
  </section>;
}
