
export interface Document {
  id: number;
  companyId: number;
  companyCorporateName: string | null;
  supplyRequestId: number | null;
  workSiteId: number | null;
  workSiteName: string | null;
  documentTypeId: number;
  documentTypeCode: string | null;
  documentTypeName: string | null;
  uploadedBySupplierUserId: number;
  uploadedByName: string | null;
  workerId: number | null;
  workerName: string | null;
  workerCpf: string | null;
  originalFileName: string | null;
  contentType: string | null;
  referencePeriodStart: string | null;
  referencePeriodEnd: string | null;
  expirationDate: string | null;
  status: DocumentStatusCode;
  statusDescription: string | null;
  rejectionReason: string | null;
  uploadWarning: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  analysis: DocumentAnalysisSummary | null;
}

export interface DocumentListResponse {
  items: Document[];
}

export type DocumentStatusCode = 1 | 2 | 3;
export type DocumentAnalysisStatusCode = 1 | 2 | 3 | 4 | 5;
export type AnalysisVerdictCode = 1 | 2 | 3;
export type DocumentOrderByCode = 1 | 2 | 3;
export type OrderDirectionCode = 1 | 2;

/** Alias emphasizing the DTO shape returned by the internal documents API. */
export type DocumentRecord = Document;

export interface DocumentAnalysisSummary {
  status: DocumentAnalysisStatusCode;
  statusDescription: string | null;
  verdict: AnalysisVerdictCode;
  verdictDescription: string | null;
  blockingCount: number;
  warningCount: number;
  analyzedAt: string | null;
}

export interface DocumentPageResponse {
  items: DocumentRecord[] | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface DocumentListFilters {
  pageNumber?: number;
  pageSize?: number;
  analysisStatus?: DocumentAnalysisStatusCode;
  analysisVerdict?: AnalysisVerdictCode;
  companyId?: number;
  workSiteId?: number;
  supplyRequestId?: number;
  documentTypeId?: number;
  workerId?: number;
  withoutSupplyRequest?: boolean;
  status?: DocumentStatusCode;
  periodStart?: string;
  periodEnd?: string;
  orderBy?: DocumentOrderByCode;
  orderDirection?: OrderDirectionCode;
}

export interface AnalysisField {
  name: string | null;
  value: string | null;
}

export interface AnalysisFinding {
  code: string | null;
  severity: number;
  severityDescription: string | null;
  message: string | null;
}

export interface DocumentAnalysisResult {
  id: number;
  documentId: number;
  status: DocumentAnalysisStatusCode;
  statusDescription: string | null;
  verdict: AnalysisVerdictCode;
  verdictDescription: string | null;
  engine: number;
  engineDescription: string | null;
  fields: AnalysisField[] | null;
  findings: AnalysisFinding[] | null;
  failureReason: string | null;
  attempts: number;
  analyzedAt: string | null;
  createdAt: string;
}
