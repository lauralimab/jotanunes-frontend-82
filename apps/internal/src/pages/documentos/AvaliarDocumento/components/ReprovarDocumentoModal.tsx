import Icon from "../../../../shared/components/Icon";

type ReprovarDocumentoModalProps = { doc: { name: string; person: string }; setShowRejectModal: (value: boolean) => void; rejectConfirmed: boolean; setRejectConfirmed: (value: boolean) => void; setDecision: (value: "approved" | "rejected" | null) => void; };

export default function ReprovarDocumentoModal({ doc, setShowRejectModal, rejectConfirmed, setRejectConfirmed, setDecision }: ReprovarDocumentoModalProps) {
  return (
<div className="modal-overlay" onClick={() => { setShowRejectModal(false); setRejectConfirmed(false); }}>
          <div className="modal-box rejection-modal" onClick={e => e.stopPropagation()}>
            <div className="rejection-icon"><Icon name="x" size={22} /></div>
            <h3>Confirmar reprovação?</h3>
            <p>
              Esta ação reprovará <strong>{doc.name}</strong> de <strong>{doc.person}</strong> e será registrada no histórico.
            </p>
            <label className="rejection-check">
              <input
                type="checkbox"
                checked={rejectConfirmed}
                onChange={e => setRejectConfirmed(e.target.checked)}
              />
              <span>Revisei o documento e tenho certeza de que desejo reprová-lo.</span>
            </label>
            <div className="rejection-actions">
              <button className="btn btn-secondary" onClick={() => { setShowRejectModal(false); setRejectConfirmed(false); }}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                disabled={!rejectConfirmed}
                onClick={() => {
                  if (!rejectConfirmed) return;
                  setDecision("rejected");
                  setShowRejectModal(false);
                  setRejectConfirmed(false);
                }}
              >
                <Icon name="x" size={15} />
                Sim, reprovar documento
              </button>
            </div>
          </div>
        </div>
  );
}
