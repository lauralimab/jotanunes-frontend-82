
import type {
  Document,
  DocumentListResponse,
  DocumentAnalysisResult,
} from "../types/document";

import { requestApi, jsonRequest } from "./client";
import ApiError from "./ApiError";

const base = "/api/Document";

// Listar documentos
export async function getDocuments(): Promise<Document[]> {
  const response = await requestApi<DocumentListResponse>(
    base,
    "Não foi possível listar os documentos.",
    { method: "GET" }
  );

  return response.items;
}

// Consultar documento pelo ID
export function getDocumentById(id: number): Promise<Document> {
  return requestApi<Document>(
    `${base}/${id}`,
    "Não foi possível consultar o documento.",
    { method: "GET" }
  );
}

// Consultar resultado da análise automática
export function getDocumentAnalysis(
  id: number
): Promise<DocumentAnalysisResult> {
  return requestApi<DocumentAnalysisResult>(
    `${base}/${id}/analysis`,
    "Não foi possível carregar a análise automática.",
    { method: "GET" }
  );
}

// Aprovar documento
export function approveDocument(id: number): Promise<void> {
  return requestApi<void>(
    `${base}/${id}/approve`,
    "Não foi possível aprovar o documento.",
    { method: "POST" },
    false
  );
}

// Reprovar documento com justificativa
export function rejectDocument(
  id: number,
  reason: string
): Promise<void> {
  return requestApi<void>(
    `${base}/${id}/reject`,
    "Não foi possível reprovar o documento.",
    jsonRequest("POST", { reason }),
    false
  );
}

// Baixar documento original (PDF ou outro arquivo)
export async function downloadDocument(
  id: number
): Promise<Blob> {
  const apiUrl = import.meta.env.VITE_API_URL
    ?.trim()
    .replace(/\/+$/, "");

  if (!apiUrl) {
    throw new ApiError(
      "configuration",
      "A URL do backend não está configurada."
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${apiUrl}${base}/${id}/download`
    );
  } catch {
    throw new ApiError(
      "connection",
      "Não foi possível conectar ao serviço de documentos."
    );
  }

  if (!response.ok) {
    throw new ApiError(
      "http",
      "Não foi possível baixar o documento.",
      response.status
    );
  }

  return response.blob();
}
