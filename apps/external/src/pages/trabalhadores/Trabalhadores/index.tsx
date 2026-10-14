import { useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

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

type TrabalhadorForm = {
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  role: string;
  email: string;
  phone: string;
};

const initialForm: TrabalhadorForm = {
  name: "",
  cpf: "",
  rg: "",
  birthDate: "",
  role: "",
  email: "",
  phone: "",
};

export default function TrabalhadoresPage({
  trabalhadores,
  onNav,
}: TrabalhadoresPageProps) {
  const [showModal, setShowModal] = useState(false);

  const [listaTrabalhadores, setListaTrabalhadores] =
    useState<Trabalhador[]>(trabalhadores);

  const [form, setForm] =
    useState<TrabalhadorForm>(initialForm);

  function handleField(
    field: keyof TrabalhadorForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCloseModal() {
    setForm(initialForm);
    setShowModal(false);
  }

  function handleAddTrabalhador() {
    if (
      !form.name.trim() ||
      !form.cpf.trim() ||
      !form.role.trim()
    ) {
      alert(
        "Preencha Nome, CPF e Função / Cargo.",
      );

      return;
    }

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
      name: form.name.trim(),
      cpf: form.cpf.trim(),
      role: form.role.trim(),
      status: "pending",
      pendingDocs: 0,
    };

    setListaTrabalhadores((current) => [
      ...current,
      novoTrabalhador,
    ]);

    setForm(initialForm);
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
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal-box"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily:
                    "'DM Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Adicionar Funcionário
              </h3>

              <button
                className="btn btn-ghost btn-sm"
                onClick={handleCloseModal}
              >
                <Icon
                  name="x"
                  size={16}
                />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Nome Completo *
                </label>

                <input
                  className="input-base"
                  value={form.name}
                  onChange={(event) =>
                    handleField(
                      "name",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  CPF *
                </label>

                <input
                  className="input-base"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(event) =>
                    handleField(
                      "cpf",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  RG
                </label>

                <input
                  className="input-base"
                  value={form.rg}
                  onChange={(event) =>
                    handleField(
                      "rg",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Data de Nascimento
                </label>

                <input
                  className="input-base"
                  type="date"
                  value={form.birthDate}
                  onChange={(event) =>
                    handleField(
                      "birthDate",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Função / Cargo *
                </label>

                <input
                  className="input-base"
                  placeholder="Ex: Auxiliar de Limpeza"
                  value={form.role}
                  onChange={(event) =>
                    handleField(
                      "role",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  E-mail
                </label>

                <input
                  className="input-base"
                  type="email"
                  placeholder="joao@empresa.com"
                  value={form.email}
                  onChange={(event) =>
                    handleField(
                      "email",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Telefone
                </label>

                <input
                  className="input-base"
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={(event) =>
                    handleField(
                      "phone",
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 22,
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>

              <button
                className="btn btn-primary"
                onClick={
                  handleAddTrabalhador
                }
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}