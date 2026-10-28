import { useEffect, useState } from "react";
import { getCompanies } from "../../../shared/api/company";
import { CompanyStatus } from "../../../shared/types/company";
import Skeleton from "../../../shared/components/Skeleton";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import type { Screen } from "../../../shared/types/portal";
import EstatisticasCards from "./components/EstatisticasCards";
import DocumentosRecentesCard from "./components/DocumentosRecentesCard";

const supplierStatuses = [
  { status: CompanyStatus.Eligible, label: "Aptos", color: "#16a34a" },
  { status: CompanyStatus.PendingDocumentation, label: "Pendentes", color: "#ca8a04" },
  { status: CompanyStatus.NotEligible, label: "Não apto", color: "#d97706" },
  { status: CompanyStatus.Blocked, label: "Bloqueados", color: "#dc2626" },
];

type SupplierStatusCount = (typeof supplierStatuses)[number] & { count: number };

export default function InicioPage({ onNav }: { onNav: (s: Screen) => void }) {
  const [supplierTotal, setSupplierTotal] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState<SupplierStatusCount[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [suppliersError, setSuppliersError] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all(supplierStatuses.map(({ status }) =>
      getCompanies({ pageNumber: 1, pageSize: 1, status }),
    ))
      .then((statusPages) => {
        if (!active) return;

        setSupplierTotal(statusPages.reduce((total, page) => total + page.totalCount, 0));
        setStatusCounts(supplierStatuses.map((item, index) => ({
          ...item,
          count: statusPages[index].totalCount,
        })).sort((a, b) => b.count - a.count));
      })
      .catch(() => {
        if (active) setSuppliersError(true);
      })
      .finally(() => {
        if (active) setSuppliersLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <>
      <Header title="Dashboard Administrativo" subtitle="Visão geral da plataforma" />
      <PageWrapper>
        <EstatisticasCards supplierTotal={supplierTotal} suppliersLoading={suppliersLoading} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}><Skeleton loading={suppliersLoading}>Status dos Fornecedores</Skeleton></h3>
              <div aria-live="polite" aria-busy={suppliersLoading}>
                {suppliersError ? (
                  <p style={{ fontSize: 13, color: "#6b7280" }}>Status indisponíveis no momento.</p>
                ) : (suppliersLoading ? supplierStatuses.map(item => ({ ...item, count: 0 })) : statusCounts).map((item) => {
                  const percentage = supplierTotal !== null && supplierTotal > 0 ? item.count / supplierTotal * 100 : 0;

                  return (
                    <div key={item.status} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}><Skeleton loading={suppliersLoading}>{item.label}</Skeleton></span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}><Skeleton loading={suppliersLoading} width={70} height={16}>{item.count.toLocaleString("pt-BR")} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({Math.round(percentage)}%)</span></Skeleton></span>
                      </div>
                      <div className="progress-bar-track">{suppliersLoading ? <Skeleton width="100%" height={6} borderRadius={999} /> : <div className="progress-bar-fill" style={{ width: `${Math.min(percentage, 100)}%`, background: item.color }} />}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card" aria-busy={suppliersLoading} style={{ background: suppliersLoading ? "rgba(255, 255, 255, 0.10)" : "#fde8ea", border: suppliersLoading ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid #fca5a5" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <Skeleton loading={suppliersLoading} width={18} height={18}><Icon name="alert" size={18} color="#c01a2b" /></Skeleton>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7f1d1d" }}><Skeleton loading={suppliersLoading}>Autorizações Excepcionais</Skeleton></h4>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#b91c1c" }}><Skeleton loading={suppliersLoading}><strong>2</strong> autorizações ativas — fornecedores operando com documentação irregular aprovada pela Jotanunes.</Skeleton></p>
              <Skeleton loading={suppliersLoading} borderRadius={8}><button className="btn btn-danger btn-sm" disabled={suppliersLoading} onClick={() => onNav("autorizacao-excepcional")}>Ver autorizações</button></Skeleton>
            </div>
          </div>

          <DocumentosRecentesCard onNav={onNav} loading={suppliersLoading} />
        </div>
      </PageWrapper>
    </>
  );
}
