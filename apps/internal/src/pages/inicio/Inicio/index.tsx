import Header from "../../../shared/components/Header";

import PageWrapper from "../../../shared/components/PageWrapper";
import type { Screen } from "../../../shared/types/portal";
import EstatisticasCards from "./components/EstatisticasCards";
import DocumentosRecentesCard from "./components/DocumentosRecentesCard";
import SolicitacoesPendentesCard from "./components/SolicitacoesPendentesCard";
import StatusFornecedoresCard from "./components/StatusFornecedoresCard";

import styles from "./dashboard.module.css";

export default function InicioPage({ onNav }: { onNav: (s: Screen) => void }) {
  return <>
    <Header title="Dashboard Administrativo" subtitle="Pendências e prioridades da operação" />
    <PageWrapper className={styles.page}>
      <div className={styles.dashboard}>
        <EstatisticasCards />
        <div className={styles.operationalGrid}>
          <DocumentosRecentesCard onNav={onNav} />
          <SolicitacoesPendentesCard />
        </div>
        <StatusFornecedoresCard />
      </div>
    </PageWrapper>
  </>;
}
