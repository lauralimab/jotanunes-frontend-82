import {
  useEffect,
  useMemo,
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

import Select from "../../../../shared/components/Select";

import type {
  DocumentOption,
  DocumentOptions,
  SupplierType,
} from "../../../../shared/types/supplyRequest";

import type {
  WorkSite,
} from "../../../../shared/types/worksite";

type Props = {
  companyId: number;
  supplierType: SupplierType;
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

export default function CreateSupplyRequestModal({
  companyId,
  supplierType,
  onClose,
  onCreated,
}: Props) {
  const [
    workSites,
    setWorkSites,
  ] =
    useState<WorkSite[]>([]);

  const [
    workSiteId,
    setWorkSiteId,
  ] = useState("");

  const [
    requiredWorkerCount,
    setRequiredWorkerCount,
  ] = useState("");

  const [
    options,
    setOptions,
  ] =
    useState<DocumentOptions | null>(
      null,
    );

  const [
    selectedIds,
    setSelectedIds,
  ] =
    useState<Set<number>>(
      new Set(),
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    Promise.all([
      getWorkSites(),
      getSupplyRequestDocumentOptions(
        companyId,
        supplierType,
      ),
    ])
      .then(
        ([
          sites,
          documentOptions,
        ]) => {
          if (!active) {
            return;
          }

          setWorkSites(sites);
          setOptions(
            documentOptions,
          );

          const allItems = [
            ...documentOptions
              .companyOnboarding,
            ...documentOptions
              .companyRecurring,
            ...documentOptions
              .workerOnboarding,
            ...documentOptions
              .workerRecurring,
          ];

          setSelectedIds(
            new Set(
              allItems
                .filter(
                  (item) =>
                    item.selected,
                )
                .map(
                  (item) =>
                    item.documentTypeId,
                ),
            ),
          );
        },
      )
      .catch((cause) => {
        if (!active) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível carregar os dados da solicitação.",
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    companyId,
    supplierType,
  ]);

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
    if (!workSiteId) {
      setError(
        "Selecione uma obra.",
      );
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
        workSiteId:
          Number(workSiteId),
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
        className="modal-box"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          maxWidth: 860,
          width:
            "calc(100% - 32px)",
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
              Nova solicitação
            </h3>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#6b7280",
                fontSize: 12.5,
              }}
            >
              Defina a obra e os
              documentos que serão
              exigidos do fornecedor.
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
        ) : options ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div>
                <label
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

                <Select
                  label="Selecionar obra"
                  value={workSiteId}
                  placeholder="Selecione a obra"
                  options={workSites.map(
                    (workSite) => ({
                      value:
                        String(
                          workSite.id,
                        ),
                      label:
                        workSite.name,
                    }),
                  )}
                  onChange={
                    setWorkSiteId
                  }
                />
              </div>

              <div>
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

                <div
                  className="input-base"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 38,
                    background:
                      "#f9fafb",
                    color: "#374151",
                  }}
                >
                  {supplierType === 1
                    ? "Material"
                    : "Mão de obra"}
                </div>
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

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Documentos exigidos
                </div>

                <div
                  style={{
                    marginTop: 3,
                    fontSize: 11.5,
                    color: "#6b7280",
                  }}
                >
                  Os documentos
                  sugeridos já vêm
                  selecionados.
                </div>
              </div>

              <span
                style={{
                  fontSize: 11.5,
                  color: "#6b7280",
                }}
              >
                {selectedIds.size} de{" "}
                {totalDocuments}{" "}
                selecionado(s)
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
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

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  handleSubmit
                }
                disabled={
                  saving ||
                  !workSiteId
                }
              >
                {saving
                  ? "Criando..."
                  : "Criar solicitação"}
              </button>
            </div>
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
            {error ||
              "Não foi possível carregar os dados."}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}