import {
  useRef,
  useState,
  type DragEvent,
} from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const [file, setFile] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setDragging(false);

    const selectedFile =
      event.dataTransfer.files[0];

    if (!selectedFile) {
      return;
    }

    const kb = selectedFile.size / 1024;

    if (kb > 10240) {
      alert("Arquivo excede 10 MB (RNF05)");
      return;
    }

    setFile({
      name: selectedFile.name,
      size: `${kb.toFixed(0)} KB`,
    });
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
                    style={{ width: "100%" }}
                  >
                    <option>
                      Selecionar tipo...
                    </option>
                    <option>
                      Certidão Negativa Federal
                    </option>
                    <option>
                      CNDT — Certidão de Débitos
                      Trabalhistas
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
                      ASO — Atestado de Saúde
                      Ocupacional
                    </option>
                    <option>
                      NR-35 — Trabalho em Altura
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
                    style={{ width: "100%" }}
                  >
                    <option>Empresa</option>
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
                    Data de Validade (RF11)
                  </label>

                  <input
                    className="input-base"
                    type="date"
                    defaultValue="2026-12-31"
                  />
                </div>

                <div
                  style={{
                    gridColumn: "span 2",
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

              <div
                className={`drag-zone${
                  dragging ? " active" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() =>
                  setDragging(false)
                }
                onDrop={handleDrop}
                onClick={() =>
                  inputRef.current?.click()
                }
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{
                    display: "none",
                  }}
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0];

                    if (!selectedFile) {
                      return;
                    }

                    if (
                      selectedFile.size >
                      10485760
                    ) {
                      alert(
                        "Arquivo excede 10 MB (RNF05)",
                      );

                      return;
                    }

                    setFile({
                      name: selectedFile.name,
                      size: `${(
                        selectedFile.size /
                        1024
                      ).toFixed(0)} KB`,
                    });
                  }}
                />

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fde8ea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Icon
                    name="upload"
                    size={24}
                    color="#c01a2b"
                  />
                </div>

                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Arraste o arquivo aqui ou clique
                  para selecionar
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  RNF05 — Formatos aceitos: PDF,
                  JPG, PNG — máximo 10 MB por
                  arquivo
                </p>
              </div>

              {file && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "12px 16px",
                    background: "#fef2f2",
                    border:
                      "1px solid #fecaca",
                    borderRadius: 8,
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Icon
                      name="doc"
                      size={18}
                      color="#c01a2b"
                    />

                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                        }}
                      >
                        {file.name}
                      </div>

                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#6b7280",
                        }}
                      >
                        {file.size}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      setFile(null)
                    }
                  >
                    <Icon
                      name="x"
                      size={14}
                    />
                  </button>
                </div>
              )}

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