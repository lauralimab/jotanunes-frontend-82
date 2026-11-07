import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import {
  ROUTES,
} from "../../../shared/constants/routes";

import {
  uploadDocument,
} from "../../../shared/api/documents";

import {
  getDocumentTypes,
} from "../../../shared/api/documentTypes";

import {
  getWorkers,
} from "../../../shared/api/workers";

import {
  getActiveSupplyRequests,
  getSupplyRequestWorkers,
} from "../../../shared/api/supplyRequests";

import {
  DOCUMENT_CATEGORY,
  DOCUMENT_SUBJECT,
  type SupplierDocumentType,
} from "../../../shared/types/documentTypes";

import type {
  SupplyRequest,
} from "../../../shared/types/supplyRequests";

import DocumentoEnviadoSucesso
  from "./components/DocumentoEnviadoSucesso";

import DocumentoUploadArea, {
  type SelectedFile,
} from "./components/DocumentoUploadArea";

import InformacoesDocumentoForm, {
  type WorkerOption,
} from "./components/InformacoesDocumentoForm";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

async function getAllActiveWorkers(
  token: string,
): Promise<WorkerOption[]> {
  const result:
    WorkerOption[] = [];

  let pageNumber = 1;

  while (true) {
    const page =
      await getWorkers(
        token,
        {
          pageNumber,
          pageSize: 50,
          active: true,
        },
      );

    result.push(
      ...page.items
        .filter(
          (worker) =>
            worker.active,
        )
        .map(
          (worker) => ({
            id:
              worker.id,

            name:
              worker.name,

            formattedCpf:
              worker.formattedCpf,
          }),
        ),
    );

    if (
      pageNumber >=
      page.totalPages
    ) {
      return result;
    }

    pageNumber++;
  }
}

function parsePositiveId(
  value:
    | string
    | null,
) {
  if (!value) {
    return "";
  }

  const parsed =
    Number(value);

  return (
    Number.isSafeInteger(
      parsed,
    ) &&
    parsed > 0
  )
    ? String(parsed)
    : "";
}

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "—";
  }

  const parts =
    value.split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const {
    auth,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const accessToken =
    auth?.accessToken;

  const source =
    searchParams.get(
      "source",
    );

  const contextDocumentTypeId =
    parsePositiveId(
      searchParams.get(
        "documentTypeId",
      ),
    );

  const contextSupplyRequestId =
    parsePositiveId(
      searchParams.get(
        "supplyRequestId",
      ),
    );

  const contextWorkerId =
    parsePositiveId(
      searchParams.get(
        "workerId",
      ),
    );

  const contextPeriodStart =
    searchParams.get(
      "periodStart",
    );

  const contextPeriodEnd =
    searchParams.get(
      "periodEnd",
    );

  const contextWorkSiteName =
    searchParams.get(
      "workSiteName",
    );

  const contextWorkerName =
    searchParams.get(
      "workerName",
    );

  const isPendingContext =
    source ===
      "pendencies" &&
    Boolean(
      contextDocumentTypeId,
    );

  const [
    file,
    setFile,
  ] =
    useState<
      SelectedFile | null
    >(null);

  const [
    documentTypes,
    setDocumentTypes,
  ] =
    useState<
      SupplierDocumentType[]
    >([]);

  const [
    supplyRequests,
    setSupplyRequests,
  ] =
    useState<
      SupplyRequest[]
    >([]);

  const [
    companyWorkers,
    setCompanyWorkers,
  ] =
    useState<
      WorkerOption[]
    >([]);

  const [
    requestWorkers,
    setRequestWorkers,
  ] =
    useState<
      WorkerOption[]
    >([]);

  const [
    documentTypeId,
    setDocumentTypeId,
  ] =
    useState(
      contextDocumentTypeId,
    );

  const [
    supplyRequestId,
    setSupplyRequestId,
  ] =
    useState(
      contextSupplyRequestId,
    );

  const [
    workerId,
    setWorkerId,
  ] =
    useState(
      contextWorkerId,
    );

  const [
    expirationDate,
    setExpirationDate,
  ] =
    useState("");

  const [
    isLoadingOptions,
    setIsLoadingOptions,
  ] =
    useState(true);

  const [
    isLoadingRequests,
    setIsLoadingRequests,
  ] =
    useState(false);

  const [
    isLoadingCompanyWorkers,
    setIsLoadingCompanyWorkers,
  ] =
    useState(false);

  const [
    isLoadingRequestWorkers,
    setIsLoadingRequestWorkers,
  ] =
    useState(false);

  const [
    optionsError,
    setOptionsError,
  ] =
    useState("");

  const [
    requestsError,
    setRequestsError,
  ] =
    useState("");

  const [
    workersError,
    setWorkersError,
  ] =
    useState("");

  const [
    requestWorkersError,
    setRequestWorkersError,
  ] =
    useState("");

  const [
    sendError,
    setSendError,
  ] =
    useState("");

  const [
    isSending,
    setIsSending,
  ] =
    useState(false);

  const [
    sent,
    setSent,
  ] =
    useState(false);

  useEffect(() => {
    if (
      !isPendingContext
    ) {
      return;
    }

    setDocumentTypeId(
      contextDocumentTypeId,
    );

    setSupplyRequestId(
      contextSupplyRequestId,
    );

    setWorkerId(
      contextWorkerId,
    );
  }, [
    isPendingContext,
    contextDocumentTypeId,
    contextSupplyRequestId,
    contextWorkerId,
  ]);

  const selectedDocumentType =
    documentTypes.find(
      (type) =>
        type.id ===
        Number(
          documentTypeId,
        ),
    );

  const isRecurring =
    selectedDocumentType
      ?.category ===
    DOCUMENT_CATEGORY.recurring;

  const workerRequired =
    selectedDocumentType
      ?.subject ===
    DOCUMENT_SUBJECT.worker;

  const expirationRequired =
    selectedDocumentType
      ?.requiresExpirationDate ===
    true;

  const compatibleRequests =
    supplyRequests.filter(
      (request) =>
        Boolean(
          selectedDocumentType &&
          (
            request.supplierType &
            selectedDocumentType.appliesTo
          ) !==
            0,
        ),
    );

  const selectedRequest =
    compatibleRequests.find(
      (request) =>
        request.id ===
        Number(
          supplyRequestId,
        ),
    );

  const workerOptions =
    isRecurring
      ? requestWorkers
      : companyWorkers;

  const isLoadingWorkers =
    workerRequired
      ? isRecurring
        ? isLoadingRequestWorkers
        : isLoadingCompanyWorkers
      : false;

  useEffect(() => {
    if (!accessToken) {
      setIsLoadingOptions(
        false,
      );

      return;
    }

    let cancelled =
      false;

    async function loadTypes(
      token: string,
    ) {
      try {
        setIsLoadingOptions(
          true,
        );

        setOptionsError("");

        const result =
          await getDocumentTypes(
            token,
          );

        if (!cancelled) {
          setDocumentTypes(
            result,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setOptionsError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os tipos de documentos.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOptions(
            false,
          );
        }
      }
    }

    void loadTypes(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
  ]);

  useEffect(() => {
    if (
      !accessToken ||
      !isRecurring ||
      isPendingContext
    ) {
      setSupplyRequests(
        [],
      );

      setIsLoadingRequests(
        false,
      );

      setRequestsError("");

      return;
    }

    let cancelled =
      false;

    async function loadRequests(
      token: string,
    ) {
      try {
        setIsLoadingRequests(
          true,
        );

        setRequestsError("");

        const result =
          await getActiveSupplyRequests(
            token,
          );

        if (!cancelled) {
          setSupplyRequests(
            result,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setRequestsError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar as solicitações.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRequests(
            false,
          );
        }
      }
    }

    void loadRequests(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    isRecurring,
    isPendingContext,
  ]);

  useEffect(() => {
    if (
      !accessToken ||
      !workerRequired ||
      isRecurring ||
      isPendingContext
    ) {
      setCompanyWorkers(
        [],
      );

      setIsLoadingCompanyWorkers(
        false,
      );

      setWorkersError("");

      return;
    }

    let cancelled =
      false;

    async function loadWorkers(
      token: string,
    ) {
      try {
        setIsLoadingCompanyWorkers(
          true,
        );

        setWorkersError("");

        const result =
          await getAllActiveWorkers(
            token,
          );

        if (!cancelled) {
          setCompanyWorkers(
            result,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setWorkersError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os funcionários.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCompanyWorkers(
            false,
          );
        }
      }
    }

    void loadWorkers(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    workerRequired,
    isRecurring,
    isPendingContext,
  ]);

  useEffect(() => {
    if (
      !accessToken ||
      !isRecurring ||
      !workerRequired ||
      !selectedRequest ||
      isPendingContext
    ) {
      setRequestWorkers(
        [],
      );

      setIsLoadingRequestWorkers(
        false,
      );

      setRequestWorkersError(
        "",
      );

      return;
    }

    let cancelled =
      false;

    async function loadAllocatedWorkers(
      token: string,
      requestId: number,
    ) {
      try {
        setIsLoadingRequestWorkers(
          true,
        );

        setRequestWorkersError(
          "",
        );

        const allocations =
          await getSupplyRequestWorkers(
            token,
            requestId,
          );

        if (!cancelled) {
          setRequestWorkers(
            allocations
              .filter(
                (allocation) =>
                  allocation.workerActive &&
                  allocation.releasedAt ===
                    null,
              )
              .map(
                (allocation) => ({
                  id:
                    allocation.workerId,

                  name:
                    allocation.workerName,

                  formattedCpf:
                    allocation.workerFormattedCpf,
                }),
              ),
          );
        }
      } catch (error) {
        if (!cancelled) {
          setRequestWorkersError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os funcionários alocados.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRequestWorkers(
            false,
          );
        }
      }
    }

    void loadAllocatedWorkers(
      accessToken,
      selectedRequest.id,
    );

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    isRecurring,
    workerRequired,
    selectedRequest?.id,
    isPendingContext,
  ]);

  function handleDocumentTypeChange(
    value: string,
  ) {
    setDocumentTypeId(
      value,
    );

    setSupplyRequestId("");
    setWorkerId("");
    setExpirationDate("");
    setSendError("");
  }

  function handleSupplyRequestChange(
    value: string,
  ) {
    setSupplyRequestId(
      value,
    );

    setWorkerId("");
    setRequestWorkers(
      [],
    );

    setSendError("");
  }

  function handleSendAnother() {
    setSent(false);
    setFile(null);
    setDocumentTypeId("");
    setSupplyRequestId("");
    setWorkerId("");
    setExpirationDate("");
    setSendError("");
  }

  function handleCancel() {
    if (
      isPendingContext
    ) {
      navigate(
        ROUTES.pendencies,
      );

      return;
    }

    onCancel();
  }

  const genericValidWorker =
    !workerRequired ||
    workerOptions.some(
      (worker) =>
        worker.id ===
        Number(workerId),
    );

  const contextValidWorker =
    !workerRequired ||
    Boolean(
      contextWorkerId,
    );

  const contextValidRequest =
    !isRecurring ||
    Boolean(
      contextSupplyRequestId,
    );

  const hasLoading =
    isLoadingOptions ||
    isSending ||
    (
      !isPendingContext &&
      (
        (
          isRecurring &&
          isLoadingRequests
        ) ||
        isLoadingWorkers
      )
    );

  const hasError =
    Boolean(
      optionsError,
    ) ||
    (
      !isPendingContext &&
      (
        (
          isRecurring &&
          Boolean(
            requestsError,
          )
        ) ||
        (
          workerRequired &&
          Boolean(
            isRecurring
              ? requestWorkersError
              : workersError,
          )
        )
      )
    );

  const canSend =
    Boolean(
      accessToken,
    ) &&
    Boolean(file) &&
    Boolean(
      selectedDocumentType,
    ) &&
    (
      isPendingContext
        ? contextValidRequest
        : (
          !isRecurring ||
          Boolean(
            selectedRequest,
          )
        )
    ) &&
    (
      isPendingContext
        ? contextValidWorker
        : genericValidWorker
    ) &&
    (
      !expirationRequired ||
      Boolean(
        expirationDate,
      )
    ) &&
    !hasLoading &&
    !hasError;

  async function handleSend() {
    if (
      !canSend ||
      !accessToken ||
      !file ||
      !selectedDocumentType
    ) {
      return;
    }

    const requestId =
      isPendingContext
        ? Number(
            contextSupplyRequestId,
          ) || undefined
        : selectedRequest?.id;

    const selectedWorkerId =
      isPendingContext
        ? Number(
            contextWorkerId,
          ) || undefined
        : Number(
            workerId,
          ) || undefined;

    try {
      setIsSending(true);
      setSendError("");

      await uploadDocument(
        accessToken,
        {
          documentTypeId:
            selectedDocumentType.id,

          supplyRequestId:
            isRecurring
              ? requestId
              : undefined,

          workerId:
            workerRequired
              ? selectedWorkerId
              : undefined,

          referencePeriodStart:
            isRecurring &&
            isPendingContext
              ? contextPeriodStart ||
                undefined
              : undefined,

          referencePeriodEnd:
            isRecurring &&
            isPendingContext
              ? contextPeriodEnd ||
                undefined
              : undefined,

          expirationDate:
            expirationDate ||
            undefined,

          file:
            file.file,
        },
      );

      setSent(true);
    } catch (error) {
      setSendError(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o documento.",
      );
    } finally {
      setIsSending(false);
    }
  }

  const errors = [
    optionsError,

    !isPendingContext &&
    isRecurring
      ? requestsError
      : "",

    !isPendingContext &&
    workerRequired
      ? isRecurring
        ? requestWorkersError
        : workersError
      : "",

    sendError,
  ].filter(Boolean);

  return (
    <>
      <Header
        title={
          isPendingContext
            ? "Enviar documento pendente"
            : "Enviar Documento"
        }
        subtitle={
          isPendingContext
            ? "Envio vinculado à pendência selecionada"
            : "Envio de documentação da empresa e dos funcionários"
        }
      />

      <PageWrapper>
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          {sent ? (
            <DocumentoEnviadoSucesso
              actionLabel={
                isPendingContext
                  ? "Voltar para pendências"
                  : "Enviar outro"
              }
              onSendAnother={
                isPendingContext
                  ? () =>
                    navigate(
                      ROUTES.pendencies,
                    )
                  : handleSendAnother
              }
            />
          ) : (
            <div className="card">
              {errors.map(
                (
                  message,
                  index,
                ) => (
                  <div
                    key={index}
                    role="alert"
                    style={{
                      padding:
                        "12px 14px",
                      marginBottom: 16,
                      borderRadius: 8,
                      background:
                        "#fef2f2",
                      border:
                        "1px solid #fecaca",
                      color:
                        "#b91c1c",
                      fontSize: 13,
                    }}
                  >
                    {message}
                  </div>
                ),
              )}

              {isPendingContext ? (
                <>
                  <div
                    style={{
                      marginBottom:
                        18,
                      padding:
                        "12px 14px",
                      borderRadius: 8,
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #e2e8f0",
                      fontSize: 12.5,
                      color:
                        "#475569",
                    }}
                  >
                    O documento e seus
                    vínculos foram
                    definidos
                    automaticamente a
                    partir da pendência.
                  </div>

                  <h3
                    style={{
                      margin:
                        "0 0 16px",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Informações do
                    Documento
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize:
                            11.5,
                          fontWeight:
                            600,
                          color:
                            "#64748b",
                          marginBottom:
                            4,
                        }}
                      >
                        Documento
                      </div>

                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight:
                            600,
                        }}
                      >
                        {isLoadingOptions
                          ? "Carregando..."
                          : selectedDocumentType
                            ?.name ??
                            "Documento não encontrado"}
                      </div>
                    </div>

                    {isRecurring && (
                      <div>
                        <div
                          style={{
                            fontSize:
                              11.5,
                            fontWeight:
                              600,
                            color:
                              "#64748b",
                            marginBottom:
                              4,
                          }}
                        >
                          Obra
                        </div>

                        <div
                          style={{
                            fontSize:
                              13.5,
                            fontWeight:
                              600,
                          }}
                        >
                          {contextWorkSiteName ??
                            `Solicitação #${contextSupplyRequestId}`}
                        </div>
                      </div>
                    )}

                    {workerRequired && (
                      <div>
                        <div
                          style={{
                            fontSize:
                              11.5,
                            fontWeight:
                              600,
                            color:
                              "#64748b",
                            marginBottom:
                              4,
                          }}
                        >
                          Trabalhador
                        </div>

                        <div
                          style={{
                            fontSize:
                              13.5,
                            fontWeight:
                              600,
                          }}
                        >
                          {contextWorkerName ??
                            `Funcionário #${contextWorkerId}`}
                        </div>
                      </div>
                    )}

                    {isRecurring && (
                      <div>
                        <div
                          style={{
                            fontSize:
                              11.5,
                            fontWeight:
                              600,
                            color:
                              "#64748b",
                            marginBottom:
                              4,
                          }}
                        >
                          Período
                        </div>

                        <div
                          style={{
                            fontSize:
                              13.5,
                            fontWeight:
                              600,
                          }}
                        >
                          {formatDate(
                            contextPeriodStart,
                          )}
                          {" a "}
                          {formatDate(
                            contextPeriodEnd,
                          )}
                        </div>
                      </div>
                    )}

                    {expirationRequired && (
                      <div>
                        <label
                          htmlFor="pending-expiration"
                          style={{
                            fontSize:
                              11.5,
                            fontWeight:
                              600,
                            color:
                              "#64748b",
                            display:
                              "block",
                            marginBottom:
                              6,
                          }}
                        >
                          Data de Validade *
                        </label>

                        <input
                          id="pending-expiration"
                          className="input-base"
                          type="date"
                          value={
                            expirationDate
                          }
                          disabled={
                            isSending
                          }
                          onChange={(
                            event,
                          ) =>
                            setExpirationDate(
                              event
                                .target
                                .value,
                            )
                          }
                          style={{
                            width:
                              "100%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <InformacoesDocumentoForm
                  documentTypes={
                    documentTypes
                  }
                  workerOptions={
                    workerOptions
                  }
                  supplyRequests={
                    compatibleRequests
                  }
                  documentTypeId={
                    documentTypeId
                  }
                  supplyRequestId={
                    supplyRequestId
                  }
                  workerId={
                    workerId
                  }
                  expirationDate={
                    expirationDate
                  }
                  isLoading={
                    isLoadingOptions ||
                    isSending
                  }
                  isLoadingRequests={
                    isLoadingRequests
                  }
                  isLoadingWorkers={
                    isLoadingWorkers
                  }
                  onDocumentTypeChange={
                    handleDocumentTypeChange
                  }
                  onSupplyRequestChange={
                    handleSupplyRequestChange
                  }
                  onWorkerChange={(
                    value,
                  ) => {
                    setWorkerId(
                      value,
                    );

                    setSendError("");
                  }}
                  onExpirationDateChange={
                    setExpirationDate
                  }
                />
              )}

              <DocumentoUploadArea
                file={file}
                onFileChange={(
                  selectedFile,
                ) => {
                  setFile(
                    selectedFile,
                  );

                  setSendError("");
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginTop: 20,
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={
                    isSending
                  }
                  onClick={
                    handleCancel
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={
                    !canSend
                  }
                  onClick={() =>
                    void handleSend()
                  }
                  style={{
                    opacity:
                      canSend
                        ? 1
                        : 0.5,
                  }}
                >
                  <Icon
                    name="upload"
                    size={15}
                  />

                  {isSending
                    ? "Enviando..."
                    : "Enviar Documento"}
                </button>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}