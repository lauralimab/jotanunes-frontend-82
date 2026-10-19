import { useEffect, useState } from "react";
import { getCompanies } from "../../../../shared/api/company";
import { CompanyStatus, type CompanyPage, type SupplierType } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import Select from "../../../../shared/components/Select";

const PAGE_SIZE = 10;
const companyStatuses = [
  { value: CompanyStatus.PendingDocumentation, label: "Documentação pendente", className: "badge-warning" },
  { value: CompanyStatus.Eligible, label: "Apto", className: "badge-success" },
  { value: CompanyStatus.NotEligible, label: "Não apto", className: "badge-orange" },
  { value: CompanyStatus.Blocked, label: "Bloqueado", className: "badge-danger" },
];

type Filters = {
  search: string;
  status: "all" | CompanyStatus;
  supplierType: "all" | SupplierType;
  pageNumber: number;
};

type TableState = { page: CompanyPage | null; loading: boolean; error: boolean };

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 14 ? digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : value;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export default function EmpresasTable({ onSelectCompany }: { onSelectCompany: (id: number) => void }) {
  const [filters, setFilters] = useState<Filters>({ search: "", status: "all", supplierType: "all", pageNumber: 1 });
  const [state, setState] = useState<TableState>({ page: null, loading: true, error: false });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      const search = filters.search.trim();
      const isCnpj = /^[\d./\s-]+$/.test(search);
      getCompanies({
        pageNumber: filters.pageNumber,
        pageSize: PAGE_SIZE,
        corporateName: search && !isCnpj ? search : undefined,
        cnpj: search && isCnpj ? search.replace(/\D/g, "") : undefined,
        status: filters.status === "all" ? undefined : filters.status,
        supplierType: filters.supplierType === "all" ? undefined : filters.supplierType,
      }).then((page) => {
        if (active) setState({ page, loading: false, error: false });
      }).catch(() => {
        if (active) setState({ page: null, loading: false, error: true });
      });
    }, 300);

    return () => { active = false; clearTimeout(timer); };
  }, [filters, retryCount]);

  function changeFilters(next: Partial<Filters>) {
    setState({ page: null, loading: true, error: false });
    setFilters(current => ({ ...current, pageNumber: 1, ...next }));
  }

  function retry() {
    setState({ page: null, loading: true, error: false });
    setRetryCount(count => count + 1);
  }

  const { page, loading, error } = state;
  const currentPage = page?.currentPage ?? filters.pageNumber;
  const totalPages = page?.totalPages ?? 0;
  const firstPageButton = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageButtons = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPageButton + index);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(15, 23, 42, 0.06)", display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
          <input className="input-base" aria-label="Buscar por razão social ou CNPJ" placeholder="Buscar por razão social ou CNPJ..." style={{ paddingLeft: 32 }} value={filters.search} onChange={event => changeFilters({ search: event.target.value })} />
        </div>
        <Select label="Filtrar por status" value={String(filters.status)} style={{ flex: "1 1 14rem", maxWidth: "18rem" }}
          options={[{ value: "all", label: "Todos" }, ...companyStatuses.map(status => ({ value: String(status.value), label: status.label }))]}
          onChange={value => changeFilters({ status: value === "all" ? "all" : Number(value) as CompanyStatus })} />
        <Select label="Filtrar por tipo de fornecedor" value={String(filters.supplierType)} style={{ flex: "1 1 14rem", maxWidth: "18rem" }}
          options={[{ value: "all", label: "Todos" }, { value: "1", label: "Material" }, { value: "2", label: "Mão de obra" }]}
          onChange={value => changeFilters({ supplierType: value === "all" ? "all" : Number(value) as SupplierType })} />
      </div>
      {error && <div role="alert" style={{ padding: "16px 20px", color: "#b91c1c" }}>Não foi possível carregar os fornecedores. <button className="btn btn-secondary btn-sm" onClick={retry}>Tentar novamente</button></div>}
      <div style={{ overflowX: "auto" }} aria-busy={loading}>
        <table className="table-base">
          <thead><tr><th>Fornecedor</th><th>CNPJ</th><th>Tipo de fornecedor</th><th>Status</th><th>Última Atualização</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => (
              <tr key={index} aria-hidden="true">
                <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Skeleton width={36} height={36} borderRadius={8} /><div style={{ flex: 1 }}><Skeleton width="85%" height={14} /><div style={{ marginTop: 5 }}><Skeleton width="65%" height={12} /></div></div></div></td>
                <td><Skeleton width={145} height={15} /></td>
                <td><Skeleton width={85} height={15} /></td>
                <td><Skeleton width={130} height={24} borderRadius={999} /></td>
                <td><Skeleton width={80} height={15} /></td>
                <td><Skeleton width={70} height={28} borderRadius={8} /></td>
              </tr>
            )) : page?.items.map(company => {
              const name = company.corporateName || company.tradeName || "Fornecedor";
              const status = companyStatuses.find(item => item.value === company.status);
              return (
                <tr key={company.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#c01a2b", flexShrink: 0 }}>{name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                    <div><div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5 }}>{name}</div><div style={{ fontSize: 11.5, color: "#9ca3af" }}>{company.email || "—"}</div></div>
                  </div></td>
                  <td style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{company.formattedCnpj || formatCnpj(company.cnpj || "") || "—"}</td>
                  <td>{company.supplierType === 1 ? "Material" : company.supplierType === 2 ? "Mão de obra" : "—"}</td>
                  <td><span className={`badge ${status?.className ?? "badge-gray"}`}>{status?.label ?? "Status indisponível"}</span></td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{formatDate(company.updatedAt)}</td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => onSelectCompany(company.id)}>Detalhes</button></td>
                </tr>
              );
            })}
            {!loading && !error && !page?.items.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 24 }}>Nenhum fornecedor encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span aria-live="polite" style={{ fontSize: 12.5, color: "#6b7280" }}>{loading ? "Carregando fornecedores..." : error ? "Total indisponível" : `${page?.totalCount ?? 0} fornecedor(es)${totalPages > 0 ? ` · Página ${currentPage} de ${totalPages}` : ""}`}</span>
        <nav aria-label="Páginas de fornecedores" style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-ghost btn-sm" disabled={loading || error || currentPage <= 1} onClick={() => changeFilters({ pageNumber: currentPage - 1 })}>Anterior</button>
          {pageButtons.map(number => <button key={number} className="btn btn-ghost btn-sm" aria-current={number === currentPage ? "page" : undefined} disabled={loading || number === currentPage} style={{ minWidth: 32, justifyContent: "center", background: number === currentPage ? "#fde8ea" : undefined, color: number === currentPage ? "#c01a2b" : undefined }} onClick={() => changeFilters({ pageNumber: number })}>{number}</button>)}
          <button className="btn btn-ghost btn-sm" disabled={loading || error || currentPage >= totalPages} onClick={() => changeFilters({ pageNumber: currentPage + 1 })}>Próxima</button>
        </nav>
      </div>
    </div>
  );
}
