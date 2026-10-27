import { useAuth } from "../../../app/providers";

import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";

import DocumentosRecentesCard, {
  type DashboardDocument,
} from "./components/DocumentosRecentesCard";

import EstatisticasCards from "./components/EstatisticasCards";
import ProgressoDocumentalCard from "./components/ProgressoDocumentalCard";
import StatusGeralCard from "./components/StatusGeralCard";

type InicioNavigation =
  | "documents"
  | "send-document"
  | "pendencies";

type InicioPageProps = {
  onNav: (screen: InicioNavigation) => void;
  documents: DashboardDocument[];
};

export default function InicioPage({
  onNav,
  documents,
}: InicioPageProps) {
  const { auth } = useAuth();

  const companyName =
    auth?.user.companyCorporateName;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={
          companyName
            ? `Visão geral da sua documentação — ${companyName}`
            : "Visão geral da sua documentação"
        }
      />

      <PageWrapper>
        <StatusGeralCard
          onSendDocument={() =>
            onNav("send-document")
          }
          onViewPendencies={() =>
            onNav("pendencies")
          }
        />

        <EstatisticasCards />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          <DocumentosRecentesCard
            documents={documents}
            onViewAll={() =>
              onNav("documents")
            }
          />

          <ProgressoDocumentalCard
            onCorrectDocument={() =>
              onNav("send-document")
            }
          />
        </div>
      </PageWrapper>
    </>
  );
}