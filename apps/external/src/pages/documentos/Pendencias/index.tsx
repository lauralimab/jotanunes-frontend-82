import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

type DocumentoPendente = {
  id: number;
  name: string;
  person: string;
  status: string;
  validity: string;
};

type PendenciasPageProps = {
  documents: DocumentoPendente[];
  onNav: (screen: "send-document") => void;
};

export default function PendenciasPage({
  documents,
  onNav,
}: PendenciasPageProps) {
  const items = documents.filter((document) =>
    ["rejected", "expired", "correction"].includes(
      document.status,
    ),
  );

  const reasons: Record<number, string> = {
    5: "ASO com data de emissão ilegível. Reenvie o documento original com boa resolução.",
    7: "Certidão estadual com CNPJ divergente do cadastro.",
    8: "Laudo de insalubridade com assinatura do médico responsável ausente.",
  };

  return (
    <>
      <Header
        title="Pendências"
        subtitle="RF06/RF09 — Documentos que necessitam de correção ou reenvio"
      />

      <PageWrapper>
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 8,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Icon
            name="alert"
            size={18}
            color="#d97706"
          />

          <span
            style={{
              fontSize: 13,
              color: "#92400e",
            }}
          >
            <strong>{items.length} documentos</strong>{" "}
            com pendência. O status{" "}
            <strong>APTO</strong> exige 100%
            aprovados (Regra de Negócio).
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {items.map((document) => (
            <div
              key={document.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                borderLeft: `3px solid ${
                  document.status === "correction"
                    ? "#d97706"
                    : "#dc2626"
                }`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background:
                    document.status === "correction"
                      ? "#fff7ed"
                      : "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  name="doc"
                  size={20}
                  color={
                    document.status === "correction"
                      ? "#d97706"
                      : "#dc2626"
                  }
                />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {document.name}
                  </span>

                  <StatusBadge
                    status={document.status}
                  />
                </div>

                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  {document.person} • Validade:{" "}
                  {document.validity}
                </p>

                {reasons[document.id] && (
                  <div
                    style={{
                      background:
                        document.status ===
                        "correction"
                          ? "#fff7ed"
                          : "#fef2f2",
                      borderRadius: 6,
                      padding: "8px 12px",
                      marginTop: 8,
                      border: `1px solid ${
                        document.status ===
                        "correction"
                          ? "#fed7aa"
                          : "#fecaca"
                      }`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color:
                          document.status ===
                          "correction"
                            ? "#92400e"
                            : "#b91c1c",
                      }}
                    >
                      Motivo da correção:{" "}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#374151",
                      }}
                    >
                      {reasons[document.id]}
                    </span>
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  onNav("send-document")
                }
              >
                <Icon
                  name="upload"
                  size={13}
                />

                Corrigir Documento
              </button>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}