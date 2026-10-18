import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import { MOCK_SUPPLIERS, MOCK_MATERIAIS } from "../../../shared/mocks/portal";

export default function RecebimentoMaterialPage() {
  const [showNew, setShowNew] = useState(false);
  return (
    <>
      <Header title="Recebimento de Material" subtitle="RF16 — Registro de materiais recebidos de fornecedores"
        actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}><Icon name="plus" size={15} />Registrar Recebimento</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar por fornecedor ou material..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base"><option>Todos os fornecedores</option>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select>
            <input className="select-base" type="date" />
          </div>
          <table className="table-base">
            <thead><tr><th>Fornecedor</th><th>Material Recebido</th><th>Recebido por</th><th>Data</th><th>Observações</th><th>Ações</th></tr></thead>
            <tbody>
              {MOCK_MATERIAIS.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.supplier}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="package" size={16} color="#6b7280" />
                      </div>
                      <span>{m.material}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#c01a2b" }}>
                        {m.recebidoPor.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13 }}>{m.recebidoPor}</span>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>{m.data}</td>
                  <td style={{ fontSize: 12.5, color: m.obs ? "#374151" : "#9ca3af", fontStyle: m.obs ? "normal" : "italic" }}>{m.obs || "Sem observações"}</td>
                  <td><button className="btn btn-ghost btn-sm"><Icon name="eye" size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{MOCK_MATERIAIS.length} registros — RF16 Definido ✅</span>
          </div>
        </div>
      </PageWrapper>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Registrar Recebimento — RF16</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}><Icon name="x" size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Fornecedor *</label><select className="select-base" style={{ width: "100%" }}>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Material / Descrição *</label><input className="input-base" placeholder="Ex: Capacetes de segurança (20 un.)" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Data de Recebimento *</label><input className="input-base" type="date" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Recebido por</label><input className="input-base" defaultValue="Ana Carvalho" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Observações</label><textarea className="input-base" rows={3} placeholder="Condições, divergências, devoluções..." style={{ resize: "vertical" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={() => setShowNew(false)}><Icon name="package" size={15} />Registrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
