// Dados temporários: substituir ao integrar Documentos e SupplyRequest.
export const dashboardMocks = {
  documentsAwaitingReview: 9,
  rejectedDocuments: 3,
  requestsWithPending: 4,
  requestsInProgress: 12,
  analysisQueue: [
    { id: 1, document: "Certidão Negativa FGTS", supplier: "Almeida Serviços e Engenharia Ltda", sentAt: "26/10/2026", status: "pending" },
    { id: 2, document: "ASO — Atestado de Saúde Ocupacional", supplier: "Serviços e Logística SA", sentAt: "26/10/2026", status: "pending" },
    { id: 3, document: "Certidão Negativa Municipal", supplier: "Vigilância Suprema Eireli", sentAt: "27/10/2026", status: "pending" },
    { id: 4, document: "Contrato Social", supplier: "Construtora Base Forte", sentAt: "27/10/2026", status: "pending" },
    { id: 5, document: "Certidão Negativa Federal", supplier: "Facilities Total ME", sentAt: "27/10/2026", status: "pending" },
    { id: 6, document: "NR-35 — Trabalho em Altura", supplier: "Almeida Serviços e Engenharia Ltda", sentAt: "28/10/2026", status: "pending" },
    { id: 7, document: "Certidão de Débitos Trabalhistas", supplier: "Construtora Base Forte", sentAt: "28/10/2026", status: "pending" },
    { id: 8, document: "Comprovante de Inscrição no CNPJ", supplier: "Serviços e Logística SA", sentAt: "28/10/2026", status: "pending" },
  ],
  pendingRequests: [
    { id: 1, supplier: "Almeida Serviços e Engenharia Ltda", workSite: "Condomínio Fenda do Biquíni", missingDocuments: 2, regularWorkers: 7, requiredWorkers: 10 },
    { id: 2, supplier: "Serviços e Logística SA", workSite: "Residencial Jardins", missingDocuments: 3, regularWorkers: 3, requiredWorkers: 5 },
    { id: 3, supplier: "Vigilância Suprema Eireli", workSite: "Edifício Horizonte", missingDocuments: 1, regularWorkers: 4, requiredWorkers: 6 },
    { id: 4, supplier: "Facilities Total ME", workSite: "Residencial Jardins", missingDocuments: 2, regularWorkers: 2, requiredWorkers: 4 },
  ],
};
