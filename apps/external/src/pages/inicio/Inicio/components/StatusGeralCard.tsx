import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

type StatusGeralCardProps = {
  onSendDocument: () => void;
  onViewPendencies: () => void;
};

export default function StatusGeralCard({
  onSendDocument,
  onViewPendencies,
}: StatusGeralCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid #fbbf24",
        borderRadius: 12,
        padding: "18px 24px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#fef9c3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          name="alert"
          size={24}
          color="#ca8a04"
        />
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Status Geral
          </span>

          <StatusBadge status="pending" />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Documentos pendentes precisam ser
          regularizados. O status{" "}
          <strong>APTO</strong> exige 100% dos
          documentos obrigatórios aprovados
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          className="btn btn-primary"
          onClick={onSendDocument}
        >
          <Icon
            name="upload"
            size={15}
          />

          Enviar Documento
        </button>

        <button
          className="btn btn-secondary"
          onClick={onViewPendencies}
        >
          <Icon
            name="alert"
            size={15}
          />

          Ver Pendências
        </button>
      </div>
    </div>
  );
}