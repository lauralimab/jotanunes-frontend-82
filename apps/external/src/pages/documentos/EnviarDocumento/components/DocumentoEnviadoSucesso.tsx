import Icon from "../../../../shared/components/Icon";

type DocumentoEnviadoSucessoProps = {
  onSendAnother: () => void;

  actionLabel?: string;
};

export default function DocumentoEnviadoSucesso({
  onSendAnother,
  actionLabel = "Enviar outro",
}: DocumentoEnviadoSucessoProps) {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#dcfce7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <Icon
          name="check"
          size={32}
          color="#16a34a"
        />
      </div>

      <h3
        style={{
          fontFamily:
            "'DM Sans', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Documento enviado com sucesso!
      </h3>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        Status:{" "}
        <strong>
          Aguardando Análise
        </strong>{" "}
        — documento recebido e aguardando análise pela equipe Jotanunes.
      </p>

      <button
        className="btn btn-primary"
        onClick={
          onSendAnother
        }
      >
        <Icon
          name="check"
          size={15}
        />

        {actionLabel}
      </button>
    </div>
  );
}