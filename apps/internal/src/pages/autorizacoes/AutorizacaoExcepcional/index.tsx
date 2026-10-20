import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import { MOCK_SUPPLIERS, MOCK_AUTORIZACOES } from "../../../shared/mocks/portal";

export default function AutorizacaoExcepcionalPage() {
  const [showNew, setShowNew] = useState(false);
  return (
    <>
      <Header title="Autorizações Excepcionais" subtitle="Autorização temporária para fornecedores com documentação irregular"
        actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}><Icon name="plus" size={15} />Nova Autorização</button>} />
      <PageWrapper>
        <div style={{ padding: "12px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, marginBottom: 20, display: "flex", gap: 10 }}>
          <Icon name="alert" size={18} color="#d97706" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Status: Pendente de definição (Validar com cliente)</div>
            <div style={{ fontSize: 12.5, color: "#78350f" }}>Fluxo de aprovação, escopo e vigência das autorizações excepcionais ainda está em revisão com a Jotanunes.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MOCK_AUTORIZACOES.map(a => (
            <div key={a.id} className="card" style={{ borderLeft: `3px solid ${a.status === "approved" ? "#16a34a" : "#ca8a04"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{a.supplier}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 10 }}>
                    {[["Funcionário/Escopo", a.funcionario], ["Solicitante", a.solicitante], ["Aprovador", a.aprovador], ["Válida até", a.validade]].map(([l, v]) => (
                      <div key={l}><div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div><div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{v}</div></div>
                    ))}
                  </div>
                  <div style={{ background: "#fef9c3", borderRadius: 6, padding: "8px 12px", border: "1px solid #fde68a" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>Justificativa: </span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{a.motivo}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 16 }}>
                  {a.status === "pending" && <><button className="btn btn-success btn-sm"><Icon name="check" size={13} />Aprovar</button><button className="btn btn-danger btn-sm"><Icon name="x" size={13} />Negar</button></>}
                  <button className="btn btn-ghost btn-sm"><Icon name="list" size={13} />Histórico</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Nova Autorização Excepcional</h3>
              <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar formulário" onClick={() => setShowNew(false)}><Icon name="x" size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Fornecedor *</label><select className="select-base" style={{ width: "100%" }}>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Funcionário / Escopo</label><input className="input-base" placeholder="Ex: Empresa inteira ou nome do funcionário" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Documento(s) com pendência</label><input className="input-base" placeholder="Ex: ASO vencido, Certidão Estadual em renovação" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Justificativa *</label><textarea className="input-base" rows={3} placeholder="Motivo da autorização excepcional..." style={{ resize: "vertical" }} /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Válida até *</label><input className="input-base" type="date" /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowNew(false)}>Solicitar Autorização</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
