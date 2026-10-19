import { useState } from "react";

type EsqueciSenhaPageProps = {
  onBack: () => void;
};

export default function EsqueciSenhaPage({
  onBack,
}: EsqueciSenhaPageProps) {
  const [email, setEmail] = useState("");

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
      }}
    >
      <div
        style={{
          width: "min(420px, 92vw)",
          background: "#fff",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 20 }}
          onClick={onBack}
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
      </div>
    </div>
  );
}