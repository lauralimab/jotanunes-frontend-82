import { useEffect, useState } from "react";
import PortalLayout from "./app/layouts/PortalLayout";
import type { Screen } from "./shared/types/navigation";
import LoginPage from "./pages/auth/Login";
import EsqueciSenhaPage from "./pages/auth/EsqueciSenha";
import Icon from "./shared/components/Icon";
import StatusBadge from "./shared/components/StatusBadge";
import Header from "./shared/components/Header";
import PageWrapper from "./shared/components/PageWrapper";
import InicioPage from "./pages/inicio/Inicio";
import DocumentosPage from "./pages/documentos/Documentos";
import EnviarDocumentoPage from "./pages/documentos/EnviarDocumento";


import {
  getAuthenticatedUser,
  logout as logoutRequest,
  refreshAuthSession,
} from "./shared/api/auth";

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "./shared/auth/session";

import type { AuthToken } from "./shared/types/auth";

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

  const [auth, setAuth] = useState<AuthToken | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedSession = getAuthSession();

      if (!storedSession) {
        if (!cancelled) {
          setIsCheckingSession(false);
        }

        return;
      }

      try {
        const user = await getAuthenticatedUser(
          storedSession.accessToken,
        );

        if (cancelled) {
          return;
        }

        const validatedSession: AuthToken = {
          ...storedSession,
          user,
        };

        saveAuthSession(validatedSession);
        setAuth(validatedSession);
        setScreen("supplier-dashboard");
      } catch {
        try {
          const refreshedSession = await refreshAuthSession(
            storedSession.refreshToken,
          );

          const user = await getAuthenticatedUser(
            refreshedSession.accessToken,
          );

          if (cancelled) {
            return;
          }

          const validatedSession: AuthToken = {
            ...refreshedSession,
            user,
          };

          saveAuthSession(validatedSession);
          setAuth(validatedSession);
          setScreen("supplier-dashboard");
        } catch {
          if (cancelled) {
            return;
          }

          clearAuthSession();
          setAuth(null);
          setScreen("login");
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(authToken: AuthToken) {
    saveAuthSession(authToken);
    setAuth(authToken);
    setScreen("supplier-dashboard");
  }

  async function handleLogout() {
    const currentSession = auth;

    clearAuthSession();
    setAuth(null);
    setScreen("login");

    if (!currentSession) {
      return;
    }

    try {
      await logoutRequest(currentSession.accessToken);
    } catch {
      // A sessão local já foi encerrada.
    }
  }

  const handleNav = (s: Screen) => {
    setScreen(s);
  };

  if (isCheckingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        Verificando sessão...
      </div>
    );
  }

  if (!auth) {
    if (screen === "forgot-password") {
      return (
        <EsqueciSenhaPage
          onBack={() => setScreen("login")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => setScreen("forgot-password")}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "supplier-dashboard":
        return (
          <InicioPage
            onNav={handleNav}
            documents={MOCK_DOCUMENTS}
          />
        );

      case "company-data":
        return <CompanyData />;

      case "employees":
        return <Employees onNav={handleNav} />;

      case "documents":
        return (
          <DocumentosPage
            documents={MOCK_DOCUMENTS}
            onNav={handleNav}
          />
        );

      case "send-document":
  return (
    <EnviarDocumentoPage
      onCancel={() => handleNav("documents")}
    />
  );

      case "pendencies":
        return <Pendencies onNav={handleNav} />;

      case "supplier-profile":
        return <SupplierProfile />;

      default:
        return (
          <InicioPage
            onNav={handleNav}
            documents={MOCK_DOCUMENTS}
          />
        );
    }
  };

  return (
    <PortalLayout
      screen={screen}
      onNav={handleNav}
      onLogout={() => void handleLogout()}
      navOpen={navOpen}
      onOpenNav={() => setNavOpen(true)}
      onCloseNav={() => setNavOpen(false)}
    >
      {renderScreen()}
    </PortalLayout>
  );

}