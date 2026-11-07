import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

import {
  getActiveSupplyRequests,
} from "../../../shared/api/supplyRequests";

import {
  getComplianceChecklist,
} from "../../../shared/api/compliance";

import {
  CHECKLIST_ITEM_STATUS,
  type ChecklistItem,
  type ComplianceChecklist,
} from "../../../shared/types/compliance";

type PendenciasPageProps = {
  onNav: (
    screen: "send-document",
  ) => void;
};

type PendencyViewItem = {
  key: string;

  item: ChecklistItem;

  supplyRequestId: number;

  workSiteName:
  | string
  | null;

  workerName:
  | string
  | null;

  context: string;
};

function getBadgeStatus(
  status: number,
) {
  switch (status) {
    case CHECKLIST_ITEM_STATUS.notSent:
      return "waiting";

    case CHECKLIST_ITEM_STATUS.pending:
      return "pending";

    case CHECKLIST_ITEM_STATUS.rejected:
      return "rejected";

    case CHECKLIST_ITEM_STATUS.expired:
      return "expired";

    case CHECKLIST_ITEM_STATUS.approved:
      return "approved";

    default:
      return "waiting";
  }
}

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return null;
  }

  const parts =
    value.split("-");

  if (
    parts.length === 3
  ) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

function buildPendencies(
  checklists:
    ComplianceChecklist[],
): PendencyViewItem[] {
  const result:
    PendencyViewItem[] = [];

  const companyOnboardingSeen =
    new Set<number>();

  const workerOnboardingSeen =
    new Set<string>();

  for (
    const checklist
    of checklists
  ) {
    for (
      const item
      of checklist.onboardingItems
    ) {
      if (
        item.status ===
        CHECKLIST_ITEM_STATUS.approved
      ) {
        continue;
      }

      if (
        companyOnboardingSeen.has(
          item.documentTypeId,
        )
      ) {
        continue;
      }

      companyOnboardingSeen.add(
        item.documentTypeId,
      );

      result.push({
        key:
          `company-onboarding-${item.documentTypeId}`,

        item,

        supplyRequestId:
          checklist.supplyRequestId,

        workSiteName: null,

        workerName: null,

        context:
          "Cadastro / Habilitação da empresa",
      });
    }

    for (
      const item
      of checklist.recurringCompanyItems
    ) {
      if (
        item.status ===
        CHECKLIST_ITEM_STATUS.approved
      ) {
        continue;
      }

      result.push({
        key:
          `company-recurring-${checklist.supplyRequestId}-${item.documentTypeId}`,

        item,

        supplyRequestId:
          checklist.supplyRequestId,

        workSiteName:
          checklist.workSiteName,

        workerName: null,

        context:
          "Documento recorrente da empresa",
      });
    }

    for (
      const worker
      of checklist.workers
    ) {
      for (
        const item
        of worker.onboardingItems
      ) {
        if (
          item.status ===
          CHECKLIST_ITEM_STATUS.approved
        ) {
          continue;
        }

        const key =
          `${worker.workerId}-${item.documentTypeId}`;

        if (
          workerOnboardingSeen.has(
            key,
          )
        ) {
          continue;
        }

        workerOnboardingSeen.add(
          key,
        );

        result.push({
          key:
            `worker-onboarding-${key}`,

          item,

          supplyRequestId:
            checklist.supplyRequestId,

          workSiteName: null,

          workerName:
            worker.workerName,

          context:
            "Habilitação do trabalhador",
        });
      }

      for (
        const item
        of worker.items
      ) {
        if (
          item.status ===
          CHECKLIST_ITEM_STATUS.approved
        ) {
          continue;
        }

        result.push({
          key:
            `worker-recurring-${checklist.supplyRequestId}-${worker.workerId}-${item.documentTypeId}`,

          item,

          supplyRequestId:
            checklist.supplyRequestId,

          workSiteName:
            checklist.workSiteName,

          workerName:
            worker.workerName,

          context:
            "Documento recorrente do trabalhador",
        });
      }
    }
  }

  return result;
}

export default function PendenciasPage({
  onNav,
}: PendenciasPageProps) {
  const {
    auth,
  } = useAuth();

  const [
    checklists,
    setChecklists,
  ] =
    useState<
      ComplianceChecklist[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      return;
    }

    let cancelled =
      false;

    async function load(
      token: string,
    ) {
      try {
        setLoading(true);
        setError("");

        const requests =
          await getActiveSupplyRequests(
            token,
          );

        const results =
          await Promise.all(
            requests.map(
              (request) =>
                getComplianceChecklist(
                  token,
                  request.id,
                ),
            ),
          );

        if (cancelled) {
          return;
        }

        setChecklists(
          results,
        );
      } catch (
      loadError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar as pendências.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [
    auth?.accessToken,
  ]);

  const items =
    useMemo(
      () =>
        buildPendencies(
          checklists,
        ),
      [checklists],
    );

  const pendingCount =
    items.filter(
      ({ item }) =>
        item.status ===
        CHECKLIST_ITEM_STATUS.notSent,
    ).length;

  const analysisCount =
    items.filter(
      ({ item }) =>
        item.status ===
        CHECKLIST_ITEM_STATUS.pending,
    ).length;

  const problemCount =
    items.filter(
      ({ item }) =>
        item.status ===
        CHECKLIST_ITEM_STATUS.rejected ||
        item.status ===
        CHECKLIST_ITEM_STATUS.expired,
    ).length;

  return (
    <>
      <Header
        title="Pendências"
        subtitle="Documentos exigidos que ainda precisam de regularização"
      />

      <PageWrapper>
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 16,
              padding:
                "12px 16px",
              border:
                "1px solid #fecaca",
              borderRadius: 8,
              background:
                "#fef2f2",
              color:
                "#b91c1c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="card"
            style={{
              padding: 36,
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            Carregando pendências...
          </div>
        ) : (
          <>
            <div
              style={{
                marginBottom: 16,
                padding:
                  "12px 16px",
                background:
                  "#fff7ed",
                border:
                  "1px solid #fed7aa",
                borderRadius: 8,
                display: "flex",
                gap: 10,
                alignItems:
                  "center",
              }}
            >
              <Icon
                name="alert"
                size={18}
                color="#d97706"
              />

              <span
                style={{
                  fontSize: 13,
                  color:
                    "#92400e",
                }}
              >
                <strong>
                  {items.length}{" "}
                  {items.length === 1
                    ? "documento"
                    : "documentos"}
                </strong>{" "}
                precisam de
                acompanhamento.
                {" "}
                {pendingCount} aguardando
                envio,{" "}
                {analysisCount} em
                análise e{" "}
                {problemCount} rejeitado(s)
                ou vencido(s).
              </span>
            </div>

            {items.length ===
              0 ? (
              <div
                className="card"
                style={{
                  padding: 32,
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      "#15803d",
                  }}
                >
                  Nenhuma pendência
                  encontrada
                </div>

                <div
                  style={{
                    marginTop: 5,
                    fontSize: 12.5,
                    color:
                      "#6b7280",
                  }}
                >
                  Os documentos exigidos
                  nas solicitações ativas
                  estão regularizados.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: 12,
                }}
              >
                {items.map(
                  ({
                    key,
                    item,
                    workSiteName,
                    workerName,
                    context,
                  }) => {
                    const canUpload =
                      item.status !==
                      CHECKLIST_ITEM_STATUS.pending;

                    const expirationDate =
                      formatDate(
                        item.expirationDate,
                      );

                    return (
                      <div
                        key={key}
                        className="card"
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "flex-start",
                          gap: 16,
                          borderLeft:
                            item.status ===
                              CHECKLIST_ITEM_STATUS.rejected ||
                              item.status ===
                              CHECKLIST_ITEM_STATUS.expired
                              ? "3px solid #dc2626"
                              : "3px solid #d97706",
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius:
                              10,
                            background:
                              "#fff7ed",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            name="doc"
                            size={20}
                            color="#d97706"
                          />
                        </div>

                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 10,
                              flexWrap:
                                "wrap",
                              marginBottom:
                                4,
                            }}
                          >
                            <span
                              style={{
                                fontWeight:
                                  700,
                                fontSize:
                                  14,
                              }}
                            >
                              {
                                item.documentTypeName
                              }
                            </span>

                            <StatusBadge
                              status={getBadgeStatus(
                                item.status,
                              )}
                            />
                          </div>

                          <div
                            style={{
                              fontSize:
                                12.5,
                              color:
                                "#6b7280",
                            }}
                          >
                            {context}

                            {workerName &&
                              ` • ${workerName}`}

                            {workSiteName &&
                              ` • Obra: ${workSiteName}`}

                            {expirationDate &&
                              ` • Validade: ${expirationDate}`}
                          </div>

                          <div
                            style={{
                              marginTop:
                                3,
                              fontSize:
                                11,
                              color:
                                "#9ca3af",
                            }}
                          >
                            Código:{" "}
                            {
                              item.documentTypeCode
                            }
                          </div>

                          {item.rejectionReason && (
                            <div
                              style={{
                                marginTop:
                                  8,
                                padding:
                                  "8px 12px",
                                borderRadius:
                                  6,
                                background:
                                  "#fef2f2",
                                border:
                                  "1px solid #fecaca",
                                fontSize:
                                  12,
                                color:
                                  "#374151",
                              }}
                            >
                              <strong
                                style={{
                                  color:
                                    "#b91c1c",
                                }}
                              >
                                Motivo da
                                rejeição:{" "}
                              </strong>

                              {
                                item.rejectionReason
                              }
                            </div>
                          )}
                        </div>

                        {canUpload && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              onNav(
                                "send-document",
                              )
                            }
                          >
                            <Icon
                              name="upload"
                              size={13}
                            />

                            {item.status ===
                              CHECKLIST_ITEM_STATUS.notSent
                              ? "Enviar"
                              : "Reenviar"}
                          </button>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
}