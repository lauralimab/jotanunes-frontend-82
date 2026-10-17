import { useState } from "react";

import { useAuth } from "../../../app/providers";

import Icon from "../../../shared/components/Icon";

export default function TrocarSenhaPage() {
  const {
    handleChangePassword,
    handleLogout,
  } = useAuth();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmation,
    setConfirmation,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  async function handleSubmit() {
    setError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmation
    ) {
      setError(
        "Preencha todos os campos.",
      );

      return;
    }

    if (newPassword.length < 8) {
      setError(
        "A nova senha deve ter pelo menos 8 caracteres.",
      );

      return;
    }

    if (
      newPassword ===
      currentPassword
    ) {
      setError(
        "A nova senha deve ser diferente da senha atual.",
      );

      return;
    }

    if (
      newPassword !==
      confirmation
    ) {
      setError(
        "A confirmação da nova senha não confere.",
      );

      return;
    }

    try {
      setIsLoading(true);

      await handleChangePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation:
          confirmation,
      });
    } catch (changeError) {
      if (
        changeError instanceof Error
      ) {
        setError(
          changeError.message,
        );
      } else {
        setError(
          "Não foi possível alterar a senha.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  function renderPasswordField(
    label: string,
    value: string,
    onChange: (
      value: string,
    ) => void,
    visible: boolean,
    onToggle: () => void,
    autoComplete:
      | "current-password"
      | "new-password",
  ) {
    return (
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: "#374151",
          }}
        >
          {label}
        </label>

        <div
          style={{
            position: "relative",
          }}
        >
          <input
            className="input-base"
            type={
              visible
                ? "text"
                : "password"
            }
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value,
              )
            }
            autoComplete={
              autoComplete
            }
            style={{
              paddingRight: 44,
            }}
          />

          <button
            type="button"
            onClick={onToggle}
            title={
              visible
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            aria-label={
              visible
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform:
                "translateY(-50%)",
              width: 34,
              height: 34,
              border: "none",
              background:
                "transparent",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius: 7,
            }}
          >
            <Icon
              name={
                visible
                  ? "eyeOff"
                  : "eye"
              }
              size={17}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div
        style={{
          width:
            "min(440px, 100%)",
          background:
            "rgba(255,255,255,0.94)",
          border:
            "1px solid rgba(15,23,42,0.08)",
          borderRadius: 18,
          padding:
            "36px 38px",
          boxShadow:
            "0 24px 60px rgba(15,23,42,0.12)",
        }}
      >
        <h1
          style={{
            margin:
              "0 0 8px",
            fontSize: 24,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Altere sua senha
        </h1>

        <p
          style={{
            margin:
              "0 0 26px",
            color: "#64748b",
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          Por segurança, sua senha
          provisória precisa ser
          alterada antes de acessar
          o Portal do Fornecedor.
        </p>

        {error && (
          <div
            style={{
              padding:
                "11px 13px",
              marginBottom: 18,
              borderRadius: 9,
              background:
                "#fef2f2",
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
            flexDirection:
              "column",
            gap: 16,
          }}
        >
          {renderPasswordField(
            "Senha atual",
            currentPassword,
            setCurrentPassword,
            showCurrentPassword,
            () =>
              setShowCurrentPassword(
                (current) =>
                  !current,
              ),
            "current-password",
          )}

          {renderPasswordField(
            "Nova senha",
            newPassword,
            setNewPassword,
            showNewPassword,
            () =>
              setShowNewPassword(
                (current) =>
                  !current,
              ),
            "new-password",
          )}

          {renderPasswordField(
            "Confirmar nova senha",
            confirmation,
            setConfirmation,
            showConfirmation,
            () =>
              setShowConfirmation(
                (current) =>
                  !current,
              ),
            "new-password",
          )}
        </div>

        <button
          className="btn btn-primary btn-lg"
          disabled={isLoading}
          onClick={() =>
            void handleSubmit()
          }
          style={{
            width: "100%",
            justifyContent:
              "center",
            marginTop: 22,
          }}
        >
          {isLoading
            ? "Alterando senha..."
            : "Alterar senha e continuar"}
        </button>

        <button
          className="btn btn-ghost"
          disabled={isLoading}
          onClick={() =>
            void handleLogout()
          }
          style={{
            width: "100%",
            justifyContent:
              "center",
            marginTop: 8,
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}