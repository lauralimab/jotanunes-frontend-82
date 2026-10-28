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

import { jsonRequest, requestApi } from './client'

function requestCompany<T>(path: string, fallback: string, options?: RequestInit): Promise<T> {
  return requestApi<T>(`/api/company${path}`, fallback, options, options?.method !== 'DELETE')
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
