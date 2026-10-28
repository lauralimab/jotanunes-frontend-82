export type WorkSite = {
  id: number
  name: string
  renewalPeriodDays: number
  createdAt: string
  updatedAt: string
}

export type WorkSiteRequest = {
  name: string
  renewalPeriodDays: number
}
