import { useState } from "react";

import Icon from "../../../../shared/components/Icon";

import type { Worker } from "../../../../shared/types/workers";

type EditarTrabalhadorModalProps = {
  trabalhador: Worker;
  onClose: () => void;
  onSave: (
    name: string,
  ) => Promise<void>;
};

export default function EditarTrabalhadorModal({
  trabalhador,
  onClose,
  onSave,
}: EditarTrabalhadorModalProps) {
  const [name, setName] =
    useState(trabalhador.name);

  const [error, setError] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  async function handleSave() {
    const normalizedName =
      name.trim();

    setError("");

    if (!normalizedName) {
      setError(
        "Informe o nome do funcionário.",
      );

      return;
    }

    try {
      setIsSaving(true);

      await onSave(
        normalizedName,
      );
    } catch (saveError) {
      if (
        saveError instanceof Error
      ) {
        setError(
          saveError.message,
        );
      } else {
        setError(
          "Não foi possível atualizar o funcionário.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={
        isSaving
          ? undefined
          : onClose
      }
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
            Editar Funcionário
          </h3>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={isSaving}
            onClick={onClose}
          >
            <Icon
              name="x"
              size={16}
            />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding:
                "10px 12px",
              marginBottom: 16,
              borderRadius: 8,
              background:
                "#fef2f2",
              border:
                "1px solid #fecaca",
              color:
                "#b91c1c",
              fontSize: 12.5,
            }}
          >
            {error}
          </div>
        )}

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
                display:
                  "block",
                marginBottom: 5,
                fontSize: 12.5,
                fontWeight: 600,
                color:
                  "#374151",
              }}
            >
              Nome completo *
            </label>

            <input
              className="input-base"
              value={name}
              disabled={isSaving}
              onChange={(event) =>
                setName(
                  event.target
                    .value,
                )
              }
            />
          </div>

          <div>
            <label
              style={{
                display:
                  "block",
                marginBottom: 5,
                fontSize: 12.5,
                fontWeight: 600,
                color:
                  "#374151",
              }}
            >
              CPF
            </label>

            <input
              className="input-base"
              value={
                trabalhador.formattedCpf ||
                trabalhador.cpf
              }
              disabled
            />

            <div
              style={{
                marginTop: 5,
                color:
                  "#94a3b8",
                fontSize: 11.5,
              }}
            >
              O CPF não pode ser
              alterado.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 10,
            marginTop: 22,
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isSaving}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={isSaving}
            onClick={() =>
              void handleSave()
            }
          >
            {isSaving
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}