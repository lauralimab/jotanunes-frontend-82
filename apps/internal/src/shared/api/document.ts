
import type {
  Document,
  DocumentListResponse,
  DocumentAnalysisResult,
} from '../types/document'

import ApiError from './ApiError'

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

type ApiErrorResponse = {
  message?: string
  Message?: string
}

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const error: ApiErrorResponse = await response.json()
    return error.message ?? error.Message ?? fallback
  } catch {
    return fallback
  }
}

async function requestDocument<T>(
  path: string,
  fallback: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      'configuration',
      'A URL do backend não está configurada.',
    )
  }

  let response: Response

  try {
    response = await fetch(
      `${API_URL}/api/Document${path}`,
      options,
    )
  } catch {
    throw new ApiError(
      'connection',
      'Não foi possível conectar ao serviço de documentos.',
    )
  }

  if (!response.ok) {
    throw new ApiError(
      'http',
      await getErrorMessage(response, fallback),
      response.status,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError(
      'invalid-response',
      'O servidor retornou uma resposta inválida.',
    )
  }
}

// Listar todos os documentos
export async function getDocuments(): Promise<Document[]> {
  const response = await requestDocument<DocumentListResponse>(
    '',
    'Não foi possível listar os documentos.',
    { method: 'GET' },
  )

  return response.items
}

// Buscar um documento pelo ID
export function getDocumentById(id: number): Promise<Document> {
  return requestDocument<Document>(
    `/${id}`,
    'Não foi possível consultar o documento.',
    { method: 'GET' },
  )
}

// Baixar o arquivo original
export async function downloadDocument(id: number): Promise<Blob> {
  if (!API_URL) {
    throw new ApiError(
      'configuration',
      'A URL do backend não está configurada.',
    )
  }

  let response: Response

  try {
    response = await fetch(`${API_URL}/api/Document/${id}/download`)
  } catch {
    throw new ApiError(
      'connection',
      'Não foi possível conectar ao serviço de documentos.',
    )
  }

  if (!response.ok) {
    throw new ApiError(
      'http',
      await getErrorMessage(
        response,
        'Não foi possível carregar o arquivo.',
      ),
      response.status,
    )
  }

  return response.blob()
}

// Aprovar documento
export function approveDocument(id: number): Promise<Document> {
  return requestDocument<Document>(
    `/${id}/approve`,
    'Não foi possível aprovar o documento.',
    { method: 'POST' },
  )
}

// Reprovar documento
export function rejectDocument(
  id: number,
  reason: string,
): Promise<Document> {
  return requestDocument<Document>(
    `/${id}/reject`,
    'Não foi possível reprovar o documento.',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    },
  )
}

// Consultar a análise automática
export function getDocumentAnalysis(
  documentId: number,
): Promise<DocumentAnalysisResult> {
  return requestDocument<DocumentAnalysisResult>(
    `/${documentId}/analysis`,
    'Não foi possível carregar a análise automática.',
    { method: 'GET' },
  )
}
