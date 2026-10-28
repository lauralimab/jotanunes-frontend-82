import { jsonRequest, requestApi } from './client'
import type { WorkSite, WorkSiteRequest } from '../types/worksite'

const base = '/api/worksite'

export function getWorkSites(signal?: AbortSignal): Promise<WorkSite[]> {
  return requestApi(base, 'Não foi possível carregar as obras.', { method: 'GET', signal })
}

export function getWorkSite(id: number, signal?: AbortSignal): Promise<WorkSite> {
  return requestApi(`${base}/${id}`, 'Não foi possível carregar os dados da obra.', { method: 'GET', signal })
}

export function createWorkSite(data: WorkSiteRequest): Promise<WorkSite> {
  return requestApi(base, 'Não foi possível cadastrar a obra.', jsonRequest('POST', data))
}

export function updateWorkSite(id: number, data: WorkSiteRequest): Promise<WorkSite> {
  return requestApi(`${base}/${id}`, 'Não foi possível atualizar a obra.', jsonRequest('PUT', data))
}

export function deleteWorkSite(id: number): Promise<void> {
  return requestApi(`${base}/${id}`, 'Não foi possível excluir a obra. Verifique se ela possui vínculos ativos.', { method: 'DELETE' }, false)
}
