import { useEffect, useRef, useState } from "react";

import ReprovarDocumentoModal from "./components/ReprovarDocumentoModal";
import SolicitarCorrecaoModal from "./components/SolicitarCorrecaoModal";
import ConfirmarCorrecaoModal from "./components/ConfirmarCorrecaoModal";
import ConfirmarAprovacaoModal from "./components/ConfirmarAprovacaoModal";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

import type { Screen } from "../../../shared/types/portal";
import type { WorkSite } from "../../../shared/types/worksite";
import type { Company } from "../../../shared/types/company";
import type {
  Document,
  DocumentAnalysisResult,
} from "../../../shared/types/document";

import {
  getDocuments,
  getDocumentsForCompany,
  getDocumentsForWorkSite,
  downloadDocument,
  getDocumentAnalysis,
  approveDocument,
  rejectDocument,
} from "../../../shared/api/document";
import { getWorkSite } from "../../../shared/api/worksite";
import { getCompany } from "../../../shared/api/company";

// FORMATAÇÃO DE DATAS
function formatDate(value: string | null | undefined): string {
  if (!value) return "Não informada";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("pt-BR");
}

// STATUS DO DOCUMENTO
function getStatus(status: string): string {
  const value = status.toLowerCase();

  if (value.includes("approv") || value.includes("aprov")) {
    return "approved";
  }

  if (value.includes("reject") || value.includes("reprov")) {
    return "rejected";
  }

  if (value.includes("correct") || value.includes("corre")) {
    return "correction";
  }

  if (value.includes("expir") || value.includes("venc")) {
    return "expired";
  }

  return "pending";
}

// TRADUÇÃO DO RESULTADO DA ANÁLISE
function getVerdict(value: string | null | undefined): string {
  switch (value?.toLowerCase()) {
    case "conforming":
      return "Conforme";

    case "nonconforming":
      return "Não conforme";

    case "needsattention":
      return "Requer atenção";

    default:
      return value || "Não disponível";
  }
}

type Props = {
  onNav: (s: Screen) => void;
  workSiteId?: number;
  invalidWorkSiteId?: boolean;
  companyId?: number;
  invalidCompanyId?: boolean;
  requestedDocumentId?: number;
  invalidDocumentId?: boolean;
  onBackToContext?: () => void;
};

export default function AvaliarDocumentoPage({
  onNav,
  workSiteId,
  invalidWorkSiteId = false,
  companyId,
  invalidCompanyId = false,
  requestedDocumentId,
  invalidDocumentId = false,
  onBackToContext,
}: Props) {
  const contextualMode = workSiteId !== undefined || companyId !== undefined || invalidWorkSiteId || invalidCompanyId;
  const scopeKey = invalidWorkSiteId ? "invalid-worksite" : invalidCompanyId ? "invalid-supplier" : workSiteId !== undefined ? `worksite:${workSiteId}` : companyId !== undefined ? `supplier:${companyId}` : "global";
  // DOCUMENTOS
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsScope, setDocumentsScope] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [documentSelectionError, setDocumentSelectionError] = useState<string | null>(null);
  const [contextNameState, setContextNameState] = useState<{ scope: string; name: string | null } | null>(null);

  // PESQUISA
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // CARREGAMENTO DOS DOCUMENTOS
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  // VISUALIZADOR
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileVersion, setFileVersion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  // ANÁLISE AUTOMÁTICA
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // APROVAÇÃO
  const [approving, setApproving] = useState(false);

  const [pendingApproval, setPendingApproval] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // RESULTADO DAS DECISÕES
  const [decisionError, setDecisionError] = useState<string | null>(null);

  const [, setDecisionSuccess] = useState<string | null>(null);

  // REPROVAÇÃO
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // SOLICITAÇÃO DE CORREÇÃO
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [sendingCorrection, setSendingCorrection] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  const [pendingCorrection, setPendingCorrection] = useState<{
    documentId: number;
    documentName: string;
    type: string;
    reason: string;
  } | null>(null);

  // DOCUMENTO SELECIONADO
  const scopedDocuments = documentsScope === scopeKey ? documents : [];
  const scopedSelectedId = documentsScope === scopeKey ? selectedId : null;
  const scopedLoading = documentsScope !== scopeKey || loadingDocuments;
  const scopedError = documentsScope === scopeKey ? documentsError : null;
  const scopedContextName = contextNameState?.scope === scopeKey ? contextNameState.name : null;
  const doc = scopedDocuments.find((item) => item.id === scopedSelectedId) ?? null;

  const filteredDocuments = scopedDocuments.filter((item) => {
    const search = appliedSearch.trim().toLocaleLowerCase("pt-BR");

    if (!search) return true;

    const searchableText = [
      item.documentTypeName,
      item.companyCorporateName,
      item.originalFileName,
      item.uploadedByName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return searchableText.includes(search);
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const nameComparison = (a.documentTypeName ?? "").localeCompare(
      b.documentTypeName ?? "",
      "pt-BR",
      { sensitivity: "base" }
    );

    if (nameComparison !== 0) return nameComparison;

    const companyComparison = (a.companyCorporateName ?? "").localeCompare(
      b.companyCorporateName ?? "",
      "pt-BR",
      { sensitivity: "base" }
    );

    return companyComparison !== 0 ? companyComparison : a.id - b.id;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedDocuments.length / itemsPerPage)
  );

  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load globally without filters, or use the explicit worksite context.
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const requestScope = scopeKey;

    async function loadDocuments() {
      setLoadingDocuments(true);
      setDocumentsError(null);
      setDocumentSelectionError(null);
      setDocuments([]);
      setSelectedId(null);
      setCurrentPage(1);
      setContextNameState({ scope: requestScope, name: null });

      if (invalidWorkSiteId || invalidCompanyId) {
        setDocumentsError("O contexto de obra ou fornecedor na URL est\u00e1 ausente ou n\u00e3o \u00e9 v\u00e1lido.");
        setDocumentsScope(requestScope);
        setLoadingDocuments(false);
        return;
      }

      let contextName: string | null = null;
      try {
        if (workSiteId !== undefined) {
          const workSite: WorkSite = await getWorkSite(workSiteId, controller.signal);
          if (!active) return;
          contextName = workSite.name;
        } else if (companyId !== undefined) {
          const company: Company = await getCompany(companyId);
          if (!active) return;
          contextName = company.corporateName || company.tradeName || "Fornecedor";
        }
        setContextNameState({ scope: requestScope, name: contextName });

        const result = workSiteId === undefined
          ? companyId === undefined
            ? await getDocuments()
            : await getDocumentsForCompany(companyId, controller.signal)
          : await getDocumentsForWorkSite(workSiteId, controller.signal);

        if (!active) return;
        setDocuments(result);
        if (invalidDocumentId) {
          setSelectedId(null);
          setDocumentSelectionError("O identificador do documento na URL n\u00e3o \u00e9 v\u00e1lido.");
        } else if (requestedDocumentId !== undefined) {
          const sortedResult = [...result].sort((a, b) => {
            const nameComparison = (a.documentTypeName ?? "").localeCompare(b.documentTypeName ?? "", "pt-BR", { sensitivity: "base" });
            if (nameComparison !== 0) return nameComparison;
            const companyComparison = (a.companyCorporateName ?? "").localeCompare(b.companyCorporateName ?? "", "pt-BR", { sensitivity: "base" });
            return companyComparison !== 0 ? companyComparison : a.id - b.id;
          });
          const selectedIndex = sortedResult.findIndex(document => document.id === requestedDocumentId);
          if (selectedIndex < 0) {
            setSelectedId(null);
            setDocumentSelectionError("Este documento n\u00e3o foi encontrado entre os documentos desta obra.");
          } else {
            setSelectedId(requestedDocumentId);
            setCurrentPage(Math.floor(selectedIndex / itemsPerPage) + 1);
          }
        }
        setDocumentsScope(requestScope);
      } catch (error) {
        if (!active) return;
        setContextNameState({ scope: requestScope, name: contextName });
        setDocuments([]);
        setDocumentsError(
          error instanceof Error
            ? error.message
            : "N\u00e3o foi poss\u00edvel carregar os documentos."
        );
        setDocumentsScope(requestScope);
      } finally {
        if (active) setLoadingDocuments(false);
      }
    }

    void loadDocuments();
    return () => {
      active = false;
      controller.abort();
    };
  }, [scopeKey, workSiteId, invalidWorkSiteId, companyId, invalidCompanyId, requestedDocumentId, invalidDocumentId]);

  useEffect(() => {
    if (scopedSelectedId === null) {
      setFileUrl(null);
      setLoadingFile(false);
      return;
    }

    let active = true;
    let objectUrl: string | null = null;

    setFileUrl(null);
    setFileError(null);
    setLoadingFile(true);

    async function loadFile() {
      try {
        const blob = await downloadDocument(scopedSelectedId as number);

        if (!active) return;

        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (error) {
        if (!active) return;

        setFileError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o documento."
        );
      } finally {
        if (active) {
          setLoadingFile(false);
        }
      }
    }

    void loadFile();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [scopedSelectedId, fileVersion]);

  // CARREGAR A ANÁLISE AUTOMÁTICA
  useEffect(() => {
    if (scopedSelectedId === null) {
      setAnalysis(null);
      setLoadingAnalysis(false);
      return;
    }

    let active = true;

    setAnalysis(null);
    setAnalysisError(null);
    setLoadingAnalysis(true);

    async function loadAnalysis() {
      try {
        const result = await getDocumentAnalysis(scopedSelectedId as number);

        if (active) {
          setAnalysis(result);
        }
      } catch (error) {
        if (!active) return;

        setAnalysisError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a análise automática."
        );
      } finally {
        if (active) {
          setLoadingAnalysis(false);
        }
      }
    }

    void loadAnalysis();

    return () => {
      active = false;
    };
  }, [scopedSelectedId]);

  // MONITORAR TELA CHEIA
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // ABRIR OU FECHAR TELA CHEIA
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === viewerRef.current) {
        await document.exitFullscreen();
      } else if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
      }
    } catch {
      setFileError("Não foi possível alterar o modo de tela cheia.");
    }
  }

  function selectDocument(id: number) {
    setSelectedId(id);
    setDocumentSelectionError(null);

    setDecisionError(null);
    setDecisionSuccess(null);

    setShowRejectModal(false);
    setShowCorrectionModal(false);

    setPendingApproval(null);
    setPendingCorrection(null);

    setRejectError(null);
    setCorrectionError(null);
  }

  async function reloadCurrentDocumentList() {
    try {
      const updatedDocuments = workSiteId !== undefined
        ? await getDocumentsForWorkSite(workSiteId)
        : companyId !== undefined
          ? await getDocumentsForCompany(companyId)
          : await getDocuments();
      setDocuments(updatedDocuments);
      setDocumentsScope(scopeKey);
    } catch {
      setDecisionError("A decis\u00e3o foi registrada, mas n\u00e3o foi poss\u00edvel atualizar a lista. Recarregue a p\u00e1gina.");
    }
  }

  async function handleRejectDocument(reason: string) {
    if (!doc || rejecting || approving || sendingCorrection) {
      return;
    }

    const status = getStatus(doc.statusDescription ?? "");

    if (status === "approved" || status === "rejected") {
      setRejectError("Este documento já possui uma decisão final.");
      return;
    }

    const documentId = doc.id;

    try {
      setRejecting(true);
      setRejectError(null);
      setDecisionError(null);
      setDecisionSuccess(null);

      await rejectDocument(documentId, reason);

      setShowRejectModal(false);

      await reloadCurrentDocumentList();
    } catch (error) {
      setRejectError(
        error instanceof Error
          ? error.message
          : "Não foi possível reprovar o documento."
      );
    } finally {
      setRejecting(false);
    }
  }

  function handleRequestCorrection(type: string, reason: string) {
    if (!doc || sendingCorrection || approving || rejecting) {
      return;
    }

    const status = getStatus(doc.statusDescription ?? "");

    if (status === "approved" || status === "rejected") {
      setCorrectionError("Este documento já possui uma decisão final.");
      return;
    }

    if (!type.trim() || !reason.trim()) {
      setCorrectionError(
        "Preencha o motivo principal e a descrição detalhada."
      );
      return;
    }

    setCorrectionError(null);

    setPendingCorrection({
      documentId: doc.id,
      documentName: doc.documentTypeName ?? "Documento",
      type: type.trim(),
      reason: reason.trim(),
    });

    setShowCorrectionModal(false);
  }

  // CONFIRMAR SOLICITAÇÃO DE CORREÇÃO
  async function confirmRequestCorrection() {
    if (!pendingCorrection || sendingCorrection) return;

    const { documentId, type, reason } = pendingCorrection;

    try {
      setSendingCorrection(true);
      setCorrectionError(null);
      setDecisionError(null);
      setDecisionSuccess(null);

      const justification = `Correção solicitada - ${type}: ${reason}`;

      // O BACKEND REGISTRA ESSA AÇÃO COMO REPROVAÇÃO
      await rejectDocument(documentId, justification);

      setPendingCorrection(null);
      setShowCorrectionModal(false);

      await reloadCurrentDocumentList();
    } catch (error) {
      setPendingCorrection(null);
      setShowCorrectionModal(true);

      setCorrectionError(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a solicitação."
      );
    } finally {
      setSendingCorrection(false);
    }
  }

  // PREPARAR APROVAÇÃO
  function handleApproveDocument() {
    if (!doc || approving || rejecting || sendingCorrection) {
      return;
    }

    const status = getStatus(doc.statusDescription ?? "");

    if (status === "approved" || status === "rejected") {
      setDecisionError("Este documento já possui uma decisão final.");
      return;
    }

    setDecisionError(null);

    setPendingApproval({
      id: doc.id,
      name: doc.documentTypeName ?? "Documento",
    });
  }

  async function confirmApproveDocument() {
    if (!pendingApproval || approving) return;

    const documentId = pendingApproval.id;

    try {
      setApproving(true);
      setDecisionError(null);
      setDecisionSuccess(null);

      await approveDocument(documentId);

      setPendingApproval(null);

      await reloadCurrentDocumentList();
    } catch (error) {
      setDecisionError(
        error instanceof Error
          ? error.message
          : "Não foi possível aprovar o documento."
      );

      setPendingApproval(null);
    } finally {
      setApproving(false);
    }
  }

  const findings = analysis?.findings ?? [];

  const blockingCount = findings.filter(
    (finding) => finding.severityDescription?.toLowerCase() === "blocking"
  ).length;

  const warningCount = findings.filter(
    (finding) => finding.severityDescription?.toLowerCase() === "warning"
  ).length;

  const finalStatus = doc ? getStatus(doc.statusDescription ?? "") : "pending";

  const hasFinalDecision =
    finalStatus === "approved" || finalStatus === "rejected";

  const processing = approving || rejecting || sendingCorrection;

  return (
    <>
      <Header
        title={contextualMode ? (scopedContextName ? `Análise de Documentos — ${scopedContextName}` : "Análise de Documentos") : "Análise de Documento"}
        subtitle={
          contextualMode
            ? "Documentos relacionados a esta obra"
            : doc
              ? (doc.documentTypeName ?? "Documento")
              : "Consultar e analisar documentos enviados"
        }
        actions={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (contextualMode) {
                if (onBackToContext) onBackToContext();
                else onNav("worksites");
              } else {
                onNav("admin-suppliers");
              }
            }}
          >
            {contextualMode ? (workSiteId !== undefined ? "← Voltar para a obra" : companyId !== undefined ? "← Voltar para o fornecedor" : "← Voltar") : "← Voltar"}
          </button>
        }
      />

      <PageWrapper>
        {decisionError && (
          <div
            className="card"
            role="alert"
            style={{
              marginBottom: 16,
              color: "#b91c1c",
              border: "1px solid #fca5a5",
            }}
          >
            {decisionError}
          </div>
        )}

        {scopedError && (
          <div
            className="card"
            role="alert"
            style={{
              marginBottom: 16,
              color: "#b91c1c",
            }}
          >
            {scopedError}
          </div>
        )}

        {documentSelectionError && (
          <div className="card" role="alert" style={{ marginBottom: 16, color: "#b91c1c" }}>
            {documentSelectionError}
          </div>
        )}

        {scopedLoading && (
          <div className="card">Carregando documentos...</div>
        )}

        {!scopedLoading && !scopedError && scopedDocuments.length === 0 && (
          <div className="card">Nenhum documento encontrado.</div>
        )}

        {scopedDocuments.length > 0 && (
          <>
            <div
              className="card"
              style={{
                marginBottom: 16,
                padding: 20,
              }}
            >
              <label
                htmlFor="document-search"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Buscar documento
              </label>

              {/* CAMPO DE PESQUISA */}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setAppliedSearch(searchText);
                  setCurrentPage(1);
                }}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  id="document-search"
                  className="input-base"
                  type="search"
                  placeholder="Buscar por documento ou fornecedor"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  style={{
                    flex: "1 1 280px",
                    minWidth: 0,
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon name="search" size={16} />
                  Buscar
                </button>
              </form>

              {/* TABELA DE RESULTADOS */}

              <div
                style={{
                  marginTop: 20,
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        textAlign: "left",
                        color: "#64748b",
                      }}
                    >
                      <th style={{ padding: "12px 10px" }}>DOCUMENTO</th>

                      <th style={{ padding: "12px 10px" }}>FORNECEDOR</th>

                      <th style={{ padding: "12px 10px" }}>SITUAÇÃO</th>

                      <th style={{ padding: "12px 10px" }}>AÇÃO</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDocuments.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background:
                            scopedSelectedId === item.id ? "#f8fafc" : "transparent",
                        }}
                      >
                        <td
                          style={{
                            padding: "13px 10px",
                            fontWeight: 500,
                          }}
                        >
                          {item.documentTypeName}
                        </td>

                        <td style={{ padding: "13px 10px" }}>
                          {item.companyCorporateName}
                        </td>

                        <td style={{ padding: "13px 10px" }}>
                          <StatusBadge
                            status={getStatus(item.statusDescription ?? "")}
                          />
                        </td>

                        <td style={{ padding: "13px 10px" }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => selectDocument(item.id)}
                          >
                            <Icon name="eye" size={14} />
                            Analisar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredDocuments.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: 24,
                            textAlign: "center",
                            color: "#64748b",
                          }}
                        >
                          Nenhum documento encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                <span>
                  {filteredDocuments.length} documento(s) encontrado(s) · Página{" "}
                  {currentPage} de {totalPages}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {/* SETA ANTERIOR */}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        borderRadius: 8,
                        background: "transparent",
                        color: currentPage === 1 ? "#cbd5e1" : "#64748b",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <Icon name="chevron-left" size={16} />
                    </button>

                    {/* NÚMEROS DAS PÁGINAS */}
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Ir para página ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        style={{
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "none",
                          borderRadius: 8,
                          background:
                            currentPage === page ? "#fff1f2" : "transparent",
                          color: currentPage === page ? "#be123c" : "#64748b",
                          fontSize: 13,
                          fontWeight: currentPage === page ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    {/* SETA PRÓXIMA */}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Próxima página"
                      style={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        borderRadius: 8,
                        background: "transparent",
                        color:
                          currentPage === totalPages ? "#cbd5e1" : "#64748b",
                        cursor:
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      <Icon name="chevron-right" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {doc && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                <div
                  ref={viewerRef}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    ...(isFullscreen
                      ? {
                          width: "100vw",
                          height: "100vh",
                          maxWidth: "none",
                          maxHeight: "none",
                          borderRadius: 0,
                        }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      background: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Visualização do Documento
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                      }}
                    >
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={loadingFile}
                        onClick={() => setFileVersion((value) => value + 1)}
                      >
                        <Icon name="refresh" size={13} />
                        Recarregar
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={!fileUrl}
                        onClick={() => void toggleFullscreen()}
                      >
                        <Icon
                          name={isFullscreen ? "minimize" : "eye"}
                          size={13}
                        />

                        {isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      minHeight: isFullscreen ? 0 : 520,
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {loadingFile ? (
                      <span>Carregando documento...</span>
                    ) : fileError ? (
                      <span
                        style={{
                          color: "#dc2626",
                          padding: 20,
                        }}
                      >
                        {fileError}
                      </span>
                    ) : fileUrl ? (
                      doc.contentType?.startsWith("image/") ? (
                        <img
                          src={fileUrl}
                          alt={doc.originalFileName ?? "Documento"}
                          style={{
                            width: "100%",
                            height: isFullscreen ? "100%" : "auto",
                            maxHeight: isFullscreen ? "none" : "80vh",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <iframe
                          src={fileUrl}
                          title={doc.originalFileName ?? "Documento"}
                          style={{
                            width: "100%",
                            height: "100%",
                            minHeight: isFullscreen ? 0 : 520,
                            border: 0,
                            display: "block",
                          }}
                        />
                      )
                    ) : (
                      <span>Arquivo indisponível.</span>
                    )}
                  </div>
                </div>

                {/* COLUNA DIREITA */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* INFORMAÇÕES DO DOCUMENTO */}

                  <div className="card">
                    <h3
                      style={{
                        margin: "0 0 14px",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      Informações
                    </h3>

                    {[
                      ["Tipo", doc.documentTypeName],
                      ["Fornecedor", doc.companyCorporateName],
                      ["Enviado em", formatDate(doc.createdAt)],
                      ["Validade", formatDate(doc.expirationDate)],
                      ["Status atual", ""],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid #f3f4f6",
                          fontSize: 13,
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            color: "#6b7280",
                            fontWeight: 500,
                          }}
                        >
                          {label}
                        </span>

                        {label === "Status atual" ? (
                          <StatusBadge status={finalStatus} />
                        ) : (
                          <span
                            style={{
                              color: "#0f172a",
                              fontWeight: 500,
                              textAlign: "right",
                            }}
                          >
                            {value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ANÁLISE AUTOMÁTICA */}

                  <div
                    className="card"
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <Icon name="info" size={16} color="#d97706" />

                      <h4
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#92400e",
                        }}
                      >
                        Análise Automática
                      </h4>
                    </div>

                    {loadingAnalysis ? (
                      <p style={{ fontSize: 12 }}>Carregando análise...</p>
                    ) : analysisError ? (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#dc2626",
                        }}
                      >
                        {analysisError}
                      </p>
                    ) : analysis ? (
                      <>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#92400e",
                            marginBottom: 12,
                          }}
                        >
                          Resultado: {getVerdict(analysis.verdictDescription)}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {findings.map((finding, index) => {
                            const severity =
                              finding.severityDescription?.toLowerCase() ?? "";

                            const blocking = severity === "blocking";

                            const warning = severity === "warning";

                            const color = blocking
                              ? "#dc2626"
                              : warning
                              ? "#d97706"
                              : "#16a34a";

                            return (
                              <div
                                key={`${finding.code}-${index}`}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    color,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                  }}
                                >
                                  {blocking || warning ? "⚠" : "✓"}
                                </span>

                                <div>
                                  <strong
                                    style={{
                                      display: "block",
                                      fontSize: 12,
                                      color,
                                      marginBottom: 3,
                                    }}
                                  >
                                    {blocking
                                      ? "Problema bloqueante"
                                      : warning
                                      ? "Alerta"
                                      : finding.severityDescription}
                                  </strong>

                                  <span
                                    style={{
                                      fontSize: 12,
                                      lineHeight: 1.6,
                                      color: "#374151",
                                    }}
                                  >
                                    {finding.message}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {findings.length === 0 && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            Nenhuma ocorrência detalhada registrada.
                          </p>
                        )}

                        <div
                          style={{
                            borderTop: "1px solid #fde68a",
                            paddingTop: 10,
                            marginTop: 14,
                            fontSize: 11,
                            color: "#92400e",
                          }}
                        >
                          {blockingCount} bloqueio(s) · {warningCount} alerta(s)
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: 12 }}>Análise não disponível.</p>
                    )}

                    <p
                      style={{
                        margin: "12px 0 0",
                        fontSize: 11,
                        color: "#92400e",
                        fontStyle: "italic",
                      }}
                    >
                      A análise automática é auxiliar. A decisão final é do
                      analista.
                    </p>
                  </div>

                  {/* CONCLUIR ANÁLISE */}

                  <div className="card decision-card">
                    <div className="decision-heading">
                      <h4>Concluir análise</h4>

                      <p>Selecione a ação adequada para este documento.</p>
                    </div>

                    <div className="decision-actions">
                      {/* APROVAR */}

                      <button
                        className="btn btn-success decision-primary"
                        onClick={() => handleApproveDocument()}
                        disabled={processing || hasFinalDecision}
                      >
                        <Icon name="check" size={16} />

                        {approving ? "Aprovando..." : "Aprovar documento"}
                      </button>

                      {/* SOLICITAR CORREÇÃO */}

                      <button
                        className="btn btn-secondary decision-primary"
                        onClick={() => {
                          setCorrectionError(null);
                          setShowCorrectionModal(true);
                        }}
                        disabled={processing || hasFinalDecision}
                      >
                        <Icon name="edit" size={16} />
                        Solicitar correção
                      </button>

                      <div className="decision-divider">
                        <span>ou</span>
                      </div>

                      {/* REPROVAR */}

                      <button
                        className="btn decision-reject"
                        onClick={() => {
                          setRejectError(null);
                          setShowRejectModal(true);
                        }}
                        disabled={processing || hasFinalDecision}
                      >
                        <Icon name="x" size={16} />
                        Reprovar documento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>

      {/* MODAL DE REPROVAÇÃO */}

      {showRejectModal && doc && (
        <ReprovarDocumentoModal
          doc={{
            name: doc.documentTypeName ?? "Documento",
            person: doc.companyCorporateName ?? "",
          }}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectDocument}
          loading={rejecting}
          error={rejectError}
        />
      )}

      {/* MODAL DE SOLICITAÇÃO DE CORREÇÃO */}

      {showCorrectionModal && doc && (
        <SolicitarCorrecaoModal
          doc={{
            name: doc.documentTypeName ?? "Documento",
            person: doc.companyCorporateName ?? "",
          }}
          onClose={() => setShowCorrectionModal(false)}
          onConfirm={handleRequestCorrection}
          loading={sendingCorrection}
          error={correctionError}
        />
      )}

      {/* CONFIRMAÇÃO DA CORREÇÃO */}

      {pendingCorrection && (
        <ConfirmarCorrecaoModal
          documentName={pendingCorrection.documentName}
          loading={sendingCorrection}
          onCancel={() => {
            setPendingCorrection(null);
            setShowCorrectionModal(true);
          }}
          onConfirm={() => void confirmRequestCorrection()}
        />
      )}

      {/* CONFIRMAÇÃO DA APROVAÇÃO */}

      {pendingApproval && (
        <ConfirmarAprovacaoModal
          documentName={pendingApproval.name}
          loading={approving}
          onCancel={() => setPendingApproval(null)}
          onConfirm={() => void confirmApproveDocument()}
        />
      )}
    </>
  );
}
