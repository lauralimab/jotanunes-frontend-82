import type {
  SupplierDocumentType,
} from "../types/documentTypes";

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

export async function getDocumentTypes(
  accessToken: string,
): Promise<SupplierDocumentType[]> {
  const response =
    await fetch(
      `${API_URL}/api/DocumentType`,
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
        "Não foi possível carregar os tipos de documento.",
      );

    throw new Error(
      message,
    );
  }

  const data =
    (await response.json()) as SupplierDocumentType[];

  return data;
}