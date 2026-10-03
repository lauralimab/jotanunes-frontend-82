import type { AuthToken } from '../types/auth'

const AUTH_SESSION_KEY = 'jotanunes.external.auth'

export function saveAuthSession(auth: AuthToken): void {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(auth))
}

export function getAuthSession(): AuthToken | null {
  const storedSession = sessionStorage.getItem(AUTH_SESSION_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as AuthToken
  } catch {
    clearAuthSession()
    return null
  }
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY)
}