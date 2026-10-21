
export type SupplyRequestStatus = 1 | 2 | 3 | 4;

export type SupplyRequest = {
  id: number;
  workSiteId: number;
  workSiteName: string;
  supplierType: 1 | 2;
  supplierTypeDescription: string;
  status: SupplyRequestStatus;
  statusDescription: string;
};

export type SupplyRequestsPage = {
  items: SupplyRequest[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export type SupplyRequestWorker = {
  id: number;
  supplyRequestId: number;
  workerId: number;
  workerName: string;
  workerCpf: string;
  workerFormattedCpf: string;
  workerActive: boolean;
  allocatedAt: string;
  releasedAt: string | null;
};
