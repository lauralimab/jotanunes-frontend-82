import { useEffect, useMemo, useState } from "react";
import { getDocumentsForCompany, getDocumentsForWorkSite } from "../../../shared/api/document";
import type { Document } from "../../../shared/types/document";
import Icon from "../../../shared/components/Icon";
import StatusBadge from "../../../shared/components/StatusBadge";
import styles from "./ContextDocumentsSection.module.css";

const PAGE_SIZE = 5;
const EMPTY_DOCUMENTS: Document[] = [];
type SortDirection = "asc" | "desc";
type SortKey = "document" | "supplier" | "status";

function documentName(document: Document) {
  return document.documentTypeName || document.originalFileName || "Documento";
}

function getStatus(value: string | null) {
  const status = value?.toLocaleLowerCase("pt-BR") ?? "";
  if (status.includes("approv") || status.includes("aprov")) return "approved";
  if (status.includes("reject") || status.includes("reprov")) return "rejected";
  if (status.includes("correct") || status.includes("corre")) return "correction";
  if (status.includes("expir") || status.includes("venc")) return "expired";
  if (status.includes("wait") || status.includes("envio")) return "waiting";
  return "pending";
}

type SharedProps = {
  initialSearch?: string;
  initialPage?: number;
  initialOrder?: SortDirection;
  initialSort?: SortKey;
  onAnalyze: (documentId: number, search: string, page: number, sort: SortKey, order: SortDirection) => void;
};

type Props = SharedProps & ({
  workSiteId: number;
  companyId?: never;
} | {
  companyId: number;
  workSiteId?: never;
});

export default function ContextDocumentsSection(props: Props) {
  const workSiteId = props.workSiteId;
  const companyId = props.companyId;
  const scopeId = workSiteId ?? companyId!;
  const supplierScope = companyId !== undefined;
  const scopeKey = `${supplierScope ? "supplier" : "worksite"}:${scopeId}`;
  const { initialSearch = "", initialPage = 1, initialOrder = "asc", initialSort = "document", onAnalyze } = props;
  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialOrder);
  const [sortKey, setSortKey] = useState<SortKey>(initialSort);
  // A API documenta OrderBy=3 como situação. Os códigos 1 e 2 são datas,
  // então Documento e Fornecedor continuam ordenados globalmente no frontend.
  const serverOrderBy = sortKey === "status" ? 3 as const : undefined;
  const serverOrderDirection = serverOrderBy === undefined
    ? undefined
    : sortDirection === "asc" ? 1 as const : 2 as const;
  const requestKey = serverOrderBy !== undefined
    ? `${scopeKey}:status:${sortDirection}`
    : `${scopeKey}:client-sort`;
  const [result, setResult] = useState<{ requestKey: string; documents?: Document[]; error?: unknown } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const serverOrder = serverOrderBy !== undefined && serverOrderDirection !== undefined
      ? { orderBy: serverOrderBy, orderDirection: serverOrderDirection }
      : undefined;
    const request = supplierScope
      ? getDocumentsForCompany(scopeId, controller.signal, serverOrder)
      : getDocumentsForWorkSite(scopeId, controller.signal, serverOrder);
    request
      .then(documents => { if (active) setResult({ requestKey, documents }); })
      .catch(error => { if (active) setResult({ requestKey, error }); });
    return () => { active = false; controller.abort(); };
  }, [scopeId, requestKey, serverOrderBy, serverOrderDirection, supplierScope]);

  const state = result?.requestKey === requestKey ? result : null;
  const loading = state === null;
  const documents = state?.documents ?? EMPTY_DOCUMENTS;
  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return documents;
    return documents.filter(document => [document.documentTypeName, document.companyCorporateName, document.originalFileName]
      .filter(Boolean).join(" ").toLocaleLowerCase("pt-BR").includes(term));
  }, [documents, search]);
  const sortedDocuments = useMemo(() => [...filteredDocuments].sort((a, b) => {
    const valueFor = (document: Document) => sortKey === "document"
      ? documentName(document)
      : sortKey === "supplier"
        ? document.companyCorporateName ?? ""
        : document.statusDescription ?? "";
    const valueOrder = valueFor(a).localeCompare(valueFor(b), "pt-BR", { sensitivity: "base" });
    if (valueOrder !== 0) return sortDirection === "asc" ? valueOrder : -valueOrder;
    return a.id - b.id;
  }), [filteredDocuments, sortKey, sortDirection]);

  function sortBy(key: SortKey) {
    if (sortKey === key) setSortDirection(direction => direction === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("asc"); }
  }

  function sortHeader(key: SortKey, label: string) {
    const active = sortKey === key;
    const nextDirection = active && sortDirection === "asc" ? "decrescente" : "crescente";
    const indicator = active ? sortDirection === "asc" ? "↑" : "↓" : null;
    return <th className={styles.sortableHeader} aria-sort={active ? sortDirection === "asc" ? "ascending" : "descending" : "none"}>
      <button type="button" className={styles.sortButton} aria-label={`Ordenar ${label.toLocaleLowerCase("pt-BR")} em ordem ${nextDirection}`} onClick={() => sortBy(key)}>{label}{indicator && <span aria-hidden="true">{indicator}</span>}</button>
    </th>;
  }
  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageDocuments = sortedDocuments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return <section className={`card ${styles.section}`} aria-labelledby={`context-documents-${scopeKey}`} aria-busy={loading}>
    <div className={styles.sectionHeading}>
      <div className={styles.headingCopy}>
        <h2 id={`context-documents-${scopeKey}`}>Análise de Documentos</h2>
        <p>{supplierScope ? "Consulte e analise os documentos enviados por este fornecedor." : "Consulte e analise os documentos relacionados a esta obra."}</p>
      </div>
      {!loading && !state?.error && <span className={styles.count}>{filteredDocuments.length} documento(s)</span>}
    </div>

    {state?.error ? <div className={styles.error} role="alert">{state.error instanceof Error ? state.error.message : "Não foi possível carregar os documentos desta obra."}</div> : <>
      <label className={styles.search} htmlFor={`context-document-search-${scopeKey}`}>Buscar documento ou fornecedor
        <span className={styles.searchControl}><Icon name="search" size={16} /><input id={`context-document-search-${scopeKey}`} className="input-base" type="search" placeholder="Buscar por documento ou fornecedor" value={search} onChange={event => { setSearch(event.target.value); setCurrentPage(1); }} /></span>
      </label>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead><tr>{sortHeader("document", "DOCUMENTO")}{sortHeader("supplier", "FORNECEDOR")}{sortHeader("status", "SITUAÇÃO")}<th>AÇÃO</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className={styles.message}>Carregando documentos...</td></tr>
              : pageDocuments.map(document => <tr key={document.id}>
                <td className={styles.truncatedCell} title={documentName(document)}>{documentName(document)}</td>
                <td className={styles.truncatedCell} title={document.companyCorporateName || "—"}>{document.companyCorporateName || "—"}</td>
                <td className={styles.statusCell} title={document.statusDescription || "Situação indisponível"}><StatusBadge status={getStatus(document.statusDescription)} /></td>
                <td><button type="button" className="btn btn-primary btn-sm" onClick={() => onAnalyze(document.id, search, safePage, sortKey, sortDirection)}><Icon name="eye" size={14} />Analisar</button></td>
              </tr>)}
            {!loading && !filteredDocuments.length && <tr><td colSpan={4} className={styles.message}>{documents.length === 0 ? supplierScope ? "Este fornecedor ainda não possui documentos." : "Esta obra ainda não possui documentos." : "Nenhum documento corresponde à pesquisa."}</td></tr>}
            {!loading && filteredDocuments.length > 0 && pageDocuments.length === 0 && <tr><td colSpan={4} className={styles.message}>Nenhum documento encontrado nesta página.</td></tr>}
          </tbody>
        </table>
      </div>

      {!loading && filteredDocuments.length > 0 && <div className={styles.pagination}>
        <span>{filteredDocuments.length} documento(s) encontrado(s) · Página {safePage} de {totalPages}</span>
        <div className={styles.paginationButtons}>
          <button type="button" aria-label="Página anterior" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}><Icon name="chevron-left" size={16} /></button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => <button key={page} type="button" aria-label={`Ir para página ${page}`} aria-current={safePage === page ? "page" : undefined} className={safePage === page ? styles.activePage : ""} onClick={() => setCurrentPage(page)}>{page}</button>)}
          <button type="button" aria-label="Próxima página" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)}><Icon name="chevron-right" size={16} /></button>
        </div>
      </div>}
    </>}
  </section>;
}
