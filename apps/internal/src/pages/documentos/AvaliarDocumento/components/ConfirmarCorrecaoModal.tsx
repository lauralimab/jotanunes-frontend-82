
import Icon from "../../../../shared/components/Icon";

type Props = {
  documentName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmarCorrecaoModal({
  documentName,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="modal-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-correction-title"
        aria-describedby="confirm-correction-description"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "calc(100% - 32px)",
          maxWidth: 440,
          borderRadius: 16,
          padding: 28,
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
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
          id="confirm-correction-title"
          style={{
            fontSize: 19,
            margin: "0 0 10px",
            color: "#0f172a",
          }}
        >
          Confirmar solicitação?
        </h3>

        <p
          id="confirm-correction-description"
          style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            margin: "0 0 18px",
          }}
        >
          Você está prestes a solicitar a correção do documento
          abaixo. Confira antes de continuar.
        </p>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 14,
            marginBottom: 16,
            fontSize: 13,
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          {documentName}
        </div>

        <div
          style={{
            padding: 13,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 9,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 22,
          }}
        >
          <Icon name="info" size={16} color="#d97706" />

          <span
            style={{
              fontSize: 12,
              color: "#92400e",
              lineHeight: 1.5,
            }}
          >
            A solicitação será registrada no backend como
            <strong> Reprovado</strong>, com o motivo da
            correção na justificativa.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
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
            {loading ? "Enviando..." : "Confirmar solicitação"}
          </button>
        </div>
      </div>
    </div>
  );
}
