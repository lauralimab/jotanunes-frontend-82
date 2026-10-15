import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import DocumentoUploadArea, {
  type SelectedFile,
} from "./components/DocumentoUploadArea";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const [file, setFile] =
    useState<SelectedFile | null>(
      null,
    );

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
                Documento enviado com
                sucesso!
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
                — a equipe Jotanunes será
                notificada (RF15).
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
              <h3
                style={{
                  margin: "0 0 20px",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Informações do Documento
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Tipo de Documento *
                  </label>

                  <select
                    className="select-base"
                    style={{
                      width: "100%",
                    }}
                  >
                    <option>
                      Selecionar tipo...
                    </option>

                    <option>
                      Certidão Negativa
                      Federal
                    </option>

                    <option>
                      CNDT — Certidão de
                      Débitos Trabalhistas
                    </option>

                    <option>
                      Certidão Negativa FGTS
                    </option>

                    <option>
                      Certidão Estadual
                    </option>

                    <option>
                      Certidão Municipal
                    </option>

                    <option>
                      Contrato Social
                    </option>

                    <option>
                      ASO — Atestado de
                      Saúde Ocupacional
                    </option>

                    <option>
                      NR-35 — Trabalho em
                      Altura
                    </option>

                    <option>
                      Insalubridade /
                      Periculosidade
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Referente a *
                  </label>

                  <select
                    className="select-base"
                    style={{
                      width: "100%",
                    }}
                  >
                    <option>
                      Empresa
                    </option>

                    <option>
                      Carlos Souza
                    </option>

                    <option>
                      Ana Lima
                    </option>

                    <option>
                      João Ferreira
                    </option>

                    <option>
                      Marcia Ramos
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Data de Emissão
                  </label>

                  <input
                    className="input-base"
                    type="date"
                    defaultValue="2026-09-01"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Data de Validade
                    (RF11)
                  </label>

                  <input
                    className="input-base"
                    type="date"
                    defaultValue="2026-12-31"
                  />
                </div>

                <div
                  style={{
                    gridColumn:
                      "span 2",
                  }}
                >
                  <label
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Observações
                  </label>

                  <textarea
                    className="input-base"
                    rows={2}
                    placeholder="Informações adicionais..."
                    style={{
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <DocumentoUploadArea
                file={file}
                onFileChange={
                  setFile
                }
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