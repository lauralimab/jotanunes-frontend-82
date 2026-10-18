import BrandLogo from "../../../../shared/components/BrandLogo";



export default function LoginBrandPanel() {
  return (
<div style={{ flex: "1 1 320px", background: "#8b1220", padding: 52, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}><BrandLogo alternate white /></div>
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.25 }}>Painel Interno — Gestão e Validação Documental</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>Analise, aprove e acompanhe a documentação de fornecedores e funcionários terceirizados — versão 1.0.</p>
          </div>
          <div style={{ display: "flex", gap: 28, position: "relative" }}>
            {[["RF07–RF18", "Requisitos"], ["1 Ator", "Usuário"], ["Desde", "1987"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
  );
}
