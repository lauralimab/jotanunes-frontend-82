import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import DocumentosTable, {
  type Documento,
} from "./components/DocumentosTable";

import FluxoStatus from "./components/FluxoStatus";

type DocumentosPageProps = {
  documents: Documento[];
  onNav: (
    screen: "send-document",
  ) => void;
};

export default function DocumentosPage({
  documents,
  onNav,
}: DocumentosPageProps) {
  return (
    <>
      <Header
        title="Documentos"
        subtitle="RF04/RF05/RF06 — Consulta de situação das documentações"
        actions={
          <button
            className="btn btn-primary"
            onClick={() =>
              onNav(
                "send-document",
              )
            }
          >
            <Icon
              name="upload"
              size={15}
            />

            Enviar Documento
          </button>
        }
      />

      <PageWrapper>
        <FluxoStatus />

        <DocumentosTable
          documents={documents}
          onCorrect={() =>
            onNav(
              "send-document",
            )
          }
        />
      </PageWrapper>
    </>
  );
}