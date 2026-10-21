
import { useState } from "react";
import Icon from "../../../../shared/components/Icon";

type Props = {
  doc: {
    name: string;
    person: string;
  };
  onClose: () => void;
  onConfirm: (type: string, reason: string) => Promise<void>;
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
  const [correctionType, setCorrectionType] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  const canSubmit =
    correctionType.trim().length > 0 &&
    correctionReason.trim().length > 0 &&
    !loading;

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="modal-box correction-modal-modern"
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="correction-top">
          <h3 id="correction-title">Solicitar correção</h3>

          <button
            type="button"
            className="correction-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <p className="correction-description">
          Informe quais informações precisam ser corrigidas
          ou qual documento deverá ser substituído.
        </p>

        <div className="correction-document">
          <span className="correction-document-label">
            DOCUMENTO SELECIONADO
          </span>
          <strong>{doc.name}</strong>
          <span>{doc.person}</span>
        </div>

        <div className="correction-field">
          <label htmlFor="correction-type">
            Motivo principal <span>*</span>
          </label>

          <select
            id="correction-type"
            className="select-base"
            value={correctionType}
            onChange={(event) =>
              setCorrectionType(event.target.value)
            }
            disabled={loading}
          >
            <option value="">Selecione o motivo...</option>
            <option>Documento ilegível ou com baixa qualidade</option>
            <option>CNPJ/CPF divergente do cadastro</option>
            <option>Documento vencido</option>
            <option>Assinatura ausente ou inválida</option>
            <option>Documento incompleto</option>
            <option>Outro</option>
          </select>
        </div>

        <div className="correction-field">
          <label htmlFor="correction-reason">
            Descrição detalhada <span>*</span>
          </label>

          <textarea
            id="correction-reason"
            rows={4}
            value={correctionReason}
            onChange={(event) =>
              setCorrectionReason(event.target.value)
            }
            placeholder="Explique o que precisa ser corrigido..."
            disabled={loading}
            maxLength={1000}
          />

          <div className="correction-counter">
            {correctionReason.length}/1000
          </div>
        </div>

        <div className="correction-warning">
          <Icon name="info" size={17} color="#d97706" />
          <span>
            Atualmente, o backend registra esta solicitação
            como <strong>Reprovado</strong>, incluindo o motivo
            da correção na justificativa.
          </span>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              color: "#b91c1c",
              fontSize: 12,
              padding: 10,
              background: "#fef2f2",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        <div className="correction-footer">
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
            className="btn btn-warning"
            disabled={!canSubmit}
            onClick={() =>
              void onConfirm(
                correctionType,
                correctionReason.trim()
              )
            }
          >
            <Icon name="edit" size={15} />
            {loading ? "Enviando..." : "Enviar solicitação"}
          </button>
        </div>
      </div>
    </div>
  );
}
