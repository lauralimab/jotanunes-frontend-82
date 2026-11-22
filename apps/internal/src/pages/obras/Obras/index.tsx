import { useEffect, useState } from "react";
import { getWorkSites } from "../../../shared/api/worksite";
import type { WorkSite } from "../../../shared/types/worksite";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import Icon from "../../../shared/components/Icon";
import TablePagination from "../../../shared/components/TablePagination";
import ClearSearchButton from "../../../shared/components/ClearSearchButton";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import Toast from "../../../shared/components/Toast";
import WorkSiteFormModal from "../components/WorkSiteFormModal";
import DeleteWorkSiteModal from "../components/DeleteWorkSiteModal";
import WorkSiteCover from "../components/WorkSiteCover";
import { normalizeWorkSiteName } from "../formatters";
import styles from "../obras.module.css";

const PAGE_SIZE = 10;
type ListState = { items: WorkSite[] | null; error: unknown };

function WorkSiteCard({ workSite, onDetails }: { workSite: WorkSite; onDetails: () => void }) {
  return <article className={`card ${styles.workSiteCard}`} aria-label={workSite.name}>
    <button type="button" className={styles.cardLink} aria-label={`Ver detalhes de ${workSite.name}`} onClick={onDetails} />
    <WorkSiteCover />
    <div className={styles.cardContent}>
      <div className={styles.cardHeading}><span className={styles.cardIcon} aria-hidden="true"><Icon name="crane" size={19} /></span><div className={styles.cardName}><h3 title={workSite.name}>{workSite.name}</h3></div><span className={styles.cardArrow} aria-hidden="true"><Icon name="chevron-right" size={18} /></span></div>
    </div>
  </article>;
}

function WorkSiteCardSkeleton() {
  return <div className={`card ${styles.workSiteCard}`} aria-hidden="true"><div className={styles.coverSkeleton} /><div className={styles.cardContent}><div className={styles.cardHeading}><Skeleton width={36} height={36} borderRadius={9} /><div className={styles.cardName}><Skeleton width="90%" height={17} /></div><Skeleton width={18} height={18} /></div></div></div>;
}

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
      <div className={`card ${styles.catalog}`}>
        <form className={styles.filters} onSubmit={event => { event.preventDefault(); setSearch(draftSearch.trim()); setPage(1); }}>
          <label className={styles.search}><span>Buscar obra</span><div className={styles.searchInput}><span><Icon name="search" size={15} /></span><input className="input-base" type="search" placeholder="Buscar por nome" value={draftSearch} onChange={event => setDraftSearch(event.target.value)} />{draftSearch && <ClearSearchButton onClear={() => setDraftSearch("")} />}</div></label>
          <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={loading || result?.error !== null}><Icon name="search" size={15} />Buscar</button>
        </form>
        {result?.error ? <ErrorState error={result.error} /> : <div className={styles.catalogPanel} aria-busy={loading}>
          <div className={styles.catalogGrid}>
            {loading ? Array.from({ length: 6 }, (_, index) => <WorkSiteCardSkeleton key={index} />) : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(workSite => <WorkSiteCard key={workSite.id} workSite={workSite} onDetails={() => onSelectWorkSite(workSite.id)} />)}
          </div>
          {!loading && !filtered.length && <div className={styles.empty} role="status">Nenhuma obra encontrada.</div>}
        </div>}
        <TablePagination totalCount={filtered.length} currentPage={currentPage} totalPages={totalPages} itemLabel="obra(s)" ariaLabel="Páginas de obras" loading={loading} loadingText="Carregando obras..." onPageChange={setPage} />
      </div>
    </PageWrapper>
    {form && <WorkSiteFormModal workSite={form.workSite} onClose={() => setForm(null)} onSaved={handleSaved} />}
    {deleting && <DeleteWorkSiteModal workSite={deleting} onClose={() => setDeleting(null)} onDeleted={handleDeleted} />}
    {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
  </>;
}
