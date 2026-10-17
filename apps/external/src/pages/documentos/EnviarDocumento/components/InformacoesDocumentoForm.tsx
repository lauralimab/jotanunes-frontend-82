import type {
  SupplierDocumentType,
} from "../../../../shared/types/documentsTypes";

import {
  DOCUMENT_SUBJECT,
} from "../../../../shared/types/documentsTypes";

import type {
  Worker,
} from "../../../../shared/types/workers";

type InformacoesDocumentoFormProps = {
  documentTypes:
    SupplierDocumentType[];

  workers: Worker[];

  documentTypeId: string;

  workerId: string;

  expirationDate: string;

  isLoading: boolean;

  onDocumentTypeChange: (
    value: string,
  ) => void;

  onWorkerChange: (
    value: string,
  ) => void;

  onExpirationDateChange: (
    value: string,
  ) => void;
};

export default function InformacoesDocumentoForm({
  documentTypes,
  workers,
  documentTypeId,
  workerId,
  expirationDate,
  isLoading,
  onDocumentTypeChange,
  onWorkerChange,
  onExpirationDateChange,
}: InformacoesDocumentoFormProps) {
  const selectedDocumentType =
    documentTypes.find(
      (documentType) =>
        documentType.id ===
        Number(documentTypeId),
    );

  const isWorkerDocument =
    selectedDocumentType?.subject ===
    DOCUMENT_SUBJECT.worker;

  const isCompanyDocument =
    selectedDocumentType?.subject ===
    DOCUMENT_SUBJECT.company;

  return (
    <>
      <h3
        style={{
          margin: "0 0 20px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Informações do Documento
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Tipo de Documento *
          </label>

          <select
            className="select-base"
            value={documentTypeId}
            disabled={isLoading}
            onChange={(event) =>
              onDocumentTypeChange(
                event.target.value,
              )
            }
            style={{
              width: "100%",
            }}
          >
            <option value="">
              {isLoading
                ? "Carregando tipos..."
                : "Selecionar tipo..."}
            </option>

            {documentTypes.map(
              (documentType) => (
                <option
                  key={
                    documentType.id
                  }
                  value={
                    documentType.id
                  }
                >
                  {
                    documentType.name
                  }
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Referente a *
          </label>

          {!selectedDocumentType ? (
            <select
              className="select-base"
              disabled
              style={{
                width: "100%",
              }}
            >
              <option>
                Selecione o tipo primeiro
              </option>
            </select>
          ) : isCompanyDocument ? (
            <select
              className="select-base"
              disabled
              value="company"
              style={{
                width: "100%",
              }}
            >
              <option value="company">
                Empresa
              </option>
            </select>
          ) : isWorkerDocument ? (
            <select
              className="select-base"
              value={workerId}
              onChange={(event) =>
                onWorkerChange(
                  event.target.value,
                )
              }
              style={{
                width: "100%",
              }}
            >
              <option value="">
                Selecionar funcionário...
              </option>

              {workers.map(
                (worker) => (
                  <option
                    key={
                      worker.id
                    }
                    value={
                      worker.id
                    }
                  >
                    {
                      worker.name
                    }
                    {" — "}
                    {
                      worker.formattedCpf
                    }
                  </option>
                ),
              )}
            </select>
          ) : (
            <select
              className="select-base"
              disabled
              style={{
                width: "100%",
              }}
            >
              <option>
                Tipo não identificado
              </option>
            </select>
          )}
        </div>

        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Data de Validade
            {selectedDocumentType
              ?.requiresExpirationDate
              ? " *"
              : ""}
          </label>

          <input
            className="input-base"
            type="date"
            value={expirationDate}
            onChange={(event) =>
              onExpirationDateChange(
                event.target.value,
              )
            }
          />

          {selectedDocumentType
            ?.requiresExpirationDate && (
            <div
              style={{
                marginTop: 5,
                color: "#64748b",
                fontSize: 11.5,
              }}
            >
              Obrigatória para este
              tipo de documento.
            </div>
          )}
        </div>

        {selectedDocumentType
          ?.isConditional &&
          selectedDocumentType
            .conditionDescription && (
            <div
              style={{
                gridColumn:
                  "1 / -1",

                padding:
                  "10px 12px",

                background:
                  "#f8fafc",

                border:
                  "1px solid #e2e8f0",

                borderRadius: 8,

                fontSize: 12.5,

                color: "#475569",
              }}
            >
              <strong>
                Condição:
              </strong>{" "}
              {
                selectedDocumentType
                  .conditionDescription
              }
            </div>
          )}
      </div>
    </>
  );
}