import ApiError from './ApiError'

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

export async function requestApi<T>(path: string, fallback: string, options?: RequestInit, readBody = true): Promise<T> {
  if (!API_URL) throw new ApiError('configuration', 'O serviço está indisponível no momento. Entre em contato com o suporte.')
  let response: Response
  try { response = await fetch(`${API_URL}${path}`, options) }
  catch (cause) {
    if (options?.signal?.aborted) throw cause
    throw new ApiError('connection', 'Não foi possível conectar ao serviço. Verifique sua conexão e tente mais tarde.')
  }
  if (!response.ok) {
    let message = fallback
    try {
      const error: { message?: unknown; Message?: unknown } = await response.json()
      const detail = error?.Message ?? error?.message
      if (typeof detail === 'string' && detail.trim()) message = detail
    } catch { /* Respostas sem JSON utilizam a mensagem da operação. */ }
    throw new ApiError('http', message, response.status)
  }
  if (!readBody || response.status === 204) return undefined as T
  try { return await response.json() as T }
  catch { throw new ApiError('invalid-response', 'Não foi possível carregar as informações. O serviço está temporariamente indisponível.') }
}

export function jsonRequest(method: 'POST' | 'PUT', body: object): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}
