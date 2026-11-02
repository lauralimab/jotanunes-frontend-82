import {
  useState,
} from "react";

import Icon from "../../../../shared/components/Icon";

import {
  formatCpf,
  isValidCpf,
  onlyCpfDigits,
} from "../../../../shared/utils/cpf";

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

const labelStyle = {
  fontSize: 12.5,
  fontWeight: 600,
  color: "#374151",
  display: "block",
  marginBottom: 5,
} as const;

const errorTextStyle = {
  marginTop: 5,
  color: "#b91c1c",
  fontSize: 11.5,
} as const;

export default function AdicionarTrabalhadorModal({
  onClose,
  onAdd,
}: AdicionarTrabalhadorModalProps) {
  const [name, setName] =
    useState("");

  const [cpf, setCpf] =
    useState("");

  const [nameError, setNameError] =
    useState("");

  const [cpfError, setCpfError] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  function validateCpf(
    value: string,
  ) {
    if (!value) {
      return "Informe o CPF.";
    }

    if (!isValidCpf(value)) {
      return "CPF inválido. Confira os números digitados.";
    }

    return "";
  }

  async function handleAdd() {
    const normalizedName =
      name.trim();

    const nextNameError =
      normalizedName
        ? ""
        : "Informe o nome completo.";

    const nextCpfError =
      validateCpf(cpf);

    setNameError(nextNameError);
    setCpfError(nextCpfError);
    setError("");

    if (
      nextNameError ||
      nextCpfError
    ) {
      return;
    }

    try {
      setIsSaving(true);

      await onAdd({
        name: normalizedName,
        cpf: onlyCpfDigits(cpf),
      });
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Não foi possível cadastrar o funcionário.",
      );
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
              padding: "10px 12px",
              marginBottom: 16,
              borderRadius: 8,
              background: "#fef2f2",
              border:
                "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: 12.5,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <label
              htmlFor="novo-funcionario-nome"
              style={labelStyle}
            >
              Nome completo *
            </label>

            <input
              id="novo-funcionario-nome"
              className="input-base"
              placeholder="Ex.: Maria da Silva Santos"
              value={name}
              disabled={isSaving}
              aria-invalid={
                nameError
                  ? true
                  : undefined
              }
              style={
                nameError
                  ? {
                    borderColor:
                      "#dc2626",
                  }
                  : undefined
              }
              onChange={(event) => {
                setName(
                  event.target.value,
                );
                setNameError("");
              }}
            />

            {nameError && (
              <div
                role="alert"
                style={errorTextStyle}
              >
                {nameError}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="novo-funcionario-cpf"
              style={labelStyle}
            >
              CPF *
            </label>

            <input
              id="novo-funcionario-cpf"
              className="input-base"
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              value={cpf}
              disabled={isSaving}
              aria-invalid={
                cpfError
                  ? true
                  : undefined
              }
              style={
                cpfError
                  ? {
                    borderColor:
                      "#dc2626",
                  }
                  : undefined
              }
              onChange={(event) => {
                setCpf(
                  formatCpf(
                    event.target.value,
                  ),
                );
                setCpfError("");
              }}
              onBlur={() => {
                // Só valida ao sair do campo se algo foi digitado.
                if (cpf) {
                  setCpfError(
                    validateCpf(cpf),
                  );
                }
              }}
            />

            {cpfError && (
              <div
                role="alert"
                style={errorTextStyle}
              >
                {cpfError}
              </div>
            )}
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
              void handleAdd()
            }
          >
            {isSaving
              ? "Adicionando..."
              : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
