import Icon from "../../../../shared/components/Icon";

type AcessoSegurancaTabProps = {
  emailLogin: string;
  onChangePassword: () => void;
};

const notificationPreferences = [
  {
    label:
      "E-mail ao receber aprovação/reprovação de documentos",
    checked: true,
  },
  {
    label:
      "E-mail 30 dias antes do vencimento de documentos",
    checked: true,
  },
  {
    label:
      "E-mail 7 dias antes do vencimento de documentos",
    checked: true,
  },
  {
    label:
      "E-mail de alerta de boletim de pagamento pendente",
    checked: false,
  },
  {
    label:
      "Notificações no portal sobre correções solicitadas",
    checked: true,
  },
];

export default function AcessoSegurancaTab({
  emailLogin,
  onChangePassword,
}: AcessoSegurancaTabProps) {
  return (
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
            margin: "0 0 18px",
            fontSize: 13.5,
            fontWeight: 700,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 4,
              height: 16,
              background: "#c01a2b",
              borderRadius: 2,
              display: "inline-block",
            }}
          />

          Credenciais de Acesso
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "#6b7280",
                display: "block",
                marginBottom: 5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              E-mail de login
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 13.5,
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                {emailLogin}
              </div>

              <span
                style={{
                  fontSize: 11,
                  background: "#dcfce7",
                  color: "#16a34a",
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                Verificado
              </span>
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "#6b7280",
                display: "block",
                marginBottom: 5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Último acesso
            </label>

            <div
              style={{
                fontSize: 13.5,
                color: "#0f172a",
                fontWeight: 500,
              }}
            >
              12/09/2026 às 09:14
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "16px 18px",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#fde8ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name="shield"
                size={20}
                color="#c01a2b"
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Senha de acesso
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 2,
                }}
              >
                Última alteração: 05/09/2026
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onChangePassword}
          >
            <Icon
              name="edit"
              size={14}
            />
            Alterar senha
          </button>
        </div>
      </div>

      <div className="card">
        <h3
          style={{
            margin: "0 0 18px",
            fontSize: 13.5,
            fontWeight: 700,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 4,
              height: 16,
              background: "#c01a2b",
              borderRadius: 2,
              display: "inline-block",
            }}
          />

          Preferências de Notificação
        </h3>

        {notificationPreferences.map(
          (preference, index) => (
            <div
              key={preference.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 0",
                borderBottom:
                  index <
                  notificationPreferences.length - 1
                    ? "1px solid #f3f4f6"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: 13.5,
                  color: "#374151",
                }}
              >
                {preference.label}
              </span>

              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: preference.checked
                    ? "#c01a2b"
                    : "#d1d5db",
                  position: "relative",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 2,
                    left: preference.checked
                      ? 20
                      : 2,
                    transition: "left 0.18s",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          background: "#fffbeb",
          border: "1px solid #fcd34d",
          borderRadius: 10,
          padding: "14px 18px",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <Icon
          name="alert"
          size={18}
          color="#d97706"
        />

        <div
          style={{
            fontSize: 13,
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          <strong>
            Atenção (RNF01):
          </strong>{" "}
          Suas credenciais são pessoais e
          intransferíveis. O acesso ao sistema é
          monitorado conforme política de segurança
          da Jotanunes. Em caso de suspeita de acesso
          indevido, entre em contato imediatamente
          com{" "}
          <strong>
            ti@jotanunes.com.br
          </strong>
          .
        </div>
      </div>
    </div>
  );
}