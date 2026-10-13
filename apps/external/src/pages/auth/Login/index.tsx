import { useState } from "react";

import { login } from "../../../shared/api/auth";
import BrandLogo from "../../../shared/components/BrandLogo";
import type { AuthToken } from "../../../shared/types/auth";

type LoginPageProps = {
  onLogin: (auth: AuthToken) => void;
};

export default function LoginPage({
  onLogin,
}: LoginPageProps) {
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setLoginError("");

    if (!email.trim()) {
      setLoginError("Informe o e-mail.");
      return;
    }

    if (!pass.trim()) {
      setLoginError("Informe a senha.");
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
        setLoginError(error.message);
      } else {
        setLoginError("Não foi possível realizar o login.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          width: "min(880px, 94vw)",
          minHeight: 560,
        }}
      >
        <div
          style={{
            flex: "1 1 320px",
            background: "#8b1220",
            padding: 52,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <BrandLogo alternate white />
          </div>

          <div style={{ position: "relative" }}>
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 14px",
                lineHeight: 1.25,
              }}
            >
              Portal do Fornecedor
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 14,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Centralize o cadastro, envio e controle de documentos da sua
              empresa e funcionários terceirizados — versão 1.0.
            </p>
          </div>

          <div style={{ display: "flex", gap: 28, position: "relative" }}>
            {[["", ""], ["", ""], ["", ""]].map(([v, l], index) => (
              <div key={index}>
                <div
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {v}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 2,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

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
          {forgot ? (
            <>
              <button
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: "flex-start", marginBottom: 20 }}
                onClick={() => setForgot(false)}
              >
                ← Voltar
              </button>

              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                Recuperar senha
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: 13.5,
                  margin: "0 0 24px",
                }}
              >
                Informe seu e-mail para receber as instruções.
              </p>

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
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 16 }}
              />

              <button
                className="btn btn-primary btn-lg"
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                Enviar instruções
              </button>
            </>
          ) : (
            <>
              {loginError && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    fontSize: 12.5,
                  }}
                >
                  {loginError}
                </div>
              )}

              <h2
                style={{
                  fontFamily: "'DM Sans', sans-serif",
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
                Acesse com suas credenciais de fornecedor
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
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
                    onClick={() => setForgot(true)}
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
                    justifyContent: "center",
                  }}
                  onClick={() => void handleLogin()}
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar como Fornecedor"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}