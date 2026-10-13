import type {
  AuthenticatedUser,
  AuthToken,
  LoginRequest,
} from '../types/auth'

const API_URL = import.meta.env.VITE_API_URL

type ApiErrorResponse = {
  Message?: string
  message?: string
}

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const error: ApiErrorResponse = await response.json()

    return error.Message ?? error.message ?? fallback
  } catch {
    return fallback
  }
}

export async function login(
  credentials: LoginRequest,
): Promise<AuthToken> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Não foi possível realizar o login.',
    )

    throw new Error(message)
  }

  return response.json() as Promise<AuthToken>
}

export async function getAuthenticatedUser(
  accessToken: string,
): Promise<AuthenticatedUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Não foi possível validar a sessão.',
    )

    throw new Error(message)
  }

  return response.json() as Promise<AuthenticatedUser>
}

export async function refreshAuthSession(
  refreshToken: string,
): Promise<AuthToken> {
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  })

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Não foi possível renovar a sessão.',
    )

    throw new Error(message)
  }

  return response.json() as Promise<AuthToken>
}

export async function logout(
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Não foi possível encerrar a sessão.',
    )

    throw new Error(message)
  }
}