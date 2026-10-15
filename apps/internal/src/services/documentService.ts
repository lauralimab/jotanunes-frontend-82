import { apiRequest } from "./api";

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

export async function getDocuments(): Promise<Document[]> {
  const response = await apiRequest<DocumentListResponse>("/api/Document");

  return response.items;
}

export async function getDocumentById(id: number) {
  return apiRequest<Document>(`/api/Document/${id}`);
}

export async function downloadDocument(id: number): Promise<Blob> {
  const API_URL = import.meta.env.VITE_INTERNAL_API_URL;

  const response = await fetch(`${API_URL}/api/Document/${id}/download`);

  if (!response.ok) {
    throw new Error(`Erro ao carregar documento: ${response.status}`);
  }

  return response.blob();
}

export async function approveDocument(id: number): Promise<Document> {
  return apiRequest<Document>(`/api/Document/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectDocument(
  id: number,
  reason: string
): Promise<Document> {
  return apiRequest<Document>(`/api/Document/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({
      reason: reason,
    }),
  });
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

export async function getDocumentAnalysis(
  documentId: number
): Promise<DocumentAnalysisResult> {
  return apiRequest<DocumentAnalysisResult>(
    `/api/Document/${documentId}/analysis`
  );
}

