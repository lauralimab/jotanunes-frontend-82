import Icon from "../../../../shared/components/Icon";
import { dashboardMocks } from "../dashboardMocks";
import styles from "../dashboard.module.css";

export default function EstatisticasCards() {
  const stats = [
    { label: "Docs. em análise", value: dashboardMocks.documentsAwaitingReview, icon: "clock", color: "#a16207", bg: "#fef9c3" },
    { label: "Docs. reprovados", value: dashboardMocks.rejectedDocuments, icon: "file", color: "#c01a2b", bg: "#fde8ea" },
    { label: "Solic. pendentes", value: dashboardMocks.requestsWithPending, icon: "alert", color: "#c2410c", bg: "#ffedd5" },
    { label: "Solic. em andamento", value: dashboardMocks.requestsInProgress, icon: "list", color: "#2563eb", bg: "#dbeafe" },
  ];
  return <div className={styles.metrics} aria-label="Indicadores do dashboard">
    {stats.map(stat => <div key={stat.label} className="stat-card">
      <div className={styles.metricContent}>
        <div><div className="label">{stat.label}</div><div className="value" style={{ color: stat.color, marginTop: 8 }}>{stat.value.toLocaleString("pt-BR")}</div></div>
        <span className={styles.metricIcon} style={{ background: stat.bg, color: stat.color }} aria-hidden="true"><Icon name={stat.icon} size={20} /></span>
      </div>
    </div>)}
  </div>;
}
