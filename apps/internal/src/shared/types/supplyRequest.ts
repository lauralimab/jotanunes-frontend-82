export type SupplierType =
  | 1
  | 2;

export type ChecklistItemStatus =
  | 0
  | 1
  | 2
  | 3
  | 4;

export type DocumentOption = {
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;

  category: 1 | 2;
  subject: 1 | 2;

  isConditional: boolean;
  conditionDescription:
    | string
    | null;

  selected: boolean;
  suggested: boolean;

  companyAlreadyHas: boolean;
  companyStatus:
    ChecklistItemStatus;

  companyDocumentId:
    | number
    | null;

  companyDocumentExpirationDate:
    | string
    | null;
};

export type DocumentOptions = {
  supplyRequestId:
    | number
    | null;

  companyId: number;

  companyCorporateName:
    string;

  supplierType:
    SupplierType;

  companyOnboarding:
    DocumentOption[];

  companyRecurring:
    DocumentOption[];

  workerOnboarding:
    DocumentOption[];

  workerRecurring:
    DocumentOption[];
};

export type SupplyRequestCreateRequest = {
  companyId: number;
  workSiteId: number;
  supplierType:
    SupplierType;

  requiredWorkerCount?:
    | number
    | null;

  requiredDocumentTypeIds:
    number[];
};

export type SupplyRequestDocumentsUpdateRequest = {
  documentTypeIds:
    number[];
};

export type SupplyRequestStatus =
  | 1
  | 2
  | 3
  | 4;

export type SupplyRequestPending = {
  periodStart: string;
  periodEnd: string;
  missingOnboardingCount: number;
  missingRecurringCompanyCount: number;
  requiredWorkerCount:
    | number
    | null;
  workersUpToDate: number;
};

export type SupplyRequest = {
  id: number;

  companyId: number;
  companyCorporateName: string;
  companyTradeName: string;
  companyFormattedCnpj: string;

  workSiteId: number;
  workSiteName: string;

  renewalPeriodDays: number;

  supplierType: SupplierType;
  supplierTypeDescription: string;

  requiredWorkerCount:
    | number
    | null;

  status: SupplyRequestStatus;
  statusDescription: string;

  closedAt:
    | string
    | null;

  pending:
    | SupplyRequestPending
    | null;

  createdAt: string;
  updatedAt: string;
};

export type SupplyRequestPage = {
  items: SupplyRequest[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export type SupplyRequestFilters = {
  companyId?: number;
  workSiteId?: number;
  supplierType?: SupplierType;
  status?: SupplyRequestStatus;
  hasPending?: boolean;
  pageNumber?: number;
  pageSize?: number;
};