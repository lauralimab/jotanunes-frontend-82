import Icon from "../../../../shared/components/Icon";



export default function EstatisticasCards() {
const stats = [
    { label: "Total Fornecedores",     value: 47, icon: "building", color: "#c01a2b", bg: "#fde8ea" },
    { label: "Aptos",                  value: 31, icon: "check",    color: "#16a34a", bg: "#dcfce7" },
    { label: "Aguardando Análise",     value: 9,  icon: "clock",    color: "#ca8a04", bg: "#fef9c3" },
    { label: "Correção Solicitada",    value: 3,  icon: "edit",     color: "#d97706", bg: "#fff7ed" },
    { label: "Bloqueados",             value: 5,  icon: "x",        color: "#dc2626", bg: "#fee2e2" },
    { label: "Boletins Pendentes (RF13)",value: 4,icon: "money",    color: "#7c3aed", bg: "#ede9fe" },
  ];
  return (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div className="label">{s.label}</div><div className="value" style={{ color: s.color, marginTop: 8 }}>{s.value}</div></div>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={22} color={s.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
  );
}
