import ReprovarDocumentoModal from "./components/ReprovarDocumentoModal";
import SolicitarCorrecaoModal from "./components/SolicitarCorrecaoModal";
import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";
import type { Screen } from "../../../shared/types/portal";
import { MOCK_DOCUMENTS } from "../../../shared/mocks/portal";

export default function AvaliarDocumentoPage({ onNav }: { onNav: (s: Screen) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectConfirmed, setRejectConfirmed] = useState(false);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionType, setCorrectionType] = useState("");
  const doc = MOCK_DOCUMENTS[2];

  return (
    <>
      <Header title="Análise de Documento" subtitle={`RF07/RF08/RF09/RF10 — ${doc.name}`}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>← Voltar</button>} />
      <PageWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Visualização do Documento (RNF04)</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-sm"><Icon name="refresh" size={13} />Recarregar</button>
                <button className="btn btn-ghost btn-sm"><Icon name="eye" size={13} />Tela cheia</button>
              </div>
            </div>
            <div style={{ background: "#f8fafc", minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "min(480px, 92vw)", background: "#fff", borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.1)", padding: 40, fontFamily: "serif" }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>MINISTÉRIO DA FAZENDA</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Receita Federal do Brasil</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>CERTIDÃO NEGATIVA DE DÉBITOS</div>
                  <div style={{ fontSize: 13, color: "#444" }}>Relativos a Tributos Federais e à Dívida Ativa da União</div>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: "#333" }}>
                  <p>Certificamos que, <strong>SERVIÇOS E LOGÍSTICA SA</strong>, inscrito no CNPJ sob o n° <strong>98.765.432/0001-11</strong>, não possui débitos em aberto perante a Fazenda Nacional até a presente data.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
                    <div><strong>Emissão:</strong> 08/09/2026</div>
                    <div><strong>Validade:</strong> 10/10/2026</div>
                    <div style={{ gridColumn: "span 2" }}><strong>Código de Controle:</strong> ABCD-1234-EFGH-5678</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Informações (RF07)</h3>
              {[["Tipo", doc.name], ["Fornecedor", doc.person], ["Enviado em", doc.uploadedAt], ["Validade (RF11)", doc.validity], ["Status atual", ""]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
                  <span style={{ color: "#6b7280", fontWeight: 500 }}>{l}</span>
                  {l === "Status atual" ? <StatusBadge status={doc.status} /> : <span style={{ color: "#0f172a", fontWeight: 500 }}>{v}</span>}
                </div>
              ))}
            </div>

            <div className="card" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                <Icon name="info" size={16} color="#d97706" />
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#92400e" }}>Análise Automática — RF10</h4>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["✓","CNPJ confere com o cadastro do sistema","#16a34a"], ["✓","Documento emitido por órgão reconhecido","#16a34a"], ["⚠","Validade próxima: vence em 32 dias","#d97706"], ["✓","Assinatura digital detectada","#16a34a"]].map(([ic, txt, clr]) => (
                  <div key={txt} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: clr, fontWeight: 700, flexShrink: 0 }}>{ic}</span>
                    <span style={{ fontSize: 12.5, color: "#374151" }}>{txt}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#92400e", fontStyle: "italic" }}>A análise automática é auxiliar. A decisão final é do analista (RF10).</p>
            </div>

            {decision ? (
              <div className="card" style={{ background: decision === "approved" ? "#dcfce7" : "#fee2e2", border: `1px solid ${decision === "approved" ? "#86efac" : "#fca5a5"}` }}>
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <Icon name={decision === "approved" ? "check" : "x"} size={32} color={decision === "approved" ? "#16a34a" : "#dc2626"} />
                  <div style={{ fontWeight: 700, fontSize: 15, color: decision === "approved" ? "#15803d" : "#b91c1c", marginTop: 8 }}>
                    Documento {decision === "approved" ? "Aprovado" : "Reprovado"} — RF08
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4, color: "#6b7280" }}>Registrado em histórico (RF18) — {new Date().toLocaleString("pt-BR")}</div>
                </div>
              </div>
            ) : (
              <div className="card decision-card">
                <div className="decision-heading">
                  <h4>Concluir análise</h4>
                  <p>Selecione a ação adequada para este documento.</p>
                </div>
                <div className="decision-actions">
                  <button className="btn btn-success decision-primary" onClick={() => setDecision("approved")}>
                    <Icon name="check" size={16} />
                    Aprovar documento
                  </button>
                  <button className="btn btn-secondary decision-primary" onClick={() => setShowModal(true)}>
                    <Icon name="edit" size={16} />
                    Solicitar correção
                  </button>
                  <div className="decision-divider"><span>ou</span></div>
                  <button className="btn decision-reject" onClick={() => setShowRejectModal(true)}>
                    <Icon name="x" size={16} />
                    Reprovar documento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>

      {showModal && (
        <SolicitarCorrecaoModal doc={doc} setShowModal={setShowModal} correctionType={correctionType} setCorrectionType={setCorrectionType} correctionReason={correctionReason} setCorrectionReason={setCorrectionReason} />
      )}

      {showRejectModal && (
        <ReprovarDocumentoModal doc={doc} setShowRejectModal={setShowRejectModal} rejectConfirmed={rejectConfirmed} setRejectConfirmed={setRejectConfirmed} setDecision={setDecision} />
      )}
    </>
  );
}
