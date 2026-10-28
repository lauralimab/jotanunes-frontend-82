import { useEffect, useState } from "react";
import { getWorkSites } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import Icon from "../../../shared/components/Icon";
import ClearSearchButton from "../../../shared/components/ClearSearchButton";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import Toast from "../../../shared/components/Toast";
import WorkSiteFormModal from "../components/WorkSiteFormModal";
import DeleteWorkSiteModal from "../components/DeleteWorkSiteModal";
import { formatWorkSiteDate, normalizeWorkSiteName } from "../formatters";
import styles from "../obras.module.css";

const PAGE_SIZE = 10;
type ListState = { items: WorkSite[] | null; error: unknown };

export default function ObrasPage({ onSelectWorkSite }: { onSelectWorkSite: (id: number) => void }) {
  const [result, setResult] = useState<ListState | null>(null);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<{ workSite?: WorkSite } | null>(null);
  const [deleting, setDeleting] = useState<WorkSite | null>(null);
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
  const firstPageButton = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageButtons = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPageButton + index);
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
      <div className={`card ${styles.card}`}>
        <form className={styles.filters} onSubmit={event => { event.preventDefault(); setSearch(draftSearch.trim()); setPage(1); }}>
          <label className={styles.search}><span>Buscar obra</span><div className={styles.searchInput}><span><Icon name="search" size={15} /></span><input className="input-base" type="search" placeholder="Buscar por nome" value={draftSearch} onChange={event => setDraftSearch(event.target.value)} />{draftSearch && <ClearSearchButton onClear={() => setDraftSearch("")} />}</div></label>
          <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={loading || result?.error !== null}><Icon name="search" size={15} />Buscar</button>
        </form>
        {result?.error ? <ErrorState error={result.error} /> : <div className={styles.tableWrapper} aria-busy={loading}>
          <table className={`table-base ${styles.table}`}>
            <colgroup><col /><col className={styles.periodColumn} /><col className={styles.dateColumn} /><col className={styles.dateColumn} /><col className={styles.actionsColumn} /></colgroup>
            <thead><tr><th scope="col">Obra</th><th scope="col">Renovação (dias)</th><th scope="col">Cadastrada em</th><th scope="col">Atualizada em</th><th scope="col">Ações</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: PAGE_SIZE }, (_, index) => <tr key={index} aria-hidden="true"><td><div style={{ lineHeight: "20px" }}><Skeleton width="85%" height={14} /></div><div style={{ lineHeight: "16px" }}><Skeleton width={50} height={12} /></div></td><td><Skeleton width={70} height={18} /></td><td><Skeleton width={80} height={14} /></td><td><Skeleton width={80} height={14} /></td><td><div className={styles.actions}>{Array.from({ length: 3 }, (_, action) => <Skeleton key={action} width="2rem" height="2rem" borderRadius={9} />)}</div></td></tr>) : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(workSite => <tr key={workSite.id}>
                <td><div className={styles.truncate} title={workSite.name}>{workSite.name}</div></td>
                <td>{workSite.renewalPeriodDays} dia(s)</td><td>{formatWorkSiteDate(workSite.createdAt)}</td><td>{formatWorkSiteDate(workSite.updatedAt)}</td>
                <td><div className={styles.actions}>
                  <button type="button" className={`btn btn-icon ${styles.softAction}`} title="Ver detalhes" aria-label={`Ver detalhes de ${workSite.name}`} onClick={() => onSelectWorkSite(workSite.id)}><Icon name="eye" size={15} /></button>
                  <button type="button" className={`btn btn-icon ${styles.softAction}`} title="Editar obra" aria-label={`Editar ${workSite.name}`} onClick={() => setForm({ workSite })}><Icon name="edit" size={15} /></button>
                  <button type="button" className="btn btn-primary btn-icon" title="Excluir obra" aria-label={`Excluir ${workSite.name}`} onClick={() => setDeleting(workSite)}><Icon name="trash" size={15} /></button>
                </div></td>
              </tr>)}
              {!loading && !filtered.length && <tr><td colSpan={5} className={styles.empty}>Nenhuma obra encontrada.</td></tr>}
            </tbody>
          </table>
        </div>}
        <footer className={styles.pagination}><span aria-live="polite">{loading ? "Carregando obras..." : `${filtered.length} obra(s)${totalPages > 0 ? ` · Página ${currentPage} de ${totalPages}` : ""}`}</span><nav className={styles.actions} aria-label="Páginas de obras">
          <button type="button" className="btn btn-ghost btn-icon" aria-label="Página anterior" title="Página anterior" disabled={loading || currentPage <= 1} onClick={() => setPage(currentPage - 1)}><Icon name="chevron-left" size={16} /></button>
          {pageButtons.map(number => <button type="button" key={number} className={`btn btn-ghost btn-icon ${number === currentPage ? styles.currentPage : ""}`} aria-label={`Página ${number}`} aria-current={number === currentPage ? "page" : undefined} disabled={loading || number === currentPage} onClick={() => setPage(number)}>{number}</button>)}
          <button type="button" className="btn btn-ghost btn-icon" aria-label="Próxima página" title="Próxima página" disabled={loading || currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}><Icon name="chevron-right" size={16} /></button>
        </nav></footer>
      </div>
    </PageWrapper>
    {form && <WorkSiteFormModal workSite={form.workSite} onClose={() => setForm(null)} onSaved={handleSaved} />}
    {deleting && <DeleteWorkSiteModal workSite={deleting} onClose={() => setDeleting(null)} onDeleted={handleDeleted} />}
    {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
  </>;
}
