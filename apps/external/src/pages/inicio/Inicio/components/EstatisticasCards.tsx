import Icon from "../../../../shared/components/Icon";

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

export default function EstatisticasCards() {
  return (
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
              justifyContent:
                "space-between",
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
                justifyContent:
                  "center",
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
  );
}