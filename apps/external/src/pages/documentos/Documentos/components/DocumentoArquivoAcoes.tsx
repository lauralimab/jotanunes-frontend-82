
import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import Icon from "../../../../shared/components/Icon";

import {
  getDocumentFile,
} from "../../../../shared/api/documents";

import type {
  Document as SupplierDocument,
} from "../../../../shared/types/documents";

type DocumentoArquivoAcoesProps = {
  documento: SupplierDocument;
  accessToken?: string;
};

type Action = "view" | "download";

const PREVIEW_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export default function DocumentoArquivoAcoes({
  documento,
  accessToken,
}: DocumentoArquivoAcoesProps) {
  const [loading, setLoading] =
    useState<Action | null>(null);

  const [error, setError] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const contentType =
    documento.contentType.toLowerCase();

  // Libera a URL temporária ao fechar a visualização
  // e quando o componente for desmontado.
  useEffect(() => {
    if (!previewUrl) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewUrl(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleView() {
    if (!accessToken) {
      setError("Sessão inválida. Entre novamente.");
      return;
    }

    if (!PREVIEW_TYPES.includes(contentType)) {
      setError(
        "Este formato não possui visualização disponível.",
      );
      return;
    }

    try {
      setLoading("view");
      setError("");

      const file = await getDocumentFile(
        accessToken,
        documento.id,
      );

      const previewFile = new Blob(
        [file],
        { type: contentType },
      );

      const url =
        URL.createObjectURL(previewFile);

      setPreviewUrl(url);
    } catch (viewError) {
      setError(
        viewError instanceof Error
          ? viewError.message
          : "Erro ao visualizar o documento.",
      );
    } finally {
      setLoading(null);
    }
  }

  async function handleDownload() {
    if (!accessToken) {
      setError("Sessão inválida. Entre novamente.");
      return;
    }

    try {
      setLoading("download");
      setError("");

      const file = await getDocumentFile(
        accessToken,
        documento.id,
      );

      const url = URL.createObjectURL(file);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        documento.originalFileName ||
        `documento-${documento.id}`;

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      link.remove();

      // Aguarda o navegador iniciar o download.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Erro ao baixar o documento.",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={loading !== null}
          onClick={() => void handleView()}
          title="Visualizar documento"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="eye" size={14} />

          {loading === "view"
            ? "Abrindo..."
            : "Visualizar"}
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={loading !== null}
          onClick={() => void handleDownload()}
          title="Baixar documento"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          <Icon name="doc" size={14} />

          {loading === "download"
            ? "Baixando..."
            : "Baixar"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 6,
            maxWidth: 250,
            color: "#b91c1c",
            fontSize: 11,
          }}
        >
          {error}
        </div>
      )}

      {previewUrl &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(15, 23, 42, 0.75)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Visualização de ${documento.originalFileName}`}
              style={{
                background: "#fff",
                borderRadius: 14,
                width: "100%",
                maxWidth: 1000,
                height: "88vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom:
                    "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    Visualizar Documento
                  </h3>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#64748b",
                      fontSize: 12,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {documento.originalFileName}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setPreviewUrl(null)
                  }
                >
                  <Icon name="x" size={15} />

                  Fechar
                </button>
              </div>

              {documento.status === 3 &&
                documento.rejectionReason && (
                  <div
                    style={{
                      margin: "12px 16px 0",
                      padding: 12,
                      borderRadius: 8,
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      fontSize: 13,
                    }}
                  >
                    <strong>
                      Motivo da reprovação:
                    </strong>{" "}
                    {documento.rejectionReason}
                  </div>
                )}

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflow: "auto",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {contentType === "application/pdf" ? (
                  <iframe
                    src={previewUrl}
                    title={documento.originalFileName}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt={documento.originalFileName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
