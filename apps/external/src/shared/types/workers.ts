export type Worker = {
  id: number;
  companyId: number;
  companyCorporateName: string;
  name: string;
  cpf: string;
  formattedCpf: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkerCreateRequest = {
  name: string;
  cpf: string;
};

export type WorkerUpdateRequest = {
  name: string;
};

export type WorkersPage = {
  items: Worker[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export type WorkersQuery = {
  pageNumber?: number;
  pageSize?: number;
  name?: string;
  cpf?: string;
  active?: boolean;
  supplyRequestId?: number;
};