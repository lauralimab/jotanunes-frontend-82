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

export type WorkerSort =
  | "name-asc"
  | "name-desc"
  | "cpf-asc"
  | "cpf-desc"
  | "newest"
  | "oldest"
  | "active-first"
  | "inactive-first";

type TrabalhadoresTableProps = {
  trabalhadores: Worker[];
  sort: WorkerSort;

  onSortChange: (
    value: WorkerSort,
  ) => void;

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
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
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

  const trabalhadoresFiltrados = trabalhadores;

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
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          padding: 18,
          borderBottom: "1px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 220px" }}>
          <span
            style={{
              display: "block",
              marginBottom: 5,
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Buscar funcionário
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Nome ou CPF"
            style={{
              width: "100%",
              height: 38,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              padding: "0 12px",
              fontSize: 14,
              color: "#111827",
              background: "#fff",
            }}
          />
        </div>

        <div style={{ width: 170 }}>
          <Select
            label="Status do funcionário"
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
              onStatusChange(value as StatusFilter)
            }
          />
        </div>

        <div style={{ width: 190 }}>
          <span
            style={{
              display: "block",
              marginBottom: 5,
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Ordenar por
          </span>

          <Select
            label="Ordenar funcionários"
            value={sort}
            options={[
              {
                value: "name-asc",
                label: "Nome A-Z",
              },
              {
                value: "name-desc",
                label: "Nome Z-A",
              },
              {
                value: "newest",
                label: "Mais recentes",
              },
              {
                value: "oldest",
                label: "Mais antigos",
              },
              {
                value: "cpf-asc",
                label: "CPF crescente",
              },
              {
                value: "cpf-desc",
                label: "CPF decrescente",
              },
              {
                value: "active-first",
                label: "Ativos primeiro",
              },
              {
                value: "inactive-first",
                label: "Inativos primeiro",
              },
            ]}
            onChange={(value) =>
              onSortChange(value as WorkerSort)
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          <Icon name="search" size={15} />
          Buscar
        </button>
      </form>

      <table className="table-base">
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <tr key={index} aria-hidden="true">
                <td>
                  <Skeleton width={160} height={14} />
                </td>

                <td>
                  <Skeleton width={120} height={14} />
                </td>

                <td>
                  <Skeleton width={68} height={23} borderRadius={999} />
                </td>

                <td>
                  <Skeleton width={180} height={28} borderRadius={6} />
                </td>
              </tr>
            ))
          ) : trabalhadoresFiltrados.length > 0 ? (
            trabalhadoresFiltrados.map((trabalhador) => {
              const isChangingStatus =
                changingStatusId === trabalhador.id;

              return (
                <tr key={trabalhador.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          minWidth: 32,
                          borderRadius: "50%",
                          background: "#fde8ea",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#c01a2b",
                        }}
                      >
                        {trabalhador.name
                          .split(" ")
                          .filter(Boolean)
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <span style={{ fontWeight: 600 }}>
                        {trabalhador.name}
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      color: "#475569",
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    {trabalhador.formattedCpf || trabalhador.cpf}
                  </td>

                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 9px",
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: trabalhador.active
                          ? "#dcfce7"
                          : "#f1f5f9",
                        color: trabalhador.active
                          ? "#15803d"
                          : "#64748b",
                      }}
                    >
                      {trabalhador.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={onDocuments}
                      >
                        <Icon name="doc" size={13} />
                        Docs
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        title="Editar funcionário"
                        onClick={() => onEdit(trabalhador)}
                      >
                        <Icon name="edit" size={13} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={isChangingStatus}
                        title={
                          trabalhador.active
                            ? "Desativar funcionário"
                            : "Ativar funcionário"
                        }
                        onClick={() => {
                          void handleToggleStatus(trabalhador);
                        }}
                      >
                        <Icon
                          name={trabalhador.active ? "x" : "check"}
                          size={13}
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
            })
          ) : (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: "36px 20px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Nenhum funcionário encontrado.
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
