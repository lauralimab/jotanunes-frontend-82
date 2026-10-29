import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { getDocumentTypes } from "../../../shared/api/documentType";
import type { DocumentCategory, DocumentType } from "../../../shared/types/documentType";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import Icon from "../../../shared/components/Icon";
import Select from "../../../shared/components/Select";
import ClearSearchButton from "../../../shared/components/ClearSearchButton";

import TablePagination from "../../../shared/components/TablePagination";
import Skeleton from "../../../shared/components/Skeleton";
import ErrorState from "../../../shared/components/ErrorState";
import Toast from "../../../shared/components/Toast";
import DocumentTypeCard, { DocumentTypeCardSkeleton } from "./components/DocumentTypeCard";
import DocumentTypeFormModal from "./components/DocumentTypeFormModal";
import DocumentTypeDetailModal from "./components/DocumentTypeDetailModal";
import DeleteDocumentTypeModal from "./components/DeleteDocumentTypeModal";
import { documentCategories, documentSubjects, documentApplicabilities, normalizeSearch } from "./documentTypeOptions";
import styles from "./tiposDocumentos.module.css";

const PAGE_SIZE = 12;
const initialFilters = { search: "", subject: "all", appliesTo: "all" };
type Action = { type: "create" } | { type: "edit" | "delete"; item: DocumentType } | { type: "details"; id: number };

export default function TiposDocumentosPage() {
  const [result, setResult] = useState<{ items: DocumentType[]; error?: unknown } | null>(null);
  const [draft, setDraft] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [category, setCategory] = useState<DocumentCategory>(1);
  const [pages, setPages] = useState<Record<DocumentCategory, number>>({ 1: 1, 2: 1 });
  const [action, setAction] = useState<Action | null>(null);
  const [notification, setNotification] = useState<{ id: number; message: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getDocumentTypes(controller.signal).then(items => { if (!controller.signal.aborted) setResult({ items }); }).catch(error => { if (!controller.signal.aborted) setResult({ items: [], error }); });
    return () => controller.abort();
  }, []);
  const loading = result === null;
  const unavailable = loading || Boolean(result?.error);
  const filtered = (result?.items ?? []).filter(item =>
    item.active &&
    normalizeSearch(`${item.name} ${item.code}`).includes(normalizeSearch(filters.search)) &&
    (filters.subject === "all" || String(item.subject) === filters.subject) &&
    (filters.appliesTo === "all" || (filters.appliesTo === "3" ? item.appliesTo === 3 : (item.appliesTo & Number(filters.appliesTo)) !== 0)),
  );

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % documentCategories.length; break;
      case "ArrowLeft": next = (index - 1 + documentCategories.length) % documentCategories.length; break;
      case "Home": next = 0; break;
      case "End": next = documentCategories.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setCategory(Number(documentCategories[next].value) as DocumentCategory);
    tabRefs.current[next]?.focus();
  }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setFilters({ ...draft, search: draft.search.trim() }); setPages({ 1: 1, 2: 1 }); }
  function saved(item: DocumentType, message: string) {
    setResult(current => ({ items: [...(current?.items ?? []).filter(existing => existing.id !== item.id), item].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")) }));
    if (action?.type === "create") { setDraft(initialFilters); setFilters(initialFilters); setCategory(item.category); setPages({ 1: 1, 2: 1 }); }
    setAction(null); setNotification({ id: Date.now(), message });
  }
  return <>
    <Header title="Tipos de documentos" subtitle="Gerencie os documentos e suas regras de exigência" actions={<button type="button" className="btn btn-primary" disabled={unavailable} onClick={() => setAction({ type: "create" })}><Icon name="plus" size={15} />Novo tipo</button>} />
    <PageWrapper>
      <div className={styles.catalog}>
        <form className={`card ${styles.filters}`} onSubmit={search}>
          <label className={`${styles.filter} ${styles.search}`}><span>Buscar tipo de documento</span><div className={styles.searchInput}><span><Icon name="search" size={15} /></span><input className="input-base" type="search" placeholder="Buscar por nome ou código" value={draft.search} onChange={event => setDraft(current => ({ ...current, search: event.target.value }))} />{draft.search && <ClearSearchButton onClear={() => setDraft(current => ({ ...current, search: "" }))} />}</div></label>
          <div className={styles.filter}><span>Tipo de fornecedor</span><Select label="Filtrar por tipo de fornecedor" value={draft.appliesTo} options={[{ value: "all", label: "Todos" }, ...documentApplicabilities]} onChange={appliesTo => setDraft(current => ({ ...current, appliesTo }))} /></div>
          <div className={styles.filter}><span>Documento de</span><Select label="Filtrar por documento de" value={draft.subject} options={[{ value: "all", label: "Todos" }, ...documentSubjects]} onChange={subject => setDraft(current => ({ ...current, subject }))} /></div>
          <button type="submit" className={`btn btn-primary ${styles.searchButton}`} disabled={unavailable}><Icon name="search" size={15} />Buscar</button>
        </form>
        <div className={styles.tabList} role="tablist" aria-label="Categorias de documentos">
          {documentCategories.map((tab, index) => {
            const tabCategory = Number(tab.value) as DocumentCategory;
            return <button key={tab.value} ref={node => { tabRefs.current[index] = node; }} type="button" id={`${id}-tab-${tab.value}`} role="tab" aria-selected={category === tabCategory} aria-controls={`${id}-panel-${tab.value}`} tabIndex={category === tabCategory ? 0 : -1} className={styles.tab} onClick={() => setCategory(tabCategory)} onKeyDown={event => handleTabKey(event, index)}>
              <Icon name={tabCategory === 1 ? "doc" : "calendar"} size={18} /><span>{tab.label}</span>
              <span className={styles.tabCount}>{loading ? <Skeleton width={18} height={12} /> : result?.error ? "—" : filtered.filter(item => item.category === tabCategory).length.toLocaleString("pt-BR")}</span>
            </button>;
          })}
        </div>
        {documentCategories.map(tab => {
          const tabCategory = Number(tab.value) as DocumentCategory;
          const items = filtered.filter(item => item.category === tabCategory);
          const totalPages = Math.ceil(items.length / PAGE_SIZE);
          const currentPage = Math.min(pages[tabCategory], Math.max(1, totalPages));
          return <section key={tab.value} id={`${id}-panel-${tab.value}`} role="tabpanel" aria-labelledby={`${id}-tab-${tab.value}`} hidden={category !== tabCategory} tabIndex={0} className={styles.catalogPanel} aria-busy={loading}>
            {result?.error ? <ErrorState error={result.error} /> : <>
              <div className={styles.catalogGrid}>
                {loading ? Array.from({ length: 6 }, (_, index) => <DocumentTypeCardSkeleton key={index} />) : items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(item => <DocumentTypeCard key={item.id} item={item} onDetails={() => setAction({ type: "details", id: item.id })} />)}
              </div>
              {!loading && !items.length && <div className={`card ${styles.empty}`} role="status">Nenhum tipo de documento encontrado nesta categoria.</div>}
              <div className={styles.catalogPagination}><TablePagination totalCount={items.length} currentPage={currentPage} totalPages={totalPages} itemLabel="tipo(s) de documento" ariaLabel={`Páginas de ${tab.label.toLocaleLowerCase("pt-BR")}`} loading={loading} loadingText="Carregando tipos de documentos..." onPageChange={page => setPages(current => ({ ...current, [tabCategory]: page }))} /></div>
            </>}
          </section>;
        })}
      </div>
    </PageWrapper>
    {(action?.type === "create" || action?.type === "edit") && <DocumentTypeFormModal documentType={action.type === "edit" ? action.item : undefined} onClose={() => setAction(null)} onSaved={item => saved(item, action.type === "edit" ? "Tipo de documento atualizado com sucesso!" : "Tipo de documento cadastrado com sucesso!")} />}
    {action?.type === "details" && <DocumentTypeDetailModal key={action.id} documentTypeId={action.id} onClose={() => setAction(null)} onEdit={item => setAction({ type: "edit", item })} onDelete={item => setAction({ type: "delete", item })} />}
    {action?.type === "delete" && <DeleteDocumentTypeModal documentType={action.item} onClose={() => setAction(null)} onDeleted={item => saved(item, "Tipo de documento excluído com sucesso!")} />}
    {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
  </>;
}
