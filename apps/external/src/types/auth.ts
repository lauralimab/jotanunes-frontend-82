export type LoginRequest = {
  email: string
  password: string
}

export type AuthenticatedUser = {
  id: number
  name: string
  email: string
  companyId: number
  companyCorporateName: string
  companyCnpj: string
  mustChangePassword: boolean
  lastAccessAt: string | null
}

export type AuthToken = {
  accessToken: string
  refreshToken: string
  expiresAt: string
  tokenType: string
  user: AuthenticatedUser
}