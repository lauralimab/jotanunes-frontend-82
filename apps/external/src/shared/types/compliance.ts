export type ChecklistItemStatus =
  | 0
  | 1
  | 2
  | 3
  | 4;

export const CHECKLIST_ITEM_STATUS = {
  notSent: 0,
  pending: 1,
  rejected: 2,
  approved: 3,
  expired: 4,
} as const;

export type ChecklistItem = {
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;

  isRequired: boolean;

  conditionDescription:
    | string
    | null;

  isSatisfied: boolean;

  status:
    ChecklistItemStatus;

  statusDescription: string;

  documentId:
    | number
    | null;

  expirationDate:
    | string
    | null;

  rejectionReason:
    | string
    | null;
};

export type WorkerCompliance = {
  workerId: number;
  workerCpf: string;
  workerName: string;
  allocatedAt: string;

  isUpToDate: boolean;

  onboardingItems:
    ChecklistItem[];

  items:
    ChecklistItem[];
};

export type ComplianceChecklist = {
  supplyRequestId: number;

  supplierType:
    | 1
    | 2;

  status:
    | 1
    | 2
    | 3
    | 4;

  companyId: number;
  companyCorporateName: string;

  workSiteId: number;
  workSiteName: string;

  periodStart: string;
  periodEnd: string;

  requiredWorkerCount:
    | number
    | null;

  allocatedWorkerCount: number;
  workersUpToDate: number;

  onboardingItems:
    ChecklistItem[];

  recurringCompanyItems:
    ChecklistItem[];

  workers:
    WorkerCompliance[];
};