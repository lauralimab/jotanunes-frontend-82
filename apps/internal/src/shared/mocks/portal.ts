import type { DocStatus, SupplierStatus } from "../types/portal";

export const MOCK_SUPPLIERS = [
  { id: 1, name: "Construtora BH Ltda",      cnpj: "12.345.678/0001-90", status: "apt"     as SupplierStatus, pendingDocs: 0, lastUpdate: "12/09/2026", contact: "joao@construtora.com",  unidade: "Belo Horizonte" },
  { id: 2, name: "Serviços e Logística SA",   cnpj: "98.765.432/0001-11", status: "pending" as SupplierStatus, pendingDocs: 3, lastUpdate: "10/09/2026", contact: "maria@selog.com",        unidade: "Petrolina" },
  { id: 3, name: "TechClean Terceirizados",   cnpj: "55.123.456/0001-33", status: "blocked" as SupplierStatus, pendingDocs: 7, lastUpdate: "02/09/2026", contact: "carlos@techclean.com",   unidade: "Belo Horizonte" },
  { id: 4, name: "Vigilância Suprema Eireli", cnpj: "33.987.654/0001-77", status: "pending" as SupplierStatus, pendingDocs: 2, lastUpdate: "08/09/2026", contact: "ana@vigilancia.com",     unidade: "Petrolina" },
  { id: 5, name: "Facilities Total ME",       cnpj: "77.654.321/0001-55", status: "apt"     as SupplierStatus, pendingDocs: 0, lastUpdate: "11/09/2026", contact: "pedro@facilities.com",   unidade: "Belo Horizonte" },
];

export const MOCK_DOCUMENTS = [
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

export const MOCK_NOTIFICATIONS = [
  { id: 1, type: "success", msg: "Documento 'Certidão Negativa Federal' aprovado para Construtora BH Ltda", time: "Há 2 horas",  read: false },
  { id: 2, type: "warning", msg: "Documento 'ASO' de Carlos Souza vence em 7 dias", time: "Há 5 horas", read: false },
  { id: 3, type: "danger",  msg: "Certidão Estadual reprovada — TechClean Terceirizados", time: "Há 1 dia", read: true },
  { id: 4, type: "info",    msg: "Serviços e Logística SA enviou 3 novos documentos para análise", time: "Há 2 dias", read: true },
  { id: 5, type: "danger",  msg: "TechClean Terceirizados está BLOQUEADA — 7 documentos vencidos/reprovados", time: "Há 3 dias", read: true },
  { id: 6, type: "warning", msg: "Boletim de pagamento de Vigilância Suprema vence em 5 dias — Petrolina", time: "Há 4 dias", read: true },
  { id: 7, type: "info",    msg: "Correção solicitada para 'Insalubridade / Periculosidade' — João Ferreira", time: "Há 4 dias", read: true },
];

export const MOCK_HISTORY = [
  { id: 1, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Aprovação de documento",    doc: "Certidão Negativa Federal",   supplier: "Construtora BH Ltda",     date: "12/09/2026 14:32" },
  { id: 2, user: "Pedro Mota",     role: "Analista Jotanunes", action: "Reprovação de documento",   doc: "Certidão Estadual",            supplier: "TechClean Terceirizados", date: "12/09/2026 11:18" },
  { id: 3, user: "Construtora BH", role: "Fornecedor",          action: "Envio de documento",        doc: "CNDT Trabalhistas",            supplier: "Construtora BH Ltda",     date: "11/09/2026 16:45" },
  { id: 4, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Correção solicitada",       doc: "Insalubridade/Periculosidade", supplier: "Serviços e Logística SA", date: "11/09/2026 09:12" },
  { id: 5, user: "TechClean",      role: "Fornecedor",          action: "Envio de documento",        doc: "Certidão Estadual",            supplier: "TechClean Terceirizados", date: "10/09/2026 15:00" },
  { id: 6, user: "Sistema",        role: "Automático",          action: "Bloqueio automático",       doc: "—",                            supplier: "TechClean Terceirizados", date: "09/09/2026 00:00" },
  { id: 7, user: "Pedro Mota",     role: "Analista Jotanunes", action: "Autorização excepcional",   doc: "—",                            supplier: "Vigilância Suprema Eireli",date: "08/09/2026 10:30" },
  { id: 8, user: "Ana Carvalho",   role: "Analista Jotanunes", action: "Recebimento de material",   doc: "Equipamentos de EPI",          supplier: "Facilities Total ME",     date: "07/09/2026 09:00" },
];

export const MOCK_BOLETINS = [
  { id: 1, supplier: "Construtora BH Ltda",     mes: "Setembro/2026", status: "approved" as DocStatus, dataEnvio: "03/09/2026", dataVenc: "30/09/2026", unidade: "Belo Horizonte", tipo: "mensal" },
  { id: 2, name: "Serviços e Logística SA",     mes: "Setembro/2026", status: "pending"  as DocStatus, dataEnvio: "—",          dataVenc: "30/09/2026", unidade: "Petrolina",      tipo: "quinzenal-1" },
  { id: 3, supplier: "Vigilância Suprema Eireli",mes:"Setembro/2026", status: "waiting"  as DocStatus, dataEnvio: "—",          dataVenc: "15/09/2026", unidade: "Petrolina",      tipo: "quinzenal-2" },
  { id: 4, supplier: "Facilities Total ME",      mes: "Setembro/2026", status: "approved" as DocStatus, dataEnvio: "01/09/2026", dataVenc: "30/09/2026", unidade: "Belo Horizonte", tipo: "mensal" },
  { id: 5, supplier: "TechClean Terceirizados",  mes: "Agosto/2026",   status: "rejected" as DocStatus, dataEnvio: "05/08/2026", dataVenc: "31/08/2026", unidade: "Belo Horizonte", tipo: "mensal" },
];

export const MOCK_AUTORIZACOES = [
  { id: 1, supplier: "TechClean Terceirizados", funcionario: "Empresa inteira", motivo: "Certidão Estadual em processo de renovação — prazo aguardando Receita Estadual", solicitante: "Pedro Mota", aprovador: "Ana Carvalho", validade: "20/09/2026", status: "approved" },
  { id: 2, supplier: "Serviços e Logística SA",  funcionario: "Carlos Souza",    motivo: "ASO em atualização — médico em férias, laudo parcial apresentado", solicitante: "Ana Carvalho", aprovador: "—", validade: "18/09/2026", status: "pending" },
];

export const MOCK_MATERIAIS = [
  { id: 1, supplier: "Construtora BH Ltda",  material: "Capacetes de segurança (20 un.)", recebidoPor: "Ana Carvalho", data: "12/09/2026", obs: "Todos em boas condições" },
  { id: 2, supplier: "Facilities Total ME",   material: "EPIs — Luvas e botas (10 kits)", recebidoPor: "Pedro Mota",    data: "11/09/2026", obs: "2 kits com defeito, devolvidos" },
  { id: 3, supplier: "Vigilância Suprema Eireli", material: "Uniformes (15 conjuntos)",   recebidoPor: "Ana Carvalho", data: "08/09/2026", obs: "" },
];
