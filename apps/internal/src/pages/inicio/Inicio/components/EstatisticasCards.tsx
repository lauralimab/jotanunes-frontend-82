import Skeleton from "../../../../shared/components/Skeleton";
import Icon from "../../../../shared/components/Icon";



type EstatisticasCardsProps = {
  supplierTotal: number | null;
  suppliersLoading: boolean;
};

export default function EstatisticasCards({ supplierTotal, suppliersLoading }: EstatisticasCardsProps) {
  const stats = [
    { label: "Total Fornecedores",     value: supplierTotal?.toLocaleString("pt-BR") ?? "—", icon: "building", color: "#c01a2b", bg: "#fde8ea" },
    { label: "Aguardando Análise",     value: 9,  icon: "clock",    color: "#ca8a04", bg: "#fef9c3" },
    { label: "Correção Solicitada",    value: 3,  icon: "edit",     color: "#d97706", bg: "#fff7ed" },
    { label: "Boletins Pendentes",     value: 4,icon: "money",    color: "#7c3aed", bg: "#ede9fe" },
  ];
  return (
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 24 }} aria-busy={suppliersLoading} aria-label="Indicadores do dashboard">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div className="label"><Skeleton loading={suppliersLoading}>{s.label}</Skeleton></div><div className="value" aria-live={s.label === "Total Fornecedores" ? "polite" : undefined} style={{ color: s.color, marginTop: 8 }}><Skeleton loading={suppliersLoading} width={64} height={28}>{s.value}</Skeleton></div></div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: suppliersLoading ? "transparent" : s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Skeleton loading={suppliersLoading} width={40} height={40} borderRadius={10}><Icon name={s.icon} size={20} color={s.color} /></Skeleton>
                </div>
              </div>
            </div>
          ))}
        </div>
  );
}
