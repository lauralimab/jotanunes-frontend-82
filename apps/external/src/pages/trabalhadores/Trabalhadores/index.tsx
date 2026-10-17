import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../../app/providers";

import {
  createWorker,
  getWorkers,
} from "../../../shared/api/workers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import type { Worker } from "../../../shared/types/workers";

import AdicionarTrabalhadorModal, {
  type TrabalhadorForm,
} from "./components/AdicionarTrabalhadorModal";

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

  const accessToken =
    auth?.accessToken;

  const [
    trabalhadores,
    setTrabalhadores,
  ] = useState<Worker[]>([]);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadWorkers() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getWorkers(
            accessToken!,
            {
              pageNumber: 1,
              pageSize: 50,
            },
          );

        if (cancelled) {
          return;
        }

        setTrabalhadores(
          response.items,
        );
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

    void loadWorkers();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleAddTrabalhador(
    form: TrabalhadorForm,
  ) {
    if (!accessToken) {
      setError(
        "Sessão inválida. Faça login novamente.",
      );

      return;
    }

    try {
      setError("");

      const novoTrabalhador =
        await createWorker(
          accessToken,
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

      setShowModal(false);
    } catch (createError) {
      if (
        createError instanceof Error
      ) {
        setError(
          createError.message,
        );
      } else {
        setError(
          "Não foi possível cadastrar o funcionário.",
        );
      }
    }
  }

  return (
    <>
      <Header
        title="Funcionários"
        subtitle="RF03 — Cadastro de funcionários vinculados ao fornecedor"
        actions={
          <button
            className="btn btn-primary"
            onClick={() =>
              setShowModal(true)
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
                "12px 16px",
              marginBottom: 16,

              border:
                "1px solid #fecaca",

              borderRadius: 10,

              background:
                "rgba(254, 242, 242, 0.94)",

              color:
                "#b91c1c",

              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div
            className="card"
            style={{
              padding: 40,
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
          />
        )}
      </PageWrapper>

      {showModal && (
        <AdicionarTrabalhadorModal
          onClose={() =>
            setShowModal(false)
          }
          onAdd={
            handleAddTrabalhador
          }
        />
      )}
    </>
  );
}