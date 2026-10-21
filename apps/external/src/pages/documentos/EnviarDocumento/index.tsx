import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import {
  getDocumentTypes,
} from "../../../shared/api/documentTypes";

import {
  getWorkers,
} from "../../../shared/api/workers";

import {
  DOCUMENT_SUBJECT,
  type SupplierDocumentType,
} from "../../../shared/types/documentTypes";

import type {
  Worker,
} from "../../../shared/types/workers";

import DocumentoEnviadoSucesso from "./components/DocumentoEnviadoSucesso";

import DocumentoUploadArea, {
  type SelectedFile,
} from "./components/DocumentoUploadArea";

import InformacoesDocumentoForm from "./components/InformacoesDocumentoForm";

type EnviarDocumentoPageProps = {
  onCancel: () => void;
};

export default function EnviarDocumentoPage({
  onCancel,
}: EnviarDocumentoPageProps) {
  const { auth } = useAuth();

  const [
    file,
    setFile,
  ] =
    useState<SelectedFile | null>(
      null,
    );

  const [
    documentTypes,
    setDocumentTypes,
  ] = useState<
    SupplierDocumentType[]
  >([]);

  const [
    workers,
    setWorkers,
  ] = useState<Worker[]>([]);

  const [
    documentTypeId,
    setDocumentTypeId,
  ] = useState("");

  const [
    workerId,
    setWorkerId,
  ] = useState("");

  const [
    expirationDate,
    setExpirationDate,
  ] = useState("");

  const [
    isLoadingOptions,
    setIsLoadingOptions,
  ] = useState(true);

  const [
    optionsError,
    setOptionsError,
  ] = useState("");

  const [
    sent,
    setSent,
  ] = useState(false);

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadOptions(
      token: string,
    ) {
      try {
        setIsLoadingOptions(
          true,
        );

        setOptionsError("");

        const [
          typesResult,
          workersResult,
        ] = await Promise.all([
          getDocumentTypes(
            token,
          ),

          getWorkers(
            token,
            {
              pageNumber: 1,
              pageSize: 50,
              active: true,
            },
          ),
        ]);

        if (cancelled) {
          return;
        }

        setDocumentTypes(
          typesResult,
        );

        setWorkers(
          workersResult.items,
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        if (
          loadError instanceof Error
        ) {
          setOptionsError(
            loadError.message,
          );
        } else {
          setOptionsError(
            "Não foi possível carregar as opções do formulário.",
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

    void loadOptions(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [auth?.accessToken]);

  function handleDocumentTypeChange(
    value: string,
  ) {
    setDocumentTypeId(
      value,
    );

    setWorkerId("");

    const selectedType =
      documentTypes.find(
        (documentType) =>
          documentType.id ===
          Number(value),
      );

    if (
      !selectedType
        ?.requiresExpirationDate
    ) {
      setExpirationDate("");
    }
  }

  function handleSendAnother() {
    setSent(false);

    setFile(null);

    setDocumentTypeId("");

    setWorkerId("");

    setExpirationDate("");
  }

  const selectedDocumentType =
    documentTypes.find(
      (documentType) =>
        documentType.id ===
        Number(documentTypeId),
    );

  const workerRequired =
    selectedDocumentType
      ?.subject ===
    DOCUMENT_SUBJECT.worker;

  const expirationRequired =
    selectedDocumentType
      ?.requiresExpirationDate ===
    true;

  const canSend =
    Boolean(file) &&
    Boolean(documentTypeId) &&
    (!workerRequired ||
      Boolean(workerId)) &&
    (!expirationRequired ||
      Boolean(expirationDate));

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
              onSendAnother={
                handleSendAnother
              }
            />
          ) : (
            <div className="card">
              {optionsError && (
                <div
                  style={{
                    padding:
                      "10px 12px",

                    marginBottom: 18,

                    borderRadius: 8,

                    background:
                      "#fef2f2",

                    border:
                      "1px solid #fecaca",

                    color:
                      "#b91c1c",

                    fontSize: 12.5,
                  }}
                >
                  {optionsError}
                </div>
              )}

              <InformacoesDocumentoForm
                documentTypes={
                  documentTypes
                }
                workers={
                  workers
                }
                documentTypeId={
                  documentTypeId
                }
                workerId={
                  workerId
                }
                expirationDate={
                  expirationDate
                }
                isLoading={
                  isLoadingOptions
                }
                onDocumentTypeChange={
                  handleDocumentTypeChange
                }
                onWorkerChange={
                  setWorkerId
                }
                onExpirationDateChange={
                  setExpirationDate
                }
              />

              <DocumentoUploadArea
                file={file}
                onFileChange={
                  setFile
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginTop: 20,
                  gap: 10,
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={
                    onCancel
                  }
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-primary"
                  disabled={
                    !canSend
                  }
                  onClick={() => {
                    if (
                      canSend
                    ) {
                      setSent(
                        true,
                      );
                    }
                  }}
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

                  Enviar Documento
                </button>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}