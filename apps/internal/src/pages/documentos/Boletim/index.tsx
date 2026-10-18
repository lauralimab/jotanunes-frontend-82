import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import { MOCK_BOLETINS } from "../../../shared/mocks/portal";

export default function BoletimPage() {
  const [tab, setTab] = useState<"mensal" | "petrolina">("mensal");
  return (
    <>
      <Header title="Boletim de Pagamento" subtitle="RF13 — Renovação periódica | RF14 — Regra Petrolina (quinzenal)" />
      <PageWrapper>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {[{ label: "Boletins Aprovados", value: 2, color: "#16a34a", bg: "#dcfce7" }, { label: "Aguardando Envio", value: 2, color: "#ca8a04", bg: "#fef9c3" }, { label: "Reprovados", value: 1, color: "#dc2626", bg: "#fee2e2" }, { label: "Vence esta semana", value: 1, color: "#d97706", bg: "#fff7ed" }].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1 }}>
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", width: "fit-content" }}>
          {[["mensal", "Padrão Mensal (RF13)"], ["petrolina", "Petrolina — Quinzenal (RF14)"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t as "mensal" | "petrolina")}
              style={{ padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: tab === t ? "#c01a2b" : "#fff", color: tab === t ? "#fff" : "#374151", transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>

        {tab === "mensal" ? (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Boletim Mensal — Setembro/2026</h3>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>Renovação obrigatória até o último dia de cada mês (RF13)</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}><select className="select-base"><option>Setembro/2026</option><option>Agosto/2026</option><option>Julho/2026</option></select></div>
            </div>
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
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm"><Icon name="eye" size={13} /></button>
                        {b.status === "waiting" && <button className="btn btn-warning btn-sm"><Icon name="bell" size={13} />Notificar (RF15)</button>}
                        {b.status === "pending" && <button className="btn btn-primary btn-sm"><Icon name="check" size={13} />Analisar</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div style={{ padding: "12px 16px", background: "#ede9fe", border: "1px solid #c4b5fd", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10 }}>
              <Icon name="mappin" size={18} color="#7c3aed" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6" }}>Regra Específica — Operação Petrolina (RF14)</div>
                <div style={{ fontSize: 12.5, color: "#6d28d9" }}>Confirmações de pagamento quinzenais: 1ª quinzena (até dia 15) e 2ª quinzena (até último dia do mês). Regra em validação com o cliente.</div>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Confirmações Petrolina — Setembro/2026</h3>
              </div>
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
                        {b.status === "waiting" ? <button className="btn btn-primary btn-sm"><Icon name="check" size={13} />Confirmar</button>
                          : b.status === "pending" ? <button className="btn btn-warning btn-sm"><Icon name="bell" size={13} />Notificar</button>
                          : <span style={{ color: "#16a34a", fontSize: 12.5, fontWeight: 600 }}>✓ Confirmado</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
