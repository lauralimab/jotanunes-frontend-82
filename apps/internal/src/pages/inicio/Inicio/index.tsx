import Header from "../../../shared/components/Header";

import PageWrapper from "../../../shared/components/PageWrapper";
import type { Screen } from "../../../shared/types/portal";
import EstatisticasCards from "./components/EstatisticasCards";
import DocumentosRecentesCard from "./components/DocumentosRecentesCard";
import SolicitacoesPendentesCard from "./components/SolicitacoesPendentesCard";
import StatusFornecedoresCard from "./components/StatusFornecedoresCard";
import useDashboardData from "./useDashboardData";

import styles from "./dashboard.module.css";

export default function InicioPage({ onNav, onSelectCompany, onAnalyzeDocument }: { onNav: (s: Screen) => void; onSelectCompany: (companyId: number) => void; onAnalyzeDocument: (documentId: number) => void }) {
  const data = useDashboardData();
  return <>
    <Header title="Dashboard Administrativo" subtitle="Pendências e prioridades da operação" />
    <PageWrapper className={styles.page}>
      <div className={styles.dashboard}>
        <EstatisticasCards data={data} />
        <div className={styles.operationalGrid}>
          <DocumentosRecentesCard onNav={onNav} onAnalyzeDocument={onAnalyzeDocument} documents={data.documents} loading={data.loadingDocuments} error={data.documentsError} />
          <SolicitacoesPendentesCard requests={data.pendingRequests} loading={data.loadingRequests} error={data.requestsError} onSelectSupplier={onSelectCompany} />
        </div>
        <StatusFornecedoresCard />
      </div>
    </PageWrapper>
  </>;
}
