import type {
  Company,
  CompanyChangeSupplierTypeRequest,
  CompanyCreateRequest,
  CompanyListFilters,
  CompanyPage,
  CompanyUpdateRequest,
  SupplierUser,
  SupplierUserCreateRequest,
  SupplierUserResetPasswordRequest,
} from '../types/company'

import ApiError from './ApiError'

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

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

async function requestCompany<T>(
  path: string,
  fallback: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_URL) {
    throw new ApiError('configuration', 'O serviço está indisponível no momento. Entre em contato com o suporte.')
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/company${path}`, options)
  } catch {
    throw new ApiError('connection', 'Não foi possível conectar ao serviço. Verifique sua conexão e tente mais tarde.')
  }

  if (!response.ok) {
    throw new ApiError('http', await getErrorMessage(response, fallback), response.status)
  }

  if (options?.method === 'DELETE') return undefined as T

  try {
    return await response.json() as T
  } catch {
    throw new ApiError('invalid-response', 'Não foi possível carregar as informações. O serviço está temporariamente indisponível.')
  }
}

function jsonRequest(method: 'POST' | 'PUT', body: object): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export function getCompanies(
  filters: CompanyListFilters = {},
): Promise<CompanyPage> {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }

  const search = query.toString()

  return requestCompany<CompanyPage>(
    search ? `?${search}` : '',
    'Não foi possível listar as empresas.',
    { method: 'GET' },
  )
}

export function getCompany(id: number): Promise<Company> {
  return requestCompany<Company>(
    `/${id}`,
    'Não foi possível consultar a empresa.',
    { method: 'GET' },
  )
}

export function createCompany(data: CompanyCreateRequest): Promise<Company> {
  return requestCompany<Company>(
    '',
    'Não foi possível cadastrar a empresa.',
    jsonRequest('POST', data),
  )
}

export function updateCompany(
  id: number,
  data: CompanyUpdateRequest,
): Promise<Company> {
  return requestCompany<Company>(
    `/${id}`,
    'Não foi possível atualizar a empresa.',
    jsonRequest('PUT', data),
  )
}

export function changeCompanySupplierType(
  id: number,
  data: CompanyChangeSupplierTypeRequest,
): Promise<Company> {
  return requestCompany<Company>(
    `/${id}/supplier-type`,
    'Não foi possível alterar o tipo de fornecedor.',
    jsonRequest('PUT', data),
  )
}

export function deleteCompany(id: number): Promise<void> {
  return requestCompany<void>(
    `/${id}`,
    'Não foi possível excluir a empresa.',
    { method: 'DELETE' },
  )
}

export function getCompanyUsers(companyId: number): Promise<SupplierUser[]> {
  return requestCompany<SupplierUser[]>(
    `/${companyId}/users`,
    'Não foi possível listar os usuários da empresa.',
    { method: 'GET' },
  )
}

export function createCompanyUser(
  companyId: number,
  data: SupplierUserCreateRequest,
): Promise<SupplierUser> {
  return requestCompany<SupplierUser>(
    `/${companyId}/users`,
    'Não foi possível cadastrar o usuário da empresa.',
    jsonRequest('POST', data),
  )
}

export function activateCompanyUser(
  companyId: number,
  userId: number,
): Promise<SupplierUser> {
  return requestCompany<SupplierUser>(
    `/${companyId}/users/${userId}/activate`,
    'Não foi possível ativar o usuário da empresa.',
    { method: 'POST' },
  )
}

export function deactivateCompanyUser(
  companyId: number,
  userId: number,
): Promise<SupplierUser> {
  return requestCompany<SupplierUser>(
    `/${companyId}/users/${userId}/deactivate`,
    'Não foi possível desativar o usuário da empresa.',
    { method: 'POST' },
  )
}

export function resetCompanyUserPassword(
  companyId: number,
  userId: number,
  data: SupplierUserResetPasswordRequest,
): Promise<SupplierUser> {
  return requestCompany<SupplierUser>(
    `/${companyId}/users/${userId}/reset-password`,
    'Não foi possível redefinir a senha do usuário da empresa.',
    jsonRequest('POST', data),
  )
}
