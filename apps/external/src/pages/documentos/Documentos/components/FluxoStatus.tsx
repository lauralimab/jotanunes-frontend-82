const statusFlow = [
  ["Aguardando Envio", "#6b7280"],
  ["→", "#9ca3af"],
  ["Aguardando Análise", "#ca8a04"],
  ["→", "#9ca3af"],
  ["Aprovado", "#16a34a"],
  ["/", "#9ca3af"],
  ["Reprovado", "#dc2626"],
  ["/", "#9ca3af"],
  ["Correção Solicitada", "#d97706"],
  ["→", "#9ca3af"],
  ["Vencido", "#dc2626"],
];

export default function FluxoStatus() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
        padding: "10px 16px",
        background: "#f8fafc",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 11.5,
          color: "#6b7280",
          fontWeight: 600,
        }}
      >
        Fluxo de status:
      </span>

      {statusFlow.map(
        ([label, color], index) => (
          <span
            key={index}
            style={{
              fontSize: 11.5,
              color,
              fontWeight:
                label === "→" ||
                label === "/"
                  ? 400
                  : 600,
            }}
          >
            {label}
          </span>
        ),
      )}
    </div>
  );
}