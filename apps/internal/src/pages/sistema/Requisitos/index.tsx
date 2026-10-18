import { useState } from "react";
import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";
import RFStatusBadge from "./components/RFStatusBadge";

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

export default function RequisitosPage() {
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
