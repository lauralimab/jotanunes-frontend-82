
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
};

export default function ReprovarDocumentoModal({
  doc,
  onClose,
  onConfirm,
  loading,
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
        className="modal-box rejection-modal rejection-modal-modern"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reject-top">
       

          <button
            type="button"
            className="reject-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <h3 id="reject-title">Reprovar documento</h3>

        <p className="reject-description">
          Informe o motivo da reprovação. Essa decisão será
          registrada no sistema.
        </p>

        <div className="reject-document">
          <span className="reject-document-label">
            DOCUMENTO SELECIONADO
          </span>

          <strong>{doc.name}</strong>
          <span>{doc.person}</span>
        </div>

        <div className="reject-field">
          <label htmlFor="reject-reason">
            Motivo da reprovação <span>*</span>
          </label>

          <textarea
            id="reject-reason"
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Descreva por que o documento não atende aos requisitos..."
            disabled={loading}
            maxLength={1000}
          />

          <div className="reject-field-footer">
            <span>Justificativa obrigatória</span>
            <span>{reason.length}/1000</span>
          </div>
        </div>

        <label className="reject-confirmation">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            disabled={loading}
          />

          <span>
            Confirmo que revisei o documento e desejo reprová-lo.
          </span>
        </label>

        <div className="reject-footer">
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
