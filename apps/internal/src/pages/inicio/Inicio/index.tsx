import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import type { Screen } from "../../../shared/types/portal";
import EstatisticasCards from "./components/EstatisticasCards";
import DocumentosRecentesCard from "./components/DocumentosRecentesCard";

export default function InicioPage({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <>
      <Header title="Dashboard Administrativo" subtitle="Visão geral da plataforma — 14/09/2026"
        actions={<><button className="btn btn-secondary btn-sm"><Icon name="refresh" size={14} />Atualizar</button><button className="btn btn-primary btn-sm"><Icon name="doc" size={14} />Relatório</button></>} />
      <PageWrapper>
        <EstatisticasCards />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Status dos Fornecedores</h3>
              {[{ label: "Aptos", count: 31, total: 47, color: "#16a34a" }, { label: "Pendentes", count: 11, total: 47, color: "#ca8a04" }, { label: "Bloqueados", count: 5, total: 47, color: "#dc2626" }].map(b => (
                <div key={b.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{b.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.count} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({Math.round(b.count / b.total * 100)}%)</span></span>
                  </div>
                  <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${b.count / b.total * 100}%`, background: b.color }} /></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ background: "#fde8ea", border: "1px solid #fca5a5" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <Icon name="alert" size={18} color="#c01a2b" />
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7f1d1d" }}>Autorizações Excepcionais</h4>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#b91c1c" }}><strong>2</strong> autorizações ativas — fornecedores operando com documentação irregular aprovada pela Jotanunes.</p>
              <button className="btn btn-danger btn-sm" onClick={() => onNav("autorizacao-excepcional")}>Ver autorizações</button>
            </div>
          </div>

          <DocumentosRecentesCard onNav={onNav} />
        </div>
      </PageWrapper>
    </>
  );
}
