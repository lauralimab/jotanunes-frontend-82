import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

type Documento = {
  id: number;
  name: string;
  person: string;
  type: string;
  status: string;
  validity: string;
  uploadedAt: string;
};

type DocumentosPageProps = {
  documents: Documento[];
  onNav: (screen: "send-document") => void;
};

export default function DocumentosPage({
  documents,
  onNav,
}: DocumentosPageProps) {
  const [filter, setFilter] = useState("all");
  const [type, setType] = useState("all");

  const filtered = documents.filter((document) => {
    if (
      filter !== "all" &&
      document.status !== filter
    ) {
      return false;
    }

    if (
      type !== "all" &&
      document.type !== type
    ) {
      return false;
    }

    return true;
  });

  return (
    <>
      <Header
        title="Documentos"
        subtitle="RF04/RF05/RF06 — Consulta de situação das documentações"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => onNav("send-document")}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
            padding: "10px 16px",
            background: "#f8fafc",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11.5,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            Fluxo de status (RF06):
          </span>

          {[
            ["Aguardando Envio", "#6b7280"],
            ["→", "#9ca3af"],
            ["Aguardando Análise", "#ca8a04"],
            ["→", "#9ca3af"],
            ["Aprovado", "#16a34a"],
            ["/", "#9ca3af"],
            ["Reprovado", "#dc2626"],
            ["/", "#9ca3af"],
            ["Correção Solicitada", "#d97706"],
            ["→", "#9ca3af"],
            ["Vencido", "#dc2626"],
          ].map(([label, color], index) => (
            <span
              key={index}
              style={{
                fontSize: 11.5,
                color,
                fontWeight:
                  label === "→" || label === "/"
                    ? 400
                    : 600,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: 220,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              >
                <Icon
                  name="search"
                  size={15}
                />
              </span>

              <input
                className="input-base"
                placeholder="Buscar documento..."
                style={{
                  paddingLeft: 32,
                }}
              />
            </div>

            <select
              className="select-base"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option value="all">
                Todos os status
              </option>

              <option value="approved">
                Aprovado
              </option>

              <option value="pending">
                Aguardando Análise
              </option>

              <option value="waiting">
                Aguardando Envio
              </option>

              <option value="correction">
                Correção Solicitada
              </option>

              <option value="expired">
                Vencido
              </option>

              <option value="rejected">
                Reprovado
              </option>
            </select>

            <select
              className="select-base"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="all">
                Todos os tipos
              </option>

              <option value="company">
                Empresa
              </option>

              <option value="employee">
                Funcionário
              </option>
            </select>
          </div>

          <table className="table-base">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Referente a</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Validade</th>
                <th>Enviado em</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((document) => (
                <tr key={document.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Icon
                        name="doc"
                        size={16}
                        color="#6b7280"
                      />

                      <span
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {document.name}
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      color: "#374151",
                    }}
                  >
                    {document.person}
                  </td>

                  <td>
                    <span className="badge badge-blue">
                      {document.type === "company"
                        ? "Empresa"
                        : "Funcionário"}
                    </span>
                  </td>

                  <td>
                    <StatusBadge
                      status={document.status}
                    />
                  </td>

                  <td
                    style={{
                      color:
                        document.status === "expired"
                          ? "#dc2626"
                          : "#374151",

                      fontWeight:
                        document.status === "expired"
                          ? 600
                          : 400,
                    }}
                  >
                    {document.validity}
                  </td>

                  <td
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {document.uploadedAt}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                      }}
                    >
                      <button className="btn btn-ghost btn-sm">
                        <Icon
                          name="eye"
                          size={13}
                        />
                      </button>

                      {(document.status === "rejected" ||
                        document.status === "expired" ||
                        document.status ===
                          "correction") && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            onNav("send-document")
                          }
                        >
                          Corrigir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                color: "#6b7280",
              }}
            >
              {filtered.length} documento(s) — RNF05:
              apenas PDF, JPG, PNG aceitos (máx. 10 MB)
            </span>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}