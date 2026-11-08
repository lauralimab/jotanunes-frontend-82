import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "../../../app/providers";

import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";

import {
  getDocuments,
} from "../../../shared/api/documents";

import {
  getComplianceChecklist,
} from "../../../shared/api/compliance";

import {
  getActiveSupplyRequests,
} from "../../../shared/api/supplyRequests";

import {
  CHECKLIST_ITEM_STATUS,
  type ChecklistItem,
  type ComplianceChecklist,
} from "../../../shared/types/compliance";

import type {
  Document as SupplierDocument,
} from "../../../shared/types/documents";

import DocumentosRecentesCard
  from "./components/DocumentosRecentesCard";

import EstatisticasCards
  from "./components/EstatisticasCards";

import ProgressoDocumentalCard
  from "./components/ProgressoDocumentalCard";

import StatusGeralCard
  from "./components/StatusGeralCard";

type InicioNavigation =
  | "documents"
  | "pendencies";

type InicioPageProps = {
  onNav: (
    screen:
      InicioNavigation,
  ) => void;
};

function collectChecklistItems(
  checklists:
    ComplianceChecklist[],
) {
  const companyOnboarding =
    new Map<
      number,
      ChecklistItem
    >();

  const workerOnboarding =
    new Map<
      string,
      ChecklistItem
    >();

  const companyRecurring:
    ChecklistItem[] = [];

  const workerRecurring:
    ChecklistItem[] = [];

  for (
    const checklist
    of checklists
  ) {
    for (
      const item
      of checklist.onboardingItems
    ) {
      if (
        !companyOnboarding.has(
          item.documentTypeId,
        )
      ) {
        companyOnboarding.set(
          item.documentTypeId,
          item,
        );
      }
    }

    companyRecurring.push(
      ...checklist
        .recurringCompanyItems,
    );

    for (
      const worker
      of checklist.workers
    ) {
      for (
        const item
        of worker.onboardingItems
      ) {
        const key =
          `${worker.workerId}-${item.documentTypeId}`;

        if (
          !workerOnboarding.has(
            key,
          )
        ) {
          workerOnboarding.set(
            key,
            item,
          );
        }
      }

      workerRecurring.push(
        ...worker.items,
      );
    }
  }

  const companyItems = [
    ...companyOnboarding.values(),
    ...companyRecurring,
  ];

  const workerItems = [
    ...workerOnboarding.values(),
    ...workerRecurring,
  ];

  return {
    companyItems,
    workerItems,

    allItems: [
      ...companyItems,
      ...workerItems,
    ],
  };
}

export default function InicioPage({
  onNav,
}: InicioPageProps) {
  const {
    auth,
  } = useAuth();

  const [
    documents,
    setDocuments,
  ] =
    useState<
      SupplierDocument[]
    >([]);

  const [
    checklists,
    setChecklists,
  ] =
    useState<
      ComplianceChecklist[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const companyName =
    auth?.user
      .companyCorporateName;

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      setLoading(false);
      return;
    }

    let cancelled =
      false;

    async function load(
      token: string,
    ) {
      try {
        setLoading(true);
        setError("");

        const [
          documentsResult,
          requests,
        ] =
          await Promise.all([
            getDocuments(
              token,
              {
                pageNumber: 1,
                pageSize: 50,
              },
            ),

            getActiveSupplyRequests(
              token,
            ),
          ]);

        const checklistResults =
          await Promise.all(
            requests.map(
              (
                request,
              ) =>
                getComplianceChecklist(
                  token,
                  request.id,
                ),
            ),
          );

        if (cancelled) {
          return;
        }

        setDocuments(
          documentsResult.items,
        );

        setChecklists(
          checklistResults,
        );
      } catch (
      loadError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar o dashboard.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [
    auth?.accessToken,
  ]);

  const data =
    useMemo(() => {
      const {
        companyItems,
        workerItems,
        allItems,
      } =
        collectChecklistItems(
          checklists,
        );

      const approved =
        allItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.approved,
        ).length;

      const waiting =
        allItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.notSent,
        ).length;

      const pending =
        allItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.pending,
        ).length;

      const rejected =
        allItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.rejected,
        ).length;

      const expired =
        allItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.expired,
        ).length;

      const companyApproved =
        companyItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.approved,
        ).length;

      const workerApproved =
        workerItems.filter(
          (item) =>
            item.status ===
            CHECKLIST_ITEM_STATUS.approved,
        ).length;

      const sortedDocuments =
        [...documents].sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );

      const recentDocumentMap =
        new Map<
          string,
          SupplierDocument
        >();

      for (
        const document
        of sortedDocuments
      ) {
        const key = [
          document.documentTypeId,
          document.supplyRequestId ??
          "global",
          document.workerId ??
          "company",
        ].join("-");

        if (
          !recentDocumentMap.has(
            key,
          )
        ) {
          recentDocumentMap.set(
            key,
            document,
          );
        }
      }

      const recentDocuments =
        Array.from(
          recentDocumentMap.values(),
        );

      return {
        approved,
        waiting,
        pending,

        problems:
          rejected +
          expired,

        companyApproved,

        companyTotal:
          companyItems.length,

        workerApproved,

        workerTotal:
          workerItems.length,

        total:
          allItems.length,

        unresolved:
          allItems.length -
          approved,

        recentDocuments,
      };
    }, [
      checklists,
      documents,
    ]);

  const isApt =
    data.total > 0 &&
    data.approved ===
    data.total;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={
          companyName
            ? `Visão geral da sua documentação — ${companyName}`
            : "Visão geral da sua documentação"
        }
      />

      <PageWrapper>
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 18,
              padding:
                "12px 14px",
              border:
                "1px solid #fecaca",
              borderRadius: 8,
              background:
                "#fef2f2",
              color:
                "#b91c1c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="card"
            style={{
              padding: 40,
              textAlign:
                "center",
              color:
                "#475569",
            }}
          >
            Carregando dashboard...
          </div>
        ) : (
          <>
            <StatusGeralCard
              isApt={
                isApt
              }
              activeRequests={
                checklists.length
              }
              unresolved={
                data.unresolved
              }
              onViewPendencies={() =>
                onNav(
                  "pendencies",
                )
              }
            />

            <EstatisticasCards
              approved={
                data.approved
              }
              waiting={
                data.waiting
              }
              pending={
                data.pending
              }
              problems={
                data.problems
              }
            />

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",

                gap: 20,
              }}
            >
              <DocumentosRecentesCard
                documents={
                  data.recentDocuments
                }
                onViewAll={() =>
                  onNav(
                    "documents",
                  )
                }
              />

              <ProgressoDocumentalCard
                companyDone={
                  data.companyApproved
                }
                companyTotal={
                  data.companyTotal
                }
                workerDone={
                  data.workerApproved
                }
                workerTotal={
                  data.workerTotal
                }
                problemCount={
                  data.problems
                }
                onViewPendencies={() =>
                  onNav(
                    "pendencies",
                  )
                }
              />
            </div>
          </>
        )}
      </PageWrapper>
    </>
  );
}