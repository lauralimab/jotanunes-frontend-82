import { useState } from "react";

import Icon from "../../../../shared/components/Icon";
import Select from "../../../../shared/components/Select";
import TablePagination from "../../../../shared/components/TablePagination";
import Skeleton from "../../../../shared/components/Skeleton";

import type { Worker } from "../../../../shared/types/workers";

export type StatusFilter =
  | "todos"
  | "ativos"
  | "inativos";

type TrabalhadoresTableProps = {
  trabalhadores: Worker[];

  loading: boolean;

  /** Texto e status ainda não aplicados (o que está digitado). */
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onApplyFilters: () => void;

  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  onDocuments: () => void;

  onEdit: (
    trabalhador: Worker,
  ) => void;

  onToggleStatus: (
    trabalhador: Worker,
  ) => Promise<void>;
};

export default function TrabalhadoresTable({
  trabalhadores,
  loading,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onApplyFilters,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onDocuments,
  onEdit,
  onToggleStatus,
}: TrabalhadoresTableProps) {
  const [
    changingStatusId,
    setChangingStatusId,
  ] = useState<number | null>(
    null,
  );

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

  const trabalhadoresFiltrados =
    trabalhadores;

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApplyFilters();
        }}
        style={{
          padding:
            "16px 20px",
          borderBottom:
            "1px solid rgba(15,23,42,0.06)",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            maxWidth: 340,
          }}
        >
          <label
            htmlFor="busca-funcionario"
            style={{
              display: "block",
              marginBottom: 5,
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Buscar funcionário
          </label>

          <div
            style={{
              position: "relative",
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
                color: "#64748b",
                pointerEvents:
                  "none",
                display: "flex",
              }}
            >
              <Icon
                name="search"
                size={15}
              />
            </span>

            <input
              id="busca-funcionario"
              className="input-base"
              placeholder="Buscar por nome ou CPF"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              style={{
                paddingLeft: 32,
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: 170,
          }}
        >
          <span
            style={{
              display: "block",
              marginBottom: 5,
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Status do funcionário
          </span>

          <Select
            label="Filtrar por status do funcionário"
            value={status}
            options={[
              {
                value: "todos",
                label: "Todos",
              },
              {
                value: "ativos",
                label: "Ativos",
              },
              {
                value: "inativos",
                label: "Inativos",
              },
            ]}
            onChange={(value) =>
              onStatusChange(
                value as StatusFilter,
              )
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          <Icon
            name="search"
            size={15}
          />

          Buscar
        </button>
      </form>

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
          {loading ? (
            Array.from(
              { length: 5 },
              (_, index) => (
                <tr
                  key={index}
                  aria-hidden="true"
                >
                  <td>
                    <Skeleton
                      width={160}
                      height={14}
                    />
                  </td>

                  <td>
                    <Skeleton
                      width={120}
                      height={14}
                    />
                  </td>

                  <td>
                    <Skeleton
                      width={68}
                      height={23}
                      borderRadius={999}
                    />
                  </td>

                  <td>
                    <Skeleton
                      width={180}
                      height={28}
                      borderRadius={6}
                    />
                  </td>
                </tr>
              ),
            )
          ) : trabalhadoresFiltrados
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

      <TablePagination
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        itemLabel="funcionário(s)"
        ariaLabel="Páginas de funcionários"
        loading={loading}
        loadingText="Carregando funcionários..."
        onPageChange={onPageChange}
      />
    </div>
  );
}
