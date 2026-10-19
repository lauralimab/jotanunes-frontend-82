import { useState } from "react";

import Icon from "../../../../shared/components/Icon";

export type TrabalhadorForm = {
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  role: string;
  email: string;
  phone: string;
};

type AdicionarTrabalhadorModalProps = {
  onClose: () => void;
  onAdd: (form: TrabalhadorForm) => void;
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

export default function AdicionarTrabalhadorModal({
  onClose,
  onAdd,
}: AdicionarTrabalhadorModalProps) {
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

  function handleAdd() {
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

    onAdd({
      ...form,
      name: form.name.trim(),
      cpf: form.cpf.trim(),
      role: form.role.trim(),
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
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
            justifyContent: "space-between",
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
            onClick={onClose}
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
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={handleAdd}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}