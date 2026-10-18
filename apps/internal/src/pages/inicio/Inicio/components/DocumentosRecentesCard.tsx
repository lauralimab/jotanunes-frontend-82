import type { Screen } from "../../../../shared/types/portal";
import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { MOCK_DOCUMENTS } from "../../../../shared/mocks/portal";



export default function DocumentosRecentesCard({ onNav }: { onNav: (screen: Screen) => void }) {
  return (
<div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Documentos Aguardando Análise</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav("admin-suppliers")}>Ver todos</button>
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table-base">
              <thead><tr><th>Documento</th><th>Fornecedor</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                {MOCK_DOCUMENTS.filter(d => ["pending","correction"].includes(d.status)).map(d => (
                  <tr key={d.id}>
                    <td><div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 11.5, color: "#9ca3af" }}>{d.uploadedAt}</div></td>
                    <td style={{ fontSize: 13 }}>{d.person}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={13} />Analisar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
  );
}
