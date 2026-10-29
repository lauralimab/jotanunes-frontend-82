import { jsonRequest, requestApi } from "./client";
import type { DocumentType, DocumentTypeCreateRequest, DocumentTypeUpdateRequest } from "../types/documentType";

const base = "/api/documenttype";

export function getDocumentTypes(signal?: AbortSignal): Promise<DocumentType[]> {
  return requestApi(base, "Não foi possível carregar os tipos de documentos.", { method: "GET", signal });
}

export function getDocumentType(id: number, signal?: AbortSignal): Promise<DocumentType> {
  return requestApi(`${base}/${id}`, "Não foi possível carregar o tipo de documento.", { method: "GET", signal });
}

export function createDocumentType(data: DocumentTypeCreateRequest): Promise<DocumentType> {
  return requestApi(base, "Não foi possível cadastrar o tipo de documento.", jsonRequest("POST", data));
}

export function updateDocumentType(id: number, data: DocumentTypeUpdateRequest): Promise<DocumentType> {
  return requestApi(`${base}/${id}`, "Não foi possível atualizar o tipo de documento.", jsonRequest("PUT", data));
}

export function deactivateDocumentType(id: number): Promise<DocumentType> {
  return requestApi(`${base}/${id}`, "Não foi possível excluir o tipo de documento.", { method: "DELETE" });
}
