import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import DocumentoEnviadoSucesso from "./components/DocumentoEnviadoSucesso";

import DocumentoUploadArea, {
  type SelectedFile,
} from "./components/DocumentoUploadArea";

import InformacoesDocumentoForm from "./components/InformacoesDocumentoForm";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const [file, setFile] =
    useState<SelectedFile | null>(null);

  const [sent, setSent] =
    useState(false);

  function handleSendAnother() {
    setSent(false);
    setFile(null);
  }

  return (
    <>
      <Header
        title="Enviar Documento"
        subtitle="RF04/RF05 — Envio de documentação da empresa e dos funcionários"
      />

      <PageWrapper>
        <div style={{ maxWidth: 700 }}>
          {sent ? (
            <DocumentoEnviadoSucesso
              onSendAnother={
                handleSendAnother
              }
            />
          ) : (
            <div className="card">
              <InformacoesDocumentoForm />

              <DocumentoUploadArea
                file={file}
                onFileChange={setFile}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginTop: 20,
                  gap: 10,
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={onCancel}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    file &&
                    setSent(true)
                  }
                  style={{
                    opacity: file
                      ? 1
                      : 0.5,
                  }}
                >
                  <Icon
                    name="upload"
                    size={15}
                  />

                  Enviar Documento
                </button>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}