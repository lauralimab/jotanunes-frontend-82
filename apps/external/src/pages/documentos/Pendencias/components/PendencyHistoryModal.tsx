import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  getDocumentFile,
  getDocuments,
} from "../../../../shared/api/documents";

import {
  DOCUMENT_STATUS,
  type Document as SupplierDocument,
} from "../../../../shared/types/documents";

import Icon from "../../../../shared/components/Icon";

type Props = {
  accessToken: string;

  documentTypeId: number;
  documentName: string;

  category: 1 | 2;

  supplyRequestId: number;

  workerId:
    | number
    | null;

  context: string;

  onClose: () => void;
};

function formatDate(
  value:
    | string
    | null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "pt-BR",
  );
}

function formatDateTime(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "pt-BR",
  );
}

function getStatus(
  status: number,
) {
  switch (status) {
    case DOCUMENT_STATUS.pending:
      return {
        label:
          "Aguardando Análise",
        background:
          "#fef3c7",
        color:
          "#92400e",
      };

    case DOCUMENT_STATUS.approved:
      return {
        label:
          "Aprovado",
        background:
          "#dcfce7",
        color:
          "#15803d",
      };

    case DOCUMENT_STATUS.rejected:
      return {
        label:
          "Reprovado",
        background:
          "#fee2e2",
        color:
          "#b91c1c",
      };

    default:
      return {
        label:
          "Desconhecido",
        background:
          "#f1f5f9",
        color:
          "#475569",
      };
  }
}

export default function PendencyHistoryModal({
  accessToken,
  documentTypeId,
  documentName,
  category,
  supplyRequestId,
  workerId,
  context,
  onClose,
}: Props) {
  const [
    documents,
    setDocuments,
  ] =
    useState<
      SupplierDocument[]
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

  const [
    downloadingId,
    setDownloadingId,
  ] =
    useState<
      number | null
    >(null);

  useEffect(() => {
    let cancelled =
      false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const allDocuments:
          SupplierDocument[] = [];

        let pageNumber = 1;
        let totalPages = 1;

        do {
          const result =
            await getDocuments(
              accessToken,
              {
                pageNumber,
                pageSize: 50,

                documentTypeId,

                supplyRequestId:
                  category === 2
                    ? supplyRequestId
                    : undefined,

                withoutSupplyRequest:
                  category === 1
                    ? true
                    : undefined,

                workerId:
                  workerId ??
                  undefined,
              },
            );

          allDocuments.push(
            ...result.items,
          );

          totalPages =
            result.totalPages;

          pageNumber++;
        } while (
          pageNumber <=
          totalPages
        );

        if (cancelled) {
          return;
        }

        allDocuments.sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );

        setDocuments(
          allDocuments,
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
            : "Não foi possível carregar o histórico.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    documentTypeId,
    category,
    supplyRequestId,
    workerId,
  ]);

  async function handleDownload(
    document:
      SupplierDocument,
  ) {
    try {
      setDownloadingId(
        document.id,
      );

      const file =
        await getDocumentFile(
          accessToken,
          document.id,
        );

      const url =
        URL.createObjectURL(
          file,
        );

      const anchor =
        window.document.createElement(
          "a",
        );

      anchor.href = url;

      anchor.download =
        document.originalFileName;

      window.document.body.appendChild(
        anchor,
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(
        url,
      );
    } catch (
      downloadError
    ) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Não foi possível baixar o documento.",
      );
    } finally {
      setDownloadingId(
        null,
      );
    }
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={
        downloadingId
          ? undefined
          : onClose
      }
    >
      <div
        className="modal-box"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
        style={{
          width:
            "calc(100% - 32px)",
          maxWidth: 780,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
              }}
            >
              Histórico de envios
            </h3>

            <div
              style={{
                marginTop: 5,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {documentName}
            </div>

            <div
              style={{
                marginTop: 3,
                color:
                  "#64748b",
                fontSize: 12,
              }}
            >
              {context}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={
              onClose
            }
          >
            Fechar
          </button>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 14,
              padding:
                "10px 12px",
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
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            Carregando histórico...
          </div>
        ) : documents.length ===
          0 ? (
          <div
            style={{
              padding: 32,
              textAlign:
                "center",
              border:
                "1px dashed #cbd5e1",
              borderRadius: 10,
              color:
                "#64748b",
              fontSize: 13,
            }}
          >
            Nenhum envio anterior
            encontrado para este
            documento.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {documents.map(
              (
                document,
                index,
              ) => {
                const status =
                  getStatus(
                    document.status,
                  );

                return (
                  <div
                    key={
                      document.id
                    }
                    style={{
                      position:
                        "relative",
                      padding:
                        "14px 16px",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius:
                        10,
                      background:
                        "#fff",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 12,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 8,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <strong
                            style={{
                              fontSize:
                                13.5,
                            }}
                          >
                            Envio{" "}
                            {documents.length -
                              index}
                          </strong>

                          <span
                            style={{
                              padding:
                                "4px 8px",
                              borderRadius:
                                999,
                              background:
                                status.background,
                              color:
                                status.color,
                              fontSize:
                                10.5,
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              status.label
                            }
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontSize:
                              12,
                            color:
                              "#64748b",
                          }}
                        >
                          Enviado em{" "}
                          {formatDateTime(
                            document.createdAt,
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={
                          downloadingId ===
                          document.id
                        }
                        onClick={() =>
                          void handleDownload(
                            document,
                          )
                        }
                      >
                        <Icon
                          name="download"
                          size={13}
                        />

                        {downloadingId ===
                        document.id
                          ? "Baixando..."
                          : "Baixar"}
                      </button>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        display:
                          "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 10,
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          Arquivo
                        </span>

                        <div
                          style={{
                            marginTop:
                              2,
                            fontWeight:
                              600,
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {
                            document.originalFileName
                          }
                        </div>
                      </div>

                      {document.referencePeriodStart &&
                        document.referencePeriodEnd && (
                          <div>
                            <span
                              style={{
                                color:
                                  "#94a3b8",
                              }}
                            >
                              Período
                            </span>

                            <div
                              style={{
                                marginTop:
                                  2,
                                fontWeight:
                                  600,
                              }}
                            >
                              {formatDate(
                                document.referencePeriodStart,
                              )}
                              {" a "}
                              {formatDate(
                                document.referencePeriodEnd,
                              )}
                            </div>
                          </div>
                        )}

                      {document.expirationDate && (
                        <div>
                          <span
                            style={{
                              color:
                                "#94a3b8",
                            }}
                          >
                            Validade
                          </span>

                          <div
                            style={{
                              marginTop:
                                2,
                              fontWeight:
                                600,
                            }}
                          >
                            {formatDate(
                              document.expirationDate,
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <span
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          Enviado por
                        </span>

                        <div
                          style={{
                            marginTop:
                              2,
                            fontWeight:
                              600,
                          }}
                        >
                          {
                            document.uploadedByName
                          }
                        </div>
                      </div>
                    </div>

                    {document.rejectionReason && (
                      <div
                        style={{
                          marginTop: 12,
                          padding:
                            "9px 11px",
                          borderRadius:
                            7,
                          background:
                            "#fef2f2",
                          border:
                            "1px solid #fecaca",
                          fontSize: 12,
                        }}
                      >
                        <strong
                          style={{
                            color:
                              "#b91c1c",
                          }}
                        >
                          Motivo da
                          reprovação:{" "}
                        </strong>

                        {
                          document.rejectionReason
                        }
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}