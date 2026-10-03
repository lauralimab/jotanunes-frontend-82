import { useState, useRef } from "react";
import logoDefault from "@/imports/logo.png";
import logoAlternate from "@/imports/logo-1.png";
import { login } from "./services/authService";

type Screen =
  | "login"
  | "supplier-dashboard" | "company-data" | "employees" | "documents"
  | "send-document" | "pendencies" | "supplier-profile";

type DocStatus = "approved" | "pending" | "expired" | "waiting" | "rejected" | "correction";

type SupplierStatus = "apt" | "pending" | "blocked";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS = [
  { id: 1, name: "Certidão Negativa Federal", person: "Construtora BH Ltda", type: "company", status: "approved" as DocStatus, validity: "15/12/2026", uploadedAt: "05/09/2026" },
  { id: 2, name: "CNDT — Certidão de Débitos Trabalhistas", person: "Construtora BH Ltda", type: "company", status: "approved" as DocStatus, validity: "20/12/2026", uploadedAt: "05/09/2026" },
  { id: 3, name: "Certidão Negativa FGTS", person: "Serviços e Logística SA", type: "company", status: "pending" as DocStatus, validity: "10/10/2026", uploadedAt: "08/09/2026" },
  { id: 4, name: "Contrato Social", person: "Serviços e Logística SA", type: "company", status: "waiting" as DocStatus, validity: "—", uploadedAt: "—" },
  { id: 5, name: "ASO — Atestado de Saúde Ocupacional", person: "Carlos Souza", type: "employee", status: "expired" as DocStatus, validity: "01/08/2026", uploadedAt: "05/03/2026" },
  { id: 6, name: "NR-35 — Trabalho em Altura", person: "Ana Lima", type: "employee", status: "approved" as DocStatus, validity: "30/11/2026", uploadedAt: "01/09/2026" },
  { id: 7, name: "Certidão Estadual", person: "TechClean Terceirizados", type: "company", status: "rejected" as DocStatus, validity: "—", uploadedAt: "03/09/2026" },
  { id: 8, name: "Insalubridade / Periculosidade", person: "João Ferreira", type: "employee", status: "correction" as DocStatus, validity: "15/10/2026", uploadedAt: "09/09/2026" },
  { id: 9, name: "Certidão Negativa Municipal", person: "Vigilância Suprema Eireli", type: "company", status: "pending" as DocStatus, validity: "20/10/2026", uploadedAt: "08/09/2026" },
];

const MOCK_EMPLOYEES = [
  { id: 1, name: "Carlos Souza", cpf: "123.456.789-00", role: "Auxiliar de Limpeza", status: "pending" as SupplierStatus, pendingDocs: 2 },
  { id: 2, name: "Ana Lima", cpf: "987.654.321-00", role: "Supervisora", status: "apt" as SupplierStatus, pendingDocs: 0 },
  { id: 3, name: "João Ferreira", cpf: "456.789.123-00", role: "Eletricista", status: "pending" as SupplierStatus, pendingDocs: 1 },
  { id: 4, name: "Marcia Ramos", cpf: "321.654.987-00", role: "Pintura", status: "apt" as SupplierStatus, pendingDocs: 0 },
];

function StatusBadge({ status }: { status: DocStatus | SupplierStatus | string }) {
  const map: Record<string, { cls: string; label: string; dot?: string }> = {
    approved: { cls: "badge badge-success", label: "Aprovado", dot: "#16a34a" },
    apt: { cls: "badge badge-success", label: "Apto", dot: "#16a34a" },
    pending: { cls: "badge badge-warning", label: "Aguardando Análise", dot: "#ca8a04" },
    waiting: { cls: "badge badge-gray", label: "Aguardando Envio", dot: "#6b7280" },
    expired: { cls: "badge badge-danger", label: "Vencido", dot: "#dc2626" },
    rejected: { cls: "badge badge-danger", label: "Reprovado", dot: "#dc2626" },
    correction: { cls: "badge badge-orange", label: "Correção Solicitada", dot: "#d97706" },
    blocked: { cls: "badge badge-danger", label: "Bloqueado", dot: "#dc2626" },
  };
  const cfg = map[status] ?? { cls: "badge badge-gray", label: status };
  return (
    <span className={cfg.cls}>
      {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />}
      {cfg.label}
    </span>
  );
}

function Icon({ name, size = 18, color }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, stroke: color || "currentColor", fill: "none", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactElement> = {
    home: <svg viewBox="0 0 24 24" style={s}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    building: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h.01M9 12h.01M9 15h.01M12 9h.01M12 12h.01M12 15h.01M15 9h.01M15 12h.01M15 15h.01" /></svg>,
    users: <svg viewBox="0 0 24 24" style={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    file: <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    upload: <svg viewBox="0 0 24 24" style={s}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>,
    alert: <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    check: <svg viewBox="0 0 24 24" style={s}><polyline points="20 6 9 17 4 12" /></svg>,
    x: <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    search: <svg viewBox="0 0 24 24" style={s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    bell: <svg viewBox="0 0 24 24" style={s}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    clock: <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    list: <svg viewBox="0 0 24 24" style={s}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    logout: <svg viewBox="0 0 24 24" style={s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    edit: <svg viewBox="0 0 24 24" style={s}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    eye: <svg viewBox="0 0 24 24" style={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    plus: <svg viewBox="0 0 24 24" style={s}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    filter: <svg viewBox="0 0 24 24" style={s}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
    refresh: <svg viewBox="0 0 24 24" style={s}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" /></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    doc: <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
    shield: <svg viewBox="0 0 24 24" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    money: <svg viewBox="0 0 24 24" style={s}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
    star: <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    package: <svg viewBox="0 0 24 24" style={s}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    info: <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
    mappin: <svg viewBox="0 0 24 24" style={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  };
  return icons[name] ?? <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10" /></svg>;
}

function BrandLogo({ alternate = false, compact = false, white = false }: { alternate?: boolean; compact?: boolean; white?: boolean }) {
  return (
    <div className={`brand-logo${compact ? " brand-logo-compact" : ""}${white ? " brand-logo-white" : ""}`}>
      <img src={alternate ? logoAlternate : logoDefault} alt="Jotanunes Construtora" />
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function Sidebar({ screen, onNav, onLogout, open, onClose }: { screen: Screen; onNav: (s: Screen) => void; onLogout: () => void; open: boolean; onClose: () => void }) {
  const links: { id: Screen; label: string; icon: string }[] = [
    { id: "supplier-dashboard", label: "Dashboard", icon: "home" },
    { id: "company-data", label: "Dados da Empresa", icon: "building" },
    { id: "employees", label: "Funcionários", icon: "users" },
    { id: "documents", label: "Documentos", icon: "doc" },
    { id: "send-document", label: "Enviar Documento", icon: "upload" },
    { id: "pendencies", label: "Pendências", icon: "alert" },
    { id: "supplier-profile", label: "Meu Perfil", icon: "shield" },
  ];

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar${open ? " open" : ""}`} style={{ width: 232, minHeight: "100vh", background: "#1a0a0c", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 16px", borderBottom: "1px solid #2d1216", flexShrink: 0 }}>
        <BrandLogo alternate compact white />
      </div>
      <div style={{ padding: "10px 18px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "#6b3a42", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Portal Fornecedor
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((l) => (
          <div key={l.id} className={`sidebar-link${screen === l.id ? " active" : ""}`} onClick={() => { onNav(l.id); onClose(); }}>
            <span className="icon"><Icon name={l.icon} size={17} /></span>
            {l.label}
          </div>
        ))}
      </nav>
      <div style={{ padding: "14px 14px 18px", borderTop: "1px solid #2d1216", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c01a2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            FL
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>Felipe Lima</div>
            <div style={{ fontSize: 11, color: "#7a3a42" }}>Fornecedor</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", color: "#7a3a42", borderColor: "#2d1216" }} onClick={onLogout}>
          <Icon name="logout" size={14} />Sair
        </button>
      </div>
      </aside>
    </>
  );
}

function Header({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, flexShrink: 0 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{title}</h1>
        {subtitle && <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#6b7280" }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 28, maxWidth: 1180 }}>{children}</div>;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
const [isLoading, setIsLoading] = useState(false);

async function handleLogin() {
  setLoginError("");

  if (!email.trim()) {
    setLoginError("Informe o e-mail.");
    return;
  }

  if (!pass.trim()) {
    setLoginError("Informe a senha.");
    return;
  }

  try {
    setIsLoading(true);

    await login({
      email: email.trim(),
      password: pass,
    });

    onLogin();
  } catch (error) {
    if (error instanceof Error) {
      setLoginError(error.message);
    } else {
      setLoginError("Não foi possível realizar o login.");
    }
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto" }}>
      <div style={{ display: "flex", flexWrap: "wrap", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.18)", width: "min(880px, 94vw)", minHeight: 560 }}>
        <div style={{ flex: "1 1 320px", background: "#8b1220", padding: 52, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.25) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}><BrandLogo alternate white /></div>
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.25 }}>Portal do Fornecedor</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>Centralize o cadastro, envio e controle de documentos da sua empresa e funcionários terceirizados — versão 1.0.</p>
          </div>
          <div style={{ display: "flex", gap: 28, position: "relative" }}>
            {[["", ""], ["", ""], ["", ""]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 320px", maxWidth: 420, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {forgot ? (
            <>
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", marginBottom: 20 }} onClick={() => setForgot(false)}>← Voltar</button>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Recuperar senha</h2>
              <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 24px" }}>Informe seu e-mail para receber as instruções.</p>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>E-mail</label>
              <input className="input-base" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
              <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>Enviar instruções</button>
            </>
          ) : (
              <>
                {loginError && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      fontSize: 12.5,
                    }}
                  >
                    {loginError}
                  </div>
                )}
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Entrar no sistema</h2>
              <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 28px" }}>Acesse com suas credenciais de fornecedor</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 8 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>E-mail</label>
                  <input className="input-base" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Senha</label>
                  <input className="input-base" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ background: "none", border: "none", color: "#c01a2b", fontSize: 12.5, cursor: "pointer", fontWeight: 500 }} onClick={() => setForgot(true)}>Esqueci minha senha</button>
                </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  <button
                    className="btn btn-primary btn-lg"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                    }}
                    onClick={() => void handleLogin()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar como Fornecedor"}
                  </button>
                </div>
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 11, marginTop: 16 }}></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SupplierDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const stats = [
    { label: "Aprovados", value: 8, color: "#16a34a", bg: "#dcfce7", icon: "check" },
    { label: "Aguardando Análise", value: 3, color: "#ca8a04", bg: "#fef9c3", icon: "clock" },
    { label: "Correção Solicitada", value: 1, color: "#d97706", bg: "#fff7ed", icon: "edit" },
    { label: "Vencidos", value: 1, color: "#dc2626", bg: "#fee2e2", icon: "alert" },
  ];

  return (
    <>
      <Header title="Dashboard" subtitle="Visão geral da sua documentação — Serviços e Logística SA" />
      <PageWrapper>
        <div style={{ background: "#fff", border: "2px solid #fbbf24", borderRadius: 12, padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="alert" size={24} color="#ca8a04" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Status Geral</span>
              <StatusBadge status="pending" />
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Documentos pendentes precisam ser regularizados. O status <strong>APTO</strong> exige 100% dos documentos obrigatórios aprovados (RF01 / Regra de Negócio).</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => onNav("send-document")}><Icon name="upload" size={15} />Enviar Documento</button>
            <button className="btn btn-secondary" onClick={() => onNav("pendencies")}><Icon name="alert" size={15} />Ver Pendências</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="label">{s.label}</div>
                  <div className="value" style={{ color: s.color, marginTop: 8 }}>{s.value}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={20} color={s.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Documentos Recentes</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav("documents")}>Ver todos</button>
            </div>
            {MOCK_DOCUMENTS.slice(0, 6).map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="doc" size={16} color="#6b7280" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{d.name}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{d.person}</div>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Progresso Documental</h3>
            {[{ label: "Documentos da Empresa", done: 6, total: 8, color: "#16a34a" }, { label: "Documentos dos Funcionários", done: 5, total: 8, color: "#d97706" }].map(p => (
              <div key={p.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{p.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.done} / {p.total}</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${p.done / p.total * 100}%`, background: p.color }} />
                </div>
              </div>
            ))}
            <div style={{ background: "#fef9c3", borderRadius: 8, padding: 14, border: "1px solid #fde68a" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>Correção Solicitada</div>
              <div style={{ fontSize: 12.5, color: "#78350f" }}>
                <strong>Insalubridade / Periculosidade</strong> — João Ferreira<br />
                <span style={{ color: "#92400e" }}>Motivo: Assinatura do médico responsável ausente.</span>
              </div>
              <button className="btn btn-warning btn-sm" style={{ marginTop: 10 }} onClick={() => onNav("send-document")}>
                <Icon name="upload" size={13} />Corrigir agora
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── COMPANY DATA ─────────────────────────────────────────────────────────────

function CompanyData() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <Header title="Dados da Empresa" subtitle="RF02 — Cadastro e atualização das informações do fornecedor" />
      <PageWrapper>
        <div className="card">
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Informações Cadastrais</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              { label: "Razão Social *", val: "Serviços e Logística SA", full: true },
              { label: "Nome Fantasia", val: "SeLog" },
              { label: "CNPJ *", val: "98.765.432/0001-11" },
              { label: "Inscrição Estadual", val: "123.456.789.000" },
              { label: "Endereço *", val: "Av. Contorno, 1245", full: true },
              { label: "Bairro", val: "Funcionários" },
              { label: "Cidade *", val: "Belo Horizonte" },
              { label: "Estado", val: "MG" },
              { label: "CEP", val: "30110-080" },
              { label: "Telefone *", val: "(31) 3333-4444" },
              { label: "E-mail Corporativo *", val: "contato@selog.com" },
              { label: "E-mail do Responsável *", val: "maria@selog.com" },
              { label: "Responsável Legal *", val: "Maria Aparecida Silva", full: true },
              { label: "CPF do Responsável *", val: "987.654.321-00" },
            ].map(f => (
              <div key={f.label} style={{ gridColumn: f.full ? "span 2" : "span 1" }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input className="input-base" defaultValue={f.val} />
              </div>
            ))}
          </div>
          {saved && <div style={{ marginTop: 16, padding: "10px 14px", background: "#dcfce7", borderRadius: 8, color: "#15803d", fontSize: 13, fontWeight: 600 }}>✓ Dados salvos com sucesso!</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10 }}>
            <button className="btn btn-secondary">Cancelar</button>
            <button className="btn btn-primary" onClick={() => setSaved(true)}>Salvar Alterações</button>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────

function Employees({ onNav }: { onNav: (s: Screen) => void }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header title="Funcionários" subtitle="RF03 — Cadastro de funcionários vinculados ao fornecedor"
        actions={<button className="btn btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={15} />Adicionar Funcionário</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar funcionário..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base">
              <option>Todos os status</option><option>Apto</option><option>Pendente</option>
            </select>
          </div>
          <table className="table-base">
            <thead>
              <tr><th>Funcionário</th><th>CPF</th><th>Função</th><th>Status</th><th>Docs Pendentes</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {MOCK_EMPLOYEES.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c01a2b" }}>
                        {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{e.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>{e.cpf}</td>
                  <td>{e.role}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>{e.pendingDocs > 0 ? <span style={{ fontWeight: 700, color: "#dc2626" }}>{e.pendingDocs}</span> : <span style={{ color: "#6b7280" }}>0</span>}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onNav("documents")}><Icon name="doc" size={13} />Docs</button>
                      <button className="btn btn-ghost btn-sm"><Icon name="edit" size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWrapper>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Adicionar Funcionário</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><Icon name="x" size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Nome Completo *", ""], ["CPF *", "000.000.000-00"], ["RG", ""], ["Data de Nascimento", "date"], ["Função / Cargo *", "Ex: Auxiliar de Limpeza"], ["E-mail", "joao@empresa.com"], ["Telefone", "(00) 00000-0000"]].map(([l, ph]) => (
                <div key={l}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l}</label>
                  <input className="input-base" placeholder={ph === "date" ? "" : ph} type={ph === "date" ? "date" : "text"} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

function Documents({ onNav }: { onNav: (s: Screen) => void }) {
  const [filter, setFilter] = useState("all");
  const [type, setType] = useState("all");
  const filtered = MOCK_DOCUMENTS.filter(d => {
    if (filter !== "all" && d.status !== filter) return false;
    if (type !== "all" && d.type !== type) return false;
    return true;
  });
  return (
    <>
      <Header title="Documentos" subtitle="RF04/RF05/RF06 — Consulta de situação das documentações"
        actions={<button className="btn btn-primary" onClick={() => onNav("send-document")}><Icon name="upload" size={15} />Enviar Documento</button>} />
      <PageWrapper>
        {/* Status flow legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: "10px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 600 }}>Fluxo de status (RF06):</span>
          {[["Aguardando Envio", "#6b7280"], ["→", "#9ca3af"], ["Aguardando Análise", "#ca8a04"], ["→", "#9ca3af"], ["Aprovado", "#16a34a"], ["/", "#9ca3af"], ["Reprovado", "#dc2626"], ["/", "#9ca3af"], ["Correção Solicitada", "#d97706"], ["→", "#9ca3af"], ["Vencido", "#dc2626"]].map(([l, c], i) => (
            <span key={i} style={{ fontSize: 11.5, color: c, fontWeight: l === "→" || l === "/" ? 400 : 600 }}>{l}</span>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar documento..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Todos os status</option>
              <option value="approved">Aprovado</option>
              <option value="pending">Aguardando Análise</option>
              <option value="waiting">Aguardando Envio</option>
              <option value="correction">Correção Solicitada</option>
              <option value="expired">Vencido</option>
              <option value="rejected">Reprovado</option>
            </select>
            <select className="select-base" value={type} onChange={e => setType(e.target.value)}>
              <option value="all">Todos os tipos</option>
              <option value="company">Empresa</option>
              <option value="employee">Funcionário</option>
            </select>
          </div>
          <table className="table-base">
            <thead>
              <tr><th>Documento</th><th>Referente a</th><th>Tipo</th><th>Status</th><th>Validade</th><th>Enviado em</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="doc" size={16} color="#6b7280" /><span style={{ fontWeight: 600, color: "#0f172a" }}>{d.name}</span></div></td>
                  <td style={{ color: "#374151" }}>{d.person}</td>
                  <td><span className="badge badge-blue">{d.type === "company" ? "Empresa" : "Funcionário"}</span></td>
                  <td><StatusBadge status={d.status} /></td>
                  <td style={{ color: d.status === "expired" ? "#dc2626" : "#374151", fontWeight: d.status === "expired" ? 600 : 400 }}>{d.validity}</td>
                  <td style={{ color: "#6b7280" }}>{d.uploadedAt}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm"><Icon name="eye" size={13} /></button>
                      {(d.status === "rejected" || d.status === "expired" || d.status === "correction") && (
                        <button className="btn btn-warning btn-sm" onClick={() => onNav("send-document")}>Corrigir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{filtered.length} documento(s) — RNF05: apenas PDF, JPG, PNG aceitos (máx. 10 MB)</span>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── SEND DOCUMENT ────────────────────────────────────────────────────────────

function SendDocument() {
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { const kb = f.size / 1024; if (kb > 10240) { alert("Arquivo excede 10 MB (RNF05)"); return; } setFile({ name: f.name, size: kb.toFixed(0) + " KB" }); }
  };

  return (
    <>
      <Header title="Enviar Documento" subtitle="RF04/RF05 — Envio de documentação da empresa e dos funcionários" />
      <PageWrapper>
        <div style={{ maxWidth: 700 }}>
          {sent ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Icon name="check" size={32} color="#16a34a" />
              </div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Documento enviado com sucesso!</h3>
              <p style={{ color: "#6b7280", marginBottom: 8 }}>Status: <strong>Aguardando Análise</strong> — a equipe Jotanunes será notificada (RF15).</p>
              <button className="btn btn-primary" onClick={() => { setSent(false); setFile(null); }}><Icon name="plus" size={15} />Enviar outro</button>
            </div>
          ) : (
            <div className="card">
              <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700 }}>Informações do Documento</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Tipo de Documento *</label>
                  <select className="select-base" style={{ width: "100%" }}>
                    <option>Selecionar tipo...</option>
                    <option>Certidão Negativa Federal</option>
                    <option>CNDT — Certidão de Débitos Trabalhistas</option>
                    <option>Certidão Negativa FGTS</option>
                    <option>Certidão Estadual</option>
                    <option>Certidão Municipal</option>
                    <option>Contrato Social</option>
                    <option>ASO — Atestado de Saúde Ocupacional</option>
                    <option>NR-35 — Trabalho em Altura</option>
                    <option>Insalubridade / Periculosidade</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Referente a *</label>
                  <select className="select-base" style={{ width: "100%" }}>
                    <option>Empresa</option><option>Carlos Souza</option><option>Ana Lima</option>
                    <option>João Ferreira</option><option>Marcia Ramos</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Data de Emissão</label>
                  <input className="input-base" type="date" defaultValue="2026-09-01" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Data de Validade (RF11)</label>
                  <input className="input-base" type="date" defaultValue="2026-12-31" />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Observações</label>
                  <textarea className="input-base" rows={2} placeholder="Informações adicionais..." style={{ resize: "vertical" }} />
                </div>
              </div>
              <div className={`drag-zone${dragging ? " active" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}>
                <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) { if (f.size > 10485760) { alert("Arquivo excede 10 MB (RNF05)"); return; } setFile({ name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }); } }} />
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Icon name="upload" size={24} color="#c01a2b" />
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Arraste o arquivo aqui ou clique para selecionar</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>RNF05 — Formatos aceitos: PDF, JPG, PNG — máximo 10 MB por arquivo</p>
              </div>
              {file && (
                <div style={{ marginTop: 14, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="doc" size={18} color="#c01a2b" />
                    <div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{file.name}</div><div style={{ fontSize: 11.5, color: "#6b7280" }}>{file.size}</div></div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setFile(null)}><Icon name="x" size={14} /></button>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, gap: 10 }}>
                <button className="btn btn-secondary">Cancelar</button>
                <button className="btn btn-primary" onClick={() => file && setSent(true)} style={{ opacity: file ? 1 : 0.5 }}><Icon name="upload" size={15} />Enviar Documento</button>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}

// ─── PENDENCIES ───────────────────────────────────────────────────────────────

function Pendencies({ onNav }: { onNav: (s: Screen) => void }) {
  const items = MOCK_DOCUMENTS.filter(d => ["rejected", "expired", "correction"].includes(d.status));
  const reasons: Record<number, string> = {
    5: "ASO com data de emissão ilegível. Reenvie o documento original com boa resolução.",
    7: "Certidão estadual com CNPJ divergente do cadastro.",
    8: "Laudo de insalubridade com assinatura do médico responsável ausente.",
  };
  return (
    <>
      <Header title="Pendências" subtitle="RF06/RF09 — Documentos que necessitam de correção ou reenvio" />
      <PageWrapper>
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, display: "flex", gap: 10, alignItems: "center" }}>
          <Icon name="alert" size={18} color="#d97706" />
          <span style={{ fontSize: 13, color: "#92400e" }}><strong>{items.length} documentos</strong> com pendência. O status <strong>APTO</strong> exige 100% aprovados (Regra de Negócio).</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(d => (
            <div key={d.id} className="card" style={{ display: "flex", alignItems: "flex-start", gap: 16, borderLeft: `3px solid ${d.status === "correction" ? "#d97706" : "#dc2626"}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: d.status === "correction" ? "#fff7ed" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="doc" size={20} color={d.status === "correction" ? "#d97706" : "#dc2626"} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</span>
                  <StatusBadge status={d.status} />
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6b7280" }}>{d.person} • Validade: {d.validity}</p>
                {reasons[d.id] && (
                  <div style={{ background: d.status === "correction" ? "#fff7ed" : "#fef2f2", borderRadius: 6, padding: "8px 12px", marginTop: 8, border: `1px solid ${d.status === "correction" ? "#fed7aa" : "#fecaca"}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: d.status === "correction" ? "#92400e" : "#b91c1c" }}>Motivo da correção: </span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{reasons[d.id]}</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => onNav("send-document")}><Icon name="upload" size={13} />Corrigir Documento</button>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}

function SupplierProfile() {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"dados" | "acesso" | "historico">("dados");
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ atual: "", nova: "", confirmar: "" });
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    razao: "Serviços e Logística SA",
    fantasia: "Selog",
    cnpj: "98.765.432/0001-11",
    ie: "0987654321",
    im: "—",
    cnaePrincipal: "7490-1/04 — Atividades de intermediação e agenciamento de serviços",
    abertura: "14/03/2008",
    porte: "Médio porte",
    email: "contato@selog.com.br",
    emailSecundario: "nfe@selog.com.br",
    telefone: "(31) 3321-9900",
    celular: "(31) 99821-4400",
    site: "www.selog.com.br",
    cep: "30150-280",
    logradouro: "Rua Espírito Santo",
    numero: "1200",
    complemento: "Sala 801",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    uf: "MG",
    responsavel: "Maria da Conceição Freitas",
    cpfResponsavel: "321.987.654-00",
    cargoResponsavel: "Diretora Administrativa",
    emailResponsavel: "maria@selog.com.br",
    telefoneResponsavel: "(31) 98812-3344",
    unidade: "Belo Horizonte",
    contrato: "CT-2024-0128",
    inicioContrato: "01/03/2024",
    fimContrato: "28/02/2026",
    emailLogin: "maria@selog.com",
  });

  const handleField = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => { setSaved(true); setEditMode(false); setTimeout(() => setSaved(false), 3000); };

  const historyLog = [
    { data: "12/09/2026 09:14", acao: "Atualização de e-mail de contato", user: "Maria Freitas" },
    { data: "05/09/2026 14:30", acao: "Alteração de senha de acesso", user: "Maria Freitas" },
    { data: "15/08/2026 11:05", acao: "Cadastro inicial do perfil", user: "Sistema" },
    { data: "01/08/2026 16:22", acao: "Aceite dos termos de uso", user: "Maria Freitas" },
  ];

  const Field = ({ label, field, type = "text", half = false }: { label: string; field: keyof typeof form; type?: string; half?: boolean }) => (
    <div style={{ gridColumn: half ? "span 1" : "span 1" }}>
      <label style={{ fontSize: 11.5, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {editMode
        ? <input className="input-base" type={type} value={form[field]} onChange={e => handleField(field, e.target.value)} style={{ fontSize: 13.5 }} />
        : <div style={{ fontSize: 13.5, color: "#0f172a", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontWeight: 500 }}>{form[field] || "—"}</div>}
    </div>
  );

  const tabs: { id: "dados" | "acesso" | "historico"; label: string; icon: string }[] = [
    { id: "dados", label: "Dados Cadastrais", icon: "building" },
    { id: "acesso", label: "Acesso e Segurança", icon: "shield" },
    { id: "historico", label: "Histórico de Alterações", icon: "list" },
  ];

  return (
    <>
      <Header
        title="Meu Perfil"
        subtitle="Gerencie as informações cadastrais e de acesso da sua empresa"
        actions={
          activeTab === "dados" ? (
            editMode ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(false)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave}><Icon name="check" size={14} />Salvar alterações</button>
              </div>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(true)}><Icon name="edit" size={14} />Editar dados</button>
            )
          ) : null
        }
      />
      <PageWrapper>
        {saved && (
          <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "#166534", fontWeight: 500 }}>
            <Icon name="check" size={16} color="#16a34a" />
            Dados atualizados com sucesso.
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px 28px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: "linear-gradient(135deg, #8b1220 0%, #c01a2b 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "#fff", flexShrink: 0, letterSpacing: -1 }}>SL</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>{form.razao}</h2>
              <StatusBadge status="pending" />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 6, flexWrap: "wrap" }}>
              {[
                { icon: "building", v: form.cnpj },
                { icon: "mappin", v: `${form.cidade} — ${form.uf}` },
                { icon: "calendar", v: `Contrato ${form.contrato}` },
                { icon: "money", v: form.unidade },
              ].map(({ icon, v }) => (
                <span key={v} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#6b7280" }}>
                  <Icon name={icon} size={13} color="#9ca3af" />{v}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, textAlign: "center", flexShrink: 0 }}>
            {[{ v: "4", l: "Funcionários" }, { v: "9", l: "Documentos" }, { v: "3", l: "Pendentes" }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#c01a2b", fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f1f5f9", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 18px",
                background: activeTab === t.id ? "#fff" : "transparent",
                border: "none", borderRadius: 8, cursor: "pointer",
                fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500,
                color: activeTab === t.id ? "#c01a2b" : "#6b7280",
                boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >
              <Icon name={t.icon} size={15} color={activeTab === t.id ? "#c01a2b" : "#9ca3af"} />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "dados" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Identificação da Empresa
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
                <div style={{ gridColumn: "span 2" }}><Field label="Razão Social" field="razao" /></div>
                <Field label="Nome Fantasia" field="fantasia" />
                <Field label="CNPJ" field="cnpj" />
                <Field label="Inscrição Estadual" field="ie" />
                <Field label="Inscrição Municipal" field="im" />
                <div style={{ gridColumn: "span 2" }}><Field label="CNAE Principal" field="cnaePrincipal" /></div>
                <Field label="Porte" field="porte" />
                <Field label="Data de Abertura" field="abertura" />
                <Field label="Unidade Jotanunes" field="unidade" />
                <Field label="Contrato" field="contrato" />
                <Field label="Início do Contrato" field="inicioContrato" />
                <Field label="Fim do Contrato" field="fimContrato" />
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Contato
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
                <div style={{ gridColumn: "span 2" }}><Field label="E-mail Principal" field="email" type="email" /></div>
                <Field label="E-mail NF-e" field="emailSecundario" type="email" />
                <Field label="Telefone" field="telefone" />
                <Field label="Celular / WhatsApp" field="celular" />
                <Field label="Site" field="site" />
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Endereço
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px 20px" }}>
                <Field label="CEP" field="cep" />
                <div style={{ gridColumn: "span 2" }}><Field label="Logradouro" field="logradouro" /></div>
                <Field label="Número" field="numero" />
                <Field label="Complemento" field="complemento" />
                <Field label="Bairro" field="bairro" />
                <Field label="Cidade" field="cidade" />
                <Field label="UF" field="uf" />
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Responsável Legal
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 20px" }}>
                <div style={{ gridColumn: "span 2" }}><Field label="Nome Completo" field="responsavel" /></div>
                <Field label="CPF" field="cpfResponsavel" />
                <Field label="Cargo" field="cargoResponsavel" />
                <Field label="E-mail" field="emailResponsavel" type="email" />
                <Field label="Telefone" field="telefoneResponsavel" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "acesso" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Credenciais de Acesso
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>E-mail de login</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 600 }}>{form.emailLogin}</div>
                    <span style={{ fontSize: 11, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Verificado</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Último acesso</label>
                  <div style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>12/09/2026 às 09:14</div>
                </div>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 18px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="shield" size={20} color="#c01a2b" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>Senha de acesso</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Última alteração: 05/09/2026</div>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPassModal(true)}><Icon name="edit" size={14} />Alterar senha</button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
                Preferências de Notificação
              </h3>
              {[
                { label: "E-mail ao receber aprovação/reprovação de documentos", checked: true },
                { label: "E-mail 30 dias antes do vencimento de documentos", checked: true },
                { label: "E-mail 7 dias antes do vencimento de documentos", checked: true },
                { label: "E-mail de alerta de boletim de pagamento pendente", checked: false },
                { label: "Notificações no portal sobre correções solicitadas", checked: true },
              ].map((pref, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 4 ? "1px solid #f3f4f6" : "none" }}>
                  <span style={{ fontSize: 13.5, color: "#374151" }}>{pref.label}</span>
                  <div style={{ width: 40, height: 22, borderRadius: 11, background: pref.checked ? "#c01a2b" : "#d1d5db", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: pref.checked ? 20 : 2, transition: "left 0.18s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Icon name="alert" size={18} color="#d97706" />
              <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                <strong>Atenção (RNF01):</strong> Suas credenciais são pessoais e intransferíveis. O acesso ao sistema é monitorado conforme política de segurança da Jotanunes. Em caso de suspeita de acesso indevido, entre em contato imediatamente com <strong>ti@jotanunes.com.br</strong>.
              </div>
            </div>
          </div>
        )}

        {activeTab === "historico" && (
          <div className="card">
            <h3 style={{ margin: "0 0 18px", fontSize: 13.5, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 4, height: 16, background: "#c01a2b", borderRadius: 2, display: "inline-block" }} />
              Histórico de Alterações do Perfil
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                  {["Data / Hora", "Ação realizada", "Usuário"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6b7280", padding: "0 12px 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyLog.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px", fontSize: 13, color: "#6b7280", fontFamily: "monospace", whiteSpace: "nowrap" }}>{r.data}</td>
                    <td style={{ padding: "12px", fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>{r.acao}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: r.user === "Sistema" ? "#f1f5f9" : "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: r.user === "Sistema" ? "#6b7280" : "#c01a2b" }}>
                          {r.user === "Sistema" ? "S" : r.user.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <span style={{ fontSize: 13, color: "#374151" }}>{r.user}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>

      {showPassModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", width: "min(420px, 92vw)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Sans', sans-serif" }}>Alterar senha</h3>
              <button onClick={() => setShowPassModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><Icon name="x" size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[{ label: "Senha atual", field: "atual" as const }, { label: "Nova senha", field: "nova" as const }, { label: "Confirmar nova senha", field: "confirmar" as const }].map(({ label, field }) => (
                <div key={field}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input className="input-base" type="password" placeholder="••••••••" value={passForm[field]} onChange={e => setPassForm(f => ({ ...f, [field]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, fontSize: 12, color: "#6b7280" }}>
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e um número.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowPassModal(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setShowPassModal(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }}>Salvar nova senha</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [navOpen, setNavOpen] = useState(false);

  const handleLogin = () => setScreen("supplier-dashboard");
  const handleLogout = () => setScreen("login");
  const handleNav = (s: Screen) => setScreen(s);

  if (screen === "login") return <LoginScreen onLogin={handleLogin} />;

  const renderScreen = () => {
    switch (screen) {
      case "supplier-dashboard": return <SupplierDashboard onNav={handleNav} />;
      case "company-data": return <CompanyData />;
      case "employees": return <Employees onNav={handleNav} />;
      case "documents": return <Documents onNav={handleNav} />;
      case "send-document": return <SendDocument />;
      case "pendencies": return <Pendencies onNav={handleNav} />;
      case "supplier-profile": return <SupplierProfile />;
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar screen={screen} onNav={handleNav} onLogout={handleLogout} open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="app-content" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setNavOpen(true)}><Icon name="list" size={18} />Menu</button>
        </div>
        {renderScreen()}
      </div>
    </div>
  );
}