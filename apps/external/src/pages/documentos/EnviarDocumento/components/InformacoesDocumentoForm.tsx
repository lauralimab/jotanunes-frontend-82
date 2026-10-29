
import {
  DOCUMENT_CATEGORY,
  DOCUMENT_SUBJECT,
  type SupplierDocumentType,
} from "../../../../shared/types/documentTypes";

import type {
  SupplyRequest,
} from "../../../../shared/types/supplyRequests";

export type WorkerOption = {
  id: number;
  name: string;
  formattedCpf: string;
};

type InformacoesDocumentoFormProps = {
  documentTypes: SupplierDocumentType[];
  workerOptions: WorkerOption[];
  supplyRequests: SupplyRequest[];

  documentTypeId: string;
  supplyRequestId: string;
  workerId: string;
  expirationDate: string;

  isLoading: boolean;
  isLoadingRequests: boolean;
  isLoadingWorkers: boolean;

  onDocumentTypeChange: (value: string) => void;
  onSupplyRequestChange: (value: string) => void;
  onWorkerChange: (value: string) => void;
  onExpirationDateChange: (value: string) => void;
};

export default function InformacoesDocumentoForm({
  documentTypes,
  workerOptions,
  supplyRequests,
  documentTypeId,
  supplyRequestId,
  workerId,
  expirationDate,
  isLoading,
  isLoadingRequests,
  isLoadingWorkers,
  onDocumentTypeChange,
  onSupplyRequestChange,
  onWorkerChange,
  onExpirationDateChange,
}: InformacoesDocumentoFormProps) {
  const selectedType = documentTypes.find(
    (type) => type.id === Number(documentTypeId),
  );

  const isRecurring =
    selectedType?.category ===
    DOCUMENT_CATEGORY.recurring;

  const isWorkerDocument =
    selectedType?.subject ===
    DOCUMENT_SUBJECT.worker;

  const isCompanyDocument =
    selectedType?.subject ===
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
            htmlFor="document-type"
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
            id="document-type"
            className="select-base"
            value={documentTypeId}
            disabled={isLoading}
            onChange={(event) =>
              onDocumentTypeChange(event.target.value)
            }
            style={{ width: "100%" }}
          >
            <option value="">
              {isLoading
                ? "Carregando tipos..."
                : "Selecionar tipo..."}
            </option>

            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {isRecurring && (
          <div>
            <label
              htmlFor="supply-request"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              Solicitação de Fornecimento *
            </label>

            <select
              id="supply-request"
              className="select-base"
              value={supplyRequestId}
              disabled={isLoading || isLoadingRequests}
              onChange={(event) =>
                onSupplyRequestChange(event.target.value)
              }
              style={{ width: "100%" }}
            >
              <option value="">
                {isLoadingRequests
                  ? "Carregando solicitações..."
                  : "Selecionar solicitação..."}
              </option>

              {supplyRequests.map((request) => (
                <option
                  key={request.id}
                  value={request.id}
                >
                  {request.workSiteName}
                  {" — "}
                  {request.supplierTypeDescription}
                  {" (#"}
                  {request.id}
                  {")"}
                </option>
              ))}
            </select>

            {!isLoadingRequests &&
              supplyRequests.length === 0 && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#92400e",
                  }}
                >
                  Nenhuma solicitação ativa compatível
                  foi encontrada.
                </div>
              )}
          </div>
        )}

        <div>
          <label
            htmlFor="document-subject"
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

          {!selectedType ? (
            <select
              id="document-subject"
              className="select-base"
              disabled
              style={{ width: "100%" }}
            >
              <option>Selecione o tipo primeiro</option>
            </select>
          ) : isCompanyDocument ? (
            <select
              id="document-subject"
              className="select-base"
              disabled
              value="company"
              style={{ width: "100%" }}
            >
              <option value="company">Empresa</option>
            </select>
          ) : isWorkerDocument ? (
            <>
              <select
                id="document-subject"
                className="select-base"
                value={workerId}
                disabled={
                  isLoading ||
                  isLoadingWorkers ||
                  (isRecurring && !supplyRequestId)
                }
                onChange={(event) =>
                  onWorkerChange(event.target.value)
                }
                style={{ width: "100%" }}
              >
                <option value="">
                  {isRecurring && !supplyRequestId
                    ? "Selecione a solicitação primeiro"
                    : isLoadingWorkers
                      ? "Carregando funcionários..."
                      : "Selecionar funcionário..."}
                </option>

                {workerOptions.map((worker) => (
                  <option
                    key={worker.id}
                    value={worker.id}
                  >
                    {worker.name}
                    {" — "}
                    {worker.formattedCpf}
                  </option>
                ))}
              </select>

              {!isLoadingWorkers &&
                (!isRecurring || Boolean(supplyRequestId)) &&
                workerOptions.length === 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#92400e",
                    }}
                  >
                    {isRecurring
                      ? "Nenhum funcionário ativo alocado nesta solicitação."
                      : "Nenhum funcionário ativo cadastrado."}
                  </div>
                )}
            </>
          ) : (
            <select
              id="document-subject"
              className="select-base"
              disabled
              style={{ width: "100%" }}
            >
              <option>Tipo não identificado</option>
            </select>
          )}
        </div>

        <div>
          <label
            htmlFor="document-expiration"
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Data de Validade
            {selectedType?.requiresExpirationDate
              ? " *"
              : ""}
          </label>

          <input
            id="document-expiration"
            className="input-base"
            type="date"
            value={expirationDate}
            disabled={isLoading || !selectedType}
            onChange={(event) =>
              onExpirationDateChange(event.target.value)
            }
            style={{ width: "100%" }}
          />

          {selectedType?.requiresExpirationDate && (
            <div
              style={{
                marginTop: 5,
                color: "#64748b",
                fontSize: 11.5,
              }}
            >
              Obrigatória para este tipo de documento.
            </div>
          )}
        </div>

        {selectedType?.isConditional &&
          selectedType.conditionDescription && (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "10px 12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12.5,
                color: "#475569",
              }}
            >
              <strong>Condição:</strong>{" "}
              {selectedType.conditionDescription}
            </div>
          )}
      </div>
    </>
  );
}
