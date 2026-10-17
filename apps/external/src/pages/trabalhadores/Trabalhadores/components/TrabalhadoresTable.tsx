import {
  useMemo,
  useState,
} from "react";

import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

export type Trabalhador = {
  id: number;
  name: string;
  cpf: string;
  role: string;
  status: string;
  pendingDocs: number;
};

type TrabalhadoresTableProps = {
  trabalhadores: Trabalhador[];
  onDocuments: () => void;
};

type StatusFilter =
  | "todos"
  | "apto"
  | "pendente";

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

function getStatusGroup(
  status: string,
): "apto" | "pendente" | "outro" {
  const normalized =
    normalizeText(status);

  if (
    normalized === "apt" ||
    normalized === "apto"
  ) {
    return "apto";
  }

  if (
    normalized === "pending" ||
    normalized === "pendente" ||
    normalized ===
      "aguardando analise"
  ) {
    return "pendente";
  }

  return "outro";
}

export default function TrabalhadoresTable({
  trabalhadores,
  onDocuments,
}: TrabalhadoresTableProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "todos",
    );

  const trabalhadoresFiltrados =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search);

      const searchDigits =
        search.replace(
          /\D/g,
          "",
        );

      return trabalhadores.filter(
        (trabalhador) => {
          const matchesSearch =
            normalizedSearch === "" ||
            normalizeText(
              trabalhador.name,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              trabalhador.role,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              trabalhador.cpf,
            ).includes(
              normalizedSearch,
            ) ||
            (
              searchDigits !== "" &&
              trabalhador.cpf
                .replace(
                  /\D/g,
                  "",
                )
                .includes(
                  searchDigits,
                )
            );

          const matchesStatus =
            statusFilter ===
              "todos" ||
            getStatusGroup(
              trabalhador.status,
            ) ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      trabalhadores,
      search,
      statusFilter,
    ]);

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding:
            "16px 20px",
          borderBottom:
            "1px solid rgba(15, 23, 42, 0.06)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position:
              "relative",
            flex: 1,
            minWidth: 220,
            maxWidth: 320,
          }}
        >
          <span
            style={{
              position:
                "absolute",
              left: 10,
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
            placeholder="Buscar funcionário..."
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            style={{
              paddingLeft: 32,
            }}
          />
        </div>

        <select
          className="select-base"
          value={
            statusFilter
          }
          onChange={(
            event,
          ) =>
            setStatusFilter(
              event.target
                .value as StatusFilter,
            )
          }
        >
          <option value="todos">
            Todos os status
          </option>

          <option value="apto">
            Apto
          </option>

          <option value="pendente">
            Pendente
          </option>
        </select>
      </div>

      <table className="table-base">
        <thead>
          <tr>
            <th>
              Funcionário
            </th>
            <th>CPF</th>
            <th>Função</th>
            <th>Status</th>
            <th>
              Docs Pendentes
            </th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {trabalhadoresFiltrados
            .length > 0 ? (
            trabalhadoresFiltrados.map(
              (
                trabalhador,
              ) => (
                <tr
                  key={
                    trabalhador.id
                  }
                >
                  <td>
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          minWidth: 32,

                          borderRadius:
                            "50%",

                          background:
                            "#fde8ea",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          fontSize:
                            12,

                          fontWeight:
                            700,

                          color:
                            "#c01a2b",
                        }}
                      >
                        {trabalhador.name
                          .split(
                            " ",
                          )
                          .filter(
                            Boolean,
                          )
                          .map(
                            (
                              name,
                            ) =>
                              name[0],
                          )
                          .join("")
                          .slice(
                            0,
                            2,
                          )
                          .toUpperCase()}
                      </div>

                      <span
                        style={{
                          fontWeight:
                            600,
                        }}
                      >
                        {
                          trabalhador.name
                        }
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      color:
                        "#6b7280",

                      fontFamily:
                        "monospace",

                      fontSize:
                        13,
                    }}
                  >
                    {
                      trabalhador.cpf
                    }
                  </td>

                  <td>
                    {
                      trabalhador.role
                    }
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        trabalhador.status
                      }
                    />
                  </td>

                  <td>
                    {trabalhador.pendingDocs >
                    0 ? (
                      <span
                        style={{
                          fontWeight:
                            700,

                          color:
                            "#dc2626",
                        }}
                      >
                        {
                          trabalhador.pendingDocs
                        }
                      </span>
                    ) : (
                      <span
                        style={{
                          color:
                            "#6b7280",
                        }}
                      >
                        0
                      </span>
                    )}
                  </td>

                  <td>
                    <div
                      style={{
                        display:
                          "flex",
                        gap: 6,
                      }}
                    >
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={
                          onDocuments
                        }
                      >
                        <Icon
                          name="doc"
                          size={13}
                        />

                        Docs
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                      >
                        <Icon
                          name="edit"
                          size={13}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )
          ) : (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding:
                    "36px 20px",

                  textAlign:
                    "center",

                  color:
                    "#64748b",
                }}
              >
                Nenhum
                funcionário
                encontrado com
                os filtros
                selecionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}