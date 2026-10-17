import Icon from "../../../../shared/components/Icon";

type PendenciasResumoProps = {
  total: number;
};

export default function PendenciasResumo({
  total,
}: PendenciasResumoProps) {
  return (
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
        <strong>
          {total} documentos
        </strong>{" "}
        com pendência. O status{" "}
        <strong>APTO</strong> exige 100%
        aprovados (Regra de Negócio).
      </span>
    </div>
  );
}