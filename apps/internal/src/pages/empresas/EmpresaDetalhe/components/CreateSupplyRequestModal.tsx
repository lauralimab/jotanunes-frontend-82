import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  createSupplyRequest,
  getSupplyRequestDocumentOptions,
} from "../../../../shared/api/supplyRequest";

import {
  getWorkSites,
} from "../../../../shared/api/worksite";
import { getCompanies } from "../../../../shared/api/company";

import Select from "../../../../shared/components/Select";

import type {
  DocumentOption,
  DocumentOptions,
  SupplierType,
} from "../../../../shared/types/supplyRequest";

import type {
  WorkSite,
} from "../../../../shared/types/worksite";
import type { Company } from "../../../../shared/types/company";
import styles from "./CreateSupplyRequestModal.module.css";

type Props = ({ mode?: "supplier"; companyId: number; supplierType: SupplierType } | { mode: "worksite"; workSite: WorkSite }) & {
  onClose: () => void;
  onCreated: () => void;
};

type DocumentGroupProps = {
  title: string;
  description: string;
  items: DocumentOption[];
  selectedIds: Set<number>;
  onToggle: (
    documentTypeId: number,
  ) => void;
};

function DocumentGroup({
  title,
  description,
  items,
  selectedIds,
  onToggle,
}: DocumentGroupProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          background: "#f9fafb",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 3,
            fontSize: 11.5,
            color: "#6b7280",
          }}
        >
          {description}
        </div>
      </div>

      {items.map((item) => {
        const checked =
          selectedIds.has(
            item.documentTypeId,
          );

        return (
          <label
            key={
              item.documentTypeId
            }
            style={{
              display: "flex",
              gap: 10,
              padding: "12px 14px",
              alignItems: "flex-start",
              borderBottom:
                "1px solid #f3f4f6",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onToggle(
                  item.documentTypeId,
                )
              }
              style={{
                marginTop: 3,
              }}
            />

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {
                    item.documentTypeName
                  }
                </span>

                {item.suggested && (
                  <span
                    style={{
                      padding:
                        "2px 6px",
                      borderRadius: 999,
                      fontSize: 9.5,
                      fontWeight: 700,
                      background:
                        "#e0f2fe",
                      color:
                        "#0369a1",
                    }}
                  >
                    Sugerido
                  </span>
                )}

                {item.isConditional && (
                  <span
                    style={{
                      padding:
                        "2px 6px",
                      borderRadius: 999,
                      fontSize: 9.5,
                      fontWeight: 700,
                      background:
                        "#fef3c7",
                      color:
                        "#92400e",
                    }}
                  >
                    Condicional
                  </span>
                )}

                {item.companyAlreadyHas && (
                  <span
                    style={{
                      padding:
                        "2px 6px",
                      borderRadius: 999,
                      fontSize: 9.5,
                      fontWeight: 700,
                      background:
                        "#dcfce7",
                      color:
                        "#15803d",
                    }}
                  >
                    Já entregue
                  </span>
                )}
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 10.5,
                  color: "#9ca3af",
                }}
              >
                Código:{" "}
                {
                  item.documentTypeCode
                }
              </div>

              {item.conditionDescription && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 11.5,
                    color: "#6b7280",
                  }}
                >
                  {
                    item.conditionDescription
                  }
                </div>
              )}
            </div>
          </label>
        );
      })}
    </section>
  );
}

export default function CreateSupplyRequestModal(props: Props) {
  const isWorkSiteMode = props.mode === "worksite";
  const fixedWorkSite = isWorkSiteMode ? props.workSite : null;
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const companyId = isWorkSiteMode ? selectedCompany?.id ?? null : props.companyId;
  const supplierType = isWorkSiteMode ? selectedCompany?.supplierType ?? null : props.supplierType;
  const [workSiteId, setWorkSiteId] = useState(isWorkSiteMode ? String(props.workSite.id) : "");
  const [requiredWorkerCount, setRequiredWorkerCount] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [workSiteResult, setWorkSiteResult] = useState<{ sites: WorkSite[]; error?: unknown } | null>(null);
  const [documentResult, setDocumentResult] = useState<{ key: string; options?: DocumentOptions; error?: unknown } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierResults, setSupplierResults] = useState<Company[]>([]);
  const [supplierTotalPages, setSupplierTotalPages] = useState(0);
  const [supplierPageNumber, setSupplierPageNumber] = useState(1);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierError, setSupplierError] = useState("");
  const [supplierMenuOpen, setSupplierMenuOpen] = useState(false);
  const [activeSupplierIndex, setActiveSupplierIndex] = useState(-1);
  const supplierSearchVersion = useRef(0);
  const supplierLoadingMore = useRef(false);

  useEffect(() => {
    if (isWorkSiteMode) return;
    let active = true;
    getWorkSites()
      .then(sites => { if (active) setWorkSiteResult({ sites }); })
      .catch(cause => { if (active) setWorkSiteResult({ sites: [], error: cause }); });
    return () => { active = false; };
  }, [isWorkSiteMode]);

  const documentKey = companyId && supplierType ? `${companyId}:${supplierType}` : "";
  useEffect(() => {
    if (!documentKey || companyId === null || supplierType === null) return;
    let active = true;
    getSupplyRequestDocumentOptions(companyId, supplierType)
      .then(options => {
        if (!active) return;
        setDocumentResult({ key: documentKey, options });
        const allItems = [...options.companyOnboarding, ...options.companyRecurring, ...options.workerOnboarding, ...options.workerRecurring];
        setSelectedIds(new Set(allItems.filter(item => item.selected).map(item => item.documentTypeId)));
      })
      .catch(cause => { if (active) setDocumentResult({ key: documentKey, error: cause }); });
    return () => { active = false; };
  }, [documentKey, companyId, supplierType]);

  const documentState = documentResult?.key === documentKey ? documentResult : null;
  const options = documentState?.options ?? null;
  const documentLoading = Boolean(documentKey) && documentState === null;
  const workSites = isWorkSiteMode ? [fixedWorkSite!] : workSiteResult?.sites ?? [];
  const workSiteLoading = !isWorkSiteMode && workSiteResult === null;
  const loadError = !isWorkSiteMode && workSiteResult?.error ? workSiteResult.error : documentState?.error;
  const loading = workSiteLoading || (!isWorkSiteMode && documentLoading);
  const onClose = props.onClose;
  const onCreated = props.onCreated;

  const searchSuppliers = useCallback(async (query: string, pageNumber: number, append: boolean, version: number) => {
    setSupplierLoading(true);
    setSupplierError("");
    try {
      const results = await Promise.allSettled([
        getCompanies({ pageNumber, pageSize: 10, corporateName: query }),
        getCompanies({ pageNumber, pageSize: 10, tradeName: query }),
      ]);
      if (version !== supplierSearchVersion.current) return;
      const pages = results.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
      if (!pages.length) throw results.find(result => result.status === "rejected")?.reason ?? new Error("N?o foi poss?vel pesquisar fornecedores.");
      const companies = pages.flatMap(page => page.items).filter((company, index, all) => all.findIndex(item => item.id === company.id) === index);
      setSupplierResults(current => append
        ? [...current, ...companies.filter(company => !current.some(item => item.id === company.id))]
        : companies);
      setSupplierTotalPages(Math.max(...pages.map(page => page.totalPages)));
      setSupplierPageNumber(pageNumber);
      setSupplierError(results.some(result => result.status === "rejected") ? "Parte dos resultados n?o p?de ser carregada." : "");
    } catch (cause) {
      if (version !== supplierSearchVersion.current) return;
      if (!append) setSupplierResults([]);
      setSupplierError(cause instanceof Error ? cause.message : "N?o foi poss?vel pesquisar fornecedores.");
    } finally {
      if (version === supplierSearchVersion.current) setSupplierLoading(false);
      if (version === supplierSearchVersion.current) supplierLoadingMore.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isWorkSiteMode) return;
    if (selectedCompany) return;
    const query = supplierSearch.trim();
    const version = ++supplierSearchVersion.current;
    supplierLoadingMore.current = false;
    if (!query) return;
    const timer = window.setTimeout(() => { void searchSuppliers(query, 1, false, version); }, 300);
    return () => window.clearTimeout(timer);
  }, [supplierSearch, selectedCompany, isWorkSiteMode, searchSuppliers]);

  function loadMoreSuppliers() {
    if (supplierLoading || supplierLoadingMore.current || supplierPageNumber >= supplierTotalPages) return;
    supplierLoadingMore.current = true;
    void searchSuppliers(supplierSearch.trim(), supplierPageNumber + 1, true, supplierSearchVersion.current);
  }

  function selectSupplier(company: Company) {
    supplierSearchVersion.current += 1;
    setSelectedCompany(company);
    setSupplierSearch(company.corporateName || company.tradeName || `Fornecedor #${company.id}`);
    setSupplierMenuOpen(false);
    setSupplierLoading(false);
    setSelectedIds(new Set());
    setRequiredWorkerCount("");
    setError("");
  }

  function clearSupplier() {
    supplierSearchVersion.current += 1;
    setSelectedCompany(null);
    setSupplierSearch("");
    setSupplierResults([]);
    setSupplierMenuOpen(false);
    setSupplierLoading(false);
    setSelectedIds(new Set());
    setRequiredWorkerCount("");
    setError("");
  }

  const totalDocuments =
    useMemo(() => {
      if (!options) {
        return 0;
      }

      return (
        options.companyOnboarding
          .length +
        options.companyRecurring
          .length +
        options.workerOnboarding
          .length +
        options.workerRecurring
          .length
      );
    }, [options]);

  function toggleDocument(
    documentTypeId: number,
  ) {
    setSelectedIds(
      (current) => {
        const next =
          new Set(current);

        if (
          next.has(documentTypeId)
        ) {
          next.delete(
            documentTypeId,
          );
        } else {
          next.add(
            documentTypeId,
          );
        }

        return next;
      },
    );
  }

  async function handleSubmit() {
    const requestWorkSiteId = fixedWorkSite?.id ?? Number(workSiteId);
    if (!requestWorkSiteId) {
      setError(
        "Selecione uma obra.",
      );
      return;
    }

    if (!companyId || !supplierType) {
      setError("Selecione um fornecedor.");
      return;
    }

    if (!options) {
      setError("Aguarde o carregamento dos documentos do fornecedor.");
      return;
    }

    const workerCount =
      requiredWorkerCount.trim()
        ? Number(
            requiredWorkerCount,
          )
        : null;

    if (
      supplierType === 2 &&
      workerCount !== null &&
      (
        !Number.isInteger(
          workerCount,
        ) ||
        workerCount < 0
      )
    ) {
      setError(
        "Informe uma quantidade válida de trabalhadores.",
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createSupplyRequest({
        companyId,
        workSiteId: requestWorkSiteId,
        supplierType,
        requiredWorkerCount:
          supplierType === 2
            ? workerCount
            : null,
        requiredDocumentTypeIds:
          Array.from(
            selectedIds,
          ),
      });

      onCreated();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível criar a solicitação.",
      );
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={
        saving
          ? undefined
          : onClose
      }
    >
      <div
        className={`modal-box ${styles.dialog} ${isWorkSiteMode ? styles.worksiteDialog : ""}`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              Nova solicitação
            </h3>

            <p className={styles.description}>
              {isWorkSiteMode ? "A obra está definida. Selecione o fornecedor e os documentos exigidos." : "Defina a obra e os documentos que serão exigidos do fornecedor."}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={saving}
          >
            Fechar
          </button>
        </div>

        <div className={styles.body}>
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Carregando...
          </div>
        ) : (options || isWorkSiteMode) && (!loadError || isWorkSiteMode) ? (
          <>
            <div className={`${styles.fields} ${isWorkSiteMode ? styles.worksiteFields : ""}`}>
              <div>
                <label
                  htmlFor="supply-request-worksite"
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#6b7280",
                  }}
                >
                  Obra
                </label>

                {fixedWorkSite ? <input id="supply-request-worksite" className={`input-base ${styles.fixedField}`} aria-label="Obra selecionada" disabled value={fixedWorkSite.name} /> : <Select
                  label="Selecionar obra"
                  value={workSiteId}
                  placeholder="Selecione a obra"
                  options={workSites.map(workSite => ({ value: String(workSite.id), label: workSite.name }))}
                  onChange={setWorkSiteId}
                />}
              </div>

              {isWorkSiteMode && <div className={styles.supplierPicker}>
                <label htmlFor="supply-request-supplier-search" style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#6b7280" }}>Fornecedor</label>
                <div className={styles.supplierCombobox}>
                  <input
                    id="supply-request-supplier-search"
                    className={`input-base ${styles.supplierInput}`}
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={supplierMenuOpen}
                    aria-controls="supply-request-supplier-options"
                    aria-activedescendant={activeSupplierIndex >= 0 ? `supply-request-supplier-option-${activeSupplierIndex}` : undefined}
                    placeholder="Digite o nome do fornecedor..."
                    value={selectedCompany ? (selectedCompany.corporateName || selectedCompany.tradeName || `Fornecedor #${selectedCompany.id}`) : supplierSearch}
                    onFocus={() => { if (!selectedCompany && supplierSearch.trim()) setSupplierMenuOpen(true); }}
                    onBlur={() => setSupplierMenuOpen(false)}
                    onChange={event => {
                      if (selectedCompany) {
                        setSelectedCompany(null);
                        setSelectedIds(new Set());
                        setRequiredWorkerCount("");
                        setError("");
                      }
                      supplierSearchVersion.current += 1;
                      setSupplierSearch(event.target.value);
                      setSupplierResults([]);
                      setSupplierTotalPages(0);
                      setSupplierPageNumber(1);
                      setSupplierLoading(Boolean(event.target.value.trim()));
                      setSupplierError("");
                      setActiveSupplierIndex(-1);
                      setSupplierMenuOpen(Boolean(event.target.value.trim()));
                    }}
                    onKeyDown={event => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setSupplierMenuOpen(true);
                        setActiveSupplierIndex(index => Math.min(index + 1, supplierResults.length - 1));
                      } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setActiveSupplierIndex(index => Math.max(index - 1, 0));
                      } else if (event.key === "Enter" && supplierMenuOpen && activeSupplierIndex >= 0) {
                        event.preventDefault();
                        const company = supplierResults[activeSupplierIndex];
                        if (company) selectSupplier(company);
                      } else if (event.key === "Escape") {
                        setSupplierMenuOpen(false);
                      }
                    }}
                  />
                  {selectedCompany && <button type="button" className={styles.supplierClear} aria-label="Limpar fornecedor selecionado" onClick={clearSupplier}>{"\u00d7"}</button>}
                  {supplierMenuOpen && !selectedCompany && <div id="supply-request-supplier-options" className={styles.supplierOptions} role="listbox" aria-label="Fornecedores encontrados" onScroll={event => {
                    const element = event.currentTarget;
                    if (element.scrollHeight - element.scrollTop - element.clientHeight < 40) loadMoreSuppliers();
                  }}>
                    {supplierResults.map((company, index) => <button
                      key={company.id}
                      id={`supply-request-supplier-option-${index}`}
                      type="button"
                      className={styles.supplierOption}
                      role="option"
                      aria-selected={activeSupplierIndex === index}
                      onMouseDown={event => event.preventDefault()}
                      onMouseEnter={() => setActiveSupplierIndex(index)}
                      onClick={() => selectSupplier(company)}
                    >{company.corporateName || company.tradeName || `Fornecedor #${company.id}`}</button>)}
                    {supplierLoading && <div className={styles.supplierStatus} role="status">Carregando fornecedores...</div>}
                    {supplierError && <div className={`${styles.supplierStatus} ${styles.supplierError}`} role="alert">{supplierError}</div>}
                    {!supplierLoading && !supplierError && supplierSearch.trim() && !supplierResults.length && <div className={styles.supplierStatus} role="status">Nenhum fornecedor encontrado</div>}
                  </div>}
                </div>
              </div>}

              <div className={styles.supplyTypeField}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#6b7280",
                  }}
                >
                  Tipo de fornecimento
                </label>

                {isWorkSiteMode ? <input
                  className={`input-base ${styles.fixedField}`}
                  aria-label="Tipo de fornecimento"
                  disabled
                  value={supplierType === 1 ? "Material" : supplierType === 2 ? "Mão de obra" : "Selecione um fornecedor"}
                /> : <div
                  className="input-base"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 38,
                    background: "#f9fafb",
                    color: "#374151",
                  }}
                >
                  {supplierType === 1 ? "Material" : supplierType === 2 ? "Mão de obra" : "Selecione um fornecedor"}
                </div>}
              </div>

              {supplierType === 2 && (
                <div>
                  <label
                    htmlFor="required-worker-count"
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "#6b7280",
                    }}
                  >
                    Quantidade de
                    trabalhadores
                  </label>

                  <input
                    id="required-worker-count"
                    type="number"
                    min="0"
                    step="1"
                    className="input-base"
                    placeholder="Ex.: 10"
                    value={
                      requiredWorkerCount
                    }
                    onChange={(event) =>
                      setRequiredWorkerCount(
                        event.target
                          .value,
                      )
                    }
                  />
                </div>
              )}
            </div>

            {options ? <>
            <section className={styles.documents}>
            <div className={styles.documentsHeader}>
              <div>
                <div className={styles.documentsTitle}>
                  Documentos exigidos
                </div>

                <div className={styles.documentsDescription}>
                  Os documentos
                  sugeridos já vêm
                  selecionados.
                </div>
              </div>

              <span className={styles.documentsCount}>
                {selectedIds.size} de{" "}
                {totalDocuments}{" "}
                selecionado(s)
              </span>
            </div>

            <div className={styles.documentList}>
              <DocumentGroup
                title="Habilitação da empresa"
                description="Documentos de cadastro inicial da empresa."
                items={
                  options.companyOnboarding
                }
                selectedIds={
                  selectedIds
                }
                onToggle={
                  toggleDocument
                }
              />

              <DocumentGroup
                title="Documentos recorrentes da empresa"
                description="Documentos periódicos exigidos nesta solicitação."
                items={
                  options.companyRecurring
                }
                selectedIds={
                  selectedIds
                }
                onToggle={
                  toggleDocument
                }
              />

              <DocumentGroup
                title="Habilitação dos trabalhadores"
                description="Documentos de cadastro dos trabalhadores."
                items={
                  options.workerOnboarding
                }
                selectedIds={
                  selectedIds
                }
                onToggle={
                  toggleDocument
                }
              />

              <DocumentGroup
                title="Documentos recorrentes dos trabalhadores"
                description="Documentos periódicos dos trabalhadores."
                items={
                  options.workerRecurring
                }
                selectedIds={
                  selectedIds
                }
                onToggle={
                  toggleDocument
                }
              />
            </div>
            </section>
            </> : <div role={documentState?.error ? "alert" : "status"} style={{ padding: 16, borderRadius: 10, background: documentState?.error ? "#fff7f7" : "#f9fafb", color: documentState?.error ? "#b91c1c" : "#6b7280", fontSize: 12.5 }}>
              {documentState?.error ? (documentState.error instanceof Error ? documentState.error.message : "Não foi possível carregar os documentos.") : documentLoading ? "Carregando documentos aplicáveis..." : "Selecione um fornecedor para carregar os documentos exigidos."}
            </div>}

            {error && (
              <div
                role="alert"
                style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8,
                  background:
                    "#fff7f7",
                  color: "#b91c1c",
                  fontSize: 12.5,
                }}
              >
                {error}
              </div>
            )}


          </>
        ) : (
          <div
            role="alert"
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#fff7f7",
              color: "#b91c1c",
            }}
          >
            {error || (loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados.")}
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving || (!workSiteId && !fixedWorkSite) || !companyId || !supplierType || !options || documentLoading}>
          {saving ? "Criando..." : "Criar solicita\u00e7\u00e3o"}
        </button>
      </footer>
      </div>
    </div>,
    document.body,
  );
}
