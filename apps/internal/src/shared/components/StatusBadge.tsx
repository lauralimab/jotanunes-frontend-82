import type { DocStatus, SupplierStatus } from "../types/portal";

export default function StatusBadge({ status }: { status: DocStatus | SupplierStatus | string }) {
  const map: Record<string, { cls: string; label: string; dot?: string }> = {
    approved:   { cls: "badge badge-success", label: "Aprovado",           dot: "#16a34a" },
    apt:        { cls: "badge badge-success", label: "Apto",               dot: "#16a34a" },
    pending:    { cls: "badge badge-warning", label: "Aguardando Análise", dot: "#ca8a04" },
    waiting:    { cls: "badge badge-gray",    label: "Aguardando Envio",   dot: "#6b7280" },
    expired:    { cls: "badge badge-danger",  label: "Vencido",            dot: "#dc2626" },
    rejected:   { cls: "badge badge-danger",  label: "Reprovado",          dot: "#dc2626" },
    correction: { cls: "badge badge-orange",  label: "Correção Solicitada",dot: "#d97706" },
    blocked:    { cls: "badge badge-danger",  label: "Bloqueado",          dot: "#dc2626" },
  };
  const cfg = map[status] ?? { cls: "badge badge-gray", label: status };
  return (
    <span className={cfg.cls}>
      {cfg.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0 }} />}
      {cfg.label}
    </span>
  );
}
