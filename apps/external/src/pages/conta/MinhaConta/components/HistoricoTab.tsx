const historyLog = [
  {
    data: "12/09/2026 09:14",
    acao: "Atualização de e-mail de contato",
    user: "Maria Freitas",
  },
  {
    data: "05/09/2026 14:30",
    acao: "Alteração de senha de acesso",
    user: "Maria Freitas",
  },
  {
    data: "15/08/2026 11:05",
    acao: "Cadastro inicial do perfil",
    user: "Sistema",
  },
  {
    data: "01/08/2026 16:22",
    acao: "Aceite dos termos de uso",
    user: "Maria Freitas",
  },
];

export default function HistoricoTab() {
  return (
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

        Histórico de Alterações do Perfil
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom:
                "2px solid #f1f5f9",
            }}
          >
            {[
              "Data / Hora",
              "Ação realizada",
              "Usuário",
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  textAlign: "left",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#6b7280",
                  padding: "0 12px 12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {historyLog.map(
            (record, index) => (
              <tr
                key={index}
                style={{
                  borderBottom:
                    "1px solid #f3f4f6",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#6b7280",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.data}
                </td>

                <td
                  style={{
                    padding: "12px",
                    fontSize: 13.5,
                    color: "#0f172a",
                    fontWeight: 500,
                  }}
                >
                  {record.acao}
                </td>

                <td
                  style={{
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background:
                          record.user ===
                          "Sistema"
                            ? "#f1f5f9"
                            : "#fde8ea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color:
                          record.user ===
                          "Sistema"
                            ? "#6b7280"
                            : "#c01a2b",
                      }}
                    >
                      {record.user ===
                      "Sistema"
                        ? "S"
                        : record.user
                            .split(" ")
                            .map(
                              (word) =>
                                word[0],
                            )
                            .slice(0, 2)
                            .join("")}
                    </div>

                    <span
                      style={{
                        fontSize: 13,
                        color: "#374151",
                      }}
                    >
                      {record.user}
                    </span>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}