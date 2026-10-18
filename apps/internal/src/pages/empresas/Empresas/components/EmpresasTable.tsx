import type { Screen } from "../../../../shared/types/portal";
import { useState } from "react";
import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { MOCK_SUPPLIERS } from "../../../../shared/mocks/portal";



export default function EmpresasTable({ onNav }: { onNav: (screen: Screen) => void }) {
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [unidadeFilter, setUnidadeFilter] = useState("all");
const filtered = MOCK_SUPPLIERS.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.cnpj.includes(q)) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (unidadeFilter !== "all" && s.unidade !== unidadeFilter) return false;
    return true;
  });
  return (
<div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar por nome ou CNPJ..." style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="select-base" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Todos os status</option><option value="apt">Apto</option><option value="pending">Pendente</option><option value="blocked">Bloqueado</option>
            </select>
            <select className="select-base" value={unidadeFilter} onChange={e => setUnidadeFilter(e.target.value)}>
              <option value="all">Todas as unidades</option>
              <option value="Belo Horizonte">Belo Horizonte</option>
              <option value="Petrolina">Petrolina (RF14)</option>
            </select>
          </div>
          <table className="table-base">
            <thead><tr><th>Fornecedor</th><th>CNPJ</th><th>Unidade</th><th>Status</th><th>Docs Pendentes</th><th>Última Atualização</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#c01a2b", flexShrink: 0 }}>
                        {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5 }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{s.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{s.cnpj}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="mappin" size={13} color={s.unidade === "Petrolina" ? "#7c3aed" : "#6b7280"} />
                      <span style={{ fontSize: 12.5, color: s.unidade === "Petrolina" ? "#7c3aed" : "#374151", fontWeight: s.unidade === "Petrolina" ? 600 : 400 }}>{s.unidade}</span>
                      {s.unidade === "Petrolina" && <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed", fontSize: 10 }}>RF14</span>}
                    </div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{s.pendingDocs > 0 ? <span style={{ fontWeight: 700, color: "#dc2626" }}>{s.pendingDocs}</span> : <span style={{ color: "#6b7280" }}>—</span>}</td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{s.lastUpdate}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => onNav("supplier-details")}>Detalhes</button>
                      {s.pendingDocs > 0 && <button className="btn btn-warning btn-sm" onClick={() => onNav("document-analysis")}>Analisar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{filtered.length} fornecedor(es)</span>
            <div style={{ display: "flex", gap: 6 }}>{[1,2,3].map(n => <button key={n} className="btn btn-ghost btn-sm" style={{ minWidth: 32, justifyContent: "center", background: n === 1 ? "#fde8ea" : undefined, color: n === 1 ? "#c01a2b" : undefined }}>{n}</button>)}</div>
          </div>
        </div>
  );
}
