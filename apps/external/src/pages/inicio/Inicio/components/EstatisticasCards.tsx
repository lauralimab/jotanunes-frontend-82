import Icon from "../../../../shared/components/Icon";

type Props = {
  approved: number;
  waiting: number;
  pending: number;
  problems: number;
};

export default function EstatisticasCards({
  approved,
  waiting,
  pending,
  problems,
}: Props) {
  const stats = [
    {
      label: "Aprovados",
      value: approved,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: "check",
    },
    {
      label: "Aguardando Envio",
      value: waiting,
      color: "#475569",
      bg: "#f1f5f9",
      icon: "upload",
    },
    {
      label: "Em Análise",
      value: pending,
      color: "#ca8a04",
      bg: "#fef9c3",
      icon: "clock",
    },
    {
      label:
        "Rejeitados / Vencidos",
      value: problems,
      color: "#dc2626",
      bg: "#fee2e2",
      icon: "alert",
    },
  ];

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
      {stats.map(
        (stat) => (
          <div
            key={
              stat.label
            }
            className="stat-card"
          >
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "flex-start",
              }}
            >
              <div>
                <div className="label">
                  {
                    stat.label
                  }
                </div>

                <div
                  className="value"
                  style={{
                    color:
                      stat.color,

                    marginTop: 8,
                  }}
                >
                  {
                    stat.value
                  }
                </div>
              </div>

              <div
                style={{
                  width: 40,
                  height: 40,

                  borderRadius: 10,

                  background:
                    stat.bg,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <Icon
                  name={
                    stat.icon
                  }
                  size={20}
                  color={
                    stat.color
                  }
                />
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}