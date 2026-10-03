import type { AuthToken, LoginRequest } from '../types/auth'

const API_URL = import.meta.env.VITE_API_URL

type ApiErrorResponse = {
  Message?: string
  message?: string
}

export async function login(credentials: LoginRequest): Promise<AuthToken> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    let message = 'Não foi possível realizar o login.'

    try {
      const error: ApiErrorResponse = await response.json()
      message = error.Message ?? error.message ?? message
    } catch {
      // Mantém a mensagem padrão caso a resposta não seja JSON.
    }

    throw new Error(message)
  }

  return response.json() as Promise<AuthToken>
}