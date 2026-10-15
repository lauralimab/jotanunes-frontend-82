import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import StatusBadge from "../../../shared/components/StatusBadge";

type InicioNavigation =
  | "documents"
  | "send-document"
  | "pendencies";

type DashboardDocument = {
  id: number;
  name: string;
  person: string;
  status: string;
};

type InicioPageProps = {
  onNav: (screen: InicioNavigation) => void;
  documents: DashboardDocument[];
};

export default function InicioPage({
  onNav,
  documents,
}: InicioPageProps) {
  const stats = [
    {
      label: "Aprovados",
      value: 8,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: "check",
    },
    {
      label: "Aguardando Análise",
      value: 3,
      color: "#ca8a04",
      bg: "#fef9c3",
      icon: "clock",
    },
    {
      label: "Correção Solicitada",
      value: 1,
      color: "#d97706",
      bg: "#fff7ed",
      icon: "edit",
    },
    {
      label: "Vencidos",
      value: 1,
      color: "#dc2626",
      bg: "#fee2e2",
      icon: "alert",
    },
  ];

  const progressItems = [
    {
      label: "Documentos da Empresa",
      done: 6,
      total: 8,
      color: "#16a34a",
    },
    {
      label: "Documentos dos Funcionários",
      done: 5,
      total: 8,
      color: "#d97706",
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Visão geral da sua documentação — Serviços e Logística SA"
      />

      <PageWrapper>
        {/* STATUS GERAL */}
        <div
          style={{
            background: "#fff",
            border: "2px solid #fbbf24",
            borderRadius: 12,
            padding: "18px 24px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fef9c3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              name="alert"
              size={24}
              color="#ca8a04"
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
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Status Geral
              </span>

              <StatusBadge status="pending" />
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Documentos pendentes precisam ser regularizados. O status{" "}
              <strong>APTO</strong> exige 100% dos documentos obrigatórios
              aprovados (RF01 / Regra de Negócio).
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => onNav("send-document")}
            >
              <Icon
                name="upload"
                size={15}
              />

              Enviar Documento
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => onNav("pendencies")}
            >
              <Icon
                name="alert"
                size={15}
              />

              Ver Pendências
            </button>
          </div>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div className="label">
                    {stat.label}
                  </div>

                  <div
                    className="value"
                    style={{
                      color: stat.color,
                      marginTop: 8,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name={stat.icon}
                    size={20}
                    color={stat.color}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DOCUMENTOS E PROGRESSO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {/* DOCUMENTOS RECENTES */}
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
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
                onClick={() => onNav("documents")}
              >
                Ver todos
              </button>
            </div>

            {documents.slice(0, 6).map((document) => (
              <div
                key={document.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name="doc"
                      size={16}
                      color="#6b7280"
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {document.name}
                    </div>

                    <div
                      style={{
                        fontSize: 11.5,
                        color: "#9ca3af",
                      }}
                    >
                      {document.person}
                    </div>
                  </div>
                </div>

                <StatusBadge status={document.status} />
              </div>
            ))}
          </div>

          {/* PROGRESSO DOCUMENTAL */}
          <div className="card">
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Progresso Documental
            </h3>

            {progressItems.map((progress) => (
              <div
                key={progress.label}
                style={{
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#374151",
                    }}
                  >
                    {progress.label}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {progress.done} / {progress.total}
                  </span>
                </div>

                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${
                        (progress.done / progress.total) * 100
                      }%`,
                      background: progress.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* CORREÇÃO SOLICITADA */}
            <div
              style={{
                background: "#fef9c3",
                borderRadius: 8,
                padding: 14,
                border: "1px solid #fde68a",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#92400e",
                  marginBottom: 8,
                }}
              >
                Correção Solicitada
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: "#78350f",
                }}
              >
                <strong>
                  Insalubridade / Periculosidade
                </strong>{" "}
                — João Ferreira
                <br />

                <span
                  style={{
                    color: "#92400e",
                  }}
                >
                  Motivo: Assinatura do médico responsável
                  ausente.
                </span>
              </div>

              <button
                className="btn btn-warning btn-sm"
                style={{
                  marginTop: 10,
                }}
                onClick={() => onNav("send-document")}
              >
                <Icon
                  name="upload"
                  size={13}
                />

                Corrigir agora
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}