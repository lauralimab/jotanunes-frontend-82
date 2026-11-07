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

import PendencyHistoryModal
  from "./components/PendencyHistoryModal";

type PendenciasPageProps = {
  onNav: (
    screen: "send-document",
    searchParams?: URLSearchParams,
  ) => void;
};

type PendencyViewItem = {
  key: string;

  item: ChecklistItem;

  supplyRequestId: number;

  workSiteName:
    | string
    | null;

  workerId:
    | number
    | null;

  workerName:
    | string
    | null;

  category:
    | 1
    | 2;

  subject:
    | 1
    | 2;

  periodStart:
    | string
    | null;

  periodEnd:
    | string
    | null;

  context: string;
};

type WorkerOnboardingGroup = {
  workerId: number;
  workerName: string;

  items:
    PendencyViewItem[];

  total: number;
  approved: number;
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

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

function getProgress(
  approved: number,
  total: number,
) {
  if (total === 0) {
    return 100;
  }

  return Math.round(
    (
      approved /
      total
    ) * 100,
  );
}

function createCompanyOnboardingItem(
  checklist:
    ComplianceChecklist,
  item:
    ChecklistItem,
): PendencyViewItem {
  return {
    key:
      `company-onboarding-${item.documentTypeId}`,

    item,

    supplyRequestId:
      checklist.supplyRequestId,

    workSiteName: null,

    workerId: null,
    workerName: null,

    category: 1,
    subject: 1,

    periodStart: null,
    periodEnd: null,

    context:
      "Cadastro / Habilitação da empresa",
  };
}

function createWorkerOnboardingItem(
  checklist:
    ComplianceChecklist,
  workerId: number,
  workerName: string,
  item:
    ChecklistItem,
): PendencyViewItem {
  return {
    key:
      `worker-onboarding-${workerId}-${item.documentTypeId}`,

    item,

    supplyRequestId:
      checklist.supplyRequestId,

    workSiteName: null,

    workerId,
    workerName,

    category: 1,
    subject: 2,

    periodStart: null,
    periodEnd: null,

    context:
      "Habilitação do trabalhador",
  };
}

function createCompanyRecurringItem(
  checklist:
    ComplianceChecklist,
  item:
    ChecklistItem,
): PendencyViewItem {
  return {
    key:
      `company-recurring-${checklist.supplyRequestId}-${item.documentTypeId}`,

    item,

    supplyRequestId:
      checklist.supplyRequestId,

    workSiteName:
      checklist.workSiteName,

    workerId: null,
    workerName: null,

    category: 2,
    subject: 1,

    periodStart:
      checklist.periodStart,

    periodEnd:
      checklist.periodEnd,

    context:
      "Documento recorrente da empresa",
  };
}

function createWorkerRecurringItem(
  checklist:
    ComplianceChecklist,
  workerId: number,
  workerName: string,
  item:
    ChecklistItem,
): PendencyViewItem {
  return {
    key:
      `worker-recurring-${checklist.supplyRequestId}-${workerId}-${item.documentTypeId}`,

    item,

    supplyRequestId:
      checklist.supplyRequestId,

    workSiteName:
      checklist.workSiteName,

    workerId,
    workerName,

    category: 2,
    subject: 2,

    periodStart:
      checklist.periodStart,

    periodEnd:
      checklist.periodEnd,

    context:
      "Documento recorrente do trabalhador",
  };
}

function buildAllPendencies(
  checklists:
    ComplianceChecklist[],
) {
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
        CHECKLIST_ITEM_STATUS.approved ||
        companyOnboardingSeen.has(
          item.documentTypeId,
        )
      ) {
        continue;
      }

      companyOnboardingSeen.add(
        item.documentTypeId,
      );

      result.push(
        createCompanyOnboardingItem(
          checklist,
          item,
        ),
      );
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

      result.push(
        createCompanyRecurringItem(
          checklist,
          item,
        ),
      );
    }

    for (
      const worker
      of checklist.workers
    ) {
      for (
        const item
        of worker.onboardingItems
      ) {
        const key =
          `${worker.workerId}-${item.documentTypeId}`;

        if (
          item.status ===
            CHECKLIST_ITEM_STATUS.approved ||
          workerOnboardingSeen.has(
            key,
          )
        ) {
          continue;
        }

        workerOnboardingSeen.add(
          key,
        );

        result.push(
          createWorkerOnboardingItem(
            checklist,
            worker.workerId,
            worker.workerName,
            item,
          ),
        );
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

        result.push(
          createWorkerRecurringItem(
            checklist,
            worker.workerId,
            worker.workerName,
            item,
          ),
        );
      }
    }
  }

  return result;
}

type PendencyRowProps = {
  pending:
    PendencyViewItem;

  onUpload: (
    pending:
      PendencyViewItem,
  ) => void;

  onHistory: (
    pending:
      PendencyViewItem,
  ) => void;
};

function PendencyRow({
  pending,
  onUpload,
  onHistory,
}: PendencyRowProps) {
  const {
    item,
    workSiteName,
    workerName,
  } = pending;

  const canUpload =
    item.status !==
    CHECKLIST_ITEM_STATUS.pending;

  const expirationDate =
    formatDate(
      item.expirationDate,
    );

  const isProblem =
    item.status ===
      CHECKLIST_ITEM_STATUS.rejected ||
    item.status ===
      CHECKLIST_ITEM_STATUS.expired;

  const isAnalysis =
    item.status ===
    CHECKLIST_ITEM_STATUS.pending;

  return (
    <div
      style={{
        padding: 16,

        border:
          "1px solid rgba(15, 23, 42, 0.08)",

        borderRadius: 12,

        background:
          "rgba(255, 255, 255, 0.72)",

        display: "flex",

        alignItems:
          "flex-start",

        gap: 14,

        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,

          borderRadius: 10,

          flexShrink: 0,

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          background:
            isProblem
              ? "#fef2f2"
              : isAnalysis
                ? "#fffbeb"
                : "#f8fafc",

          color:
            isProblem
              ? "#dc2626"
              : isAnalysis
                ? "#d97706"
                : "#475569",
        }}
      >
        <Icon
          name="doc"
          size={19}
        />
      </div>

      <div
        style={{
          flex: 1,

          minWidth: 220,
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: 8,

            flexWrap:
              "wrap",
          }}
        >
          <span
            style={{
              fontSize: 13.5,

              fontWeight: 700,

              color: "#111827",
            }}
          >
            {
              item.documentTypeName
            }
          </span>

          <StatusBadge
            status={
              getBadgeStatus(
                item.status,
              )
            }
          />
        </div>

        <div
          style={{
            marginTop: 5,

            fontSize: 12,

            color: "#475569",
          }}
        >
          {workerName &&
            `Trabalhador: ${workerName}`}

          {workerName &&
            workSiteName &&
            " • "}

          {workSiteName &&
            `Obra: ${workSiteName}`}

          {(workerName ||
            workSiteName) &&
            expirationDate &&
            " • "}

          {expirationDate &&
            `Validade: ${expirationDate}`}
        </div>

        <div
          style={{
            marginTop: 4,

            fontSize: 10.5,

            color: "#475569",
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
              marginTop: 10,

              padding:
                "9px 11px",

              borderRadius: 8,

              border:
                "1px solid #fecaca",

              background:
                "#fef2f2",

              fontSize: 12,

              color: "#374151",
            }}
          >
            <strong
              style={{
                color:
                  "#b91c1c",
              }}
            >
              Motivo da
              reprovação:{" "}
            </strong>

            {
              item.rejectionReason
            }
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",

          gap: 8,

          flexWrap: "wrap",

          marginLeft: "auto",
        }}
      >
        <button
          type="button"

          className="btn btn-secondary btn-sm"

          onClick={() =>
            onHistory(
              pending,
            )
          }
        >
          <Icon
            name="history"
            size={13}
          />

          Histórico
        </button>

        {canUpload && (
          <button
            type="button"

            className="btn btn-primary btn-sm"

            onClick={() =>
              onUpload(
                pending,
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
    </div>
  );
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

  const [
    historyItem,
    setHistoryItem,
  ] =
    useState<
      PendencyViewItem | null
    >(null);

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
              (
                request,
              ) =>
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

  const allPendencies =
    useMemo(
      () =>
        buildAllPendencies(
          checklists,
        ),
      [checklists],
    );

  const awaitingCount =
    allPendencies.filter(
      ({
        item,
      }) =>
        item.status ===
        CHECKLIST_ITEM_STATUS.notSent,
    ).length;

  const analysisCount =
    allPendencies.filter(
      ({
        item,
      }) =>
        item.status ===
        CHECKLIST_ITEM_STATUS.pending,
    ).length;

  const problemCount =
    allPendencies.filter(
      ({
        item,
      }) =>
        item.status ===
          CHECKLIST_ITEM_STATUS.rejected ||
        item.status ===
          CHECKLIST_ITEM_STATUS.expired,
    ).length;

  const onboardingData =
    useMemo(() => {
      const companyMap =
        new Map<
          number,
          {
            checklist:
              ComplianceChecklist;

            item:
              ChecklistItem;
          }
        >();

      const workerMaps =
        new Map<
          number,
          {
            workerName:
              string;

            checklist:
              ComplianceChecklist;

            items:
              Map<
                number,
                ChecklistItem
              >;
          }
        >();

      for (
        const checklist
        of checklists
      ) {
        for (
          const item
          of checklist.onboardingItems
        ) {
          if (
            !companyMap.has(
              item.documentTypeId,
            )
          ) {
            companyMap.set(
              item.documentTypeId,
              {
                checklist,
                item,
              },
            );
          }
        }

        for (
          const worker
          of checklist.workers
        ) {
          let group =
            workerMaps.get(
              worker.workerId,
            );

          if (!group) {
            group = {
              workerName:
                worker.workerName,

              checklist,

              items:
                new Map(),
            };

            workerMaps.set(
              worker.workerId,
              group,
            );
          }

          for (
            const item
            of worker.onboardingItems
          ) {
            if (
              !group.items.has(
                item.documentTypeId,
              )
            ) {
              group.items.set(
                item.documentTypeId,
                item,
              );
            }
          }
        }
      }

      const companyAll =
        Array.from(
          companyMap.values(),
        );

      const companyPending =
        companyAll
          .filter(
            ({
              item,
            }) =>
              item.status !==
              CHECKLIST_ITEM_STATUS.approved,
          )
          .map(
            ({
              checklist,
              item,
            }) =>
              createCompanyOnboardingItem(
                checklist,
                item,
              ),
          );

      const workerGroups:
        WorkerOnboardingGroup[] =
        Array.from(
          workerMaps.entries(),
        ).map(
          ([
            workerId,
            group,
          ]) => {
            const allItems =
              Array.from(
                group.items.values(),
              );

            const pending =
              allItems
                .filter(
                  (
                    item,
                  ) =>
                    item.status !==
                    CHECKLIST_ITEM_STATUS.approved,
                )
                .map(
                  (
                    item,
                  ) =>
                    createWorkerOnboardingItem(
                      group.checklist,
                      workerId,
                      group.workerName,
                      item,
                    ),
                );

            return {
              workerId,

              workerName:
                group.workerName,

              items:
                pending,

              total:
                allItems.length,

              approved:
                allItems.filter(
                  (
                    item,
                  ) =>
                    item.status ===
                    CHECKLIST_ITEM_STATUS.approved,
                ).length,
            };
          },
        );

      const companyApproved =
        companyAll.filter(
          ({
            item,
          }) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.approved,
        ).length;

      const workersTotal =
        workerGroups.reduce(
          (
            total,
            group,
          ) =>
            total +
            group.total,
          0,
        );

      const workersApproved =
        workerGroups.reduce(
          (
            total,
            group,
          ) =>
            total +
            group.approved,
          0,
        );

      return {
        companyPending,

        workerGroups,

        total:
          companyAll.length +
          workersTotal,

        approved:
          companyApproved +
          workersApproved,
      };
    }, [
      checklists,
    ]);

  function openUpload(
    pending:
      PendencyViewItem,
  ) {
    const params =
      new URLSearchParams();

    params.set(
      "source",
      "pendencies",
    );

    params.set(
      "documentTypeId",
      String(
        pending.item
          .documentTypeId,
      ),
    );

    if (
      pending.category ===
      2
    ) {
      params.set(
        "supplyRequestId",
        String(
          pending.supplyRequestId,
        ),
      );

      if (
        pending.periodStart
      ) {
        params.set(
          "periodStart",
          pending.periodStart,
        );
      }

      if (
        pending.periodEnd
      ) {
        params.set(
          "periodEnd",
          pending.periodEnd,
        );
      }

      if (
        pending.workSiteName
      ) {
        params.set(
          "workSiteName",
          pending.workSiteName,
        );
      }
    }

    if (
      pending.subject ===
        2 &&
      pending.workerId
    ) {
      params.set(
        "workerId",
        String(
          pending.workerId,
        ),
      );

      if (
        pending.workerName
      ) {
        params.set(
          "workerName",
          pending.workerName,
        );
      }
    }

    onNav(
      "send-document",
      params,
    );
  }

  const onboardingProgress =
    getProgress(
      onboardingData.approved,
      onboardingData.total,
    );

  return (
    <>
      <Header
        title="Pendências"
        subtitle="Acompanhe e regularize os documentos exigidos pela Jotanunes"
      />

      <PageWrapper>
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 18,

              padding:
                "12px 16px",

              border:
                "1px solid #fecaca",

              borderRadius: 10,

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
              padding: 40,

              textAlign:
                "center",

              color:
                "#475569",
            }}
          >
            Carregando pendências...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",

                gap: 14,

                marginBottom: 24,
              }}
            >
              <div className="stat-card">
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
                  }}
                >
                  <div className="label">
                    Aguardando envio
                  </div>

                  <div
                    style={{
                      width: 34,
                      height: 34,

                      borderRadius: 9,

                      background:
                        "#f1f5f9",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      color:
                        "#475569",
                    }}
                  >
                    <Icon
                      name="upload"
                      size={17}
                    />
                  </div>
                </div>

                <div className="value">
                  {awaitingCount}
                </div>

                <div className="sub">
                  Ainda não enviados
                </div>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
                  }}
                >
                  <div className="label">
                    Em análise
                  </div>

                  <div
                    style={{
                      width: 34,
                      height: 34,

                      borderRadius: 9,

                      background:
                        "#fffbeb",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      color:
                        "#d97706",
                    }}
                  >
                    <Icon
                      name="clock"
                      size={17}
                    />
                  </div>
                </div>

                <div className="value">
                  {analysisCount}
                </div>

                <div className="sub">
                  Aguardando avaliação
                </div>
              </div>

              <div className="stat-card">
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
                  }}
                >
                  <div className="label">
                    Rejeitados / vencidos
                  </div>

                  <div
                    style={{
                      width: 34,
                      height: 34,

                      borderRadius: 9,

                      background:
                        "#fef2f2",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      color:
                        "#dc2626",
                    }}
                  >
                    <Icon
                      name="alert"
                      size={17}
                    />
                  </div>
                </div>

                <div className="value">
                  {problemCount}
                </div>

                <div className="sub">
                  Precisam de correção
                </div>
              </div>
            </div>

            <section
              className="card"

              style={{
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "flex-start",

                  gap: 20,

                  flexWrap: "wrap",

                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",

                    gap: 12,

                    alignItems:
                      "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,

                      borderRadius: 11,

                      background:
                        "#fde8ea",

                      color:
                        "#c01a2b",

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
                      name="building"
                      size={20}
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,

                        fontSize: 16,

                        fontWeight: 700,
                      }}
                    >
                      Cadastro /
                      Habilitação
                    </h3>

                    <p
                      style={{
                        margin:
                          "4px 0 0",

                        fontSize: 12.5,

                        color:
                          "#475569",
                      }}
                    >
                      Documentos gerais
                      da empresa e dos
                      trabalhadores,
                      reutilizados entre
                      as obras.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 180,
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      marginBottom: 6,

                      fontSize: 11.5,

                      color:
                        "#475569",
                    }}
                  >
                    <span>
                      Progresso
                    </span>

                    <strong
                      style={{
                        color:
                          onboardingProgress ===
                          100
                            ? "#15803d"
                            : "#374151",
                      }}
                    >
                      {
                        onboardingProgress
                      }
                      %
                    </strong>
                  </div>

                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"

                      style={{
                        width:
                          `${onboardingProgress}%`,

                        background:
                          onboardingProgress ===
                          100
                            ? "#16a34a"
                            : "#c01a2b",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 12,

                    fontWeight: 700,

                    color:
                      "#475569",

                    marginBottom: 10,

                    textTransform:
                      "uppercase",

                    letterSpacing:
                      "0.04em",
                  }}
                >
                  Empresa
                </div>

                {onboardingData
                  .companyPending
                  .length ===
                0 ? (
                  <div
                    style={{
                      padding:
                        "13px 14px",

                      borderRadius: 9,

                      background:
                        "#f0fdf4",

                      color:
                        "#15803d",

                      fontSize: 12.5,

                      display:
                        "flex",

                      gap: 8,

                      alignItems:
                        "center",
                    }}
                  >
                    <Icon
                      name="check"
                      size={15}
                    />

                    Documentação de
                    habilitação da
                    empresa em dia.
                  </div>
                ) : (
                  <div
                    style={{
                      display:
                        "grid",

                      gap: 10,
                    }}
                  >
                    {onboardingData
                      .companyPending
                      .map(
                        (
                          pending,
                        ) => (
                          <PendencyRow
                            key={
                              pending.key
                            }

                            pending={
                              pending
                            }

                            onUpload={
                              openUpload
                            }

                            onHistory={
                              setHistoryItem
                            }
                          />
                        ),
                      )}
                  </div>
                )}
              </div>

              {onboardingData
                .workerGroups
                .length >
                0 && (
                <div>
                  <div
                    style={{
                      fontSize: 12,

                      fontWeight: 700,

                      color:
                        "#475569",

                      marginBottom: 10,

                      textTransform:
                        "uppercase",

                      letterSpacing:
                        "0.04em",
                    }}
                  >
                    Trabalhadores
                  </div>

                  <div
                    style={{
                      display:
                        "grid",

                      gap: 10,
                    }}
                  >
                    {onboardingData
                      .workerGroups
                      .map(
                        (
                          group,
                        ) => {
                          const progress =
                            getProgress(
                              group.approved,
                              group.total,
                            );

                          return (
                            <details
                              key={
                                group.workerId
                              }

                              style={{
                                border:
                                  "1px solid rgba(15, 23, 42, 0.08)",

                                borderRadius: 10,

                                background:
                                  "rgba(255,255,255,0.52)",
                              }}

                              open={
                                group
                                  .items
                                  .length >
                                0
                              }
                            >
                              <summary
                                style={{
                                  listStyle:
                                    "none",

                                  cursor:
                                    "pointer",

                                  padding:
                                    "13px 15px",

                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "space-between",

                                  gap: 12,

                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                <div
                                  style={{
                                    display:
                                      "flex",

                                    gap: 10,

                                    alignItems:
                                      "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 32,
                                      height: 32,

                                      borderRadius: 8,

                                      background:
                                        "#f1f5f9",

                                      display:
                                        "flex",

                                      alignItems:
                                        "center",

                                      justifyContent:
                                        "center",

                                      color:
                                        "#475569",
                                    }}
                                  >
                                    <Icon
                                      name="users"
                                      size={15}
                                    />
                                  </div>

                                  <div>
                                    <div
                                      style={{
                                        fontSize: 13,

                                        fontWeight: 700,
                                      }}
                                    >
                                      {
                                        group.workerName
                                      }
                                    </div>

                                    <div
                                      style={{
                                        marginTop: 2,

                                        fontSize: 11,

                                        color:
                                          "#475569",
                                      }}
                                    >
                                      {
                                        group.items.length
                                      }{" "}
                                      pendência(s)
                                      •{" "}
                                      {
                                        progress
                                      }
                                      % concluído
                                    </div>
                                  </div>
                                </div>

                                <span
                                  className={
                                    group.items.length ===
                                    0
                                      ? "badge badge-success"
                                      : "badge badge-warning"
                                  }
                                >
                                  {group.items.length ===
                                  0
                                    ? "Em dia"
                                    : `${group.items.length} pendente(s)`}
                                </span>
                              </summary>

                              {group.items.length >
                                0 && (
                                <div
                                  style={{
                                    padding:
                                      "0 14px 14px",

                                    display:
                                      "grid",

                                    gap: 9,
                                  }}
                                >
                                  {group.items.map(
                                    (
                                      pending,
                                    ) => (
                                      <PendencyRow
                                        key={
                                          pending.key
                                        }

                                        pending={
                                          pending
                                        }

                                        onUpload={
                                          openUpload
                                        }

                                        onHistory={
                                          setHistoryItem
                                        }
                                      />
                                    ),
                                  )}
                                </div>
                              )}
                            </details>
                          );
                        },
                      )}
                  </div>
                </div>
              )}
            </section>

            <div
              style={{
                display: "grid",

                gap: 18,
              }}
            >
              {checklists.map(
                (
                  checklist,
                ) => {
                  const companyPending =
                    checklist
                      .recurringCompanyItems
                      .filter(
                        (
                          item,
                        ) =>
                          item.status !==
                          CHECKLIST_ITEM_STATUS.approved,
                      )
                      .map(
                        (
                          item,
                        ) =>
                          createCompanyRecurringItem(
                            checklist,
                            item,
                          ),
                      );

                  const workers =
                    checklist.workers.map(
                      (
                        worker,
                      ) => {
                        const total =
                          worker.items.length;

                        const approved =
                          worker.items.filter(
                            (
                              item,
                            ) =>
                              item.status ===
                              CHECKLIST_ITEM_STATUS.approved,
                          ).length;

                        const pending =
                          worker.items
                            .filter(
                              (
                                item,
                              ) =>
                                item.status !==
                                CHECKLIST_ITEM_STATUS.approved,
                            )
                            .map(
                              (
                                item,
                              ) =>
                                createWorkerRecurringItem(
                                  checklist,
                                  worker.workerId,
                                  worker.workerName,
                                  item,
                                ),
                            );

                        return {
                          ...worker,

                          total,

                          approved,

                          pending,
                        };
                      },
                    );

                  const totalRecurring =
                    checklist
                      .recurringCompanyItems
                      .length +
                    workers.reduce(
                      (
                        total,
                        worker,
                      ) =>
                        total +
                        worker.total,
                      0,
                    );

                  const approvedRecurring =
                    checklist
                      .recurringCompanyItems
                      .filter(
                        (
                          item,
                        ) =>
                          item.status ===
                          CHECKLIST_ITEM_STATUS.approved,
                      )
                      .length +
                    workers.reduce(
                      (
                        total,
                        worker,
                      ) =>
                        total +
                        worker.approved,
                      0,
                    );

                  const progress =
                    getProgress(
                      approvedRecurring,
                      totalRecurring,
                    );

                  const pendingTotal =
                    companyPending.length +
                    workers.reduce(
                      (
                        total,
                        worker,
                      ) =>
                        total +
                        worker.pending.length,
                      0,
                    );

                  return (
                    <section
                      key={
                        checklist.supplyRequestId
                      }

                      className="card"
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          gap: 20,

                          flexWrap:
                            "wrap",

                          marginBottom:
                            20,
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",

                            gap: 12,

                            alignItems:
                              "flex-start",
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,

                              borderRadius: 11,

                              background:
                                "#f1f5f9",

                              color:
                                "#475569",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",
                            }}
                          >
                            <Icon
                              name="building"
                              size={20}
                            />
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: 10.5,

                                fontWeight: 700,

                                color:
                                  "#475569",

                                textTransform:
                                  "uppercase",

                                letterSpacing:
                                  "0.05em",
                              }}
                            >
                              Solicitação #
                              {
                                checklist.supplyRequestId
                              }
                            </div>

                            <h3
                              style={{
                                margin:
                                  "3px 0 0",

                                fontSize: 17,

                                fontWeight: 700,
                              }}
                            >
                              {
                                checklist.workSiteName
                              }
                            </h3>

                            <div
                              style={{
                                marginTop: 5,

                                fontSize: 12,

                                color:
                                  "#475569",
                              }}
                            >
                              Período:{" "}
                              {formatDate(
                                checklist.periodStart,
                              )}
                              {" a "}
                              {formatDate(
                                checklist.periodEnd,
                              )}

                              {checklist.requiredWorkerCount !==
                                null &&
                                ` • ${checklist.workersUpToDate} de ${checklist.requiredWorkerCount} trabalhadores em dia`}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            minWidth: 200,
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",

                              justifyContent:
                                "space-between",

                              marginBottom: 6,

                              fontSize: 11.5,

                              color:
                                "#475569",
                            }}
                          >
                            <span>
                              Regularidade
                            </span>

                            <strong
                              style={{
                                color:
                                  progress ===
                                  100
                                    ? "#15803d"
                                    : "#374151",
                              }}
                            >
                              {
                                progress
                              }
                              %
                            </strong>
                          </div>

                          <div className="progress-bar-track">
                            <div
                              className="progress-bar-fill"

                              style={{
                                width:
                                  `${progress}%`,

                                background:
                                  progress ===
                                  100
                                    ? "#16a34a"
                                    : "#c01a2b",
                              }}
                            />
                          </div>

                          <div
                            style={{
                              marginTop: 6,

                              textAlign:
                                "right",

                              fontSize: 10.5,

                              color:
                                "#475569",
                            }}
                          >
                            {pendingTotal ===
                            0
                              ? "Tudo em dia"
                              : `${pendingTotal} pendência(s)`}
                          </div>
                        </div>
                      </div>

                      {pendingTotal ===
                      0 ? (
                        <div
                          style={{
                            padding: 16,

                            borderRadius: 10,

                            background:
                              "#f0fdf4",

                            color:
                              "#15803d",

                            display: "flex",

                            alignItems:
                              "center",

                            gap: 8,

                            fontSize: 12.5,
                          }}
                        >
                          <Icon
                            name="check"
                            size={16}
                          />

                          Esta obra não
                          possui pendências
                          documentais no
                          período atual.
                        </div>
                      ) : (
                        <>
                          {companyPending.length >
                            0 && (
                            <div
                              style={{
                                marginBottom: 18,
                              }}
                            >
                              <div
                                style={{
                                  marginBottom: 9,

                                  fontSize: 12,

                                  fontWeight: 700,

                                  textTransform:
                                    "uppercase",

                                  letterSpacing:
                                    "0.04em",

                                  color:
                                    "#475569",
                                }}
                              >
                                Documentos
                                da empresa
                              </div>

                              <div
                                style={{
                                  display:
                                    "grid",

                                  gap: 9,
                                }}
                              >
                                {companyPending.map(
                                  (
                                    pending,
                                  ) => (
                                    <PendencyRow
                                      key={
                                        pending.key
                                      }

                                      pending={
                                        pending
                                      }

                                      onUpload={
                                        openUpload
                                      }

                                      onHistory={
                                        setHistoryItem
                                      }
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {workers.some(
                            (
                              worker,
                            ) =>
                              worker.pending.length >
                              0,
                          ) && (
                            <div>
                              <div
                                style={{
                                  marginBottom: 9,

                                  fontSize: 12,

                                  fontWeight: 700,

                                  textTransform:
                                    "uppercase",

                                  letterSpacing:
                                    "0.04em",

                                  color:
                                    "#475569",
                                }}
                              >
                                Trabalhadores
                              </div>

                              <div
                                style={{
                                  display:
                                    "grid",

                                  gap: 9,
                                }}
                              >
                                {workers
                                  .filter(
                                    (
                                      worker,
                                    ) =>
                                      worker.pending.length >
                                      0,
                                  )
                                  .map(
                                    (
                                      worker,
                                    ) => (
                                      <details
                                        key={
                                          worker.workerId
                                        }

                                        style={{
                                          border:
                                            "1px solid rgba(15,23,42,0.08)",

                                          borderRadius:
                                            10,

                                          background:
                                            "rgba(255,255,255,0.48)",
                                        }}
                                      >
                                        <summary
                                          style={{
                                            listStyle:
                                              "none",

                                            cursor:
                                              "pointer",

                                            padding:
                                              "13px 15px",

                                            display:
                                              "flex",

                                            justifyContent:
                                              "space-between",

                                            alignItems:
                                              "center",

                                            gap: 10,

                                            flexWrap:
                                              "wrap",
                                          }}
                                        >
                                          <div>
                                            <div
                                              style={{
                                                fontSize:
                                                  13,

                                                fontWeight:
                                                  700,
                                              }}
                                            >
                                              {
                                                worker.workerName
                                              }
                                            </div>

                                            <div
                                              style={{
                                                marginTop:
                                                  2,

                                                fontSize:
                                                  11,

                                                color:
                                                  "#475569",
                                              }}
                                            >
                                              {
                                                worker.pending.length
                                              }{" "}
                                              documento(s)
                                              pendente(s)
                                            </div>
                                          </div>

                                          <span className="badge badge-warning">
                                            {
                                              worker.pending.length
                                            }{" "}
                                            pendente(s)
                                          </span>
                                        </summary>

                                        <div
                                          style={{
                                            padding:
                                              "0 14px 14px",

                                            display:
                                              "grid",

                                            gap: 9,
                                          }}
                                        >
                                          {worker.pending.map(
                                            (
                                              pending,
                                            ) => (
                                              <PendencyRow
                                                key={
                                                  pending.key
                                                }

                                                pending={
                                                  pending
                                                }

                                                onUpload={
                                                  openUpload
                                                }

                                                onHistory={
                                                  setHistoryItem
                                                }
                                              />
                                            ),
                                          )}
                                        </div>
                                      </details>
                                    ),
                                  )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </section>
                  );
                },
              )}
            </div>

            {allPendencies.length ===
              0 &&
              checklists.length ===
                0 && (
                <div
                  className="card"

                  style={{
                    marginTop: 20,

                    padding: 36,

                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,

                      borderRadius:
                        "50%",

                      background:
                        "#dcfce7",

                      color:
                        "#15803d",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      margin:
                        "0 auto 12px",
                    }}
                  >
                    <Icon
                      name="check"
                      size={24}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: 15,

                      fontWeight: 700,
                    }}
                  >
                    Nenhuma pendência
                  </div>

                  <div
                    style={{
                      marginTop: 5,

                      fontSize: 12.5,

                      color:
                        "#475569",
                    }}
                  >
                    Não existem
                    solicitações ativas
                    com documentos a
                    regularizar.
                  </div>
                </div>
              )}
          </>
        )}
      </PageWrapper>

      {historyItem &&
        auth?.accessToken && (
          <PendencyHistoryModal
            accessToken={
              auth.accessToken
            }

            documentTypeId={
              historyItem.item
                .documentTypeId
            }

            documentName={
              historyItem.item
                .documentTypeName
            }

            category={
              historyItem.category
            }

            supplyRequestId={
              historyItem.supplyRequestId
            }

            workerId={
              historyItem.workerId
            }

            context={
              historyItem.workerName
                ? `${historyItem.context} • ${historyItem.workerName}`
                : historyItem.workSiteName
                  ? `${historyItem.context} • ${historyItem.workSiteName}`
                  : historyItem.context
            }

            onClose={() =>
              setHistoryItem(
                null,
              )
            }
          />
        )}
    </>
  );
}