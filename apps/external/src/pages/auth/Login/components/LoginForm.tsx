import { useState } from "react";

import { login } from "../../../../shared/api/auth";
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

  const [loginError, setLoginError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

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
    <div
      style={{
        flex: "1 1 320px",
        maxWidth: 420,
        padding: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
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

          <input
            className="input-base"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(event) =>
              setPass(
                event.target.value,
              )
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <button
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
          className="btn btn-primary btn-lg"
          style={{
            width: "100%",
            justifyContent:
              "center",
          }}
          onClick={() =>
            void handleLogin()
          }
          disabled={isLoading}
        >
          {isLoading
            ? "Entrando..."
            : "Entrar como Fornecedor"}
        </button>
      </div>
    </div>
  );
}