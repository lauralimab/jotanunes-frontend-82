import { useEffect, useId, useState } from "react";
import { getWorkers } from "../../../../shared/api/worker";
import type { Worker, WorkerPage } from "../../../../shared/types/worker";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import StatusBadge from "../../../../shared/components/StatusBadge";
import Select from "../../../../shared/components/Select";
import ClearSearchButton from "../../../../shared/components/ClearSearchButton";
import ErrorState from "../../../../shared/components/ErrorState";
import WorkerDetailModal from "./WorkerDetailModal";
import { formatWorkerCpf, formatWorkerDate } from "./workerFormatters";
import styles from "./SupplierWorkers.module.css";
import TableActions, { TableActionsSkeleton } from "../../../../shared/components/TableActions";
import TablePagination from "../../../../shared/components/TablePagination";

const PAGE_SIZE = 5;
type SearchFilters = { search: string; status: "all" | "active" | "inactive" };
type Filters = SearchFilters & { pageNumber: number };
type TableResult = { companyId: number; filters: Filters; page: WorkerPage | null; error?: unknown };

function WorkersTable({ loading, workers = [], onSelect }: { loading: boolean; workers?: Worker[]; onSelect?: (id: number) => void }) {
  return <div className={styles.tableWrapper} aria-busy={loading}>
    <table className={`table-base ${styles.table}`}>
      <colgroup><col /><col className={styles.cpfColumn} /><col className={styles.statusColumn} /><col className={styles.dateColumn} /><col className={styles.dateColumn} /><col className={styles.actionsColumn} /></colgroup>
      <thead><tr>{["Funcionário", "CPF", "Status", "Cadastrado em", "Atualizado em", "Ações"].map(title => <th key={title} scope="col">{title}</th>)}</tr></thead>
      <tbody>
        {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => <tr key={index} aria-hidden="true">
          <td><div className={styles.name}><Skeleton width="85%" height={14} /></div><div className={styles.secondary}><Skeleton width={55} height={12} /></div></td>
          <td className={styles.cpf}><Skeleton width="14ch" height={15} /></td>
          <td><Skeleton width={65} height={22} borderRadius={999} /></td>
          <td><Skeleton width={80} height={14} /></td><td><Skeleton width={80} height={14} /></td>
          <td><TableActionsSkeleton count={1} /></td>
        </tr>) : workers.map(worker => <tr key={worker.id}>
          <td><div className={styles.name} title={worker.name}>{worker.name}</div><div className={styles.secondary}>#{worker.id}</div></td>
          <td className={styles.cpf}>{formatWorkerCpf(worker)}</td>
          <td><StatusBadge status={worker.active ? "active" : "inactive"} /></td>
          <td>{formatWorkerDate(worker.createdAt)}</td><td>{formatWorkerDate(worker.updatedAt)}</td>
          <td><TableActions forceMenu label={`Ações do funcionário ${worker.name}`} actions={[{ label: "Ver detalhes", ariaLabel: `Ver detalhes de ${worker.name}`, icon: "eye", onClick: () => onSelect?.(worker.id) }]} /></td>
        </tr>)}
        {!loading && !workers.length && <tr><td colSpan={6} className={styles.message}>Nenhum funcionário encontrado para este fornecedor.</td></tr>}
      </tbody>
    </table>
  </div>;
}

export function SupplierWorkersSkeleton({ embedded = false }: { embedded?: boolean }) {
  return <section className={embedded ? styles.embedded : `card table-card ${styles.card}`} role="status" aria-label="Carregando funcionários do fornecedor" aria-busy="true">
    <header className={styles.header}><h3><Skeleton width={130} height={18} /></h3><p><Skeleton width="min(100%, 20rem)" height={15} /></p></header>
    <div className={styles.filters} aria-hidden="true">
      <div className={styles.searchField}><div className={styles.label}><Skeleton width={120} height={14} /></div><Skeleton width="100%" height={42} borderRadius={9} /></div>
      <div className={styles.statusField}><div className={styles.label}><Skeleton width={120} height={14} /></div><Skeleton width="100%" height={42} borderRadius={9} /></div>
      <Skeleton width={100} height={42} borderRadius={9} />
    </div>
    <WorkersTable loading />
    <footer className="table-footer"><Skeleton width={150} height={15} /><TableActionsSkeleton count={2} /></footer>
  </section>;
}

export default function SupplierWorkers({ companyId, embedded = false, onTotalChange }: { companyId: number; embedded?: boolean; onTotalChange?: (total: number | null) => void }) {
  const id = useId();
  const [draftFilters, setDraftFilters] = useState<SearchFilters>({ search: "", status: "all" });
  const [filters, setFilters] = useState<Filters>({ ...draftFilters, pageNumber: 1 });
  const [result, setResult] = useState<TableResult | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const search = filters.search.trim();
    const isCpf = /^[\d.\s-]+$/.test(search);
    getWorkers({
      companyId,
      pageNumber: filters.pageNumber,
      pageSize: PAGE_SIZE,
      name: search && !isCpf ? search : undefined,
      cpf: search && isCpf ? search.replace(/\D/g, "") : undefined,
      active: filters.status === "all" ? undefined : filters.status === "active",
    }, controller.signal).then(page => {
      if (!controller.signal.aborted) setResult({ companyId, filters, page });
    }).catch(error => { if (!controller.signal.aborted) setResult({ companyId, filters, page: null, error }); });
    return () => controller.abort();
  }, [companyId, filters]);

  useEffect(() => {
    if (result?.companyId === companyId && !result.filters.search && result.filters.status === "all") {
      onTotalChange?.(result.page?.totalCount ?? null);
    }
  }, [result, companyId, onTotalChange]);

  const loading = !result || result.companyId !== companyId || result.filters !== filters;
  if (!result || result.companyId !== companyId) return <SupplierWorkersSkeleton embedded={embedded} />;

  const page = !loading ? result.page : null;
  const failed = !loading && !page;
  const currentPage = page?.currentPage ?? filters.pageNumber;
  const totalPages = page?.totalPages ?? 0;

  function applyFilters() {
    if (loading) return;
    const search = draftFilters.search.trim();
    if (!failed && search === filters.search && draftFilters.status === filters.status && filters.pageNumber === 1) return;
    setFilters({ search, status: draftFilters.status, pageNumber: 1 });
  }

  return <>
    <section className={embedded ? styles.embedded : `card table-card ${styles.card}`} aria-labelledby={`${id}-title`}>
      <header className={styles.header}><h3 id={`${id}-title`}>Funcionários</h3><p>Funcionários vinculados a este fornecedor.</p></header>
      <form className={styles.filters} onSubmit={event => { event.preventDefault(); applyFilters(); }}>
        <div className={styles.searchField}>
          <label className={styles.label} htmlFor={`${id}-search`}>Buscar funcionário</label>
          <div className={styles.searchInput}>
            <span className={styles.searchIcon}><Icon name="search" size={15} /></span>
            <input id={`${id}-search`} className="input-base" placeholder="Buscar por nome ou CPF" value={draftFilters.search} onChange={event => setDraftFilters(current => ({ ...current, search: event.target.value }))} />
            {draftFilters.search && <ClearSearchButton onClear={() => setDraftFilters(current => ({ ...current, search: "" }))} />}
          </div>
        </div>
        <div className={styles.statusField}>
          <span className={styles.label}>Status do funcionário</span>
          <Select label="Filtrar por status do funcionário" value={draftFilters.status} options={[{ value: "all", label: "Todos" }, { value: "active", label: "Ativos" }, { value: "inactive", label: "Inativos" }]}
            onChange={value => setDraftFilters(current => ({ ...current, status: value as SearchFilters["status"] }))} />
        </div>
        <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={loading}><Icon name="search" size={15} />Buscar</button>
      </form>
      {failed ? <ErrorState error={result.error} compact /> : <WorkersTable loading={loading} workers={page?.items} onSelect={setSelectedWorkerId} />}
      {!failed && <TablePagination totalCount={page?.totalCount ?? 0} currentPage={currentPage} totalPages={totalPages} itemLabel="funcionário(s)" ariaLabel="Páginas de funcionários" loading={loading} loadingText="Carregando funcionários..." onPageChange={pageNumber => setFilters(current => ({ ...current, pageNumber }))} />}
    </section>
    {selectedWorkerId !== null && <WorkerDetailModal key={selectedWorkerId} workerId={selectedWorkerId} companyId={companyId} onClose={() => setSelectedWorkerId(null)} />}
  </>;
}
