import Icon from "../../../../shared/components/Icon";

export type PasswordForm = {
  atual: string;
  nova: string;
  confirmar: string;
};

type ChangePasswordModalProps = {
  values: PasswordForm;
  onChange: (
    field: keyof PasswordForm,
    value: string,
  ) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function ChangePasswordModal({
  values,
  onChange,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const fields: {
    label: string;
    field: keyof PasswordForm;
  }[] = [
    {
      label: "Senha atual",
      field: "atual",
    },
    {
      label: "Nova senha",
      field: "nova",
    },
    {
      label: "Confirmar nova senha",
      field: "confirmar",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px",
          width: "min(420px, 92vw)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              fontFamily:
                "'DM Sans', sans-serif",
            }}
          >
            Alterar senha
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <Icon
              name="x"
              size={20}
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
          {fields.map(
            ({ label, field }) => (
              <div key={field}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 5,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.05em",
                  }}
                >
                  {label}
                </label>

                <input
                  className="input-base"
                  type="password"
                  placeholder="••••••••"
                  value={values[field]}
                  onChange={(event) =>
                    onChange(
                      field,
                      event.target.value,
                    )
                  }
                />
              </div>
            ),
          )}
        </div>

        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            background: "#f8fafc",
            borderRadius: 8,
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          Mínimo 8 caracteres, com letras
          maiúsculas, minúsculas e um número.
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            className="btn btn-ghost"
            style={{
              flex: 1,
              justifyContent: "center",
            }}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            style={{
              flex: 1,
              justifyContent: "center",
            }}
            onClick={onSave}
          >
            Salvar nova senha
          </button>
        </div>
      </div>
    </div>
  );
}