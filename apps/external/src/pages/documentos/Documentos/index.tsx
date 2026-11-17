import {
  useEffect,
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

import type {
  Document as SupplierDocument,
} from "../../../shared/types/documents";

import DocumentosCards
  from "./components/DocumentosCards";

async function getAllDocuments(
  accessToken: string,
) {
  const documents:
    SupplierDocument[] = [];

  let pageNumber = 1;
  let totalPages = 1;

  do {
    const result =
      await getDocuments(
        accessToken,
        {
          pageNumber,
          pageSize: 100,
        },
      );

    documents.push(
      ...result.items,
    );

    totalPages =
      result.totalPages;

    pageNumber++;
  } while (
    pageNumber <=
    totalPages
  );

  return documents;
}

export default function DocumentosPage() {
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
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    const accessToken =
      auth?.accessToken;

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    let cancelled =
      false;

    async function loadDocuments(
      token: string,
    ) {
      try {
        setIsLoading(true);
        setError("");

        const result =
          await getAllDocuments(
            token,
          );

        if (cancelled) {
          return;
        }

        setDocuments(
          result,
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
            : "Não foi possível carregar os documentos.",
        );
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
  }, [
    auth?.accessToken,
  ]);

  return (
    <>
      <Header
        title="Documentos"
        subtitle="Acompanhe os documentos enviados, análises e históricos"
      />

      <PageWrapper>
        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 16,
              padding:
                "12px 14px",
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
              padding: 40,
              textAlign:
                "center",
              color:
                "#475569",
            }}
          >
            Carregando documentos...
          </div>
        ) : (
          <DocumentosCards
            documents={
              documents
            }
          />
        )}
      </PageWrapper>
    </>
  );
}