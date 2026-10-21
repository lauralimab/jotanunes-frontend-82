
import { useEffect, useState } from "react";

import { useAuth } from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import { uploadDocument } from "../../../shared/api/documents";
import { getDocumentTypes } from "../../../shared/api/documentTypes";
import { getWorkers } from "../../../shared/api/workers";

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

import DocumentoEnviadoSucesso from "./components/DocumentoEnviadoSucesso";

import DocumentoUploadArea, {
  type SelectedFile,
} from "./components/DocumentoUploadArea";

import InformacoesDocumentoForm, {
  type WorkerOption,
} from "./components/InformacoesDocumentoForm";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

// Busca todas as páginas de funcionários ativos.
// Evita limitar o formulário aos primeiros 50.
async function getAllActiveWorkers(
  token: string,
): Promise<WorkerOption[]> {
  const result: WorkerOption[] = [];
  let pageNumber = 1;

  while (true) {
    const page = await getWorkers(token, {
      pageNumber,
      pageSize: 50,
      active: true,
    });

    result.push(
      ...page.items
        .filter((worker) => worker.active)
        .map((worker) => ({
          id: worker.id,
          name: worker.name,
          formattedCpf: worker.formattedCpf,
        })),
    );

    if (pageNumber >= page.totalPages) {
      return result;
    }

    pageNumber++;
  }
}

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const [file, setFile] =
    useState<SelectedFile | null>(null);

  const [documentTypes, setDocumentTypes] =
    useState<SupplierDocumentType[]>([]);

  const [supplyRequests, setSupplyRequests] =
    useState<SupplyRequest[]>([]);

  const [companyWorkers, setCompanyWorkers] =
    useState<WorkerOption[]>([]);

  const [requestWorkers, setRequestWorkers] =
    useState<WorkerOption[]>([]);

  const [documentTypeId, setDocumentTypeId] =
    useState("");

  const [supplyRequestId, setSupplyRequestId] =
    useState("");

  const [workerId, setWorkerId] =
    useState("");

  const [expirationDate, setExpirationDate] =
    useState("");

  const [isLoadingOptions, setIsLoadingOptions] =
    useState(true);

  const [isLoadingRequests, setIsLoadingRequests] =
    useState(false);

  const [isLoadingCompanyWorkers, setIsLoadingCompanyWorkers] =
    useState(false);

  const [isLoadingRequestWorkers, setIsLoadingRequestWorkers] =
    useState(false);

  const [optionsError, setOptionsError] =
    useState("");

  const [requestsError, setRequestsError] =
    useState("");

  const [workersError, setWorkersError] =
    useState("");

  const [requestWorkersError, setRequestWorkersError] =
    useState("");

  const [sendError, setSendError] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const selectedDocumentType = documentTypes.find(
    (type) => type.id === Number(documentTypeId),
  );

  const isRecurring =
    selectedDocumentType?.category ===
    DOCUMENT_CATEGORY.recurring;

  const workerRequired =
    selectedDocumentType?.subject ===
    DOCUMENT_SUBJECT.worker;

  const expirationRequired =
    selectedDocumentType?.requiresExpirationDate === true;

  // Compatibilidade definida pelo backend:
  // AppliesTo usa flags para Material e Mão de obra.
  const compatibleRequests = supplyRequests.filter(
    (request) =>
      Boolean(
        selectedDocumentType &&
        (request.supplierType &
          selectedDocumentType.appliesTo) !== 0,
      ),
  );

  const selectedRequest = compatibleRequests.find(
    (request) =>
      request.id === Number(supplyRequestId),
  );

  const workerOptions = isRecurring
    ? requestWorkers
    : companyWorkers;

  const isLoadingWorkers = workerRequired
    ? isRecurring
      ? isLoadingRequestWorkers
      : isLoadingCompanyWorkers
    : false;

  // Carregamento inicial dos tipos de documentos.
  useEffect(() => {
    if (!accessToken) {
      setIsLoadingOptions(false);
      return;
    }

    let cancelled = false;

    async function loadTypes(token: string) {
      try {
        setIsLoadingOptions(true);
        setOptionsError("");

        const result = await getDocumentTypes(token);

        if (!cancelled) {
          setDocumentTypes(result);
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
          setIsLoadingOptions(false);
        }
      }
    }

    void loadTypes(accessToken);

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  // Solicitações só são necessárias para
  // documentos recorrentes.
  useEffect(() => {
    if (!accessToken || !isRecurring) {
      setSupplyRequests([]);
      setIsLoadingRequests(false);
      setRequestsError("");
      return;
    }

    let cancelled = false;

    async function loadRequests(token: string) {
      try {
        setIsLoadingRequests(true);
        setRequestsError("");

        const result =
          await getActiveSupplyRequests(token);

        if (!cancelled) {
          setSupplyRequests(result);
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
          setIsLoadingRequests(false);
        }
      }
    }

    void loadRequests(accessToken);

    return () => {
      cancelled = true;
    };
  }, [accessToken, isRecurring]);

  // Funcionários da empresa para documentos
  // de habilitação de funcionário.
  useEffect(() => {
    if (!accessToken || !workerRequired || isRecurring) {
      setCompanyWorkers([]);
      setIsLoadingCompanyWorkers(false);
      setWorkersError("");
      return;
    }

    let cancelled = false;

    async function loadWorkers(token: string) {
      try {
        setIsLoadingCompanyWorkers(true);
        setWorkersError("");

        const result = await getAllActiveWorkers(token);

        if (!cancelled) {
          setCompanyWorkers(result);
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
          setIsLoadingCompanyWorkers(false);
        }
      }
    }

    void loadWorkers(accessToken);

    return () => {
      cancelled = true;
    };
  }, [accessToken, workerRequired, isRecurring]);

  // Para documentos recorrentes de funcionário,
  // só mostra quem está alocado na solicitação.
  useEffect(() => {
    if (
      !accessToken ||
      !isRecurring ||
      !workerRequired ||
      !selectedRequest
    ) {
      setRequestWorkers([]);
      setIsLoadingRequestWorkers(false);
      setRequestWorkersError("");
      return;
    }

    let cancelled = false;

    async function loadAllocatedWorkers(
      token: string,
      requestId: number,
    ) {
      try {
        setIsLoadingRequestWorkers(true);
        setRequestWorkersError("");

        const allocations =
          await getSupplyRequestWorkers(token, requestId);

        if (!cancelled) {
          setRequestWorkers(
            allocations
              .filter(
                (allocation) =>
                  allocation.workerActive &&
                  allocation.releasedAt === null,
              )
              .map((allocation) => ({
                id: allocation.workerId,
                name: allocation.workerName,
                formattedCpf:
                  allocation.workerFormattedCpf,
              })),
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
          setIsLoadingRequestWorkers(false);
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
  ]);

  function handleDocumentTypeChange(value: string) {
    setDocumentTypeId(value);
    setSupplyRequestId("");
    setWorkerId("");
    setExpirationDate("");
    setSendError("");
  }

  function handleSupplyRequestChange(value: string) {
    setSupplyRequestId(value);
    setWorkerId("");
    setRequestWorkers([]);
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

  const hasLoading =
    isLoadingOptions ||
    isSending ||
    (isRecurring && isLoadingRequests) ||
    isLoadingWorkers;

  const hasError =
    Boolean(optionsError) ||
    (isRecurring && Boolean(requestsError)) ||
    (workerRequired &&
      Boolean(
        isRecurring
          ? requestWorkersError
          : workersError,
      ));

  const validWorker =
    !workerRequired ||
    workerOptions.some(
      (worker) => worker.id === Number(workerId),
    );

  const canSend =
    Boolean(accessToken) &&
    Boolean(file) &&
    Boolean(selectedDocumentType) &&
    (!isRecurring || Boolean(selectedRequest)) &&
    validWorker &&
    (!expirationRequired || Boolean(expirationDate)) &&
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

    try {
      setIsSending(true);
      setSendError("");

      await uploadDocument(accessToken, {
        documentTypeId: selectedDocumentType.id,

        supplyRequestId: isRecurring
          ? selectedRequest?.id
          : undefined,

        workerId: workerRequired
          ? Number(workerId)
          : undefined,

        expirationDate:
          expirationDate || undefined,

        // O backend calcula o período atual
        // para documentos recorrentes vinculados
        // a uma solicitação.
        file: file.file,
      });

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
    isRecurring ? requestsError : "",
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
        title="Enviar Documento"
        subtitle="Envio de documentação da empresa e dos funcionários"
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
              onSendAnother={handleSendAnother}
            />
          ) : (
            <div className="card">
              {errors.map((message, index) => (
                <div
                  key={index}
                  role="alert"
                  style={{
                    padding: "12px 14px",
                    marginBottom: 16,
                    borderRadius: 8,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    fontSize: 13,
                  }}
                >
                  {message}
                </div>
              ))}

              <InformacoesDocumentoForm
                documentTypes={documentTypes}
                workerOptions={workerOptions}
                supplyRequests={compatibleRequests}
                documentTypeId={documentTypeId}
                supplyRequestId={supplyRequestId}
                workerId={workerId}
                expirationDate={expirationDate}
                isLoading={isLoadingOptions || isSending}
                isLoadingRequests={isLoadingRequests}
                isLoadingWorkers={isLoadingWorkers}
                onDocumentTypeChange={
                  handleDocumentTypeChange
                }
                onSupplyRequestChange={
                  handleSupplyRequestChange
                }
                onWorkerChange={(value) => {
                  setWorkerId(value);
                  setSendError("");
                }}
                onExpirationDateChange={
                  setExpirationDate
                }
              />

              <DocumentoUploadArea
                file={file}
                onFileChange={(selectedFile) => {
                  setFile(selectedFile);
                  setSendError("");
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 20,
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isSending}
                  onClick={onCancel}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!canSend}
                  onClick={() => void handleSend()}
                  style={{
                    opacity: canSend ? 1 : 0.5,
                  }}
                >
                  <Icon name="upload" size={15} />

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
