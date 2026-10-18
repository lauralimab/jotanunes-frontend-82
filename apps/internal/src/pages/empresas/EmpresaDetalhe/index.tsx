import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import type { Screen } from "../../../shared/types/portal";
import { MOCK_SUPPLIERS, MOCK_DOCUMENTS, MOCK_EMPLOYEES } from "../../../shared/mocks/portal";

export default function EmpresaDetalhePage({ onNav }: { onNav: (s: Screen) => void }) {
  const s = MOCK_SUPPLIERS[1];
  const pct = 68;
  return (
    <>
      <Header title="Detalhes do Fornecedor"
        actions={<><button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>← Voltar</button><button className="btn btn-primary btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={14} />Analisar Docs</button></>} />
      <PageWrapper>
        <div className="card" style={{ marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#c01a2b", flexShrink: 0 }}>SL</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{s.name}</h2>
              <StatusBadge status={s.status} />
              <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed" }}><Icon name="mappin" size={11} />Petrolina</span>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["CNPJ", s.cnpj], ["Contato", s.contact], ["Última atualização", s.lastUpdate], ["Docs pendentes", String(s.pendingDocs)]].map(([l, v]) => (
                <div key={l}><div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div><div style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: pct >= 100 ? "#16a34a" : "#ca8a04" }}>{pct}%</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Documentação</div>
            <div className="progress-bar-track" style={{ width: 80, marginTop: 6 }}><div className="progress-bar-fill" style={{ width: `${pct}%`, background: "#ca8a04" }} /></div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Funcionários</h3>
              {MOCK_EMPLOYEES.map(e => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#374151" }}>
                      {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 11.5, color: "#9ca3af" }}>{e.role}</div></div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Documentos</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table-base">
              <thead><tr><th>Documento</th><th>Status</th><th>Validade</th><th></th></tr></thead>
              <tbody>
                {MOCK_DOCUMENTS.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontSize: 12.5, fontWeight: 600 }}>{d.name}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td style={{ fontSize: 12.5, color: "#6b7280" }}>{d.validity}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
