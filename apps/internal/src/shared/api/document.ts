
import type {
  Document,
  DocumentListResponse,
  DocumentListFilters,
  DocumentPageResponse,
  DocumentRecord,
  DocumentAnalysisResult,
  DocumentOrderByCode,
  OrderDirectionCode,
} from "../types/document";

import { requestApi, jsonRequest } from "./client";
import ApiError from "./ApiError";
import { getSupplyRequests } from "./supplyRequest";
import type { SupplyRequest } from "../types/supplyRequest";

const base = "/api/Document";
const PAGE_SIZE = 5;
const REQUEST_QUERY_CONCURRENCY = 5;
type DocumentOrder = { orderBy: DocumentOrderByCode; orderDirection: OrderDirectionCode };

type PagedItems<T> = {
  items: T[] | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

function invalidPage(resource: string): never {
  throw new ApiError("invalid-response", `A resposta paginada de ${resource} est\u00e1 incompleta ou inv\u00e1lida.`);
}

async function loadAllPages<T extends { id: number }>(
  fetchPage: (pageNumber: number, pageSize: number) => Promise<PagedItems<T>>,
  resource: string,
): Promise<T[]> {
  const first = await fetchPage(1, PAGE_SIZE);
  const expectedTotalCount = first.totalCount;
  const expectedTotalPages = first.totalPages;

  if (
    !Number.isInteger(expectedTotalCount) || expectedTotalCount < 0 ||
    !Number.isInteger(expectedTotalPages) || expectedTotalPages < 0 ||
    !Number.isInteger(first.pageSize) || first.pageSize < 0 ||
    (expectedTotalCount > 0 && first.pageSize === 0) ||
    !Number.isInteger(first.currentPage) ||
    (first.currentPage !== 1 && !(expectedTotalCount === 0 && first.currentPage === 0))
  ) {
    invalidPage(resource);
  }

  if (expectedTotalCount === 0) {
    if (first.items != null && (!Array.isArray(first.items) || first.items.length > 0)) invalidPage(resource);
    if (expectedTotalPages > 1) invalidPage(resource);
    return [];
  }

  if (expectedTotalPages < 1 || !Array.isArray(first.items) || first.items.length === 0) invalidPage(resource);

  const items: T[] = [];
  const ids = new Set<number>();

  for (let pageNumber = 1; pageNumber <= expectedTotalPages; pageNumber += 1) {
    const page = pageNumber === 1 ? first : await fetchPage(pageNumber, PAGE_SIZE);
    if (
      page.currentPage !== pageNumber ||
      page.totalPages !== expectedTotalPages ||
      page.totalCount !== expectedTotalCount ||
      page.pageSize !== first.pageSize ||
      !Array.isArray(page.items) ||
      (pageNumber < expectedTotalPages && page.items.length === 0)
    ) {
      invalidPage(resource);
    }

    for (const item of page.items) {
      if (!Number.isSafeInteger(item.id) || ids.has(item.id)) invalidPage(resource);
      ids.add(item.id);
      items.push(item);
    }
  }

  if (items.length !== expectedTotalCount) invalidPage(resource);
  return items;
}

function documentQuery(filters: DocumentListFilters): string {
  const names: Record<keyof DocumentListFilters, string> = {
    pageNumber: "PageNumber",
    pageSize: "PageSize",
    analysisStatus: "AnalysisStatus",
    analysisVerdict: "AnalysisVerdict",
    companyId: "CompanyId",
    workSiteId: "WorkSiteId",
    supplyRequestId: "SupplyRequestId",
    documentTypeId: "DocumentTypeId",
    workerId: "WorkerId",
    withoutSupplyRequest: "WithoutSupplyRequest",
    status: "Status",
    periodStart: "PeriodStart",
    periodEnd: "PeriodEnd",
    orderBy: "OrderBy",
    orderDirection: "OrderDirection",
  };
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(filters) as [keyof DocumentListFilters, DocumentListFilters[keyof DocumentListFilters]][]) {
    if (value !== undefined && value !== null) query.set(names[key], String(value));
  }

  return query.toString();
}

/** Returns a single server-paginated document page using the documented API filters. */
export function getDocumentsPage(
  filters: DocumentListFilters = {},
  signal?: AbortSignal,
): Promise<DocumentPageResponse> {
  const query = documentQuery(filters);
  return requestApi<DocumentPageResponse>(
    query ? `${base}?${query}` : base,
    "N\u00e3o foi poss\u00edvel listar os documentos.",
    { method: "GET", signal },
  );
}

/** Returns every document in the server-paginated list for a supplier. */
export async function getDocumentsForCompany(
  companyId: number,
  signal?: AbortSignal,
  order?: DocumentOrder,
): Promise<DocumentRecord[]> {
  if (!Number.isSafeInteger(companyId) || companyId <= 0) {
    throw new ApiError("invalid-response", "O identificador do fornecedor \u00e9 inv\u00e1lido.");
  }

  const documents = await loadAllPages<DocumentRecord>(
      (pageNumber, pageSize) => getDocumentsPage({ companyId, pageNumber, pageSize, ...order }, signal),
    "documentos do fornecedor",
  );

  if (documents.some(document => document.companyId !== companyId)) {
    throw new ApiError("invalid-response", "A API retornou documentos sem v\u00ednculo confirmado com o fornecedor.");
  }

  return documents;
}

/** Returns all documents supported by the direct worksite and verified request links. */
export async function getDocumentsForWorkSite(
  workSiteId: number,
  signal?: AbortSignal,
  order?: DocumentOrder,
): Promise<DocumentRecord[]> {
  if (!Number.isSafeInteger(workSiteId) || workSiteId <= 0) {
    throw new ApiError("invalid-response", "O identificador da obra \u00e9 inv\u00e1lido.");
  }

  const [directDocuments, workSiteRequests] = await Promise.all([
    loadAllPages<DocumentRecord>(
      (pageNumber, pageSize) => getDocumentsPage({ workSiteId, pageNumber, pageSize, ...order }, signal),
      "documentos da obra",
    ),
    loadAllPages<SupplyRequest>(
      (pageNumber, pageSize) => getSupplyRequests({ workSiteId, pageNumber, pageSize }),
      "solicita\u00e7\u00f5es da obra",
    ),
  ]);

  if (workSiteRequests.some(request => request.workSiteId !== workSiteId)) {
    throw new ApiError("invalid-response", "A API retornou uma solicita\u00e7\u00e3o sem v\u00ednculo confirmado com a obra.");
  }

  // Include direct links and every document belonging to suppliers associated via requests.
  const documentsById = new Map<number, DocumentRecord>();
  for (const document of directDocuments) {
    if (document.workSiteId === workSiteId) {
      documentsById.set(document.id, document);
    } else if (document.workSiteId !== null) {
      throw new ApiError("invalid-response", "A API retornou um documento associado a outra obra no filtro direto.");
    }
  }

  const companyIds = [...new Set(workSiteRequests.map(request => request.companyId))];
  for (let index = 0; index < companyIds.length; index += REQUEST_QUERY_CONCURRENCY) {
    const companyBatch = companyIds.slice(index, index + REQUEST_QUERY_CONCURRENCY);
    const companyDocuments = await Promise.all(companyBatch.map(companyId => getDocumentsForCompany(companyId, signal, order)));
    for (const documents of companyDocuments) {
      for (const document of documents) {
        documentsById.set(document.id, documentsById.get(document.id) ?? document);
      }
    }
  }

  return [...documentsById.values()];
}

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
