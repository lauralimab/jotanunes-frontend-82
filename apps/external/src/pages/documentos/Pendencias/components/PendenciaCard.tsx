import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

export type DocumentoPendente = {
  id: number;
  name: string;
  person: string;
  status: string;
  validity: string;
};

type PendenciaCardProps = {
  document: DocumentoPendente;
  reason?: string;
  onCorrect: () => void;
};

export default function PendenciaCard({
  document,
  reason,
  onCorrect,
}: PendenciaCardProps) {
  const isCorrection =
    document.status === "correction";

  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        borderLeft: `3px solid ${
          isCorrection
            ? "#d97706"
            : "#dc2626"
        }`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: isCorrection
            ? "#fff7ed"
            : "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          name="doc"
          size={20}
          color={
            isCorrection
              ? "#d97706"
              : "#dc2626"
          }
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
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {document.name}
          </span>

          <StatusBadge
            status={document.status}
          />
        </div>

        <p
          style={{
            margin: "0 0 4px",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          {document.person} • Validade:{" "}
          {document.validity}
        </p>

        {reason && (
          <div
            style={{
              background: isCorrection
                ? "#fff7ed"
                : "#fef2f2",
              borderRadius: 6,
              padding: "8px 12px",
              marginTop: 8,
              border: `1px solid ${
                isCorrection
                  ? "#fed7aa"
                  : "#fecaca"
              }`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isCorrection
                  ? "#92400e"
                  : "#b91c1c",
              }}
            >
              Motivo da correção:{" "}
            </span>

            <span
              style={{
                fontSize: 12,
                color: "#374151",
              }}
            >
              {reason}
            </span>
          </div>
        )}
      </div>

      <button
        className="btn btn-primary btn-sm"
        onClick={onCorrect}
      >
        <Icon
          name="upload"
          size={13}
        />

        Corrigir Documento
      </button>
    </div>
  );
}