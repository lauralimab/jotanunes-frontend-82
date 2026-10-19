export type SupplierType = 1 | 2

export const CompanyStatus = {
  PendingDocumentation: 1,
  Eligible: 2,
  NotEligible: 3,
  Blocked: 4,
} as const

export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus]

export type CompanyAddress = {
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export type CompanyUpdateRequest = {
  corporateName: string
  tradeName: string
  stateRegistration?: string | null
  email: string
  phone: string
  responsibleName: string
  address: CompanyAddress
}

export type CompanyCreateRequest = CompanyUpdateRequest & {
  cnpj: string
  supplierType: SupplierType
}

// Campos cadastrais descritos no PDF; campos adicionais do backend não são mapeados.
export type Company = CompanyCreateRequest & {
  id: number
  status: CompanyStatus
  formattedCnpj?: string | null
  updatedAt?: string | null
}

export type CompanyListFilters = {
  pageNumber?: number
  pageSize?: number
  corporateName?: string | null
  tradeName?: string | null
  cnpj?: string | null
  status?: CompanyStatus | null
  supplierType?: SupplierType | null
}

export type CompanyPage = {
  items: Company[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}

export type CompanyChangeSupplierTypeRequest = {
  supplierType: SupplierType
}

export type SupplierUser = {
  id: number
  companyId: number
  name: string
  email: string
  active: boolean
  mustChangePassword: boolean
  lastAccessAt: string | null
  createdAt: string
}

export type SupplierUserCreateRequest = {
  name: string
  email: string
  temporaryPassword: string
}

export type SupplierUserResetPasswordRequest = {
  temporaryPassword: string
}
