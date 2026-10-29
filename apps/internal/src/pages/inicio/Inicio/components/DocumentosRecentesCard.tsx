import type { Screen } from "../../../../shared/types/portal";
import TableActions from "../../../../shared/components/TableActions";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { dashboardMocks } from "../dashboardMocks";
import styles from "../dashboard.module.css";

export default function DocumentosRecentesCard({ onNav }: { onNav: (screen: Screen) => void }) {
  return <section className={`card table-card ${styles.tableCard}`} aria-labelledby="analysis-queue-title">
    <div className={`${styles.heading} ${styles.tableHeading}`}>
      <div><h3 id="analysis-queue-title">Fila de análise</h3><p className={styles.description}>Documentos enviados por fornecedores que aguardam análise da equipe.</p></div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNav("document-analysis")}>Ver todos</button>
    </div>
    <div className={styles.tableScroll}>
      <table className={`table-base ${styles.queue}`} aria-label="Documentos aguardando análise">
        <thead><tr><th scope="col">Documento</th><th scope="col">Fornecedor</th><th scope="col">Data de envio</th><th scope="col">Status</th><th scope="col">Ação</th></tr></thead>
        <tbody tabIndex={0} aria-label="Registros da fila de análise">{dashboardMocks.analysisQueue.map(document => <tr key={document.id}>
          <td><div className={`table-primary ${styles.truncatedName}`} title={document.document}>{document.document}</div></td>
          <td><div className={styles.truncatedName} title={document.supplier}>{document.supplier}</div></td><td>{document.sentAt}</td><td><StatusBadge status={document.status} /></td>
          <td><TableActions actions={[{ label: "Analisar documento", ariaLabel: `Analisar ${document.document}`, icon: "eye", onClick: () => onNav("document-analysis") }]} /></td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
