import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import type { DocStatus } from "../../../shared/types/portal";
import { MOCK_SUPPLIERS } from "../../../shared/mocks/portal";

export default function VencimentosPage() {
  const items = [
    { doc: "ASO — Carlos Souza",         supplier: "TechClean Terceirizados",    validity: "01/08/2026", days: -14, status: "expired"   as DocStatus },
    { doc: "Certidão Negativa FGTS",      supplier: "Serviços e Logística SA",    validity: "10/10/2026", days: 26,  status: "pending"   as DocStatus },
    { doc: "Certidão Negativa Municipal", supplier: "Vigilância Suprema Eireli",  validity: "18/10/2026", days: 34,  status: "pending"   as DocStatus },
    { doc: "NR-35 — João Ferreira",       supplier: "Serviços e Logística SA",    validity: "30/11/2026", days: 77,  status: "approved"  as DocStatus },
    { doc: "Contrato Social",             supplier: "Facilities Total ME",        validity: "15/10/2026", days: 31,  status: "approved"  as DocStatus },
  ];
  return (
    <>
      <Header title="Vencimentos" subtitle="Controle de validade dos documentos" />
      <PageWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[{ label: "Vencidos", value: 3, color: "#dc2626", bg: "#fee2e2" }, { label: "Vence em 30 dias", value: 5, color: "#d97706", bg: "#fff7ed" }, { label: "Vence em 60 dias", value: 8, color: "#ca8a04", bg: "#fef9c3" }, { label: "Em dia", value: 42, color: "#16a34a", bg: "#dcfce7" }].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1 }}>
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(15, 23, 42, 0.06)", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select className="select-base"><option>Somente vencidos</option><option>Próximos 7 dias</option><option>Próximos 30 dias</option><option>Próximos 60 dias</option><option>Todos</option></select>
            <select className="select-base"><option>Todos os fornecedores</option>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select>
            <button className="btn btn-secondary"><Icon name="refresh" size={14} />Atualizar</button>
          </div>
          <div style={{ overflowX: "auto" }}>
<table className="table-base">
            <thead><tr><th>Documento</th><th>Fornecedor</th><th>Validade</th><th>Situação</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{it.doc}</td>
                  <td>{it.supplier}</td>
                  <td style={{ color: it.days < 0 ? "#dc2626" : "#374151", fontWeight: it.days < 0 ? 600 : 400 }}>{it.validity}</td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: 12, padding: "3px 8px", borderRadius: 999, background: it.days < 0 ? "#fee2e2" : it.days <= 30 ? "#fff7ed" : "#f1f5f9", color: it.days < 0 ? "#dc2626" : it.days <= 30 ? "#d97706" : "#6b7280" }}>
                      {it.days < 0 ? `${Math.abs(it.days)}d em atraso` : `${it.days}d restantes`}
                    </span>
                  </td>
                  <td><StatusBadge status={it.status} /></td>
                  <td><button className="btn btn-ghost btn-sm"><Icon name="bell" size={13} />Notificar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
