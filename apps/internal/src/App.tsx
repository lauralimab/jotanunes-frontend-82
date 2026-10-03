import { useState } from "react";
import logoDefault from "@/imports/logo.png";
import logoAlternate from "@/imports/logo-1.png";

type Screen =
  | "login"
  | "admin-dashboard" | "admin-suppliers" | "supplier-details"
  | "document-analysis" | "expirations" | "notifications" | "history"
  | "boletim" | "autorizacao-excepcional" | "recebimento-material" | "requisitos";

type DocStatus = "approved" | "pending" | "expired" | "waiting" | "rejected" | "correction";

type SupplierStatus = "apt" | "pending" | "blocked";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SUPPLIERS = [
  { id: 1, name: "Construtora BH Ltda",      cnpj: "12.345.678/0001-90", status: "apt"     as SupplierStatus, pendingDocs: 0, lastUpdate: "12/09/2026", contact: "joao@construtora.com",  unidade: "Belo Horizonte" },
  { id: 2, name: "Serviços e Logística SA",   cnpj: "98.765.432/0001-11", status: "pending" as SupplierStatus, pendingDocs: 3, lastUpdate: "10/09/2026", contact: "maria@selog.com",        unidade: "Petrolina" },
  { id: 3, name: "TechClean Terceirizados",   cnpj: "55.123.456/0001-33", status: "blocked" as SupplierStatus, pendingDocs: 7, lastUpdate: "02/09/2026", contact: "carlos@techclean.com",   unidade: "Belo Horizonte" },
  { id: 4, name: "Vigilância Suprema Eireli", cnpj: "33.987.654/0001-77", status: "pending" as SupplierStatus, pendingDocs: 2, lastUpdate: "08/09/2026", contact: "ana@vigilancia.com",     unidade: "Petrolina" },
  { id: 5, name: "Facilities Total ME",       cnpj: "77.654.321/0001-55", status: "apt"     as SupplierStatus, pendingDocs: 0, lastUpdate: "11/09/2026", contact: "pedro@facilities.com",   unidade: "Belo Horizonte" },
];

const MOCK_DOCUMENTS = [
  { id: 1, name: "Certidão Negativa Federal",              person: "Construtora BH Ltda",     type: "company",   status: "approved"    as DocStatus, validity: "15/12/2026", uploadedAt: "05/09/2026" },
  { id: 2, name: "CNDT — Certidão de Débitos Trabalhistas",person: "Construtora BH Ltda",     type: "company",   status: "approved"    as DocStatus, validity: "20/12/2026", uploadedAt: "05/09/2026" },
  { id: 3, name: "Certidão Negativa FGTS",                 person: "Serviços e Logística SA", type: "company",   status: "pending"     as DocStatus, validity: "10/10/2026", uploadedAt: "08/09/2026" },
  { id: 4, name: "Contrato Social",                        person: "Serviços e Logística SA", type: "company",   status: "waiting"     as DocStatus, validity: "—",          uploadedAt: "—" },
  { id: 5, name: "ASO — Atestado de Saúde Ocupacional",    person: "Carlos Souza",            type: "employee",  status: "expired"     as DocStatus, validity: "01/08/2026", uploadedAt: "05/03/2026" },
  { id: 6, name: "NR-35 — Trabalho em Altura",             person: "Ana Lima",                type: "employee",  status: "approved"    as DocStatus, validity: "30/11/2026", uploadedAt: "01/09/2026" },
  { id: 7, name: "Certidão Estadual",                      person: "TechClean Terceirizados", type: "company",   status: "rejected"    as DocStatus, validity: "—",          uploadedAt: "03/09/2026" },
  { id: 8, name: "Insalubridade / Periculosidade",         person: "João Ferreira",           type: "employee",  status: "correction"  as DocStatus, validity: "15/10/2026", uploadedAt: "09/09/2026" },
  { id: 9, name: "Certidão Negativa Municipal",            person: "Vigilância Suprema Eireli",type:"company",   status: "pending"     as DocStatus, validity: "20/10/2026", uploadedAt: "08/09/2026" },
];

const MOCK_EMPLOYEES = [
  { id: 1, name: "Carlos Souza",   cpf: "123.456.789-00", role: "Auxiliar de Limpeza", status: "pending" as SupplierStatus, pendingDocs: 2 },
  { id: 2, name: "Ana Lima",       cpf: "987.654.321-00", role: "Supervisora",          status: "apt"     as SupplierStatus, pendingDocs: 0 },
  { id: 3, name: "João Ferreira",  cpf: "456.789.123-00", role: "Eletricista",          status: "pending" as SupplierStatus, pendingDocs: 1 },
  { id: 4, name: "Marcia Ramos",   cpf: "321.654.987-00", role: "Pintura",              status: "apt"     as SupplierStatus, pendingDocs: 0 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "success", msg: "Documento 'Certidão Negativa Federal' aprovado para Construtora BH Ltda", time: "Há 2 horas",  read: false },
  { id: 2, type: "warning", msg: "Documento 'ASO' de Carlos Souza vence em 7 dias", time: "Há 5 horas", read: false },
  { id: 3, type: "danger",  msg: "Certidão Estadual reprovada — TechClean Terceirizados", time: "Há 1 dia", read: true },
  { id: 4, type: "info",    msg: "Serviços e Logística SA enviou 3 novos documentos para análise", time: "Há 2 dias", read: true },
  { id: 5, type: "danger",  msg: "TechClean Terceirizados está BLOQUEADA — 7 documentos vencidos/reprovados", time: "Há 3 dias", read: true },
  { id: 6, type: "warning", msg: "Boletim de pagamento de Vigilância Suprema vence em 5 dias — Petrolina", time: "Há 4 dias", read: true },
  { id: 7, type: "info",    msg: "Correção solicitada para 'Insalubridade / Periculosidade' — João Ferreira", time: "Há 4 dias", read: true },
];

const MOCK_HISTORY = [
  { id: 1, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Aprovação de documento",    doc: "Certidão Negativa Federal",   supplier: "Construtora BH Ltda",     date: "12/09/2026 14:32" },
  { id: 2, user: "Pedro Mota",     role: "Analista Jotanunes", action: "Reprovação de documento",   doc: "Certidão Estadual",            supplier: "TechClean Terceirizados", date: "12/09/2026 11:18" },
  { id: 3, user: "Construtora BH", role: "Fornecedor",          action: "Envio de documento",        doc: "CNDT Trabalhistas",            supplier: "Construtora BH Ltda",     date: "11/09/2026 16:45" },
  { id: 4, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Correção solicitada",       doc: "Insalubridade/Periculosidade", supplier: "Serviços e Logística SA", date: "11/09/2026 09:12" },
  { id: 5, user: "TechClean",      role: "Fornecedor",          action: "Envio de documento",        doc: "Certidão Estadual",            supplier: "TechClean Terceirizados", date: "10/09/2026 15:00" },
  { id: 6, user: "Sistema",        role: "Automático",          action: "Bloqueio automático",       doc: "—",                            supplier: "TechClean Terceirizados", date: "09/09/2026 00:00" },
  { id: 7, user: "Pedro Mota",     role: "Analista Jotanunes", action: "Autorização excepcional",   doc: "—",                            supplier: "Vigilância Suprema Eireli",date: "08/09/2026 10:30" },
  { id: 8, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Recebimento de material",   doc: "Equipamentos de EPI",          supplier: "Facilities Total ME",     date: "07/09/2026 09:00" },
];

const MOCK_BOLETINS = [
  { id: 1, supplier: "Construtora BH Ltda",     mes: "Setembro/2026", status: "approved" as DocStatus, dataEnvio: "03/09/2026", dataVenc: "30/09/2026", unidade: "Belo Horizonte", tipo: "mensal" },
  { id: 2, name: "Serviços e Logística SA",     mes: "Setembro/2026", status: "pending"  as DocStatus, dataEnvio: "—",          dataVenc: "30/09/2026", unidade: "Petrolina",      tipo: "quinzenal-1" },
  { id: 3, supplier: "Vigilância Suprema Eireli",mes:"Setembro/2026", status: "waiting"  as DocStatus, dataEnvio: "—",          dataVenc: "15/09/2026", unidade: "Petrolina",      tipo: "quinzenal-2" },
  { id: 4, supplier: "Facilities Total ME",      mes: "Setembro/2026", status: "approved" as DocStatus, dataEnvio: "01/09/2026", dataVenc: "30/09/2026", unidade: "Belo Horizonte", tipo: "mensal" },
  { id: 5, supplier: "TechClean Terceirizados",  mes: "Agosto/2026",   status: "rejected" as DocStatus, dataEnvio: "05/08/2026", dataVenc: "31/08/2026", unidade: "Belo Horizonte", tipo: "mensal" },
];

const MOCK_AUTORIZACOES = [
  { id: 1, supplier: "TechClean Terceirizados", funcionario: "Empresa inteira", motivo: "Certidão Estadual em processo de renovação — prazo aguardando Receita Estadual", solicitante: "Pedro Mota", aprovador: "Ana Carvalho", validade: "20/09/2026", status: "approved" },
  { id: 2, supplier: "Serviços e Logística SA",  funcionario: "Carlos Souza",    motivo: "ASO em atualização — médico em férias, laudo parcial apresentado", solicitante: "Ana Carvalho", aprovador: "—", validade: "18/09/2026", status: "pending" },
];

const MOCK_MATERIAIS = [
  { id: 1, supplier: "Construtora BH Ltda",  material: "Capacetes de segurança (20 un.)", recebidoPor: "Ana Carvalho", data: "12/09/2026", obs: "Todos em boas condições" },
  { id: 2, supplier: "Facilities Total ME",   material: "EPIs — Luvas e botas (10 kits)", recebidoPor: "Pedro Mota",    data: "11/09/2026", obs: "2 kits com defeito, devolvidos" },
  { id: 3, supplier: "Vigilância Suprema Eireli", material: "Uniformes (15 conjuntos)",   recebidoPor: "Ana Carvalho", data: "08/09/2026", obs: "" },
];

const FUNCTIONAL_REQS = [
  { id: "RF01", title: "Autenticar fornecedor",                    status: "definido",   desc: "O sistema deverá permitir que fornecedores autenticados acessem o Portal do Fornecedor." },
  { id: "RF02", title: "Cadastrar informações do fornecedor",      status: "parcial",    desc: "O sistema deverá permitir o cadastro e atualização das informações necessárias para identificação do fornecedor." },
  { id: "RF03", title: "Cadastrar funcionários vinculados",        status: "parcial",    desc: "O sistema deverá permitir que o fornecedor cadastre os funcionários envolvidos na prestação dos serviços." },
  { id: "RF04", title: "Enviar documentação da empresa",           status: "parcial",    desc: "O sistema deverá permitir que o fornecedor envie os documentos obrigatórios referentes à empresa." },
  { id: "RF05", title: "Enviar documentação dos funcionários",     status: "parcial",    desc: "O sistema deverá permitir que o fornecedor envie as documentações obrigatórias dos funcionários cadastrados." },
  { id: "RF06", title: "Consultar situação das documentações",     status: "parcial",    desc: "O sistema deverá permitir que o fornecedor acompanhe a situação dos documentos. Status: Aguardando Análise → Aprovado / Reprovado / Correção Solicitada → Vencido." },
  { id: "RF07", title: "Analisar documentação",                    status: "definido",   desc: "O sistema deverá permitir que usuários internos da Jotanunes consultem e analisem as documentações enviadas." },
  { id: "RF08", title: "Aprovar ou reprovar documentação",         status: "definido",   desc: "O sistema deverá permitir que usuários internos da Jotanunes aprovem ou reprovem os documentos analisados." },
  { id: "RF09", title: "Solicitar correção de documentação",       status: "definido",   desc: "O sistema deverá permitir que a Jotanunes solicite ao fornecedor a correção ou substituição de um documento que apresente inconsistências." },
  { id: "RF10", title: "Auxiliar análise documental por automação",status: "definido",   desc: "O sistema deverá possuir mecanismo automatizado para auxiliar na identificação de possíveis erros, inconsistências ou informações relevantes nos documentos enviados." },
  { id: "RF11", title: "Controlar validade dos documentos",        status: "parcial",    desc: "O sistema deverá armazenar e acompanhar a validade dos documentos que possuam data de vencimento." },
  { id: "RF12", title: "Notificar sobre documentos pendentes/vencidos", status: "validar", desc: "O sistema deverá gerar notificações relacionadas a pendências, vencimentos e necessidade de renovação de documentos." },
  { id: "RF13", title: "Controlar renovação do boletim de pagamento", status: "validar", desc: "O sistema deverá controlar a renovação periódica do boletim de pagamento dos fornecedores e/ou funcionários, conforme regras definidas pela Jotanunes." },
  { id: "RF14", title: "Aplicar regra específica para Petrolina",  status: "validar",    desc: "O sistema deverá possuir tratamento específico para fornecedores vinculados à operação de Petrolina, permitindo o acompanhamento das confirmações de pagamento quinzenais." },
  { id: "RF15", title: "Notificar necessidade de validação do boletim", status: "definido", desc: "O sistema deverá notificar a equipe responsável da Jotanunes quando houver boletins de pagamento ou documentos de funcionários aguardando validação." },
  { id: "RF16", title: "Registrar recebimento de material",        status: "definido",   desc: "O sistema deverá permitir que a equipe interna registre que determinado material relacionado a um fornecedor foi recebido pela Jotanunes." },
  { id: "RF17", title: "Permitir autorização excepcional",         status: "validar",    desc: "O sistema deverá permitir o registro de autorização excepcional para prestação de serviço quando houver documentação irregular ou vencida, desde que a autorização seja realizada pela Jotanunes." },
  { id: "RF18", title: "Manter histórico das análises",            status: "validar",    desc: "O sistema deverá manter o histórico de envio, análise, aprovação, reprovação, substituição e vencimento das documentações." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DocStatus | SupplierStatus | string }) {
  const map: Record<string, { cls: string; label: string; dot?: string }> = {
    approved:   { cls: "badge badge-success", label: "Aprovado",           dot: "#16a34a" },
    apt:        { cls: "badge badge-success", label: "Apto",               dot: "#16a34a" },
    pending:    { cls: "badge badge-warning", label: "Aguardando Análise", dot: "#ca8a04" },
    waiting:    { cls: "badge badge-gray",    label: "Aguardando Envio",   dot: "#6b7280" },
    expired:    { cls: "badge badge-danger",  label: "Vencido",            dot: "#dc2626" },
    rejected:   { cls: "badge badge-danger",  label: "Reprovado",          dot: "#dc2626" },
    correction: { cls: "badge badge-orange",  label: "Correção Solicitada",dot: "#d97706" },
    blocked:    { cls: "badge badge-danger",  label: "Bloqueado",          dot: "#dc2626" },
  };
  const cfg = map[status] ?? { cls: "badge badge-gray", label: status };
  return (
    <span className={cfg.cls}>
      {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />}
      {cfg.label}
    </span>
  );
}

function RFStatusBadge({ status }: { status: string }) {
  if (status === "definido")  return <span className="badge badge-success">✅ Definido</span>;
  if (status === "parcial")   return <span className="badge badge-warning">🟡 Parcialmente definido</span>;
  return <span className="badge badge-gray">🔵 Validar com cliente</span>;
}

function Icon({ name, size = 18, color }: { name: string; size?: number; color?: string }) {
  const s = { width: size, height: size, stroke: color || "currentColor", fill: "none", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactElement> = {
    home:     <svg viewBox="0 0 24 24" style={s}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    building: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M9 12h.01M9 15h.01M12 9h.01M12 12h.01M12 15h.01M15 9h.01M15 12h.01M15 15h.01"/></svg>,
    users:    <svg viewBox="0 0 24 24" style={s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    file:     <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    upload:   <svg viewBox="0 0 24 24" style={s}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    alert:    <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    check:    <svg viewBox="0 0 24 24" style={s}><polyline points="20 6 9 17 4 12"/></svg>,
    x:        <svg viewBox="0 0 24 24" style={s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    search:   <svg viewBox="0 0 24 24" style={s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell:     <svg viewBox="0 0 24 24" style={s}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    clock:    <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    list:     <svg viewBox="0 0 24 24" style={s}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    logout:   <svg viewBox="0 0 24 24" style={s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    edit:     <svg viewBox="0 0 24 24" style={s}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    eye:      <svg viewBox="0 0 24 24" style={s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    plus:     <svg viewBox="0 0 24 24" style={s}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    filter:   <svg viewBox="0 0 24 24" style={s}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    refresh:  <svg viewBox="0 0 24 24" style={s}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>,
    calendar: <svg viewBox="0 0 24 24" style={s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    doc:      <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    shield:   <svg viewBox="0 0 24 24" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    money:    <svg viewBox="0 0 24 24" style={s}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    star:     <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    package:  <svg viewBox="0 0 24 24" style={s}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    info:     <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    mappin:   <svg viewBox="0 0 24 24" style={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  };
  return icons[name] ?? <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/></svg>;
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
  const links: { id: Screen; label: string; icon: string; group?: string }[] = [
    { id: "admin-dashboard",         label: "Dashboard",                icon: "home" },
    { id: "admin-suppliers",         label: "Fornecedores",             icon: "building",  group: "Operações" },
    { id: "document-analysis",       label: "Análise de Documentos",    icon: "eye",       group: "Operações" },
    { id: "expirations",             label: "Vencimentos",              icon: "calendar",  group: "Operações" },
    { id: "boletim",                 label: "Boletim de Pagamento",     icon: "money",     group: "Operações" },
    { id: "autorizacao-excepcional", label: "Autorizações Excepcionais",icon: "star",      group: "Controle" },
    { id: "recebimento-material",    label: "Recebimento de Material",  icon: "package",   group: "Controle" },
    { id: "notifications",           label: "Notificações",             icon: "bell",      group: "Sistema" },
    { id: "history",                 label: "Histórico",                icon: "list",      group: "Sistema" },
    { id: "requisitos",              label: "Requisitos do Sistema",    icon: "info",      group: "Sistema" },
  ];

  let lastGroup = "";
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar${open ? " open" : ""}`} style={{ width: 232, minHeight: "100vh", background: "#1a0a0c", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 16px", borderBottom: "1px solid #2d1216", flexShrink: 0 }}>
        <BrandLogo alternate compact white />
      </div>
      <div style={{ padding: "10px 18px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "#6b3a42", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Painel Interno
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((l) => {
          const showHeader = l.group && l.group !== lastGroup;
          if (showHeader) lastGroup = l.group!;
          return (
            <div key={l.id}>
              {showHeader && <div style={{ fontSize: 9, color: "#3d1820", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 4px 4px" }}>{l.group}</div>}
              <div className={`sidebar-link${screen === l.id ? " active" : ""}`} onClick={() => { onNav(l.id); onClose(); }}>
                <span className="icon"><Icon name={l.icon} size={17} /></span>
                {l.label}
              </div>
            </div>
          );
        })}
      </nav>
      <div style={{ padding: "14px 14px 18px", borderTop: "1px solid #2d1216", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c01a2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            AC
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>Ana Carvalho</div>
            <div style={{ fontSize: 11, color: "#7a3a42" }}>Analista Jotanunes</div>
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

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto" }}>
      <div style={{ display: "flex", flexWrap: "wrap", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.18)", width: "min(880px, 94vw)", minHeight: 560 }}>
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
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Entrar no sistema</h2>
              <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 28px" }}>Acesse com suas credenciais internas da Jotanunes</p>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                <button className="btn btn-secondary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={onLogin}>Entrar como Jotanunes (Interno)</button>
              </div>
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 11, marginTop: 16 }}>RNF01 — Acesso restrito por autenticação. <br/>Suporte: ti@jotanunes.com.br</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const stats = [
    { label: "Total Fornecedores",     value: 47, icon: "building", color: "#c01a2b", bg: "#fde8ea" },
    { label: "Aptos",                  value: 31, icon: "check",    color: "#16a34a", bg: "#dcfce7" },
    { label: "Aguardando Análise",     value: 9,  icon: "clock",    color: "#ca8a04", bg: "#fef9c3" },
    { label: "Correção Solicitada",    value: 3,  icon: "edit",     color: "#d97706", bg: "#fff7ed" },
    { label: "Bloqueados",             value: 5,  icon: "x",        color: "#dc2626", bg: "#fee2e2" },
    { label: "Boletins Pendentes (RF13)",value: 4,icon: "money",    color: "#7c3aed", bg: "#ede9fe" },
  ];
  return (
    <>
      <Header title="Dashboard Administrativo" subtitle="Visão geral da plataforma — 14/09/2026"
        actions={<><button className="btn btn-secondary btn-sm"><Icon name="refresh" size={14} />Atualizar</button><button className="btn btn-primary btn-sm"><Icon name="doc" size={14} />Relatório</button></>} />
      <PageWrapper>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
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
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7f1d1d" }}>Autorizações Excepcionais (RF17)</h4>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#b91c1c" }}><strong>2</strong> autorizações ativas — fornecedores operando com documentação irregular aprovada pela Jotanunes.</p>
              <button className="btn btn-danger btn-sm" onClick={() => onNav("autorizacao-excepcional")}>Ver autorizações</button>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Documentos Aguardando Análise (RF07)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav("admin-suppliers")}>Ver todos</button>
            </div>
            <table className="table-base">
              <thead><tr><th>Documento</th><th>Fornecedor</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                {MOCK_DOCUMENTS.filter(d => ["pending","correction"].includes(d.status)).map(d => (
                  <tr key={d.id}>
                    <td><div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 11.5, color: "#9ca3af" }}>{d.uploadedAt}</div></td>
                    <td style={{ fontSize: 13 }}>{d.person}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={13} />Analisar</button></td>
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

// ─── ADMIN SUPPLIERS ──────────────────────────────────────────────────────────

function AdminSuppliers({ onNav }: { onNav: (s: Screen) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unidadeFilter, setUnidadeFilter] = useState("all");
  const filtered = MOCK_SUPPLIERS.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.cnpj.includes(q)) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (unidadeFilter !== "all" && s.unidade !== unidadeFilter) return false;
    return true;
  });
  return (
    <>
      <Header title="Fornecedores" subtitle="Gestão de todos os fornecedores cadastrados"
        actions={<button className="btn btn-primary"><Icon name="plus" size={15} />Novo Fornecedor</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar por nome ou CNPJ..." style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="select-base" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Todos os status</option><option value="apt">Apto</option><option value="pending">Pendente</option><option value="blocked">Bloqueado</option>
            </select>
            <select className="select-base" value={unidadeFilter} onChange={e => setUnidadeFilter(e.target.value)}>
              <option value="all">Todas as unidades</option>
              <option value="Belo Horizonte">Belo Horizonte</option>
              <option value="Petrolina">Petrolina (RF14)</option>
            </select>
          </div>
          <table className="table-base">
            <thead><tr><th>Fornecedor</th><th>CNPJ</th><th>Unidade</th><th>Status</th><th>Docs Pendentes</th><th>Última Atualização</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#c01a2b", flexShrink: 0 }}>
                        {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5 }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{s.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>{s.cnpj}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="mappin" size={13} color={s.unidade === "Petrolina" ? "#7c3aed" : "#6b7280"} />
                      <span style={{ fontSize: 12.5, color: s.unidade === "Petrolina" ? "#7c3aed" : "#374151", fontWeight: s.unidade === "Petrolina" ? 600 : 400 }}>{s.unidade}</span>
                      {s.unidade === "Petrolina" && <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed", fontSize: 10 }}>RF14</span>}
                    </div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{s.pendingDocs > 0 ? <span style={{ fontWeight: 700, color: "#dc2626" }}>{s.pendingDocs}</span> : <span style={{ color: "#6b7280" }}>—</span>}</td>
                  <td style={{ color: "#6b7280", fontSize: 13 }}>{s.lastUpdate}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => onNav("supplier-details")}>Detalhes</button>
                      {s.pendingDocs > 0 && <button className="btn btn-warning btn-sm" onClick={() => onNav("document-analysis")}>Analisar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{filtered.length} fornecedor(es)</span>
            <div style={{ display: "flex", gap: 6 }}>{[1,2,3].map(n => <button key={n} className="btn btn-ghost btn-sm" style={{ minWidth: 32, justifyContent: "center", background: n === 1 ? "#fde8ea" : undefined, color: n === 1 ? "#c01a2b" : undefined }}>{n}</button>)}</div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── SUPPLIER DETAILS ─────────────────────────────────────────────────────────

function SupplierDetails({ onNav }: { onNav: (s: Screen) => void }) {
  const s = MOCK_SUPPLIERS[1];
  const pct = 68;
  return (
    <>
      <Header title="Detalhes do Fornecedor"
        actions={<><button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>← Voltar</button><button className="btn btn-primary btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={14} />Analisar Docs</button></>} />
      <PageWrapper>
        <div className="card" style={{ marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#c01a2b", flexShrink: 0 }}>SL</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{s.name}</h2>
              <StatusBadge status={s.status} />
              <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed" }}><Icon name="mappin" size={11} />Petrolina — RF14</span>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["CNPJ", s.cnpj], ["Contato", s.contact], ["Última atualização", s.lastUpdate], ["Docs pendentes", String(s.pendingDocs)]].map(([l, v]) => (
                <div key={l}><div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div><div style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: pct >= 100 ? "#16a34a" : "#ca8a04" }}>{pct}%</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Documentação</div>
            <div className="progress-bar-track" style={{ width: 80, marginTop: 6 }}><div className="progress-bar-fill" style={{ width: `${pct}%`, background: "#ca8a04" }} /></div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Funcionários (RF03)</h3>
              {MOCK_EMPLOYEES.map(e => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#374151" }}>
                      {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 11.5, color: "#9ca3af" }}>{e.role}</div></div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Documentos — Fluxo RF06</h3>
            </div>
            <table className="table-base">
              <thead><tr><th>Documento</th><th>Status</th><th>Validade</th><th></th></tr></thead>
              <tbody>
                {MOCK_DOCUMENTS.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontSize: 12.5, fontWeight: 600 }}>{d.name}</td>
                    <td><StatusBadge status={d.status} /></td>
                    <td style={{ fontSize: 12.5, color: "#6b7280" }}>{d.validity}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={13} /></button></td>
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

// ─── DOCUMENT ANALYSIS ────────────────────────────────────────────────────────

function DocumentAnalysis({ onNav }: { onNav: (s: Screen) => void }) {
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Solicitar Correção — RF09</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><Icon name="x" size={16} /></button>
            </div>
            <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 20px" }}>Informe ao fornecedor o que precisa ser corrigido. O status mudará para <strong>Correção Solicitada</strong>.</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Documento</label>
              <input className="input-base" value={doc.name} readOnly style={{ background: "#f9fafb" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Motivo Principal *</label>
              <select className="select-base" style={{ width: "100%" }} value={correctionType} onChange={e => setCorrectionType(e.target.value)}>
                <option value="">Selecione o motivo...</option>
                <option>Documento ilegível ou com baixa qualidade</option>
                <option>CNPJ/CPF divergente do cadastro</option>
                <option>Documento vencido</option>
                <option>Assinatura ausente ou inválida</option>
                <option>Documento incompleto</option>
                <option>Outro</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Descrição detalhada *</label>
              <textarea className="input-base" rows={4} placeholder="Descreva com detalhes o que precisa ser corrigido..." style={{ resize: "vertical" }} value={correctionReason} onChange={e => setCorrectionReason(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-warning" onClick={() => setShowModal(false)}><Icon name="edit" size={15} />Enviar Solicitação</button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => { setShowRejectModal(false); setRejectConfirmed(false); }}>
          <div className="modal-box rejection-modal" onClick={e => e.stopPropagation()}>
            <div className="rejection-icon"><Icon name="x" size={22} /></div>
            <h3>Confirmar reprovação?</h3>
            <p>
              Esta ação reprovará <strong>{doc.name}</strong> de <strong>{doc.person}</strong> e será registrada no histórico.
            </p>
            <label className="rejection-check">
              <input
                type="checkbox"
                checked={rejectConfirmed}
                onChange={e => setRejectConfirmed(e.target.checked)}
              />
              <span>Revisei o documento e tenho certeza de que desejo reprová-lo.</span>
            </label>
            <div className="rejection-actions">
              <button className="btn btn-secondary" onClick={() => { setShowRejectModal(false); setRejectConfirmed(false); }}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                disabled={!rejectConfirmed}
                onClick={() => {
                  if (!rejectConfirmed) return;
                  setDecision("rejected");
                  setShowRejectModal(false);
                  setRejectConfirmed(false);
                }}
              >
                <Icon name="x" size={15} />
                Sim, reprovar documento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── EXPIRATIONS ──────────────────────────────────────────────────────────────

function Expirations() {
  const items = [
    { doc: "ASO — Carlos Souza",         supplier: "TechClean Terceirizados",    validity: "01/08/2026", days: -14, status: "expired"   as DocStatus },
    { doc: "Certidão Negativa FGTS",      supplier: "Serviços e Logística SA",    validity: "10/10/2026", days: 26,  status: "pending"   as DocStatus },
    { doc: "Certidão Negativa Municipal", supplier: "Vigilância Suprema Eireli",  validity: "18/10/2026", days: 34,  status: "pending"   as DocStatus },
    { doc: "NR-35 — João Ferreira",       supplier: "Serviços e Logística SA",    validity: "30/11/2026", days: 77,  status: "approved"  as DocStatus },
    { doc: "Contrato Social",             supplier: "Facilities Total ME",        validity: "15/10/2026", days: 31,  status: "approved"  as DocStatus },
  ];
  return (
    <>
      <Header title="Vencimentos" subtitle="RF11 — Controle de validade dos documentos" />
      <PageWrapper>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {[{ label: "Vencidos", value: 3, color: "#dc2626", bg: "#fee2e2" }, { label: "Vence em 30 dias", value: 5, color: "#d97706", bg: "#fff7ed" }, { label: "Vence em 60 dias", value: 8, color: "#ca8a04", bg: "#fef9c3" }, { label: "Em dia", value: 42, color: "#16a34a", bg: "#dcfce7" }].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1 }}>
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <select className="select-base"><option>Somente vencidos</option><option>Próximos 7 dias</option><option>Próximos 30 dias</option><option>Próximos 60 dias</option><option>Todos</option></select>
            <select className="select-base"><option>Todos os fornecedores</option>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select>
            <button className="btn btn-secondary"><Icon name="refresh" size={14} />Atualizar</button>
          </div>
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
                  <td><button className="btn btn-ghost btn-sm"><Icon name="bell" size={13} />Notificar (RF12)</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── BOLETIM DE PAGAMENTO (RF13/RF14) ─────────────────────────────────────────

function Boletim() {
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

// ─── AUTORIZAÇÃO EXCEPCIONAL (RF17) ──────────────────────────────────────────

function AutorizacaoExcepcional() {
  const [showNew, setShowNew] = useState(false);
  return (
    <>
      <Header title="Autorizações Excepcionais" subtitle="RF17 — Autorização temporária para fornecedores com documentação irregular"
        actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}><Icon name="plus" size={15} />Nova Autorização</button>} />
      <PageWrapper>
        <div style={{ padding: "12px 16px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, marginBottom: 20, display: "flex", gap: 10 }}>
          <Icon name="alert" size={18} color="#d97706" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>RF17 — Status: Pendente de definição (Validar com cliente)</div>
            <div style={{ fontSize: 12.5, color: "#78350f" }}>Fluxo de aprovação, escopo e vigência das autorizações excepcionais ainda está em revisão com a Jotanunes.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MOCK_AUTORIZACOES.map(a => (
            <div key={a.id} className="card" style={{ borderLeft: `3px solid ${a.status === "approved" ? "#16a34a" : "#ca8a04"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{a.supplier}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 10 }}>
                    {[["Funcionário/Escopo", a.funcionario], ["Solicitante", a.solicitante], ["Aprovador", a.aprovador], ["Válida até", a.validade]].map(([l, v]) => (
                      <div key={l}><div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div><div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{v}</div></div>
                    ))}
                  </div>
                  <div style={{ background: "#fef9c3", borderRadius: 6, padding: "8px 12px", border: "1px solid #fde68a" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>Justificativa: </span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{a.motivo}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 16 }}>
                  {a.status === "pending" && <><button className="btn btn-success btn-sm"><Icon name="check" size={13} />Aprovar</button><button className="btn btn-danger btn-sm"><Icon name="x" size={13} />Negar</button></>}
                  <button className="btn btn-ghost btn-sm"><Icon name="list" size={13} />Histórico</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-box" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Nova Autorização Excepcional — RF17</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}><Icon name="x" size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Fornecedor *</label><select className="select-base" style={{ width: "100%" }}>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Funcionário / Escopo</label><input className="input-base" placeholder="Ex: Empresa inteira ou nome do funcionário" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Documento(s) com pendência</label><input className="input-base" placeholder="Ex: ASO vencido, Certidão Estadual em renovação" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Justificativa *</label><textarea className="input-base" rows={3} placeholder="Motivo da autorização excepcional..." style={{ resize: "vertical" }} /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Válida até *</label><input className="input-base" type="date" /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setShowNew(false)}>Solicitar Autorização</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── RECEBIMENTO DE MATERIAL (RF16) ──────────────────────────────────────────

function RecebimentoMaterial() {
  const [showNew, setShowNew] = useState(false);
  return (
    <>
      <Header title="Recebimento de Material" subtitle="RF16 — Registro de materiais recebidos de fornecedores"
        actions={<button className="btn btn-primary" onClick={() => setShowNew(true)}><Icon name="plus" size={15} />Registrar Recebimento</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar por fornecedor ou material..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base"><option>Todos os fornecedores</option>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select>
            <input className="select-base" type="date" />
          </div>
          <table className="table-base">
            <thead><tr><th>Fornecedor</th><th>Material Recebido</th><th>Recebido por</th><th>Data</th><th>Observações</th><th>Ações</th></tr></thead>
            <tbody>
              {MOCK_MATERIAIS.map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.supplier}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="package" size={16} color="#6b7280" />
                      </div>
                      <span>{m.material}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#c01a2b" }}>
                        {m.recebidoPor.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13 }}>{m.recebidoPor}</span>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>{m.data}</td>
                  <td style={{ fontSize: 12.5, color: m.obs ? "#374151" : "#9ca3af", fontStyle: m.obs ? "normal" : "italic" }}>{m.obs || "Sem observações"}</td>
                  <td><button className="btn btn-ghost btn-sm"><Icon name="eye" size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{MOCK_MATERIAIS.length} registros — RF16 Definido ✅</span>
          </div>
        </div>
      </PageWrapper>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>Registrar Recebimento — RF16</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}><Icon name="x" size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Fornecedor *</label><select className="select-base" style={{ width: "100%" }}>{MOCK_SUPPLIERS.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Material / Descrição *</label><input className="input-base" placeholder="Ex: Capacetes de segurança (20 un.)" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Data de Recebimento *</label><input className="input-base" type="date" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Recebido por</label><input className="input-base" defaultValue="Ana Carvalho" /></div>
              <div><label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Observações</label><textarea className="input-base" rows={3} placeholder="Condições, divergências, devoluções..." style={{ resize: "vertical" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={() => setShowNew(false)}><Icon name="package" size={15} />Registrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── NOTIFICATIONS (RF12/RF15) ───────────────────────────────────────────────

function Notifications() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const unread = items.filter(n => !n.read).length;
  const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
    success: { icon: "check",   color: "#16a34a", bg: "#dcfce7" },
    warning: { icon: "clock",   color: "#d97706", bg: "#fff7ed" },
    danger:  { icon: "alert",   color: "#dc2626", bg: "#fee2e2" },
    info:    { icon: "doc",     color: "#c01a2b", bg: "#fde8ea" },
  };
  return (
    <>
      <Header title="Notificações" subtitle={`RF12/RF15 — ${unread} não lida(s)`}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => setItems(items.map(n => ({ ...n, read: true })))}>Marcar todas como lidas</button>} />
      <PageWrapper>
        <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map(n => {
            const cfg = iconMap[n.type];
            return (
              <div key={n.id} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: n.read ? 0.65 : 1, borderLeft: `3px solid ${cfg.color}`, cursor: "pointer" }}
                onClick={() => setItems(items.map(item => item.id === n.id ? { ...item, read: true } : item))}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={cfg.icon} size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13.5, color: "#0f172a", fontWeight: n.read ? 400 : 600 }}>{n.msg}</p>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{n.time}</span>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c01a2b", flexShrink: 0, marginTop: 4 }} />}
              </div>
            );
          })}
        </div>
      </PageWrapper>
    </>
  );
}

// ─── HISTORY (RF18) ──────────────────────────────────────────────────────────

function History() {
  const actionColors: Record<string, string> = {
    "Aprovação de documento": "#16a34a", "Reprovação de documento": "#dc2626",
    "Envio de documento": "#c01a2b", "Correção solicitada": "#d97706",
    "Bloqueio automático": "#dc2626", "Autorização excepcional": "#7c3aed",
    "Recebimento de material": "#0891b2",
  };
  return (
    <>
      <Header title="Histórico de Ações" subtitle="RF18 — Rastreabilidade completa de todas as atividades do sistema"
        actions={<button className="btn btn-secondary btn-sm"><Icon name="doc" size={14} />Exportar CSV</button>} />
      <PageWrapper>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={15} /></span>
              <input className="input-base" placeholder="Buscar no histórico..." style={{ paddingLeft: 32 }} />
            </div>
            <select className="select-base"><option>Todos os usuários</option><option>Ana Carvalho</option><option>Pedro Mota</option><option>Sistema</option></select>
            <select className="select-base"><option>Todas as ações</option><option>Aprovação</option><option>Reprovação</option><option>Envio</option><option>Correção</option><option>Autorização</option></select>
            <input className="select-base" type="date" defaultValue="2026-09-01" />
          </div>
          <table className="table-base">
            <thead><tr><th>Usuário</th><th>Perfil</th><th>Ação</th><th>Documento</th><th>Fornecedor</th><th>Data / Hora</th></tr></thead>
            <tbody>
              {MOCK_HISTORY.map(h => (
                <tr key={h.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#c01a2b", flexShrink: 0 }}>
                        {h.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{h.user}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${h.role === "Analista Jotanunes" ? "badge-blue" : h.role === "Automático" ? "badge-danger" : "badge-gray"}`}>{h.role}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 600, color: actionColors[h.action] ?? "#374151" }}>{h.action}</span></td>
                  <td style={{ fontSize: 13 }}>{h.doc}</td>
                  <td style={{ fontSize: 13 }}>{h.supplier}</td>
                  <td style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 12.5, color: "#6b7280" }}>{MOCK_HISTORY.length} registros — RF18 Validar com cliente</span>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── REQUISITOS DO SISTEMA ────────────────────────────────────────────────────

function Requisitos() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? FUNCTIONAL_REQS : FUNCTIONAL_REQS.filter(r => r.status === filter);
  const counts = { definido: FUNCTIONAL_REQS.filter(r => r.status === "definido").length, parcial: FUNCTIONAL_REQS.filter(r => r.status === "parcial").length, validar: FUNCTIONAL_REQS.filter(r => r.status === "validar").length };

  return (
    <>
      <Header title="Requisitos do Sistema" subtitle="Documentação de Engenharia de Software — v1.0 | Autores: André, Davi, Gabriel, Gustavo, Hunald, Hyago, Laura, Pedro" />
      <PageWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[{ label: "Total de RFs", value: FUNCTIONAL_REQS.length, color: "#374151", bg: "#f8fafc" }, { label: "Definidos", value: counts.definido, color: "#16a34a", bg: "#dcfce7" }, { label: "Parcialmente Definidos", value: counts.parcial, color: "#ca8a04", bg: "#fef9c3" }, { label: "Validar com Cliente", value: counts.validar, color: "#6b7280", bg: "#f1f5f9" }].map(s => (
            <div key={s.label} className="stat-card">
              <div className="label">{s.label}</div>
              <div className="value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Regras de Negócio */}
        <div className="card" style={{ marginBottom: 20, borderLeft: "3px solid #c01a2b" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Regras de Negócio</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["RN01", "O fornecedor ou funcionário terceirizado só receberá o status APTO após aprovação de 100% da documentação obrigatória anexada."],
              ["RN02", "O sistema deve bloquear automaticamente o cadastro do fornecedor caso algum documento obrigatório atinja a data de vencimento."],
              ["RN03", "Apenas usuários internos da Jotanunes terão permissão para aprovar, reprovar ou solicitar correções nos anexos."],
              ["RN04", "Os documentos devem ser aceitos exclusivamente em formatos imutáveis ou de imagem (PDF, JPG, PNG) para evitar adulterações, com tamanho máximo de 10 MB por arquivo."],
            ].map(([id, desc]) => (
              <div key={id} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#c01a2b", background: "#fde8ea", padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>{id}</span>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RF list */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, flex: 1 }}>Requisitos Funcionais — RF01 a RF18</h3>
            <select className="select-base" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="definido">Definido ✅</option>
              <option value="parcial">Parcialmente definido 🟡</option>
              <option value="validar">Validar com cliente 🔵</option>
            </select>
          </div>
          <div>
            {filtered.map((r, i) => (
              <div key={r.id} style={{ padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#c01a2b", background: "#fde8ea", padding: "3px 10px", borderRadius: 4, flexShrink: 0, marginTop: 2 }}>{r.id}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{r.title}</span>
                    <RFStatusBadge status={r.status} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: "#6b7280", lineHeight: 1.65 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RNFs */}
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Requisitos Não-Funcionais</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {[
              ["RNF01", "Segurança de acesso", "Fornecedores autenticados têm acesso apenas às próprias informações e documentações."],
              ["RNF02", "Segurança na comunicação", "Informações transmitidas entre usuário e sistema utilizarão mecanismos seguros de comunicação (HTTPS)."],
              ["RNF03", "Privacidade das informações", "O sistema protegerá dados pessoais e documentos armazenados, restringindo acesso a usuários autorizados."],
              ["RNF04", "Integridade dos documentos", "O sistema garantirá que os documentos armazenados permaneçam íntegros e disponíveis durante todo o período de utilização."],
              ["RNF05", "Formatos de arquivos", "Aceitar exclusivamente PDF, JPG e PNG com limite de 10 MB por arquivo."],
            ].map(([id, title, desc]) => (
              <div key={id} style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#c01a2b", background: "#fde8ea", padding: "2px 7px", borderRadius: 4 }}>{id}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

// ─── SUPPLIER PROFILE ────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [navOpen, setNavOpen] = useState(false);

  const handleLogin = () => setScreen("admin-dashboard");
  const handleLogout = () => setScreen("login");
  const handleNav = (s: Screen) => setScreen(s);

  if (screen === "login") return <LoginScreen onLogin={handleLogin} />;

  const renderScreen = () => {
    switch (screen) {
      case "admin-dashboard":         return <AdminDashboard onNav={handleNav} />;
      case "admin-suppliers":         return <AdminSuppliers onNav={handleNav} />;
      case "supplier-details":        return <SupplierDetails onNav={handleNav} />;
      case "document-analysis":       return <DocumentAnalysis onNav={handleNav} />;
      case "expirations":             return <Expirations />;
      case "boletim":                 return <Boletim />;
      case "autorizacao-excepcional": return <AutorizacaoExcepcional />;
      case "recebimento-material":    return <RecebimentoMaterial />;
      case "notifications":           return <Notifications />;
      case "history":                 return <History />;
      case "requisitos":              return <Requisitos />;
      default:                        return null;
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
