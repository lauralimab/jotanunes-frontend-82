import { useEffect, useState } from "react";
import { getCompanies } from "../../../../shared/api/company";
import { CompanyStatus, type Company, type CompanyPage, type SupplierType } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import ClearSearchButton from "../../../../shared/components/ClearSearchButton";
import Skeleton from "../../../../shared/components/Skeleton";
import Select from "../../../../shared/components/Select";
import styles from "./EmpresasTable.module.css";
import ExcluirFornecedorModal from "./ExcluirFornecedorModal";
import Toast from "../../../../shared/components/Toast";
import TableActions, { TableActionsSkeleton } from "../../../../shared/components/TableActions";
import TablePagination from "../../../../shared/components/TablePagination";

const PAGE_SIZE = 10;
const companyStatuses = [
  { value: CompanyStatus.PendingDocumentation, label: "Pendente", className: "badge-warning" },
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

export default function EmpresasTable({ onSelectCompany, onEditCompany }: { onSelectCompany: (id: number) => void; onEditCompany: (id: number) => void }) {
  const [filters, setFilters] = useState<Filters>({ search: "", status: "all", supplierType: "all", pageNumber: 1 });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [state, setState] = useState<TableState>({ page: null, loading: true, error: false });
  const [retryCount, setRetryCount] = useState(0);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    let active = true;
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
    return () => { active = false; };
  }, [filters, retryCount]);

  function changeFilters(next: Partial<Filters>) {
    setState({ page: null, loading: true, error: false });
    setFilters(current => ({ ...current, pageNumber: 1, ...next }));
  }

  const { page, loading, error } = state;
  const currentPage = page?.currentPage ?? filters.pageNumber;
  const totalPages = page?.totalPages ?? 0;

  function handleDeleted() {
    setCompanyToDelete(null);
    setShowDeleteSuccess(true);
    if (page?.items.length === 1 && currentPage > 1) {
      changeFilters({ pageNumber: currentPage - 1 });
    } else {
      setState({ page: null, loading: true, error: false });
      setRetryCount(value => value + 1);
    }
  }

  return (
    <div className="card table-card" style={{ padding: 0, overflow: "hidden" }}>
      <form className={styles.filters} onSubmit={event => { event.preventDefault(); changeFilters(draftFilters); }}>
        <div style={{ flex: 1, minWidth: 220, maxWidth: 320 }}>
          <span style={{ display: "block", marginBottom: 5, marginLeft: 5, fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}>Buscar fornecedor</span>
          <div style={{ position: "relative", display: "flex" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
            <input className="input-base" aria-label="Buscar por razão social ou CNPJ" placeholder="Buscar por razão social ou CNPJ" style={{ paddingLeft: 32, paddingRight: "2.75rem" }} value={draftFilters.search} onChange={event => setDraftFilters(current => ({ ...current, search: event.target.value }))} />
            {draftFilters.search && <ClearSearchButton onClear={() => setDraftFilters(current => ({ ...current, search: "" }))} />}
          </div>
        </div>
        <div style={{ flex: "1 1 14rem", maxWidth: "18rem" }}>
          <span style={{ display: "block", marginBottom: 5, marginLeft: 5, fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}>Status do fornecedor</span>
          <Select label="Filtrar por status" value={String(draftFilters.status)} style={{ width: "100%" }}
            options={[{ value: "all", label: "Todos" }, ...companyStatuses.map(status => ({ value: String(status.value), label: status.label }))]}
            onChange={value => setDraftFilters(current => ({ ...current, status: value === "all" ? "all" : Number(value) as CompanyStatus }))} />
        </div>
        <div style={{ flex: "1 1 14rem", maxWidth: "18rem" }}>
          <span style={{ display: "block", marginBottom: 5, marginLeft: 5, fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}>Tipo de fornecedor</span>
          <Select label="Filtrar por tipo de fornecedor" value={String(draftFilters.supplierType)} style={{ width: "100%" }}
            options={[{ value: "all", label: "Todos" }, { value: "1", label: "Material" }, { value: "2", label: "Mão de obra" }]}
            onChange={value => setDraftFilters(current => ({ ...current, supplierType: value === "all" ? "all" : Number(value) as SupplierType }))} />
        </div>
        <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={loading}><Icon name="search" size={15} />Buscar</button>
      </form>
      <div style={{ overflowX: "auto" }} aria-busy={loading}>
        <table className={`table-base ${styles.table}`}>
          <colgroup>
            <col />
            <col className={styles.cnpjColumn} />
            <col className={styles.typeColumn} />
            <col className={styles.statusColumn} />
            <col className={styles.updatedColumn} />
            <col className={styles.actionsColumn} />
          </colgroup>
          <thead><tr><th>Razão Social</th><th>CNPJ</th><th>Tipo</th><th>Status</th><th>Atualizado em</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => (
              <tr key={index} aria-hidden="true">
                <td><div className={styles.supplierIdentity}><div className={styles.avatarSlot}><Skeleton width="100%" height="100%" borderRadius={8} /></div><div className={styles.supplierText}><div className={styles.nameLine}><Skeleton width="100%" height={14} /></div><div className={styles.emailLine}><Skeleton width="65%" height={12} /></div></div></div></td>
                <td style={{ fontFamily: "monospace", fontSize: 13 }}><Skeleton width="18ch" height={15} /></td>
                <td><Skeleton width={90} height={15} /></td>
                <td><Skeleton width={80} height={18} borderRadius={999} /></td>
                <td><Skeleton width={80} height={15} /></td>
                <td><TableActionsSkeleton count={3} /></td>
              </tr>
            )) : page?.items.map(company => {
              const name = company.corporateName || company.tradeName || "Fornecedor";
              const status = companyStatuses.find(item => item.value === company.status);
              return (
                <tr key={company.id}>
                  <td><div className={styles.supplierIdentity}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#c01a2b", flexShrink: 0 }}>{name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                    <div className={styles.supplierText}><div className={`${styles.nameLine} table-primary`} title={name}>{name}</div><div className={`${styles.emailLine} table-secondary`} title={company.email || undefined}>{company.email || "—"}</div></div>
                  </div></td>
                  <td style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{company.formattedCnpj || formatCnpj(company.cnpj || "") || "—"}</td>
                  <td>{company.supplierType === 1 ? "Material" : company.supplierType === 2 ? "Mão de obra" : "—"}</td>
                  <td><span className={`badge ${status?.className ?? "badge-gray"}`}>{status?.label ?? "Status indisponível"}</span></td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{formatDate(company.updatedAt)}</td>
                  <td><TableActions label={`Ações de ${name}`} actions={[
                    { label: "Ver detalhes", icon: "eye", onClick: () => onSelectCompany(company.id) },
                    { label: "Editar fornecedor", icon: "edit", onClick: () => onEditCompany(company.id) },
                    { label: "Excluir fornecedor", icon: "trash", danger: true, onClick: () => setCompanyToDelete(company) },
                  ]} /></td>
                </tr>
              );
            })}
            {!loading && !page?.items.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 24 }}>Nenhum fornecedor encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <TablePagination totalCount={page?.totalCount ?? 0} currentPage={currentPage} totalPages={totalPages} itemLabel="fornecedor(es)" ariaLabel="Páginas de fornecedores" loading={loading} disabled={error} loadingText="Carregando fornecedores..." onPageChange={pageNumber => changeFilters({ pageNumber })} />
      {companyToDelete && <ExcluirFornecedorModal company={companyToDelete} onClose={() => setCompanyToDelete(null)} onDeleted={handleDeleted} />}
      {showDeleteSuccess && <Toast message="Fornecedor excluído com sucesso!" onClose={() => setShowDeleteSuccess(false)} />}
    </div>
  );
}
