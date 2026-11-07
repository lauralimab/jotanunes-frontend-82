import type {
  DocumentOptions,
  SupplierType,
  SupplyRequestCreateRequest,
  SupplyRequestDocumentsUpdateRequest,
} from "../types/supplyRequest";

import {
  jsonRequest,
  requestApi,
} from "./client";

const base =
  "/api/supplyrequest";

export function getSupplyRequestDocumentOptions(
  companyId: number,
  supplierType: SupplierType,
): Promise<DocumentOptions> {
  const query =
    new URLSearchParams({
      companyId:
        String(companyId),

      supplierType:
        String(supplierType),
    });

  return requestApi<DocumentOptions>(
    `${base}/document-options?${query.toString()}`,
    "Não foi possível carregar os documentos disponíveis.",
    {
      method: "GET",
    },
  );
}

export function getSupplyRequestDocumentOptionsById(
  supplyRequestId: number,
): Promise<DocumentOptions> {
  return requestApi<DocumentOptions>(
    `${base}/${supplyRequestId}/document-options`,
    "Não foi possível carregar os documentos da solicitação.",
    {
      method: "GET",
    },
  );
}

export function createSupplyRequest(
  data: SupplyRequestCreateRequest,
) {
  return requestApi(
    base,
    "Não foi possível criar a solicitação.",
    jsonRequest(
      "POST",
      data,
    ),
  );
}

export function updateSupplyRequestDocuments(
  supplyRequestId: number,
  data: SupplyRequestDocumentsUpdateRequest,
) {
  return requestApi(
    `${base}/${supplyRequestId}/documents`,
    "Não foi possível atualizar os documentos exigidos.",
    jsonRequest(
      "PUT",
      data,
    ),
  );
}