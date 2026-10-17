import {
  useState,
} from "react";

import Icon from "../../../../shared/components/Icon";

export type TrabalhadorForm = {
  name: string;
  cpf: string;
};

type AdicionarTrabalhadorModalProps = {
  onClose: () => void;

  onAdd: (
    form: TrabalhadorForm,
  ) => void | Promise<void>;
};

const initialForm: TrabalhadorForm = {
  name: "",
  cpf: "",
};

export default function AdicionarTrabalhadorModal({
  onClose,
  onAdd,
}: AdicionarTrabalhadorModalProps) {
  const [
    form,
    setForm,
  ] =
    useState<TrabalhadorForm>(
      initialForm,
    );

  function handleField(
    field:
      keyof TrabalhadorForm,

    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  }

  async function handleAdd() {
    if (
      !form.name.trim() ||
      !form.cpf.trim()
    ) {
      alert(
        "Preencha Nome e CPF.",
      );

      return;
    }

    await onAdd({
      name:
        form.name.trim(),

      cpf:
        form.cpf.trim(),
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

            justifyContent:
              "space-between",

            alignItems:
              "center",

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
            flexDirection:
              "column",
            gap: 14,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 12.5,
                fontWeight: 600,

                color:
                  "#374151",

                display:
                  "block",

                marginBottom: 5,
              }}
            >
              Nome Completo *
            </label>

            <input
              className="input-base"

              value={
                form.name
              }

              onChange={(
                event,
              ) =>
                handleField(
                  "name",
                  event.target
                    .value,
                )
              }
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 12.5,
                fontWeight: 600,

                color:
                  "#374151",

                display:
                  "block",

                marginBottom: 5,
              }}
            >
              CPF *
            </label>

            <input
              className="input-base"

              placeholder="000.000.000-00"

              value={
                form.cpf
              }

              onChange={(
                event,
              ) =>
                handleField(
                  "cpf",
                  event.target
                    .value,
                )
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",

            gap: 10,

            justifyContent:
              "flex-end",

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
            onClick={() =>
              void handleAdd()
            }
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}