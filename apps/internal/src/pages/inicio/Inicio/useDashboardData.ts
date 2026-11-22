import { useEffect, useState } from "react";
import { getDocuments } from "../../../shared/api/document";
import { getSupplyRequests } from "../../../shared/api/supplyRequest";
import type { Document } from "../../../shared/types/document";
import type { SupplyRequest } from "../../../shared/types/supplyRequest";

export type DashboardData = {
  documents: Document[];
  pendingRequests: SupplyRequest[];
  openRequestsCount: number;
  loadingDocuments: boolean;
  loadingRequests: boolean;
  documentsError: boolean;
  requestsError: boolean;
};

const initialData: DashboardData = {
  documents: [],
  pendingRequests: [],
  openRequestsCount: 0,
  loadingDocuments: true,
  loadingRequests: true,
  documentsError: false,
  requestsError: false,
};

async function getAllPendingRequests(): Promise<SupplyRequest[]> {
  const firstPage = await getSupplyRequests({ hasPending: true, pageNumber: 1, pageSize: 100 });
  const requests = [...firstPage.items];
  for (let pageNumber = 2; pageNumber <= firstPage.totalPages; pageNumber += 1) {
    const page = await getSupplyRequests({ hasPending: true, pageNumber, pageSize: 100 });
    requests.push(...page.items);
  }
  return requests;
}

export default function useDashboardData(): DashboardData {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let active = true;
    getDocuments()
      .then(documents => { if (active) setData(current => ({ ...current, documents, loadingDocuments: false })); })
      .catch(() => { if (active) setData(current => ({ ...current, loadingDocuments: false, documentsError: true })); });

    Promise.all([getAllPendingRequests(), getSupplyRequests({ status: 1, pageNumber: 1, pageSize: 1 })])
      .then(([pendingRequests, openRequests]) => {
        if (active) setData(current => ({ ...current, pendingRequests, openRequestsCount: openRequests.totalCount, loadingRequests: false }));
      })
      .catch(() => { if (active) setData(current => ({ ...current, loadingRequests: false, requestsError: true })); });

    return () => { active = false; };
  }, []);

  return data;
}
