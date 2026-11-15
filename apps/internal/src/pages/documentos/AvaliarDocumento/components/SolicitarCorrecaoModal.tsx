
import { useState } from "react";
import Icon from "../../../../shared/components/Icon";

type Props = {
  doc: {
    name: string;
    person: string;
  };
  onClose: () => void;
  onConfirm: (type: string, reason: string) => void;
  loading: boolean;
  error: string | null;
};

export default function SolicitarCorrecaoModal({
  doc,
  onClose,
  onConfirm,
  loading,
  error,
}: Props) {
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");

  const canSubmit =
    type.trim().length > 0 &&
    reason.trim().length > 0 &&
    !loading;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth: 510,
          width: "calc(100% - 32px)",
          padding: 28,
          borderRadius: 14,
          textAlign: "left",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 id="correction-title" style={{ margin: 0 }}>
            Solicitar correção
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar"
            style={{
              border: 0,
              background: "transparent",
              fontSize: 24,
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            marginTop: 10,
          }}
        >
          Informe o que precisa ser corrigido no documento.
        </p>

        <div
          style={{
            padding: 14,
            margin: "18px 0",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
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
          htmlFor="correction-type"
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Motivo principal *
        </label>

        <select
          id="correction-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            marginBottom: 18,
            background: "#fff",
          }}
        >
          <option value="">Selecione o motivo...</option>
          <option value="Documento ilegível">
            Documento ilegível
          </option>
          <option value="Dados divergentes">
            Dados divergentes
          </option>
          <option value="Documento vencido">
            Documento vencido
          </option>
          <option value="Assinatura ausente ou inválida">
            Assinatura ausente ou inválida
          </option>
          <option value="Documento incompleto">
            Documento incompleto
          </option>
          <option value="Outro">Outro</option>
        </select>

        <label
          htmlFor="correction-reason"
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Descrição detalhada *
        </label>

        <textarea
          id="correction-reason"
          rows={4}
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Descreva quais informações precisam ser corrigidas..."
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
            color: "#94a3b8",
            fontSize: 11,
            marginTop: 5,
          }}
        >
          {reason.length}/1000
        </div>

        <div
          style={{
            display: "flex",
            gap: 9,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 8,
            padding: 12,
            marginTop: 16,
            color: "#92400e",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <Icon name="info" size={16} color="#d97706" />
          <span>
            Esta solicitação será registrada como
            <strong> Reprovado</strong> no sistema, com o motivo
            da correção na justificativa.
          </span>
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontSize: 12,
              color: "#b91c1c",
              marginTop: 12,
            }}
          >
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
            className="btn btn-secondary"
            disabled={!canSubmit}
            onClick={() => void onConfirm(type, reason.trim())}
          >
            <Icon name="edit" size={15} />
            {loading ? "Enviando..." : "Enviar solicitação"}
          </button>
        </div>
      </div>
    </div>
  );
}
