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

import TrabalhadoresTable from "./components/TrabalhadoresTable";

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

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

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

        const result =
          await getWorkers(
            token,
            {
              pageNumber: 1,
              pageSize: 50,
            },
          );

        if (!cancelled) {
          setTrabalhadores(
            result.items,
          );
        }
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
  }, [auth?.accessToken]);

  async function handleAddTrabalhador(
    form: TrabalhadorForm,
  ) {
    if (!auth?.accessToken) {
      throw new Error(
        "Sessão inválida.",
      );
    }

    const novoTrabalhador =
      await createWorker(
        auth.accessToken,
        {
          name: form.name,
          cpf: form.cpf,
        },
      );

    setTrabalhadores(
      (current) => [
        ...current,
        novoTrabalhador,
      ],
    );

    setShowAddModal(false);
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

    const atualizado =
      await updateWorker(
        auth.accessToken,
        trabalhadorEditando.id,
        {
          name,
        },
      );

    setTrabalhadores(
      (current) =>
        current.map(
          (trabalhador) =>
            trabalhador.id ===
            atualizado.id
              ? atualizado
              : trabalhador,
        ),
    );

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

      const atualizado =
        trabalhador.active
          ? await deactivateWorker(
              auth.accessToken,
              trabalhador.id,
            )
          : await activateWorker(
              auth.accessToken,
              trabalhador.id,
            );

      setTrabalhadores(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              atualizado.id
                ? atualizado
                : item,
          ),
      );
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

        {isLoading ? (
          <div
            className="card"
            style={{
              padding: 32,
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            Carregando funcionários...
          </div>
        ) : (
          <TrabalhadoresTable
            trabalhadores={
              trabalhadores
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