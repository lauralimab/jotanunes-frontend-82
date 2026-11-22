import type { Screen } from "../../../../shared/types/portal";
import type { Document } from "../../../../shared/types/document";
import TableActions from "../../../../shared/components/TableActions";
import StatusBadge from "../../../../shared/components/StatusBadge";
import styles from "../dashboard.module.css";

function getStatus(value: string | null) {
  const status = value?.toLocaleLowerCase("pt-BR") ?? "";
  if (status.includes("approv") || status.includes("aprov")) return "approved";
  if (status.includes("reject") || status.includes("reprov")) return "rejected";
  if (status.includes("correct") || status.includes("corre")) return "correction";
  if (status.includes("expir") || status.includes("venc")) return "expired";
  return "pending";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export default function DocumentosRecentesCard({ onNav, onAnalyzeDocument, documents, loading, error }: {
  onNav: (screen: Screen) => void;
  onAnalyzeDocument: (documentId: number) => void;
  documents: Document[];
  loading: boolean;
  error: boolean;
}) {
  const queue = documents
    .filter(document => getStatus(document.statusDescription) === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return <section className={`card table-card ${styles.tableCard}`} aria-labelledby="analysis-queue-title" aria-busy={loading}>
    <div className={`${styles.heading} ${styles.tableHeading}`}>
      <div><h3 id="analysis-queue-title">Fila de análise</h3><p className={styles.description}>Documentos enviados que aguardam análise da equipe.</p></div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("document-analysis")}>Ver todos</button>
    </div>
    <div className={styles.tableScroll}>
      <table className={`table-base ${styles.queue}`} aria-label="Documentos aguardando análise">
        <thead><tr><th scope="col">Documento</th><th scope="col">Fornecedor / funcionário</th><th scope="col">Data de envio</th><th scope="col">Status</th><th scope="col">Ação</th></tr></thead>
        <tbody tabIndex={0} aria-label="Registros da fila de análise">
          {loading && <tr><td colSpan={5}>Carregando documentos…</td></tr>}
          {error && <tr><td colSpan={5}>Não foi possível carregar os documentos.</td></tr>}
          {!loading && !error && queue.map(document => {
            const name = document.documentTypeName || document.originalFileName || "Documento";
            const supplier = document.companyCorporateName || document.workerName || "—";
            return <tr key={document.id}>
              <td><div className={`table-primary ${styles.truncatedName}`} title={name}>{name}</div></td>
              <td><div className={styles.truncatedName} title={supplier}>{supplier}</div></td>
              <td>{formatDate(document.createdAt)}</td>
              <td><StatusBadge status={getStatus(document.statusDescription)} /></td>
              <td><TableActions actions={[{ label: "Analisar documento", ariaLabel: `Analisar ${name}`, icon: "eye", onClick: () => onAnalyzeDocument(document.id) }]} /></td>
            </tr>;
          })}
          {!loading && !error && queue.length === 0 && <tr><td colSpan={5} className={styles.emptyMessage}>Não há documentos aguardando análise.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>;
}
