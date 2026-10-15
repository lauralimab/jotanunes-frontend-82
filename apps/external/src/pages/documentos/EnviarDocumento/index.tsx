import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

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

  return (
    <>
      <Header
        title="Enviar Documento"
        subtitle="RF04/RF05 — Envio de documentação da empresa e dos funcionários"
      />

      <PageWrapper>
        <div style={{ maxWidth: 700 }}>
          {sent ? (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: 48,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Icon
                  name="check"
                  size={32}
                  color="#16a34a"
                />
              </div>

              <h3
                style={{
                  fontFamily:
                    "'DM Sans', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Documento enviado com sucesso!
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: 8,
                }}
              >
                Status:{" "}
                <strong>
                  Aguardando Análise
                </strong>{" "}
                — a equipe Jotanunes será notificada
                (RF15).
              </p>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setSent(false);
                  setFile(null);
                }}
              >
                <Icon
                  name="plus"
                  size={15}
                />

                Enviar outro
              </button>
            </div>
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
                  justifyContent: "flex-end",
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
                    file && setSent(true)
                  }
                  style={{
                    opacity: file ? 1 : 0.5,
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