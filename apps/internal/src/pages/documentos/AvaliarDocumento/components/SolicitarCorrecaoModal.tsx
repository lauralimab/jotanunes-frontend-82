import Icon from "../../../../shared/components/Icon";

type SolicitarCorrecaoModalProps = { doc: { name: string }; setShowModal: (value: boolean) => void; correctionType: string; setCorrectionType: (value: string) => void; correctionReason: string; setCorrectionReason: (value: string) => void; };

export default function SolicitarCorrecaoModal({ doc, setShowModal, correctionType, setCorrectionType, correctionReason, setCorrectionReason }: SolicitarCorrecaoModalProps) {
  return (
<div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Solicitar Correção</h3>
              <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar formulário" onClick={() => setShowModal(false)}><Icon name="x" size={16} /></button>
            </div>
            <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 20px" }}>Informe ao fornecedor o que precisa ser corrigido. O status mudará para <strong>Correção Solicitada</strong>.</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Documento</label>
              <input className="input-base" value={doc.name} readOnly style={{ background: "#f9fafb" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Motivo Principal *</label>
              <select className="select-base" style={{ width: "100%" }} value={correctionType} onChange={e => setCorrectionType(e.target.value)}>
                <option value="">Selecione o motivo...</option>
                <option>Documento ilegível ou com baixa qualidade</option>
                <option>CNPJ/CPF divergente do cadastro</option>
                <option>Documento vencido</option>
                <option>Assinatura ausente ou inválida</option>
                <option>Documento incompleto</option>
                <option>Outro</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Descrição detalhada *</label>
              <textarea className="input-base" rows={4} placeholder="Descreva com detalhes o que precisa ser corrigido..." style={{ resize: "vertical" }} value={correctionReason} onChange={e => setCorrectionReason(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-warning" onClick={() => setShowModal(false)}><Icon name="edit" size={15} />Enviar Solicitação</button>
            </div>
          </div>
        </div>
  );
}
