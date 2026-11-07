import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getSupplyRequestDocumentOptionsById,
  updateSupplyRequestDocuments,
} from "../../../../shared/api/supplyRequest";

import type {
  DocumentOption,
  DocumentOptions,
  SupplyRequest,
} from "../../../../shared/types/supplyRequest";

import {
  createPortal,
} from "react-dom";

type Props = {
  request: SupplyRequest;
  onClose: () => void;
  onSaved: () => void;
};

type SectionProps = {
  title: string;
  description: string;
  items: DocumentOption[];
  selectedIds: Set<number>;
  onToggle: (
    documentTypeId: number,
  ) => void;
};

function DocumentSection({
  title,
  description,
  items,
  selectedIds,
  onToggle,
}: SectionProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          background: "#f9fafb",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: 14,
          }}
        >
          {title}
        </h4>

        <p
          style={{
            margin: "4px 0 0",
            color: "#6b7280",
            fontSize: 12,
          }}
        >
          {description}
        </p>
      </div>

      <div>
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
                gap: 12,
                padding:
                  "14px 16px",
                borderBottom:
                  "1px solid #f3f4f6",
                cursor: "pointer",
                alignItems:
                  "flex-start",
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
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems:
                      "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: 13,
                      color:
                        "#111827",
                    }}
                  >
                    {
                      item.documentTypeName
                    }
                  </strong>

                  {item.suggested && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight:
                          700,
                        padding:
                          "3px 7px",
                        borderRadius:
                          999,
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
                        fontSize: 10,
                        fontWeight:
                          700,
                        padding:
                          "3px 7px",
                        borderRadius:
                          999,
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
                        fontSize: 10,
                        fontWeight:
                          700,
                        padding:
                          "3px 7px",
                        borderRadius:
                          999,
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
                    marginTop: 4,
                    fontSize: 11.5,
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
                      marginTop: 6,
                      fontSize: 12,
                      color:
                        "#6b7280",
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
      </div>
    </section>
  );
}

export default function SupplyRequestDocumentsModal({
  request,
  onClose,
  onSaved,
}: Props) {
  const [options, setOptions] =
    useState<DocumentOptions | null>(
      null,
    );

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<Set<number>>(
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

    getSupplyRequestDocumentOptionsById(
      request.id,
    )
      .then((result) => {
        if (!active) {
          return;
        }

        setOptions(result);

        const allItems = [
          ...result.companyOnboarding,
          ...result.companyRecurring,
          ...result.workerOnboarding,
          ...result.workerRecurring,
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
      })
      .catch((cause) => {
        if (!active) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível carregar os documentos.",
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
  }, [request.id]);

  const totalSelected =
    selectedIds.size;

  const totalAvailable =
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

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      await updateSupplyRequestDocuments(
        request.id,
        {
          documentTypeIds:
            Array.from(
              selectedIds,
            ),
        },
      );

      onSaved();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível salvar os documentos.",
      );
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          maxWidth: 820,
          width: "calc(100% - 32px)",
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
              Documentos exigidos
            </h3>

            <p
              style={{
                margin:
                  "5px 0 0",
                color: "#6b7280",
                fontSize: 12.5,
              }}
            >
              Solicitação #
              {request.id} ·{" "}
              {request.workSiteName}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
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
            Carregando documentos...
          </div>
        ) : error && !options ? (
          <div
            role="alert"
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#fff7f7",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        ) : options ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 16,
                marginBottom: 16,
                padding: 14,
                borderRadius: 10,
                background: "#f9fafb",
                fontSize: 12.5,
              }}
            >
              <span>
                <strong>
                  {totalSelected}
                </strong>{" "}
                selecionado(s)
              </span>

              <span
                style={{
                  color: "#6b7280",
                }}
              >
                {totalAvailable}{" "}
                documento(s)
                disponível(is)
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <DocumentSection
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

              <DocumentSection
                title="Documentos recorrentes da empresa"
                description="Documentos exigidos periodicamente para esta solicitação."
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

              <DocumentSection
                title="Habilitação dos trabalhadores"
                description="Documentos iniciais exigidos dos trabalhadores vinculados."
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

              <DocumentSection
                title="Documentos recorrentes dos trabalhadores"
                description="Documentos periódicos exigidos dos trabalhadores."
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
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Salvando..."
                  : "Salvar documentos"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}