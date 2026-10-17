import type {
  Document,
  DocumentsPage,
  DocumentsQuery,
  DocumentUploadRequest,
} from "../types/documents";

const API_URL =
  import.meta.env.VITE_API_URL;

type ApiErrorResponse = {
  Message?: string;
  message?: string;
};

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const error =
      (await response.json()) as ApiErrorResponse;

    return (
      error.Message ??
      error.message ??
      fallback
    );
  } catch {
    return fallback;
  }
}

export async function getDocuments(
  accessToken: string,
  query: DocumentsQuery = {},
): Promise<DocumentsPage> {
  const params =
    new URLSearchParams();

  params.set(
    "pageNumber",
    String(
      query.pageNumber ?? 1,
    ),
  );

  params.set(
    "pageSize",
    String(
      query.pageSize ?? 50,
    ),
  );

  if (
    query.workSiteId !== undefined
  ) {
    params.set(
      "workSiteId",
      String(
        query.workSiteId,
      ),
    );
  }

  if (
    query.supplyRequestId !==
    undefined
  ) {
    params.set(
      "supplyRequestId",
      String(
        query.supplyRequestId,
      ),
    );
  }

  if (
    query.documentTypeId !==
    undefined
  ) {
    params.set(
      "documentTypeId",
      String(
        query.documentTypeId,
      ),
    );
  }

  if (
    query.workerId !== undefined
  ) {
    params.set(
      "workerId",
      String(
        query.workerId,
      ),
    );
  }

  if (
    query.withoutSupplyRequest !==
    undefined
  ) {
    params.set(
      "withoutSupplyRequest",
      String(
        query.withoutSupplyRequest,
      ),
    );
  }

  if (
    query.status !== undefined
  ) {
    params.set(
      "status",
      String(
        query.status,
      ),
    );
  }

  if (query.periodStart) {
    params.set(
      "periodStart",
      query.periodStart,
    );
  }

  if (query.periodEnd) {
    params.set(
      "periodEnd",
      query.periodEnd,
    );
  }

  const response =
    await fetch(
      `${API_URL}/api/Document?${params.toString()}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível carregar os documentos.",
      );

    throw new Error(
      message,
    );
  }

  const data =
    (await response.json()) as DocumentsPage;

  return data;
}

export async function uploadDocument(
  accessToken: string,
  data: DocumentUploadRequest,
): Promise<Document> {
  const formData =
    new FormData();

  formData.append(
    "DocumentTypeId",
    String(data.documentTypeId),
  );

  if (
    data.supplyRequestId !==
    undefined
  ) {
    formData.append(
      "SupplyRequestId",
      String(
        data.supplyRequestId,
      ),
    );
  }

  if (
    data.workerId !==
    undefined
  ) {
    formData.append(
      "WorkerId",
      String(data.workerId),
    );
  }

  if (
    data.referencePeriodStart
  ) {
    formData.append(
      "ReferencePeriodStart",
      data.referencePeriodStart,
    );
  }

  if (
    data.referencePeriodEnd
  ) {
    formData.append(
      "ReferencePeriodEnd",
      data.referencePeriodEnd,
    );
  }

  if (data.expirationDate) {
    formData.append(
      "ExpirationDate",
      data.expirationDate,
    );
  }

  formData.append(
    "File",
    data.file,
  );

  const response =
    await fetch(
      `${API_URL}/api/Document`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },

        body: formData,
      },
    );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível enviar o documento.",
      );

    throw new Error(
      message,
    );
  }

  const document =
    (await response.json()) as Document;

  return document;
}