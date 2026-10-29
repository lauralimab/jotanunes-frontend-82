
import type {
  SupplyRequest,
  SupplyRequestsPage,
  SupplyRequestWorker,
} from "../types/supplyRequests";

const API_URL = import.meta.env.VITE_API_URL;

async function apiGet<T>(
  path: string,
  accessToken: string,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    let message = "Não foi possível consultar a API.";

    try {
      const error = (await response.json()) as {
        message?: string;
        Message?: string;
      };

      message = error.message ?? error.Message ?? message;
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getActiveSupplyRequests(
  accessToken: string,
): Promise<SupplyRequest[]> {
  const statuses = [1, 2] as const;

  const results = await Promise.all(
    statuses.map(async (status) => {
      const requests: SupplyRequest[] = [];
      let pageNumber = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({
          pageNumber: String(pageNumber),
          pageSize: "50",
          status: String(status),
        });

        const page = await apiGet<SupplyRequestsPage>(
          `/api/SupplyRequest?${params.toString()}`,
          accessToken,
        );

        requests.push(...page.items);
        totalPages = page.totalPages;
        pageNumber++;
      } while (pageNumber <= totalPages);

      return requests;
    }),
  );

  return results.flat();
}

export async function getSupplyRequestWorkers(
  accessToken: string,
  supplyRequestId: number,
): Promise<SupplyRequestWorker[]> {
  return apiGet<SupplyRequestWorker[]>(
    `/api/SupplyRequest/${supplyRequestId}/workers`,
    accessToken,
  );
}
