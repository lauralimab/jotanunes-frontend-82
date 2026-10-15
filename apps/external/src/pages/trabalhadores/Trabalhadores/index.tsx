import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import AdicionarTrabalhadorModal, {
  type TrabalhadorForm,
} from "./components/AdicionarTrabalhadorModal";

type Trabalhador = {
  id: number;
  name: string;
  cpf: string;
  role: string;
  status: string;
  pendingDocs: number;
};

type TrabalhadoresPageProps = {
  trabalhadores: Trabalhador[];
  onNav: (screen: "documents") => void;
};

export default function TrabalhadoresPage({
  trabalhadores,
  onNav,
}: TrabalhadoresPageProps) {
  const [showModal, setShowModal] = useState(false);

  const [listaTrabalhadores, setListaTrabalhadores] =
    useState<Trabalhador[]>(trabalhadores);

function handleAddTrabalhador(
  form: TrabalhadorForm,
) {
  const nextId =
    listaTrabalhadores.length > 0
      ? Math.max(
          ...listaTrabalhadores.map(
            (trabalhador) => trabalhador.id,
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

  setListaTrabalhadores((current) => [
    ...current,
    novoTrabalhador,
  ]);

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
            onClick={() => setShowModal(true)}
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
        <div
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              gap: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                maxWidth: 320,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
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
                style={{
                  paddingLeft: 32,
                }}
              />
            </div>

            <select className="select-base">
              <option>Todos os status</option>
              <option>Apto</option>
              <option>Pendente</option>
            </select>
          </div>

          <table className="table-base">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>CPF</th>
                <th>Função</th>
                <th>Status</th>
                <th>Docs Pendentes</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaTrabalhadores.map(
                (trabalhador) => (
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
                            .map(
                              (name) => name[0],
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {trabalhador.name}
                        </span>
                      </div>
                    </td>

                    <td
                      style={{
                        color: "#6b7280",
                        fontFamily: "monospace",
                        fontSize: 13,
                      }}
                    >
                      {trabalhador.cpf}
                    </td>

                    <td>
                      {trabalhador.role}
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
                            fontWeight: 700,
                            color: "#dc2626",
                          }}
                        >
                          {
                            trabalhador.pendingDocs
                          }
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "#6b7280",
                          }}
                        >
                          0
                        </span>
                      )}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            onNav(
                              "documents",
                            )
                          }
                        >
                          <Icon
                            name="doc"
                            size={13}
                          />

                          Docs
                        </button>

                        <button className="btn btn-ghost btn-sm">
                          <Icon
                            name="edit"
                            size={13}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </PageWrapper>

      {showModal && (
  <AdicionarTrabalhadorModal
    onClose={() =>
      setShowModal(false)
    }
    onAdd={handleAddTrabalhador}
  />
)}
    </>
  );
}