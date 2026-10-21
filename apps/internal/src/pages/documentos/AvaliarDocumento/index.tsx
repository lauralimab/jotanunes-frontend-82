import ReprovarDocumentoModal from "./components/ReprovarDocumentoModal";
import SolicitarCorrecaoModal from "./components/SolicitarCorrecaoModal";
import { useEffect, useRef, useState } from "react";

import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

import type { Screen } from "../../../shared/types/portal";
import type {
  Document,
  DocumentAnalysisResult,
} from "../../../shared/types/document";

import {
  approveDocument,
  downloadDocument,
  getDocumentAnalysis,
  getDocuments,
  rejectDocument,
} from "../../../shared/api/document";

function formatDate(value: string | null | undefined): string {
  if (!value) return "Não informada";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("pt-BR");
}

function getBadgeStatus(status: string): string {
  const value = status.toLowerCase();

  if (value.includes("aprov") || value.includes("approv")) {
    return "approved";
  }

  if (value.includes("reprov") || value.includes("reject")) {
    return "rejected";
  }

  if (value.includes("corre") || value.includes("correct")) {
    return "correction";
  }

  if (value.includes("venc") || value.includes("expir")) {
    return "expired";
  }

  return "pending";
}

export default function AvaliarDocumentoPage({
  onNav,
}: {
  onNav: (s: Screen) => void;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [reloadFile, setReloadFile] = useState(0);

  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const [approving, setApproving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [sendingCorrection, setSendingCorrection] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  const doc = documents.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      try {
        setLoadingDocuments(true);
        setDocumentsError(null);

        const result = await getDocuments();

        if (!active) return;

        setDocuments(result);

        setSelectedId((currentId) => {
          if (result.some((item) => item.id === currentId)) {
            return currentId;
          }

          return result[0]?.id ?? null;
        });
      } catch (error) {
        if (!active) return;

        setDocumentsError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os documentos."
        );
      } finally {
        if (active) setLoadingDocuments(false);
      }
    }

    void loadDocuments();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setFileUrl(null);
      return;
    }

    let active = true;
    let generatedUrl: string | null = null;

    setFileUrl(null);
    setFileError(null);
    setLoadingFile(true);

    async function loadFile() {
      try {
        const blob = await downloadDocument(selectedId);

        if (!active) return;

        generatedUrl = URL.createObjectURL(blob);
        setFileUrl(generatedUrl);
      } catch (error) {
        if (!active) return;

        setFileError(
          error instanceof Error
            ? error.message
            : "Não foi possível visualizar o documento."
        );
      } finally {
        if (active) setLoadingFile(false);
      }
    }

    void loadFile();

    return () => {
      active = false;

      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [selectedId, reloadFile]);

  useEffect(() => {
    if (selectedId === null) {
      setAnalysis(null);
      return;
    }

    let active = true;

    setAnalysis(null);
    setAnalysisError(null);
    setLoadingAnalysis(true);

    async function loadAnalysis() {
      try {
        const result = await getDocumentAnalysis(selectedId);

        if (active) setAnalysis(result);
      } catch (error) {
        if (!active) return;

        setAnalysisError(
          error instanceof Error
            ? error.message
            : "Não foi possível consultar a análise automática."
        );
      } finally {
        if (active) setLoadingAnalysis(false);
      }
    }

    void loadAnalysis();

    return () => {
      active = false;
    };
  }, [selectedId]);

  async function handleApproveDocument() {
    if (!doc || approving) return;

    const confirmed = window.confirm(
      `Tem certeza de que deseja aprovar o documento "${doc.documentTypeName}" de "${doc.companyCorporateName}"?`
    );

    if (!confirmed) return;

    try {
      setApproving(true);
      setDecisionError(null);
      setDecisionSuccess(null);

      await approveDocument(doc.id);

      // Busca novamente os dados reais após a aprovação.
      const updatedDocuments = await getDocuments();

      setDocuments(updatedDocuments);

      setDecisionSuccess(
        "Documento aprovado com sucesso! O status foi atualizado no sistema."
      );
    } catch (error) {
      setDecisionError(
        error instanceof Error
          ? error.message
          : "Não foi possível aprovar o documento."
      );
    } finally {
      setApproving(false);
    }
  }

  async function handleRequestCorrection(type: string, reason: string) {
    if (!doc || sendingCorrection) return;

    if (!type.trim() || !reason.trim()) {
      setCorrectionError(
        "Preencha o motivo principal e a descrição detalhada."
      );
      return;
    }

    const documentId = doc.id;

    const confirmed = window.confirm(
      `Deseja registrar a solicitação de correção do documento "${doc.documentTypeName}"?\n\nAtenção: o backend registrará o status como REPROVADO.`
    );

    if (!confirmed) return;

    try {
      setSendingCorrection(true);
      setCorrectionError(null);
      setDecisionError(null);
      setDecisionSuccess(null);

      const justification = `Correção solicitada: ${type.trim()}. ${reason.trim()}`;

      await rejectDocument(documentId, justification);

      setShowCorrectionModal(false);

      setDecisionSuccess(
        "Solicitação registrada no motivo da reprovação. " +
          "O status real do documento é Reprovado."
      );

      try {
        const updatedDocuments = await getDocuments();
        setDocuments(updatedDocuments);
      } catch {
        setDecisionSuccess(
          "Solicitação registrada no backend, mas não foi possível " +
            "atualizar a lista. Recarregue a página para ver o status."
        );
      }
    } catch (error) {
      setCorrectionError(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a solicitação."
      );
    } finally {
      setSendingCorrection(false);
    }
  }

  async function handleRejectDocument(reason: string) {
    if (!doc || rejecting) return;

    const documentId = doc.id;

    try {
      setRejecting(true);
      setDecisionError(null);
      setDecisionSuccess(null);

      await rejectDocument(documentId, reason);

      setShowRejectModal(false);

      // Atualiza os documentos após a reprovação.
      const updatedDocuments = await getDocuments();
      setDocuments(updatedDocuments);

      setDecisionSuccess(
        "Documento reprovado com sucesso! O status foi atualizado no sistema."
      );
    } catch (error) {
      setDecisionError(
        error instanceof Error
          ? error.message
          : "Não foi possível reprovar o documento."
      );
    } finally {
      setRejecting(false);
    }
  }

  async function openFullscreen() {
    if (!viewerRef.current) return;

    try {
      await viewerRef.current.requestFullscreen();
    } catch {
      setFileError("Não foi possível abrir o visualizador em tela cheia.");
    }
  }

  return (
    <>
      <Header
        title="Análise de Documento"
        subtitle={
          doc
            ? doc.documentTypeName
            : loadingDocuments
            ? "Carregando documentos..."
            : "Documentos"
        }
        actions={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNav("admin-suppliers")}
          >
            ← Voltar
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

        {decisionSuccess && (
          <div
            className="card"
            role="status"
            style={{
              marginBottom: 16,
              color: "#15803d",
              border: "1px solid #86efac",
            }}
          >
            {decisionSuccess}
          </div>
        )}

        {documentsError && (
          <div className="card" style={{ marginBottom: 16, color: "#b91c1c" }}>
            {documentsError}
          </div>
        )}

        {!loadingDocuments && !documentsError && documents.length === 0 && (
          <div className="card">Nenhum documento encontrado para análise.</div>
        )}

        {doc && (
          <>
            {documents.length > 1 && (
              <div className="card" style={{ marginBottom: 16 }}>
                <label
                  htmlFor="document-selector"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Documento para análise
                </label>

                <select
                  id="document-selector"
                  className="select-base"
                  style={{ width: "100%" }}
                  value={selectedId ?? ""}
                  onChange={(event) =>
                    setSelectedId(Number(event.target.value))
                  }
                >
                  {documents.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.documentTypeName} -{" "}
                      {item.companyCorporateName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {/* VISUALIZAÇÃO DO DOCUMENTO */}
              <div
                ref={viewerRef}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
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
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    Visualização do Documento
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setReloadFile((value) => value + 1)}
                      disabled={loadingFile}
                    >
                      <Icon name="refresh" size={13} />
                      Recarregar
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => void openFullscreen()}
                      disabled={!fileUrl}
                    >
                      <Icon name="eye" size={13} />
                      Tela cheia
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    minHeight: 520,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loadingFile ? (
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                      Carregando documento...
                    </span>
                  ) : fileError ? (
                    <span
                      style={{
                        fontSize: 13,
                        color: "#b91c1c",
                        padding: 20,
                      }}
                    >
                      {fileError}
                    </span>
                  ) : fileUrl ? (
                    <iframe
                      key={fileUrl}
                      src={fileUrl}
                      title={`Documento ${doc.originalFileName}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 520,
                        border: 0,
                        display: "block",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                      Arquivo indisponível.
                    </span>
                  )}
                </div>
              </div>

              {/* COLUNA DE INFORMAÇÕES E ANÁLISE */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
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
                        gap: 12,
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
                        <StatusBadge
                          status={getBadgeStatus(doc.statusDescription)}
                        />
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
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
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
                    <p style={{ fontSize: 12 }}>
                      Carregando resultados da análise...
                    </p>
                  ) : analysisError ? (
                    <p style={{ color: "#dc2626", fontSize: 12 }}>
                      {analysisError}
                    </p>
                  ) : analysis ? (
                    <>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 14,
                          color: "#92400e",
                        }}
                      >
                        Resultado:{" "}
                        {analysis.verdictDescription === "NonConforming"
                          ? "Não conforme"
                          : analysis.verdictDescription === "NeedsAttention"
                          ? "Requer atenção"
                          : analysis.verdictDescription === "Conforming"
                          ? "Conforme"
                          : analysis.verdictDescription || "Aguardando parecer"}
                      </div>

                      {analysis.findings.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          {analysis.findings.map((finding, index) => {
                            const blocking =
                              finding.severityDescription === "Blocking";

                            const warning =
                              finding.severityDescription === "Warning";

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
                                <Icon
                                  name={
                                    blocking ? "x" : warning ? "alert" : "check"
                                  }
                                  size={16}
                                  color={color}
                                />

                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color,
                                      marginBottom: 3,
                                    }}
                                  >
                                    {blocking
                                      ? "Problema bloqueante"
                                      : warning
                                      ? "Alerta"
                                      : finding.severityDescription}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: "#374151",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {finding.message}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ fontSize: 12, color: "#6b7280" }}>
                          {analysis.statusDescription === "Completed"
                            ? "Nenhuma ocorrência detalhada registrada."
                            : "A análise ainda não disponibilizou ocorrências."}
                        </p>
                      )}

                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 10,
                          borderTop: "1px solid #fde68a",
                          fontSize: 11,
                          color: "#92400e",
                        }}
                      >
                        {
                          analysis.findings.filter(
                            (finding) =>
                              finding.severityDescription === "Blocking"
                          ).length
                        }{" "}
                        bloqueio(s) ·{" "}
                        {
                          analysis.findings.filter(
                            (finding) =>
                              finding.severityDescription === "Warning"
                          ).length
                        }{" "}
                        alerta(s)
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 12 }}>Nenhuma análise disponível.</p>
                  )}

                  <p
                    style={{
                      margin: "14px 0 0",
                      fontSize: 11,
                      color: "#92400e",
                      fontStyle: "italic",
                    }}
                  >
                    A análise automática é auxiliar. A decisão final é do
                    analista.
                  </p>
                </div>

                <div className="card decision-card">
                  <div className="decision-heading">
                    <h4>Concluir análise</h4>
                    <p>
                      As ações serão habilitadas após a integração dos modais
                      com o backend.
                    </p>
                  </div>

                  <div className="decision-actions">
                    
<button
  className="btn btn-success decision-primary"
  onClick={() => void handleApproveDocument()}
  disabled={
    approving ||
    rejecting ||
    sendingCorrection ||
    ["approved", "rejected"].includes(
      getBadgeStatus(doc.statusDescription)
    )
  }
>
  <Icon name="check" size={16} />
  {approving ? "Aprovando..." : "Aprovar documento"}
</button>


                    <button
                      className="btn btn-secondary decision-primary"
                      onClick={() => {
                        setCorrectionError(null);
                        setDecisionError(null);
                        setDecisionSuccess(null);
                        setShowCorrectionModal(true);
                      }}
                      disabled={
                        approving ||
                        rejecting ||
                        sendingCorrection ||
                        ["approved", "rejected"].includes(
                          getBadgeStatus(doc.statusDescription)
                        )
                      }
                    >
                      <Icon name="edit" size={16} />
                      Solicitar correção
                    </button>

                    <div className="decision-divider">
                      <span>ou</span>
                    </div>

                    <button
                      className="btn decision-reject"
                      onClick={() => {
                        setDecisionError(null);
                        setDecisionSuccess(null);
                        setShowRejectModal(true);
                      }}
                      disabled={
                        approving ||
                        rejecting ||
                        sendingCorrection ||
                        ["approved", "rejected"].includes(
                          getBadgeStatus(doc.statusDescription)
                        )
                      }
                    >
                      <Icon name="x" size={16} />
                      Reprovar documento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </PageWrapper>
      {showRejectModal && doc && (
        <ReprovarDocumentoModal
          doc={{
            name: doc.documentTypeName,
            person: doc.companyCorporateName,
          }}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectDocument}
          loading={rejecting}
        />
      )}

      {showCorrectionModal && doc && (
        <SolicitarCorrecaoModal
          doc={{
            name: doc.documentTypeName,
            person: doc.companyCorporateName,
          }}
          onClose={() => setShowCorrectionModal(false)}
          onConfirm={handleRequestCorrection}
          loading={sendingCorrection}
          error={correctionError}
        />
      )}
    </>
  );
}
