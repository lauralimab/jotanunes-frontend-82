import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import {
  activateWorker,
  createWorker,
  deactivateWorker,
  getWorkers,
  updateWorker,
} from "../../../shared/api/workers";

import type { Worker } from "../../../shared/types/workers";

import AdicionarTrabalhadorModal, {
  type TrabalhadorForm,
} from "./components/AdicionarTrabalhadorModal";

import EditarTrabalhadorModal from "./components/EditarTrabalhadorModal";

import TrabalhadoresTable, {
  type StatusFilter,
} from "./components/TrabalhadoresTable";
import TrabalhadoresTableSkeleton from "./components/TrabalhadoresTableSkeleton";

const PAGE_SIZE = 10;

type Filters = {
  search: string;
  status: StatusFilter;
  pageNumber: number;
};

type TrabalhadoresPageProps = {
  onNav: (
    screen: "documents",
  ) => void;
};

export default function TrabalhadoresPage({
  onNav,
}: TrabalhadoresPageProps) {
  const { auth } = useAuth();

  const [
    trabalhadores,
    setTrabalhadores,
  ] = useState<Worker[]>([]);

  const [
    showAddModal,
    setShowAddModal,
  ] = useState(false);

  const [
    trabalhadorEditando,
    setTrabalhadorEditando,
  ] = useState<Worker | null>(
    null,
  );

  // O que está digitado no formulário de busca.
  const [draft, setDraft] =
    useState<{
      search: string;
      status: StatusFilter;
    }>({
      search: "",
      status: "todos",
    });

  // O que foi realmente aplicado (dispara a chamada à API).
  const [filters, setFilters] =
    useState<Filters>({
      search: "",
      status: "todos",
      pageNumber: 1,
    });

  const [pageInfo, setPageInfo] =
    useState({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    });

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadWorkers(
      token: string,
    ) {
      try {
        setIsLoading(true);
        setError("");

        const search =
          filters.search.trim();

        const isCpf =
          /^[\d.\s-]+$/.test(search);

        const result =
          await getWorkers(
            token,
            {
              pageNumber:
                filters.pageNumber,
              pageSize: PAGE_SIZE,
              name:
                search && !isCpf
                  ? search
                  : undefined,
              cpf:
                search && isCpf
                  ? search.replace(
                    /\D/g,
                    "",
                  )
                  : undefined,
              active:
                filters.status ===
                  "todos"
                  ? undefined
                  : filters.status ===
                  "ativos",
            },
          );

        if (cancelled) {
          return;
        }

        // Apagou o último item da última página: volta uma página.
        if (
          result.items.length === 0 &&
          filters.pageNumber > 1
        ) {
          setFilters((current) => ({
            ...current,
            pageNumber:
              Math.max(
                1,
                Math.min(
                  current.pageNumber - 1,
                  result.totalPages,
                ),
              ),
          }));

          return;
        }

        setTrabalhadores(
          result.items,
        );

        setPageInfo({
          totalCount:
            result.totalCount,
          totalPages:
            result.totalPages,
          currentPage:
            result.currentPage,
        });

        setHasLoaded(true);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        if (
          loadError instanceof Error
        ) {
          setError(
            loadError.message,
          );
        } else {
          setError(
            "Não foi possível carregar os funcionários.",
          );
        }

        setHasLoaded(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkers(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [auth?.accessToken, filters]);

  /** Recarrega a página atual com os mesmos filtros. */
  function reloadWorkers() {
    setFilters((current) => ({
      ...current,
    }));
  }

  function applyFilters() {
    setFilters({
      search: draft.search.trim(),
      status: draft.status,
      pageNumber: 1,
    });
  }

  async function handleAddTrabalhador(
    form: TrabalhadorForm,
  ) {
    if (!auth?.accessToken) {
      throw new Error(
        "Sessão inválida.",
      );
    }

    await createWorker(
        auth.accessToken,
        {
          name: form.name,
          cpf: form.cpf,
        },
      );

    setShowAddModal(false);

    // Volta para a página 1 para o novo funcionário aparecer.
    setFilters((current) => ({
      ...current,
      pageNumber: 1,
    }));
  }

  async function handleEditTrabalhador(
    name: string,
  ) {
    if (
      !auth?.accessToken ||
      !trabalhadorEditando
    ) {
      throw new Error(
        "Não foi possível identificar o funcionário.",
      );
    }

    await updateWorker(
      auth.accessToken,
      trabalhadorEditando.id,
      {
        name,
      },
    );

    reloadWorkers();

    setTrabalhadorEditando(
      null,
    );
  }

  async function handleToggleStatus(
    trabalhador: Worker,
  ) {
    if (!auth?.accessToken) {
      setError(
        "Sessão inválida.",
      );

      return;
    }

    try {
      setError("");

      if (trabalhador.active) {
        await deactivateWorker(
          auth.accessToken,
          trabalhador.id,
        );
      } else {
        await activateWorker(
          auth.accessToken,
          trabalhador.id,
        );
      }

      reloadWorkers();
    } catch (statusError) {
      if (
        statusError instanceof Error
      ) {
        setError(
          statusError.message,
        );
      } else {
        setError(
          "Não foi possível alterar o status do funcionário.",
        );
      }
    }
  }

  return (
    <>
      <Header
        title="Funcionários"
        subtitle="Cadastro de funcionários vinculados ao fornecedor"
        actions={
          <button
            className="btn btn-primary"
            onClick={() =>
              setShowAddModal(
                true,
              )
            }
          >
            <Icon
              name="plus"
              size={15}
            />

            Adicionar Funcionário
          </button>
        }
      />

      <PageWrapper>
        {error && (
          <div
            style={{
              padding:
                "12px 14px",
              marginBottom: 16,
              borderRadius: 8,
              background:
                "#fef2f2",
              border:
                "1px solid #fecaca",
              color:
                "#b91c1c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {!hasLoaded ? (
          <TrabalhadoresTableSkeleton />
        ) : (
          <TrabalhadoresTable
            trabalhadores={
              trabalhadores
            }
            loading={isLoading}
            search={draft.search}
            status={draft.status}
            onSearchChange={(
              search,
            ) =>
              setDraft(
                (current) => ({
                  ...current,
                  search,
                }),
              )
            }
            onStatusChange={(
              status,
            ) =>
              setDraft(
                (current) => ({
                  ...current,
                  status,
                }),
              )
            }
            onApplyFilters={
              applyFilters
            }
            totalCount={
              pageInfo.totalCount
            }
            currentPage={
              pageInfo.currentPage
            }
            totalPages={
              pageInfo.totalPages
            }
            onPageChange={(
              pageNumber,
            ) =>
              setFilters(
                (current) => ({
                  ...current,
                  pageNumber,
                }),
              )
            }
            onDocuments={() =>
              onNav(
                "documents",
              )
            }
            onEdit={
              setTrabalhadorEditando
            }
            onToggleStatus={
              handleToggleStatus
            }
          />
        )}
      </PageWrapper>

      {showAddModal && (
        <AdicionarTrabalhadorModal
          onClose={() =>
            setShowAddModal(
              false,
            )
          }
          onAdd={
            handleAddTrabalhador
          }
        />
      )}

      {trabalhadorEditando && (
        <EditarTrabalhadorModal
          trabalhador={
            trabalhadorEditando
          }
          onClose={() =>
            setTrabalhadorEditando(
              null,
            )
          }
          onSave={
            handleEditTrabalhador
          }
        />
      )}
    </>
  );
}