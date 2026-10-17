import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../../../app/providers";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";

import {
  getDocuments,
} from "../../../shared/api/documents";

import type {
  Document as SupplierDocument,
} from "../../../shared/types/documents";

import DocumentosTable from "./components/DocumentosTable";
import FluxoStatus from "./components/FluxoStatus";

type DocumentosPageProps = {
  onNav: (
    screen: "send-document",
  ) => void;
};

export default function DocumentosPage({
  onNav,
}: DocumentosPageProps) {
  const { auth } = useAuth();

  const [
    documents,
    setDocuments,
  ] = useState<
    SupplierDocument[]
  >([]);

  const [
    totalCount,
    setTotalCount,
  ] = useState(0);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadDocuments(
      token: string,
    ) {
      try {
        setIsLoading(true);
        setError("");

        const result =
          await getDocuments(
            token,
            {
              pageNumber: 1,
              pageSize: 50,
            },
          );

        if (cancelled) {
          return;
        }

        setDocuments(
          result.items,
        );

        setTotalCount(
          result.totalCount,
        );
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        if (
          loadError instanceof Error
        ) {
          setError(
            loadError.message,
          );
        } else {
          setError(
            "Não foi possível carregar os documentos.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments(
      accessToken,
    );

    return () => {
      cancelled = true;
    };
  }, [auth?.accessToken]);

  return (
    <>
      <Header
        title="Documentos"
        subtitle="Consulta de documentos enviados pelo fornecedor"
        actions={
          <button
            className="btn btn-primary"
            onClick={() =>
              onNav(
                "send-document",
              )
            }
          >
            <Icon
              name="upload"
              size={15}
            />

            Enviar Documento
          </button>
        }
      />

      <PageWrapper>
        <FluxoStatus />

        {error && (
          <div
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
            {error}
          </div>
        )}

        {isLoading ? (
          <div
            className="card"
            style={{
              padding: 32,
              textAlign:
                "center",
              color:
                "#64748b",
            }}
          >
            Carregando documentos...
          </div>
        ) : (
          <DocumentosTable
            documents={
              documents
            }
            totalCount={
              totalCount
            }
          />
        )}
      </PageWrapper>
    </>
  );
}