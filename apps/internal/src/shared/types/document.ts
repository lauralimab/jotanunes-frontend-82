
export interface Document {
  id: number;
  companyId: number;
  companyCorporateName: string;
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;
  originalFileName: string;
  contentType: string;
  uploadedByName: string;
  workerName: string | null;
  workerCpf: string | null;
  workSiteName: string | null;
  expirationDate: string | null;
  status: number;
  statusDescription: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  analysis: {
    status: number;
    statusDescription: string;
    verdict: number;
    verdictDescription: string;
    blockingCount: number;
    warningCount: number;
    analyzedAt: string;
  } | null;
}

export interface DocumentListResponse {
  items: Document[];
}

export interface AnalysisField {
  name: string;
  value: string;
}

export interface AnalysisFinding {
  code: string;
  severity: number;
  severityDescription: string;
  message: string;
}

export interface DocumentAnalysisResult {
  id: number;
  documentId: number;
  statusDescription: string;
  verdictDescription: string | null;
  engineDescription: string | null;
  fields: AnalysisField[];
  findings: AnalysisFinding[];
  analyzedAt: string | null;
  failureReason: string | null;
}
