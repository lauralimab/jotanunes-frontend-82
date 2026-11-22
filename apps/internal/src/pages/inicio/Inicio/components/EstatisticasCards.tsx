import Icon from "../../../../shared/components/Icon";
import type { DashboardData } from "../useDashboardData";
import styles from "../dashboard.module.css";

function getDocumentStatus(status: string | null) {
  const value = status?.toLocaleLowerCase("pt-BR") ?? "";
  if (value.includes("approv") || value.includes("aprov")) return "approved";
  if (value.includes("reject") || value.includes("reprov")) return "rejected";
  if (value.includes("correct") || value.includes("corre")) return "correction";
  if (value.includes("expir") || value.includes("venc")) return "expired";
  return "pending";
}

export default function EstatisticasCards({ data }: { data: DashboardData }) {
  const awaitingReview = data.documents.filter(document => getDocumentStatus(document.statusDescription) === "pending").length;
  const rejected = data.documents.filter(document => getDocumentStatus(document.statusDescription) === "rejected").length;
  const stats = [
    { label: "Docs. em análise", value: data.documentsError ? "—" : data.loadingDocuments ? "…" : awaitingReview, icon: "clock", color: "#a16207", bg: "#fef9c3" },
    { label: "Docs. reprovados", value: data.documentsError ? "—" : data.loadingDocuments ? "…" : rejected, icon: "file", color: "#c01a2b", bg: "#fde8ea" },
    { label: "Solic. pendentes", value: data.requestsError ? "—" : data.loadingRequests ? "…" : data.pendingRequests.length, icon: "alert", color: "#c2410c", bg: "#ffedd5" },
    { label: "Solic. abertas", value: data.requestsError ? "—" : data.loadingRequests ? "…" : data.openRequestsCount, icon: "list", color: "#2563eb", bg: "#dbeafe" },
  ];
  return <div className={styles.metrics} aria-label="Indicadores do dashboard">
    {stats.map(stat => <div key={stat.label} className="stat-card">
      <div className={styles.metricContent}>
        <div><div className="label">{stat.label}</div><div className="value" style={{ color: stat.color, marginTop: 8 }}>{typeof stat.value === "number" ? stat.value.toLocaleString("pt-BR") : stat.value}</div></div>
        <span className={styles.metricIcon} style={{ background: stat.bg, color: stat.color }} aria-hidden="true"><Icon name={stat.icon} size={20} /></span>
      </div>
    </div>)}
  </div>;
}
