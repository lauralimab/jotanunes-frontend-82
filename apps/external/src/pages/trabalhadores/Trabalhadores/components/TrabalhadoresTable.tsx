import {
  useMemo,
  useState,
} from "react";

import Icon from "../../../../shared/components/Icon";

import type { Worker } from "../../../../shared/types/workers";

type TrabalhadoresTableProps = {
  trabalhadores: Worker[];

  onDocuments: () => void;

  onEdit: (
    trabalhador: Worker,
  ) => void;

  onToggleStatus: (
    trabalhador: Worker,
  ) => Promise<void>;
};

type StatusFilter =
  | "todos"
  | "ativos"
  | "inativos";

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

export default function TrabalhadoresTable({
  trabalhadores,
  onDocuments,
  onEdit,
  onToggleStatus,
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

  const [
    changingStatusId,
    setChangingStatusId,
  ] = useState<number | null>(
    null,
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
            trabalhador.cpf
              .replace(
                /\D/g,
                "",
              )
              .includes(
                searchDigits,
              );

          const matchesStatus =
            statusFilter ===
              "todos" ||
            (statusFilter ===
              "ativos" &&
              trabalhador.active) ||
            (statusFilter ===
              "inativos" &&
              !trabalhador.active);

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

  async function handleToggleStatus(
    trabalhador: Worker,
  ) {
    try {
      setChangingStatusId(
        trabalhador.id,
      );

      await onToggleStatus(
        trabalhador,
      );
    } finally {
      setChangingStatusId(
        null,
      );
    }
  }

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
            "1px solid rgba(15,23,42,0.06)",
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
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            style={{
              paddingLeft: 32,
            }}
          />
        </div>

        <select
          className="select-base"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target
                .value as StatusFilter,
            )
          }
        >
          <option value="todos">
            Todos
          </option>

          <option value="ativos">
            Ativos
          </option>

          <option value="inativos">
            Inativos
          </option>
        </select>
      </div>

      <table className="table-base">
        <thead>
          <tr>
            <th>
              Funcionário
            </th>

            <th>
              CPF
            </th>

            <th>
              Status
            </th>

            <th>
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {trabalhadoresFiltrados
            .length > 0 ? (
            trabalhadoresFiltrados.map(
              (trabalhador) => {
                const isChangingStatus =
                  changingStatusId ===
                  trabalhador.id;

                return (
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
                            fontSize: 12,
                            fontWeight: 700,
                            color:
                              "#c01a2b",
                          }}
                        >
                          {trabalhador.name
                            .split(" ")
                            .filter(
                              Boolean,
                            )
                            .map(
                              (name) =>
                                name[0],
                            )
                            .join("")
                            .slice(0, 2)
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
                        fontSize: 13,
                      }}
                    >
                      {trabalhador.formattedCpf ||
                        trabalhador.cpf}
                    </td>

                    <td>
                      <span
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          padding:
                            "4px 9px",
                          borderRadius:
                            999,
                          fontSize:
                            11.5,
                          fontWeight:
                            700,

                          background:
                            trabalhador.active
                              ? "#dcfce7"
                              : "#f1f5f9",

                          color:
                            trabalhador.active
                              ? "#15803d"
                              : "#64748b",
                        }}
                      >
                        {trabalhador.active
                          ? "Ativo"
                          : "Inativo"}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display:
                            "flex",
                          gap: 6,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={
                            onDocuments
                          }
                        >
                          <Icon
                            name="doc"
                            size={
                              13
                            }
                          />

                          Docs
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          title="Editar funcionário"
                          onClick={() =>
                            onEdit(
                              trabalhador,
                            )
                          }
                        >
                          <Icon
                            name="edit"
                            size={
                              13
                            }
                          />

                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          disabled={
                            isChangingStatus
                          }
                          title={
                            trabalhador.active
                              ? "Desativar funcionário"
                              : "Ativar funcionário"
                          }
                          onClick={() =>
                            void handleToggleStatus(
                              trabalhador,
                            )
                          }
                        >
                          <Icon
                            name={
                              trabalhador.active
                                ? "x"
                                : "check"
                            }
                            size={
                              13
                            }
                          />

                          {isChangingStatus
                            ? "Alterando..."
                            : trabalhador.active
                              ? "Desativar"
                              : "Ativar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              },
            )
          ) : (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding:
                    "36px 20px",
                  textAlign:
                    "center",
                  color:
                    "#64748b",
                }}
              >
                Nenhum funcionário
                encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}