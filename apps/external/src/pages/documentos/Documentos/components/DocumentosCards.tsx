import {
  useMemo,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  useAuth,
} from "../../../../app/providers";

import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

import DocumentoArquivoAcoes
  from "./DocumentoArquivoAcoes";

import type {
  Document as SupplierDocument,
  DocumentStatus,
} from "../../../../shared/types/documents";

type Props = {
  documents: SupplierDocument[];
};

type StatusFilter =
  | "all"
  | "1"
  | "2"
  | "3";

type CategoryFilter =
  | "all"
  | "company"
  | "workers"
  | "works";

type DocumentGroup = {
  key: string;
  latest: SupplierDocument;
  versions: SupplierDocument[];
};

type Section = {
  id: Exclude<
    CategoryFilter,
    "all"
  >;
  title: string;
  description: string;
  icon: string;
  groups: DocumentGroup[];
};

function normalizeText(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "—";
  }

  const dateOnly =
    value.slice(0, 10);

  const parts =
    dateOnly.split("-");

  if (
    parts.length !== 3
  ) {
    return value;
  }

  const [
    year,
    month,
    day,
  ] = parts;

  return `${day}/${month}/${year}`;
}

function formatDateTime(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "pt-BR",
  );
}

function getStatusKey(
  status:
    DocumentStatus,
) {
  if (status === 1) {
    return "pending";
  }

  if (status === 2) {
    return "approved";
  }

  return "rejected";
}

function getCategory(
  document:
    SupplierDocument,
): Exclude<
  CategoryFilter,
  "all"
> {
  if (
    document.supplyRequestId !==
    null
  ) {
    return "works";
  }

  if (
    document.workerId !==
    null
  ) {
    return "workers";
  }

  return "company";
}

function getContextLabel(
  document:
    SupplierDocument,
) {
  if (
    document.workerName &&
    document.workSiteName
  ) {
    return `${document.workerName} • ${document.workSiteName}`;
  }

  if (
    document.workerName
  ) {
    return document.workerName;
  }

  if (
    document.workSiteName
  ) {
    return document.workSiteName;
  }

  return document.companyCorporateName;
}

function HistoryModal({
  group,
  accessToken,
  onClose,
}: {
  group: DocumentGroup;

  accessToken?:
  string;

  onClose:
  () => void;
}) {
  return createPortal(
    <div
      className="modal-overlay"
      onClick={
        onClose
      }
    >
      <div
        className="modal-box"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
        style={{
          width:
            "calc(100% - 32px)",

          maxWidth: 820,

          maxHeight:
            "88vh",

          overflowY:
            "auto",
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "flex-start",

            gap: 16,

            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,

                fontWeight: 800,

                color:
                  "#0f172a",
              }}
            >
              Histórico de envios
            </div>

            <div
              style={{
                marginTop: 4,

                fontSize: 13.5,

                fontWeight: 700,

                color:
                  "#334155",
              }}
            >
              {
                group.latest
                  .documentTypeName
              }
            </div>

            <div
              style={{
                marginTop: 3,

                fontSize: 12,

                color:
                  "#475569",
              }}
            >
              {getContextLabel(
                group.latest,
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={
              onClose
            }
          >
            <Icon
              name="x"
              size={14}
            />

            Fechar
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {group.versions.map(
            (
              document,
              index,
            ) => (
              <div
                key={
                  document.id
                }
                style={{
                  padding: 16,

                  border:
                    "1px solid #e2e8f0",

                  borderRadius: 11,

                  background:
                    "#fff",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "flex-start",

                    gap: 12,

                    flexWrap:
                      "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display:
                          "flex",

                        gap: 8,

                        alignItems:
                          "center",

                        flexWrap:
                          "wrap",
                      }}
                    >
                      <strong>
                        Envio{" "}
                        {
                          group.versions
                            .length -
                          index
                        }
                      </strong>

                      <StatusBadge
                        status={
                          getStatusKey(
                            document.status,
                          )
                        }
                      />

                      {index ===
                        0 && (
                          <span
                            className="badge badge-blue"
                          >
                            Mais recente
                          </span>
                        )}
                    </div>

                    <div
                      style={{
                        marginTop: 5,

                        fontSize: 12,

                        color:
                          "#475569",
                      }}
                    >
                      {
                        document.originalFileName
                      }
                    </div>

                    <div
                      style={{
                        marginTop: 3,

                        fontSize: 11.5,

                        color:
                          "#64748b",
                      }}
                    >
                      Enviado em{" "}
                      {formatDateTime(
                        document.createdAt,
                      )}
                      {" • "}
                      {
                        document.uploadedByName
                      }
                    </div>
                  </div>

                  <DocumentoArquivoAcoes
                    documento={
                      document
                    }
                    accessToken={
                      accessToken
                    }
                  />
                </div>

                {document.rejectionReason && (
                  <div
                    style={{
                      marginTop: 12,

                      padding:
                        "9px 11px",

                      borderRadius: 7,

                      background:
                        "#fef2f2",

                      border:
                        "1px solid #fecaca",

                      color:
                        "#991b1b",

                      fontSize: 12,
                    }}
                  >
                    <strong>
                      Motivo da
                      reprovação:{" "}
                    </strong>

                    {
                      document.rejectionReason
                    }
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DocumentCard({
  group,
  accessToken,
  onHistory,
}: {
  group: DocumentGroup;

  accessToken?:
  string;

  onHistory:
  () => void;
}) {
  const document =
    group.latest;

  const isRejected =
    document.status === 3;

  const isApproved =
    document.status === 2;

  const statusColor =
    isRejected
      ? "#dc2626"
      : isApproved
        ? "#16a34a"
        : "#d97706";

  const iconBackground =
    isRejected
      ? "#fef2f2"
      : isApproved
        ? "#f0fdf4"
        : "#fffbeb";

  return (
    <article
      style={{
        border:
          "1px solid rgba(15,23,42,0.09)",

        borderRadius: 14,

        padding: 18,

        background:
          "rgba(255,255,255,0.78)",

        display: "flex",

        flexDirection:
          "column",

        minHeight: 245,

        boxShadow:
          "0 4px 14px rgba(15,23,42,0.035)",
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
        <div
          style={{
            display: "flex",

            alignItems:
              "flex-start",

            gap: 11,

            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 42,

              height: 42,

              borderRadius: 11,

              background:
                iconBackground,

              color:
                statusColor,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink: 0,
            }}
          >
            <Icon
              name="doc"
              size={19}
            />
          </div>

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 14,

                fontWeight: 800,

                color:
                  "#0f172a",

                lineHeight: 1.3,
              }}
            >
              {
                document.documentTypeName
              }
            </div>

            <div
              style={{
                marginTop: 4,

                fontSize: 11.5,

                color:
                  "#64748b",

                overflowWrap:
                  "anywhere",
              }}
            >
              {
                document.originalFileName
              }
            </div>
          </div>
        </div>

        <StatusBadge
          status={
            getStatusKey(
              document.status,
            )
          }
        />
      </div>

      <div
        style={{
          marginTop: 18,

          display: "grid",

          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

          gap:
            "13px 18px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10.5,

              fontWeight: 700,

              color:
                "#64748b",

              textTransform:
                "uppercase",
            }}
          >
            Referente a
          </div>

          <div
            style={{
              marginTop: 3,

              fontSize: 12.5,

              fontWeight: 600,

              color:
                "#334155",
            }}
          >
            {document.workerName ??
              document.companyCorporateName}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 10.5,

              fontWeight: 700,

              color:
                "#64748b",

              textTransform:
                "uppercase",
            }}
          >
            Último envio
          </div>

          <div
            style={{
              marginTop: 3,

              fontSize: 12.5,

              fontWeight: 600,

              color:
                "#334155",
            }}
          >
            {formatDate(
              document.createdAt,
            )}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 10.5,

              fontWeight: 700,

              color:
                "#64748b",

              textTransform:
                "uppercase",
            }}
          >
            Validade
          </div>

          <div
            style={{
              marginTop: 3,

              fontSize: 12.5,

              fontWeight: 600,

              color:
                "#334155",
            }}
          >
            {formatDate(
              document.expirationDate,
            )}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 10.5,

              fontWeight: 700,

              color:
                "#64748b",

              textTransform:
                "uppercase",
            }}
          >
            Histórico
          </div>

          <div
            style={{
              marginTop: 3,

              fontSize: 12.5,

              fontWeight: 600,

              color:
                "#334155",
            }}
          >
            {
              group.versions
                .length
            }{" "}
            envio(s)
          </div>
        </div>
      </div>

      {document.workSiteName && (
        <div
          style={{
            marginTop: 13,

            padding:
              "8px 10px",

            borderRadius: 8,

            background:
              "#f8fafc",

            color:
              "#475569",

            fontSize: 11.5,
          }}
        >
          <strong>
            Obra:
          </strong>{" "}
          {
            document.workSiteName
          }
        </div>
      )}

      {document.rejectionReason && (
        <div
          style={{
            marginTop: 12,

            padding:
              "8px 10px",

            borderRadius: 8,

            background:
              "#fef2f2",

            border:
              "1px solid #fecaca",

            color:
              "#991b1b",

            fontSize: 11.5,
          }}
        >
          <strong>
            Motivo:
          </strong>{" "}
          {
            document.rejectionReason
          }
        </div>
      )}

      <div
        style={{
          marginTop: "auto",

          paddingTop: 16,

          borderTop:
            "1px solid rgba(15,23,42,0.06)",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap: 8,

          flexWrap: "wrap",
        }}
      >
        <DocumentoArquivoAcoes
          documento={
            document
          }
          accessToken={
            accessToken
          }
        />

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={
            onHistory
          }
        >
          <Icon
            name="history"
            size={13}
          />

          Histórico

          {group.versions.length >
            1 &&
            ` (${group.versions.length})`}
        </button>
      </div>
    </article>
  );
}

export default function DocumentosCards({
  documents,
}: Props) {
  const {
    auth,
  } = useAuth();

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all",
    );

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState<CategoryFilter>(
      "all",
    );

  const [
    historyGroup,
    setHistoryGroup,
  ] =
    useState<
      DocumentGroup | null
    >(null);

  const groups =
    useMemo(() => {
      const sorted =
        [...documents].sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );

      const map =
        new Map<
          string,
          SupplierDocument[]
        >();

      for (
        const document
        of sorted
      ) {
        const key = [
          document.documentTypeId,

          document.supplyRequestId ??
          "global",

          document.workerId ??
          "company",
        ].join("-");

        const current =
          map.get(key) ??
          [];

        current.push(
          document,
        );

        map.set(
          key,
          current,
        );
      }

      return Array.from(
        map.entries(),
      ).map(
        ([
          key,
          versions,
        ]) => ({
          key,

          latest:
            versions[0],

          versions,
        }),
      );
    }, [
      documents,
    ]);

  const stats =
    useMemo(() => {
      return {
        total:
          groups.length,

        pending:
          groups.filter(
            (group) =>
              group.latest
                .status === 1,
          ).length,

        approved:
          groups.filter(
            (group) =>
              group.latest
                .status === 2,
          ).length,

        rejected:
          groups.filter(
            (group) =>
              group.latest
                .status === 3,
          ).length,
      };
    }, [
      groups,
    ]);

  const filteredGroups =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(
          search,
        );

      return groups.filter(
        (group) => {
          const document =
            group.latest;

          const matchesSearch =
            normalizedSearch ===
            "" ||
            normalizeText(
              document.documentTypeName,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              document.documentTypeCode,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              document.originalFileName,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              document.workerName ??
              "",
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              document.workSiteName ??
              "",
            ).includes(
              normalizedSearch,
            );

          const matchesStatus =
            statusFilter ===
            "all" ||
            document.status ===
            Number(
              statusFilter,
            );

          const matchesCategory =
            categoryFilter ===
            "all" ||
            getCategory(
              document,
            ) ===
            categoryFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
          );
        },
      );
    }, [
      groups,
      search,
      statusFilter,
      categoryFilter,
    ]);

  const sections:
    Section[] =
    [
      {
        id: "company",

        title:
          "Cadastro / Habilitação",

        description:
          "Documentos gerais da empresa.",

        icon:
          "building",

        groups:
          filteredGroups.filter(
            (group) =>
              getCategory(
                group.latest,
              ) ===
              "company",
          ),
      },

      {
        id: "workers",

        title:
          "Funcionários",

        description:
          "Documentos de habilitação vinculados aos trabalhadores.",

        icon:
          "users",

        groups:
          filteredGroups.filter(
            (group) =>
              getCategory(
                group.latest,
              ) ===
              "workers",
          ),
      },

      {
        id: "works",

        title:
          "Solicitações / Obras",

        description:
          "Documentos vinculados a uma solicitação e ao período da obra.",

        icon:
          "building",

        groups:
          filteredGroups.filter(
            (group) =>
              getCategory(
                group.latest,
              ) ===
              "works",
          ),
      },
    ];

  const visibleSections =
    sections.filter(
      (section) =>
        section.groups
          .length > 0,
    );

  const tabs = [
    {
      id: "all",
      label: "Todos",
      count:
        groups.length,
    },
    {
      id: "company",
      label: "Empresa",
      count:
        groups.filter(
          (group) =>
            getCategory(
              group.latest,
            ) ===
            "company",
        ).length,
    },
    {
      id: "workers",
      label:
        "Funcionários",
      count:
        groups.filter(
          (group) =>
            getCategory(
              group.latest,
            ) ===
            "workers",
        ).length,
    },
    {
      id: "works",
      label: "Obras",
      count:
        groups.filter(
          (group) =>
            getCategory(
              group.latest,
            ) ===
            "works",
        ).length,
    },
  ] as const;

  return (
    <>
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",

          gap: 14,

          marginBottom: 20,
        }}
      >
        {[
          {
            label:
              "Documentos acompanhados",

            value:
              stats.total,

            icon:
              "doc",

            color:
              "#475569",

            background:
              "#f1f5f9",
          },
          {
            label:
              "Em análise",

            value:
              stats.pending,

            icon:
              "clock",

            color:
              "#ca8a04",

            background:
              "#fef9c3",
          },
          {
            label:
              "Aprovados",

            value:
              stats.approved,

            icon:
              "check",

            color:
              "#16a34a",

            background:
              "#dcfce7",
          },
          {
            label:
              "Reprovados",

            value:
              stats.rejected,

            icon:
              "alert",

            color:
              "#dc2626",

            background:
              "#fee2e2",
          },
        ].map(
          (stat) => (
            <div
              key={
                stat.label
              }
              className="stat-card"
            >
              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "flex-start",
                }}
              >
                <div>
                  <div className="label">
                    {
                      stat.label
                    }
                  </div>

                  <div
                    className="value"
                    style={{
                      color:
                        stat.color,

                      marginTop: 8,
                    }}
                  >
                    {
                      stat.value
                    }
                  </div>
                </div>

                <div
                  style={{
                    width: 40,

                    height: 40,

                    borderRadius: 10,

                    background:
                      stat.background,

                    color:
                      stat.color,

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",
                  }}
                >
                  <Icon
                    name={
                      stat.icon
                    }
                    size={19}
                  />
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <div
        className="card"
        style={{
          marginBottom: 20,

          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",

            gap: 10,

            alignItems:
              "center",

            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position:
                "relative",

              flex: 1,

              minWidth: 240,
            }}
          >
            <span
              style={{
                position:
                  "absolute",

                left: 11,

                top: "50%",

                transform:
                  "translateY(-50%)",

                color:
                  "#64748b",

                pointerEvents:
                  "none",
              }}
            >
              <Icon
                name="search"
                size={15}
              />
            </span>

            <input
              className="input-base"
              placeholder="Buscar por documento, código, funcionário ou obra..."
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              style={{
                paddingLeft: 34,
                width: "100%",
              }}
            />
          </div>

          <select
            className="select-base"
            aria-label="Filtrar por status"
            value={
              statusFilter
            }
            onChange={(
              event,
            ) =>
              setStatusFilter(
                event.target
                  .value as
                StatusFilter,
              )
            }
          >
            <option value="all">
              Todos os status
            </option>

            <option value="1">
              Em análise
            </option>

            <option value="2">
              Aprovados
            </option>

            <option value="3">
              Reprovados
            </option>
          </select>
        </div>

        <div
          style={{
            display: "flex",

            gap: 7,

            marginTop: 14,

            flexWrap: "wrap",
          }}
        >
          {tabs.map(
            (tab) => {
              const active =
                categoryFilter ===
                tab.id;

              return (
                <button
                  key={
                    tab.id
                  }
                  type="button"
                  onClick={() =>
                    setCategoryFilter(
                      tab.id,
                    )
                  }
                  style={{
                    border:
                      active
                        ? "1px solid #c01a2b"
                        : "1px solid #e2e8f0",

                    borderRadius: 9,

                    padding:
                      "8px 13px",

                    background:
                      active
                        ? "#c01a2b"
                        : "#fff",

                    color:
                      active
                        ? "#fff"
                        : "#475569",

                    fontSize: 12,

                    fontWeight: 700,

                    cursor:
                      "pointer",
                  }}
                >
                  {
                    tab.label
                  }

                  <span
                    style={{
                      marginLeft: 7,

                      opacity:
                        active
                          ? 0.85
                          : 0.7,
                    }}
                  >
                    {
                      tab.count
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      {visibleSections.length ===
        0 ? (
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
          <div
            style={{
              width: 48,

              height: 48,

              borderRadius:
                "50%",

              background:
                "#f1f5f9",

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
              name="search"
              size={20}
            />
          </div>

          Nenhum documento encontrado
          para os filtros selecionados.
        </div>
      ) : (
        <div
          style={{
            display: "grid",

            gap: 22,
          }}
        >
          {visibleSections.map(
            (section) => (
              <section
                key={
                  section.id
                }
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 10,

                    marginBottom:
                      12,
                  }}
                >
                  <div
                    style={{
                      width: 36,

                      height: 36,

                      borderRadius:
                        9,

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
                    }}
                  >
                    <Icon
                      name={
                        section.icon
                      }
                      size={17}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize:
                          15,

                        fontWeight:
                          800,

                        color:
                          "#0f172a",
                      }}
                    >
                      {
                        section.title
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          2,

                        fontSize:
                          11.5,

                        color:
                          "#475569",
                      }}
                    >
                      {
                        section.description
                      }
                    </div>
                  </div>

                  <span
                    className="badge badge-gray"
                    style={{
                      marginLeft:
                        "auto",
                    }}
                  >
                    {
                      section.groups
                        .length
                    }
                  </span>
                </div>

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(360px, 1fr))",

                    gap: 14,
                  }}
                >
                  {section.groups.map(
                    (group) => (
                      <DocumentCard
                        key={
                          group.key
                        }
                        group={
                          group
                        }
                        accessToken={
                          auth
                            ?.accessToken
                        }
                        onHistory={() =>
                          setHistoryGroup(
                            group,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            ),
          )}
        </div>
      )}

      {historyGroup && (
        <HistoryModal
          group={
            historyGroup
          }
          accessToken={
            auth?.accessToken
          }
          onClose={() =>
            setHistoryGroup(
              null,
            )
          }
        />
      )}
    </>
  );
}