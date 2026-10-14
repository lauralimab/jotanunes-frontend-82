import { useNavigate } from "react-router-dom";

import Icon from "../../../shared/components/Icon";

export default function NaoEncontradoPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#fde8ea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}
        >
          <Icon
            name="alert"
            size={26}
            color="#c01a2b"
          />
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Página não encontrada
        </h1>

        <p
          style={{
            margin: "0 0 24px",
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          O endereço informado não existe ou não está
          disponível.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/")}
          style={{
            margin: "0 auto",
          }}
        >
          <Icon
            name="home"
            size={15}
          />

          Voltar ao início
        </button>
      </div>
    </div>
  );
}