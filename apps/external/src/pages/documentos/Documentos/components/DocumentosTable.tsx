
import { useMemo, useState } from "react";

import { useAuth } from "../../../../app/providers";

import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

import DocumentoArquivoAcoes from "./DocumentoArquivoAcoes";

import type {
  Document as SupplierDocument,
  DocumentStatus,
} from "../../../../shared/types/documents";

type DocumentosTableProps = {
  documents: SupplierDocument[];
  totalCount: number;
};

type StatusFilter = "all" | "1" | "2" | "3";

type TypeFilter = "all" | "company" | "worker";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getStatusKey(status: DocumentStatus) {
  if (status === 1) {
    return "pending";
  }

  if (status === 2) {
    return "approved";
  }

  return "rejected";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const dateOnly = value.slice(0, 10);
  const parts = dateOnly.split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

export default function DocumentosTable({
  documents,
  totalCount,
}: DocumentosTableProps) {
  // O hook precisa ficar dentro do componente.
  const { auth } = useAuth();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const filtered = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return documents.filter((document) => {
      const matchesSearch =
        normalizedSearch === "" ||
        normalizeText(
          document.documentTypeName,
        ).includes(normalizedSearch) ||
        normalizeText(
          document.originalFileName,
        ).includes(normalizedSearch) ||
        normalizeText(
          document.workerName ?? "",
        ).includes(normalizedSearch) ||
        normalizeText(
          document.companyCorporateName,
        ).includes(normalizedSearch) ||
        normalizeText(
          document.workSiteName ?? "",
        ).includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        document.status === Number(statusFilter);

      const isWorkerDocument =
        document.workerId !== null;

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "worker" &&
          isWorkerDocument) ||
        (typeFilter === "company" &&
          !isWorkerDocument);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    documents,
    search,
    statusFilter,
    typeFilter,
  ]);

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* FILTROS */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom:
            "1px solid rgba(15,23,42,0.06)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {/* BUSCA */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 220,
            maxWidth: 340,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              pointerEvents: "none",
            }}
          >
            <Icon name="search" size={15} />
          </span>

          <input
            className="input-base"
            placeholder="Buscar documento..."
            aria-label="Buscar documento"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              paddingLeft: 32,
            }}
          />
        </div>

        {/* FILTRO DE STATUS */}
        <select
          className="select-base"
          aria-label="Filtrar por status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as StatusFilter,
            )
          }
        >
          <option value="all">
            Todos os status
          </option>

          <option value="1">
            Aguardando Análise
          </option>

          <option value="2">
            Aprovado
          </option>

          <option value="3">
            Reprovado
          </option>
        </select>

        {/* FILTRO DE TIPO */}
        <select
          className="select-base"
          aria-label="Filtrar por tipo"
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(
              event.target.value as TypeFilter,
            )
          }
        >
          <option value="all">
            Todos os tipos
          </option>

          <option value="company">
            Empresa
          </option>

          <option value="worker">
            Funcionário
          </option>
        </select>
      </div>

      {/* TABELA */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          className="table-base"
          style={{
            minWidth: 950,
          }}
        >
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
            {filtered.length > 0 ? (
              filtered.map((document) => (
                <tr key={document.id}>
                  {/* DOCUMENTO */}
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

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {document.documentTypeName}
                        </div>

                        <div
                          style={{
                            marginTop: 2,
                            color: "#94a3b8",
                            fontSize: 11.5,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {document.originalFileName}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* REFERENTE A */}
                  <td
                    style={{
                      color: "#374151",
                    }}
                  >
                    {document.workerName ??
                      document.companyCorporateName}
                  </td>

                  {/* TIPO */}
                  <td>
                    <span className="badge badge-blue">
                      {document.workerId !== null
                        ? "Funcionário"
                        : "Empresa"}
                    </span>
                  </td>

                  {/* STATUS E MOTIVO */}
                  <td>
                    <StatusBadge
                      status={getStatusKey(
                        document.status,
                      )}
                    />

                    {document.status === 3 &&
                      document.rejectionReason && (
                        <div
                          style={{
                            marginTop: 6,
                            maxWidth: 240,
                            color: "#b91c1c",
                            fontSize: 11.5,
                            lineHeight: 1.4,
                            overflowWrap: "anywhere",
                          }}
                        >
                          <strong>Motivo:</strong>{" "}
                          {document.rejectionReason}
                        </div>
                      )}
                  </td>

                  {/* VALIDADE */}
                  <td
                    style={{
                      color: "#374151",
                    }}
                  >
                    {formatDate(
                      document.expirationDate,
                    )}
                  </td>

                  {/* DATA DE ENVIO */}
                  <td
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    {formatDate(
                      document.createdAt,
                    )}
                  </td>

                  {/* VISUALIZAR E BAIXAR */}
                  <td>
                    <DocumentoArquivoAcoes
                      documento={document}
                      accessToken={
                        auth?.accessToken
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "36px 20px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  Nenhum documento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ */}
      <div
        style={{
          padding: "14px 20px",
          borderTop:
            "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <span
          style={{
            fontSize: 12.5,
            color: "#6b7280",
          }}
        >
          {filtered.length}
          {" documento(s) exibido(s)"}

          {totalCount > documents.length && (
            <>
              {" de "}
              {totalCount}
              {" no total"}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
