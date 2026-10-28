import { requestApi } from './client'
import type { Worker, WorkerListFilters, WorkerPage } from '../types/worker'

const base = '/api/worker'

export function getWorkers(filters: WorkerListFilters = {}, signal?: AbortSignal): Promise<WorkerPage> {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const search = query.toString()
  return requestApi(search ? `${base}?${search}` : base, 'Não foi possível carregar os funcionários.', { method: 'GET', signal })
}

export function getWorker(id: number, signal?: AbortSignal): Promise<Worker> {
  return requestApi(`${base}/${id}`, 'Não foi possível carregar os dados do funcionário.', { method: 'GET', signal })
}
