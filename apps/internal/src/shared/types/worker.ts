export type Worker = {
  id: number
  companyId: number
  companyCorporateName: string
  name: string
  cpf: string
  formattedCpf: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type WorkerListFilters = {
  companyId?: number
  name?: string
  cpf?: string
  active?: boolean
  supplyRequestId?: number
  pageNumber?: number
  pageSize?: number
}

export type WorkerPage = {
  items: Worker[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}
