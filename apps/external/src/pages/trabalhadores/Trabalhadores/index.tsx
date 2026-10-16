import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import AdicionarTrabalhadorModal, {
  type TrabalhadorForm,
} from "./components/AdicionarTrabalhadorModal";

import TrabalhadoresTable, {
  type Trabalhador,
} from "./components/TrabalhadoresTable";

type TrabalhadoresPageProps = {
  trabalhadores: Trabalhador[];
  onNav: (screen: "documents") => void;
};

export default function TrabalhadoresPage({
  trabalhadores,
  onNav,
}: TrabalhadoresPageProps) {
  const [showModal, setShowModal] =
    useState(false);

  const [
    listaTrabalhadores,
    setListaTrabalhadores,
  ] = useState<Trabalhador[]>(
    trabalhadores,
  );

  function handleAddTrabalhador(
    form: TrabalhadorForm,
  ) {
    const nextId =
      listaTrabalhadores.length > 0
        ? Math.max(
            ...listaTrabalhadores.map(
              (trabalhador) =>
                trabalhador.id,
            ),
          ) + 1
        : 1;

    const novoTrabalhador: Trabalhador = {
      id: nextId,
      name: form.name,
      cpf: form.cpf,
      role: form.role,
      status: "pending",
      pendingDocs: 0,
    };

    setListaTrabalhadores(
      (current) => [
        ...current,
        novoTrabalhador,
      ],
    );

    setShowModal(false);
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
        <TrabalhadoresTable
          trabalhadores={
            listaTrabalhadores
          }
          onDocuments={() =>
            onNav("documents")
          }
        />
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