export type DocumentStatus =
  | 1
  | 2
  | 3;

export const DOCUMENT_STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
} as const;

export type Document = {
  id: number;

  companyId: number;
  companyCorporateName: string;

  supplyRequestId: number | null;

  workSiteId: number | null;
  workSiteName: string | null;

  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;

  uploadedBySupplierUserId: number;
  uploadedByName: string;

  workerId: number | null;
  workerName: string | null;
  workerCpf: string | null;

  originalFileName: string;
  contentType: string;

  referencePeriodStart:
    | string
    | null;

  referencePeriodEnd:
    | string
    | null;

  expirationDate:
    | string
    | null;

  status: DocumentStatus;

  statusDescription: string;

  rejectionReason:
    | string
    | null;

  reviewedAt:
    | string
    | null;

  createdAt: string;
  updatedAt: string;
};

export type DocumentsPage = {
  items: Document[];

  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export type DocumentsQuery = {
  pageNumber?: number;
  pageSize?: number;

  workSiteId?: number;
  supplyRequestId?: number;
  documentTypeId?: number;
  workerId?: number;

  withoutSupplyRequest?: boolean;

  status?: DocumentStatus;

  periodStart?: string;
  periodEnd?: string;
};

export type DocumentUploadRequest = {
  documentTypeId: number;

  supplyRequestId?: number;

  workerId?: number;

  referencePeriodStart?: string;

  referencePeriodEnd?: string;

  expirationDate?: string;

  file: File;
};