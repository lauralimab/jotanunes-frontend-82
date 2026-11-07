import type {
  ComplianceChecklist,
} from "../types/compliance";

const API_URL =
  import.meta.env.VITE_API_URL;

type ApiErrorResponse = {
  message?: string;
  Message?: string;
};

async function getErrorMessage(
  response: Response,
  fallback: string,
) {
  try {
    const data =
      (await response.json()) as
        ApiErrorResponse;

    return (
      data.message ??
      data.Message ??
      fallback
    );
  } catch {
    return fallback;
  }
}

export async function getComplianceChecklist(
  accessToken: string,
  supplyRequestId: number,
): Promise<ComplianceChecklist> {
  const response =
    await fetch(
      `${API_URL}/api/Document/checklist/${supplyRequestId}`,
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
        "Não foi possível carregar as pendências da solicitação.",
      );

    throw new Error(
      message,
    );
  }

  return (
    await response.json()
  ) as ComplianceChecklist;
}