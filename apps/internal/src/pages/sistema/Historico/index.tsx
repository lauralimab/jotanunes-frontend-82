import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import { MOCK_HISTORY } from "../../../shared/mocks/portal";

export default function HistoricoPage() {
  const actionColors: Record<string, string> = {
    "Aprovação de documento": "#16a34a", "Reprovação de documento": "#dc2626",
    "Envio de documento": "#c01a2b", "Correção solicitada": "#d97706",
    "Bloqueio automático": "#dc2626", "Autorização excepcional": "#7c3aed",
    "Recebimento de material": "#0891b2",
  };
  return (
    <>
      <Header title="Histórico de Ações" subtitle="Rastreabilidade completa de todas as atividades do sistema"
        actions={<button className="btn btn-secondary btn-sm"><Icon name="doc" size={14} />Exportar CSV</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(15, 23, 42, 0.06)", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar no histórico..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base"><option>Todos os usuários</option><option>Ana Carvalho</option><option>Pedro Mota</option><option>Sistema</option></select>
            <select className="select-base"><option>Todas as ações</option><option>Aprovação</option><option>Reprovação</option><option>Envio</option><option>Correção</option><option>Autorização</option></select>
            <input className="select-base" type="date" defaultValue="2026-09-01" />
          </div>
          <div style={{ overflowX: "auto" }}>
<table className="table-base">
            <thead><tr><th>Usuário</th><th>Perfil</th><th>Ação</th><th>Documento</th><th>Fornecedor</th><th>Data / Hora</th></tr></thead>
            <tbody>
              {MOCK_HISTORY.map(h => (
                <tr key={h.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#c01a2b", flexShrink: 0 }}>
                        {h.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{h.user}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${h.role === "Analista Jotanunes" ? "badge-blue" : h.role === "Automático" ? "badge-danger" : "badge-gray"}`}>{h.role}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 600, color: actionColors[h.action] ?? "#374151" }}>{h.action}</span></td>
                  <td style={{ fontSize: 13 }}>{h.doc}</td>
                  <td style={{ fontSize: 13 }}>{h.supplier}</td>
                  <td style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{MOCK_HISTORY.length} registros</span>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
