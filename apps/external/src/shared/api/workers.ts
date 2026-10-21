import type {
  Worker,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkersPage,
  WorkersQuery,
} from "../types/workers";

const API_URL = import.meta.env.VITE_API_URL;

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

function getAuthHeaders(
  accessToken: string,
): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function getWorkers(
  accessToken: string,
  query: WorkersQuery = {},
): Promise<WorkersPage> {
  const params = new URLSearchParams();

  params.set(
    "pageNumber",
    String(query.pageNumber ?? 1),
  );

  params.set(
    "pageSize",
    String(query.pageSize ?? 50),
  );

  if (query.name?.trim()) {
    params.set(
      "name",
      query.name.trim(),
    );
  }

  if (query.cpf?.trim()) {
    params.set(
      "cpf",
      query.cpf.trim(),
    );
  }

  if (query.active !== undefined) {
    params.set(
      "active",
      String(query.active),
    );
  }

  if (
    query.supplyRequestId !== undefined
  ) {
    params.set(
      "supplyRequestId",
      String(
        query.supplyRequestId,
      ),
    );
  }

  const response = await fetch(
    `${API_URL}/api/Worker?${params.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(
        accessToken,
      ),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível carregar os funcionários.",
      );

    throw new Error(message);
  }

  const data =
    (await response.json()) as WorkersPage;

  return data;
}

export async function getWorkerById(
  accessToken: string,
  id: number,
): Promise<Worker> {
  const response = await fetch(
    `${API_URL}/api/Worker/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(
        accessToken,
      ),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível carregar o funcionário.",
      );

    throw new Error(message);
  }

  const data =
    (await response.json()) as Worker;

  return data;
}

export async function createWorker(
  accessToken: string,
  data: WorkerCreateRequest,
): Promise<Worker> {
  const response = await fetch(
    `${API_URL}/api/Worker`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(
          accessToken,
        ),
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível cadastrar o funcionário.",
      );

    throw new Error(message);
  }

  const worker =
    (await response.json()) as Worker;

  return worker;
}

export async function updateWorker(
  accessToken: string,
  id: number,
  data: WorkerUpdateRequest,
): Promise<Worker> {
  const response = await fetch(
    `${API_URL}/api/Worker/${id}`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeaders(
          accessToken,
        ),
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível atualizar o funcionário.",
      );

    throw new Error(message);
  }

  const worker =
    (await response.json()) as Worker;

  return worker;
}

export async function activateWorker(
  accessToken: string,
  id: number,
): Promise<Worker> {
  const response = await fetch(
    `${API_URL}/api/Worker/${id}/activate`,
    {
      method: "POST",
      headers: getAuthHeaders(
        accessToken,
      ),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível ativar o funcionário.",
      );

    throw new Error(message);
  }

  const worker =
    (await response.json()) as Worker;

  return worker;
}

export async function deactivateWorker(
  accessToken: string,
  id: number,
): Promise<Worker> {
  const response = await fetch(
    `${API_URL}/api/Worker/${id}/deactivate`,
    {
      method: "POST",
      headers: getAuthHeaders(
        accessToken,
      ),
    },
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Não foi possível desativar o funcionário.",
      );

    throw new Error(message);
  }

  const worker =
    (await response.json()) as Worker;

  return worker;
}