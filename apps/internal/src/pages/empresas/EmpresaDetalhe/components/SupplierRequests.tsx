import {
  useEffect,
  useState,
} from "react";

import {
  getSupplyRequests,
} from "../../../../shared/api/supplyRequest";

import type {
  SupplyRequest,
} from "../../../../shared/types/supplyRequest";

import Skeleton from "../../../../shared/components/Skeleton";

import SupplyRequestDocumentsModal
  from "./SupplyRequestDocumentsModal";

import CreateSupplyRequestModal
  from "./CreateSupplyRequestModal";

type Props = {
  companyId: number;
  supplierType: 1 | 2;
};

const PAGE_SIZE = 4;
const API_PAGE_SIZE = 100;

const statusStyles = {
  1: {
    label: "Aberta",
    background: "#fef9c3",
    color: "#a16207",
  },
  2: {
    label: "Em andamento",
    background: "#dbeafe",
    color: "#2563eb",
  },
  3: {
    label: "Concluída",
    background: "#dcfce7",
    color: "#15803d",
  },
  4: {
    label: "Cancelada",
    background: "#fee2e2",
    color: "#b91c1c",
  },
} as const;

function getPendingDocuments(
  request: SupplyRequest,
) {
  if (!request.pending) {
    return 0;
  }

  return (
    request.pending
      .missingOnboardingCount +
    request.pending
      .missingRecurringCompanyCount
  );
}

function getMissingWorkers(
  request: SupplyRequest,
) {
  if (
    !request.pending ||
    request.pending
      .requiredWorkerCount === null
  ) {
    return 0;
  }

  return Math.max(
    request.pending
      .requiredWorkerCount -
    request.pending
      .workersUpToDate,
    0,
  );
}

export default function SupplierRequests({
  companyId,
  supplierType,
}: Props) {
  const [requestResult, setRequestResult] = useState<{ key: string; requests: SupplyRequest[]; error?: string } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SupplyRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [version, setVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const requestKey = `${companyId}:${version}`;

  useEffect(() => {
    let active = true;
    async function loadRequests() {
      const firstPage = await getSupplyRequests({ companyId, pageNumber: 1, pageSize: API_PAGE_SIZE });
      const requests = [...firstPage.items];
      for (let pageNumber = 2; pageNumber <= firstPage.totalPages; pageNumber += 1) {
        const page = await getSupplyRequests({ companyId, pageNumber, pageSize: API_PAGE_SIZE });
        requests.push(...page.items);
      }
      return requests;
    }

    loadRequests()
      .then(requests => { if (active) setRequestResult({ key: requestKey, requests }); })
      .catch(cause => { if (active) setRequestResult({ key: requestKey, requests: [], error: cause instanceof Error ? cause.message : "N?o foi poss?vel carregar as solicita??es." }); });
    return () => { active = false; };
  }, [companyId, requestKey]);

  const currentRequestResult = requestResult?.key === requestKey ? requestResult : null;
  const requests = currentRequestResult?.requests ?? [];
  const sortedRequests = [...requests].sort((a, b) => b.id - a.id);
  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRequests = sortedRequests.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const error = currentRequestResult?.error ?? "";
  const loading = currentRequestResult === null;

  return (
    <section
      className="card"
      style={{
        marginTop: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Solicitações
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12.5,
              color: "#6b7280",
            }}
          >
            Solicitações de
            fornecimento vinculadas
            a este fornecedor.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {!loading &&
            !error && (
              <span
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                {requests.length}{" "}
                {requests.length === 1
                  ? "solicitação"
                  : "solicitações"}
              </span>
            )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() =>
              setShowCreateModal(
                true,
              )
            }
          >
            + Nova solicitação
          </button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {[1, 2].map(
            (item) => (
              <div
                key={item}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <Skeleton
                  width={170}
                  height={18}
                />

                <div
                  style={{
                    marginTop: 12,
                  }}
                >
                  <Skeleton
                    width={110}
                    height={13}
                  />
                </div>

                <div
                  style={{
                    marginTop: 18,
                  }}
                >
                  <Skeleton
                    width={200}
                    height={13}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      ) : error ? (
        <div
          role="alert"
          style={{
            border:
              "1px solid #fecaca",
            background:
              "#fff7f7",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#b91c1c",
              marginBottom: 10,
            }}
          >
            {error}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() =>
              setVersion(
                (current) =>
                  current + 1,
              )
            }
          >
            Tentar novamente
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div
          style={{
            padding: "28px 16px",
            textAlign: "center",
            border:
              "1px dashed #d1d5db",
            borderRadius: 10,
            color: "#6b7280",
            fontSize: 13,
          }}
        >
          Nenhuma solicitação de
          fornecimento encontrada
          para este fornecedor.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {pageRequests.map(
            (request) => {
              const status =
                statusStyles[
                request.status
                ];

              const pendingDocuments =
                getPendingDocuments(
                  request,
                );

              const missingWorkers =
                getMissingWorkers(
                  request,
                );

              return (
                <article
                  key={request.id}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 18,
                    background:
                      "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color:
                            "#9ca3af",
                          fontWeight: 600,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.04em",
                        }}
                      >
                        Solicitação #
                        {request.id}
                      </div>

                      <h4
                        style={{
                          margin:
                            "5px 0 0",
                          fontSize: 15,
                          fontWeight: 700,
                          color:
                            "#111827",
                        }}
                      >
                        {
                          request.workSiteName
                        }
                      </h4>
                    </div>

                    <span
                      style={{
                        padding:
                          "5px 9px",
                        borderRadius: 999,
                        background:
                          status.background,
                        color:
                          status.color,
                        fontSize: 11,
                        fontWeight: 700,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gap: 9,
                      fontSize: 12.5,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color:
                            "#9ca3af",
                        }}
                      >
                        Tipo de
                        fornecimento
                      </span>

                      <div
                        style={{
                          fontWeight: 600,
                          color:
                            "#374151",
                        }}
                      >
                        {request.supplierType === 1
                          ? "Material"
                          : request.supplierType === 2
                            ? "Mão de obra"
                            : request.supplierTypeDescription}
                      </div>
                    </div>

                    {pendingDocuments >
                      0 && (
                        <div
                          style={{
                            color:
                              "#b45309",
                            fontWeight: 600,
                          }}
                        >
                          {
                            pendingDocuments
                          }{" "}
                          documento(s)
                          pendente(s)
                        </div>
                      )}

                    {missingWorkers >
                      0 && (
                        <div
                          style={{
                            color:
                              "#b45309",
                            fontWeight: 600,
                          }}
                        >
                          {
                            missingWorkers
                          }{" "}
                          trabalhador(es)
                          ainda irregular(es)
                        </div>
                      )}

                    {!request.pending && (
                      <div
                        style={{
                          color:
                            "#15803d",
                          fontWeight: 600,
                        }}
                      >
                        Sem pendências no
                        momento
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: 16,
                        paddingTop: 14,
                        borderTop:
                          "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setSelectedRequest(
                            request,
                          )
                        }
                      >
                        Gerenciar solicitação
                      </button>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Página {safePage} de {totalPages}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button type="button" className="btn btn-secondary btn-sm" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                type="button"
                className={page === safePage ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                aria-current={page === safePage ? "page" : undefined}
                aria-label={`Ir para página ${page}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)}>
              Próxima
            </button>
          </div>
        </div>
      )}

      {selectedRequest && (
        <SupplyRequestDocumentsModal
          request={
            selectedRequest
          }
          onClose={() =>
            setSelectedRequest(
              null,
            )
          }
          onSaved={() =>
            setVersion(
              (current) =>
                current + 1,
            )
          }
        />
      )}

      {showCreateModal && (
        <CreateSupplyRequestModal
          mode="supplier"
          companyId={
            companyId
          }
          supplierType={
            supplierType
          }
          onClose={() =>
            setShowCreateModal(
              false,
            )
          }
          onCreated={() =>
            setVersion(
              (current) =>
                current + 1,
            )
          }
        />
      )}
    </section>
  );
}
