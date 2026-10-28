import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import TableActions from "../../../shared/components/TableActions";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import { MOCK_BOLETINS } from "../../../shared/mocks/portal";

export default function BoletimPage() {
  const [tab, setTab] = useState<"mensal" | "petrolina">("mensal");
  return (
    <>
      <Header title="Boletim de Pagamento" subtitle="Renovação periódica | Regra Petrolina (quinzenal)" />
      <PageWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[{ label: "Boletins Aprovados", value: 2, color: "#16a34a", bg: "#dcfce7" }, { label: "Aguardando Envio", value: 2, color: "#ca8a04", bg: "#fef9c3" }, { label: "Reprovados", value: 1, color: "#dc2626", bg: "#fee2e2" }, { label: "Vence esta semana", value: 1, color: "#d97706", bg: "#fff7ed" }].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1 }}>
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
        display: "flex",
        gap: 4,
        marginBottom: 20,

        background:
          "var(--glass-background)",

        border:
          "1px solid rgba(148, 163, 184, 0.16)",

        borderRadius: 11,
        padding: 4,

        width: "fit-content",

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}>
          {[["mensal", "Padrão Mensal"], ["petrolina", "Petrolina — Quinzenal"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t as "mensal" | "petrolina")}
              style={{
              display: "flex",
              alignItems: "center",
              gap: 7,

              padding: "8px 18px",

              background: (tab === t)
                ? "transparent"
                : "transparent",

              border: "none",
              borderRadius: 8,

              cursor: "pointer",

              fontFamily:
                "'Inter', sans-serif",

              fontSize: 13,

              fontWeight: (tab === t)
                ? 700
                : 500,

              color: (tab === t)
                ? "#b51224"
                : "#374151",

              boxShadow: (tab === t)
                ? "0 2px 6px rgba(15, 23, 42, 0.08)"
                : "none",

              transition:
                "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
            }}>{label}</button>
          ))}
        </div>

        {tab === "mensal" ? (
          <div className="card table-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Boletim Mensal — Setembro/2026</h3>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>Renovação obrigatória até o último dia de cada mês</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}><select className="select-base"><option>Setembro/2026</option><option>Agosto/2026</option><option>Julho/2026</option></select></div>
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table-base">
              <thead><tr><th>Fornecedor</th><th>Mês de Referência</th><th>Enviado em</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {MOCK_BOLETINS.filter(b => b.tipo === "mensal").map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.supplier || (b as { name?: string }).name}</td>
                    <td>{b.mes}</td>
                    <td style={{ color: "#6b7280" }}>{b.dataEnvio}</td>
                    <td style={{ color: b.dataVenc === "30/09/2026" ? "#d97706" : "#374151" }}>{b.dataVenc}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <TableActions actions={[
                        { label: "Ver detalhes", icon: "eye" },
                        ...(b.status === "waiting" ? [{ label: "Notificar", icon: "bell" }] : b.status === "pending" ? [{ label: "Analisar", icon: "check" }] : []),
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        ) : (
          <div>
            <div style={{ padding: "12px 16px", background: "#ede9fe", border: "1px solid #c4b5fd", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10 }}>
              <Icon name="mappin" size={18} color="#7c3aed" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6" }}>Regra Específica — Operação Petrolina</div>
                <div style={{ fontSize: 12.5, color: "#6d28d9" }}>Confirmações de pagamento quinzenais: 1ª quinzena (até dia 15) e 2ª quinzena (até último dia do mês). Regra em validação com o cliente.</div>
              </div>
            </div>
            <div className="card table-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Confirmações Petrolina — Setembro/2026</h3>
              </div>
              <div style={{ overflowX: "auto" }}>
<table className="table-base">
                <thead><tr><th>Fornecedor</th><th>Quinzena</th><th>Prazo</th><th>Status</th><th>Ação</th></tr></thead>
                <tbody>
                  {MOCK_BOLETINS.filter(b => b.tipo?.startsWith("quinzenal")).map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600 }}>{b.supplier || (b as { name?: string }).name}</td>
                      <td><span className="badge badge-blue">{b.tipo === "quinzenal-1" ? "1ª Quinzena" : "2ª Quinzena"}</span></td>
                      <td>{b.dataVenc}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td>
                        {b.status === "waiting" ? <TableActions actions={[{ label: "Confirmar", icon: "check" }]}/>
                          : b.status === "pending" ? <TableActions actions={[{ label: "Notificar", icon: "bell" }]}/>
                          : <span style={{ color: "#16a34a", fontSize: 12.5, fontWeight: 600 }}>✓ Confirmado</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
