
import Icon from "../../../../shared/components/Icon";

type Props = {
  documentName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmarAprovacaoModal({
  documentName,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="approve-title"
        style={{
          width: "calc(100% - 32px)",
          maxWidth: 440,
          padding: 28,
          borderRadius: 16,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fechar"
            style={{
              border: 0,
              background: "transparent",
              color: "#94a3b8",
              fontSize: 24,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <h3
          id="approve-title"
          style={{
            margin: "0 0 10px",
            fontSize: 19,
            color: "#0f172a",
          }}
        >
          Confirmar aprovação?
        </h3>

        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            margin: "0 0 18px",
          }}
        >
          Você está prestes a aprovar o documento abaixo.
          Essa decisão será registrada no sistema.
        </p>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 14,
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {documentName}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            borderTop: "1px solid #e2e8f0",
            paddingTop: 18,
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={onConfirm}
            disabled={loading}
          >
            <Icon name="check" size={15} />
            {loading ? "Aprovando..." : "Confirmar aprovação"}
          </button>
        </div>
      </div>
    </div>
  );
}
