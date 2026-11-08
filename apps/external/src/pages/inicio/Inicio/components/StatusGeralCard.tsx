import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

type Props = {
  isApt: boolean;

  activeRequests: number;

  unresolved: number;

  onViewPendencies:
    () => void;
};

export default function StatusGeralCard({
  isApt,
  activeRequests,
  unresolved,
  onViewPendencies,
}: Props) {
  const hasRequests =
    activeRequests > 0;

  const borderColor =
    !hasRequests
      ? "#cbd5e1"
      : isApt
        ? "#86efac"
        : "#fbbf24";

  const iconBackground =
    !hasRequests
      ? "#f1f5f9"
      : isApt
        ? "#dcfce7"
        : "#fef9c3";

  const iconColor =
    !hasRequests
      ? "#475569"
      : isApt
        ? "#16a34a"
        : "#ca8a04";

  return (
    <div
      style={{
        background: "#fff",

        border:
          `2px solid ${borderColor}`,

        borderRadius: 12,

        padding:
          "18px 24px",

        marginBottom: 24,

        display: "flex",

        alignItems:
          "center",

        gap: 16,

        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,

          borderRadius:
            "50%",

          background:
            iconBackground,

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          flexShrink: 0,
        }}
      >
        <Icon
          name={
            isApt
              ? "check"
              : "alert"
          }
          size={24}
          color={
            iconColor
          }
        />
      </div>

      <div
        style={{
          flex: 1,

          minWidth: 240,
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: 10,

            marginBottom: 4,

            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily:
                "'DM Sans', sans-serif",

              fontSize: 15,

              fontWeight: 700,

              color:
                "#0f172a",
            }}
          >
            Status Geral
          </span>

          {hasRequests && (
            <StatusBadge
              status={
                isApt
                  ? "apt"
                  : "pending"
              }
            />
          )}
        </div>

        <p
          style={{
            margin: 0,

            fontSize: 13,

            color:
              "#475569",
          }}
        >
          {!hasRequests
            ? "Nenhuma solicitação de fornecimento ativa no momento."
            : isApt
              ? "Todos os documentos exigidos nas solicitações ativas estão aprovados."
              : `${unresolved} item(ns) documental(is) ainda precisam de acompanhamento para atingir a regularidade completa.`}
        </p>
      </div>

      {hasRequests && (
        <button
          className="btn btn-secondary"
          onClick={
            onViewPendencies
          }
        >
          <Icon
            name="alert"
            size={15}
          />

          Ver Pendências
        </button>
      )}
    </div>
  );
}