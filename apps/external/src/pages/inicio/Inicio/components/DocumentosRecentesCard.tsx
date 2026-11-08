import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

import type {
  Document as SupplierDocument,
  DocumentStatus,
} from "../../../../shared/types/documents";

type Props = {
  documents:
    SupplierDocument[];

  onViewAll:
    () => void;
};

function getStatus(
  status:
    DocumentStatus,
) {
  if (status === 1) {
    return "pending";
  }

  if (status === 2) {
    return "approved";
  }

  return "rejected";
}

export default function DocumentosRecentesCard({
  documents,
  onViewAll,
}: Props) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom: 16,

          gap: 10,
        }}
      >
        <h3
          style={{
            margin: 0,

            fontSize: 14,

            fontWeight: 700,
          }}
        >
          Documentos Recentes
        </h3>

        <button
          className="btn btn-ghost btn-sm"
          onClick={
            onViewAll
          }
        >
          Ver todos
        </button>
      </div>

      {documents.length ===
      0 ? (
        <div
          style={{
            padding:
              "24px 8px",

            textAlign:
              "center",

            color:
              "#475569",

            fontSize: 12.5,
          }}
        >
          Nenhum documento
          enviado ainda.
        </div>
      ) : (
        documents
          .slice(0, 6)
          .map(
            (
              document,
            ) => (
              <div
                key={
                  document.id
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  padding:
                    "10px 0",

                  borderBottom:
                    "1px solid #f3f4f6",

                  gap: 12,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 10,

                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,

                      borderRadius: 8,

                      background:
                        "#f8fafc",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      name="doc"
                      size={16}
                      color="#64748b"
                    />
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,

                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >
                      {
                        document.documentTypeName
                      }
                    </div>

                    <div
                      style={{
                        marginTop: 2,

                        fontSize:
                          11.5,

                        color:
                          "#64748b",

                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      {document.workerName
                        ? document.workerName
                        : document.workSiteName
                          ? `Obra: ${document.workSiteName}`
                          : document.companyCorporateName}
                    </div>
                  </div>
                </div>

                <StatusBadge
                  status={getStatus(
                    document.status,
                  )}
                />
              </div>
            ),
          )
      )}
    </div>
  );
}