import { useState } from "react";

import { login } from "../../../../shared/api/auth";
import Icon from "../../../../shared/components/Icon";
import styles from "../Login.module.css";

import type { AuthToken } from "../../../../shared/types/auth";

type LoginFormProps = {
  onLogin: (auth: AuthToken) => void;
  onForgotPassword: () => void;
};

export default function LoginForm({
  onLogin,
  onForgotPassword,
}: LoginFormProps) {
  const [email, setEmail] =
    useState("");

  const [pass, setPass] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loginError,
    setLoginError,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  async function handleLogin() {
    setLoginError("");

    if (!email.trim()) {
      setLoginError(
        "Informe o e-mail.",
      );

      return;
    }

    if (!pass.trim()) {
      setLoginError(
        "Informe a senha.",
      );

      return;
    }

    try {
      setIsLoading(true);

      const auth = await login({
        email: email.trim(),
        password: pass,
      });

      onLogin(auth);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(
          error.message,
        );
      } else {
        setLoginError(
          "Não foi possível realizar o login.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!isLoading) {
          void handleLogin();
        }
      }}
      noValidate
      className={styles.welcomePanel}
    >
      <div className={styles.welcomeContent}>
        {loginError && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: "#fef2f2",
              border:
                "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: 12.5,
              marginBottom: 18,
            }}
          >
            {loginError}
          </div>
        )}

        <h2
          style={{
            fontFamily:
              "'DM Sans', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            margin: "0 0 6px",
          }}
        >
          Entrar no sistema
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: 13.5,
            margin: "0 0 28px",
          }}
        >
          Acesse com suas credenciais de
          fornecedor
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              E-mail
            </label>

            <input
              className="input-base"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(
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
                marginBottom: 6,
              }}
            >
              Senha
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                className="input-base"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={pass}
                onChange={(event) =>
                  setPass(
                    event.target.value,
                  )
                }
                style={{
                  paddingRight: 44,
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                title={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                style={{
                  position:
                    "absolute",
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
                    showPassword
                      ? "eyeOff"
                      : "eye"
                  }
                  size={17}
                />
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#c01a2b",
                fontSize: 12.5,
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={
                onForgotPassword
              }
            >
              Esqueci minha senha
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 16,
          }}
        >
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{
              width: "100%",
              justifyContent: "center",
            }}
            disabled={isLoading}
          >
            {isLoading
              ? "Entrando..."
              : "Entrar como Fornecedor"}
          </button>
        </div>
      </div>
    </form>
  );
}