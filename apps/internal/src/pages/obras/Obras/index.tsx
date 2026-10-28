import { useEffect, useState } from "react";
import { getWorkSites } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import Icon from "../../../shared/components/Icon";
import TableActions, { TableActionsSkeleton } from "../../../shared/components/TableActions";
import TablePagination from "../../../shared/components/TablePagination";
import ClearSearchButton from "../../../shared/components/ClearSearchButton";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import Toast from "../../../shared/components/Toast";
import WorkSiteFormModal from "../components/WorkSiteFormModal";
import DeleteWorkSiteModal from "../components/DeleteWorkSiteModal";
import WorkSiteDetailModal from "../components/WorkSiteDetailModal";
import { formatWorkSiteDate, normalizeWorkSiteName } from "../formatters";
import styles from "../obras.module.css";

const PAGE_SIZE = 10;
type ListState = { items: WorkSite[] | null; error: unknown };

export default function ObrasPage({ initialWorkSiteId, onDetailsClose }: { initialWorkSiteId?: number; onDetailsClose: () => void }) {
  const [result, setResult] = useState<ListState | null>(null);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<{ workSite?: WorkSite } | null>(null);
  const [deleting, setDeleting] = useState<WorkSite | null>(null);
  const [selectedWorkSiteId, setSelectedWorkSiteId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ id: number; message: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getWorkSites(controller.signal).then(items => {
      if (!controller.signal.aborted) setResult({ items, error: null });
    }).catch(error => { if (!controller.signal.aborted) setResult({ items: null, error }); });
    return () => controller.abort();
  }, []);

  const loading = result === null;
  const filtered = (result?.items ?? []).filter(workSite => normalizeWorkSiteName(workSite.name).includes(normalizeWorkSiteName(search)));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const detailId = selectedWorkSiteId ?? initialWorkSiteId;
  function closeDetails() { setSelectedWorkSiteId(null); onDetailsClose(); }
  function notify(message: string) { setNotification({ id: Date.now(), message }); }
  function handleSaved(workSite: WorkSite) {
    const editing = Boolean(form?.workSite);
    setResult(current => ({ items: editing ? (current?.items ?? []).map(item => item.id === workSite.id ? workSite : item) : [...(current?.items ?? []), workSite], error: null }));
    if (!editing) { setDraftSearch(""); setSearch(""); setPage(Math.ceil(((result?.items?.length ?? 0) + 1) / PAGE_SIZE)); }
    setForm(null);
    notify(editing ? "Obra atualizada com sucesso!" : "Obra cadastrada com sucesso!");
  }
  function handleDeleted() {
    if (!deleting) return;
    setResult(current => ({ items: (current?.items ?? []).filter(item => item.id !== deleting.id), error: null }));
    setDeleting(null);
    notify("Obra excluída com sucesso!");
  }

  return <>
    <Header title="Obras" subtitle="Gerencie as obras e os períodos"
      actions={<button type="button" className="btn btn-primary" disabled={loading || result?.items === null} onClick={() => setForm({})}><Icon name="plus" size={15} />Nova obra</button>} />
    <PageWrapper>
      <div className={`card table-card ${styles.card}`}>
        <form className={styles.filters} onSubmit={event => { event.preventDefault(); setSearch(draftSearch.trim()); setPage(1); }}>
          <label className={styles.search}><span>Buscar obra</span><div className={styles.searchInput}><span><Icon name="search" size={15} /></span><input className="input-base" type="search" placeholder="Buscar por nome" value={draftSearch} onChange={event => setDraftSearch(event.target.value)} />{draftSearch && <ClearSearchButton onClear={() => setDraftSearch("")} />}</div></label>
          <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={loading || result?.error !== null}><Icon name="search" size={15} />Buscar</button>
        </form>
        {result?.error ? <ErrorState error={result.error} /> : <div className={styles.tableWrapper} aria-busy={loading}>
          <table className={`table-base ${styles.table}`}>
            <colgroup><col /><col className={styles.periodColumn} /><col className={styles.dateColumn} /><col className={styles.dateColumn} /><col className={styles.actionsColumn} /></colgroup>
            <thead><tr><th scope="col">Obra</th><th scope="col">Renovação (dias)</th><th scope="col">Cadastrada em</th><th scope="col">Atualizada em</th><th scope="col">Ações</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => <tr key={index} aria-hidden="true"><td><div style={{ lineHeight: "20px" }}><Skeleton width="85%" height={14} /></div><div style={{ lineHeight: "16px" }}><Skeleton width={50} height={12} /></div></td><td><Skeleton width={70} height={18} /></td><td><Skeleton width={80} height={14} /></td><td><Skeleton width={80} height={14} /></td><td><TableActionsSkeleton count={3} /></td></tr>) : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(workSite => <tr key={workSite.id}>
                <td><div className={styles.truncate} title={workSite.name}>{workSite.name}</div></td>
                <td>{workSite.renewalPeriodDays} dia(s)</td><td>{formatWorkSiteDate(workSite.createdAt)}</td><td>{formatWorkSiteDate(workSite.updatedAt)}</td>
                <td><div className={styles.actions}>
                  <TableActions label={`Ações de ${workSite.name}`} actions={[
                    { label: "Ver detalhes", icon: "eye", onClick: () => setSelectedWorkSiteId(workSite.id) },
                    { label: "Editar obra", icon: "edit", onClick: () => setForm({ workSite }) },
                    { label: "Excluir obra", icon: "trash", danger: true, onClick: () => setDeleting(workSite) },
                  ]} />
                </div></td>
              </tr>)}
              {!loading && !filtered.length && <tr><td colSpan={5} className={styles.empty}>Nenhuma obra encontrada.</td></tr>}
            </tbody>
          </table>
        </div>}
        <TablePagination totalCount={filtered.length} currentPage={currentPage} totalPages={totalPages} itemLabel="obra(s)" ariaLabel="Páginas de obras" loading={loading} loadingText="Carregando obras..." onPageChange={setPage} />
      </div>
    </PageWrapper>
    {form && <WorkSiteFormModal workSite={form.workSite} onClose={() => setForm(null)} onSaved={handleSaved} />}
    {deleting && <DeleteWorkSiteModal workSite={deleting} onClose={() => setDeleting(null)} onDeleted={handleDeleted} />}
    {detailId != null && <WorkSiteDetailModal key={detailId} workSiteId={detailId} onClose={closeDetails} />}
    {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
  </>;
}
