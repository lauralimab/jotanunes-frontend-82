
import { useState } from "react";
import Icon from "../../../../shared/components/Icon";

type Props = {
  doc: {
    name: string;
    person: string;
  };
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function ReprovarDocumentoModal({
  doc,
  onClose,
  onConfirm,
  loading,
  error,
}: Props) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canSubmit = reason.trim().length > 0 && confirmed && !loading;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="modal-box rejection-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth: 500,
          width: "calc(100% - 32px)",
          padding: 28,
          borderRadius: 14,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 id="reject-title" style={{ margin: 0 }}>
            Reprovar documento
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar"
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              fontSize: 24,
              color: "#94a3b8",
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: 13, color: "#64748b", marginTop: 10 }}>
          Informe o motivo da reprovação. Essa decisão será registrada
          no sistema.
        </p>

        <div
          style={{
            padding: 14,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            margin: "18px 0",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <strong style={{ fontSize: 13 }}>{doc.name}</strong>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            {doc.person}
          </span>
        </div>

        <label
          htmlFor="reject-reason"
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Motivo da reprovação *
        </label>

        <textarea
          id="reject-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Descreva por que o documento não atende aos requisitos..."
          rows={4}
          maxLength={1000}
          disabled={loading}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            resize: "vertical",
            font: "inherit",
            fontSize: 13,
          }}
        />

        <div
          style={{
            textAlign: "right",
            fontSize: 11,
            color: "#94a3b8",
            marginTop: 5,
          }}
        >
          {reason.length}/1000
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            marginTop: 16,
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            disabled={loading}
          />
          Confirmo que revisei o documento e desejo reprová-lo.
        </label>

        {error && (
          <p role="alert" style={{ color: "#b91c1c", fontSize: 12 }}>
            {error}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-danger"
            disabled={!canSubmit}
            onClick={() => void onConfirm(reason.trim())}
          >
            <Icon name="x" size={15} />
            {loading ? "Reprovando..." : "Confirmar reprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}
