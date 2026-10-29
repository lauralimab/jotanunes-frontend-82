export type Screen =
  | "login"
  | "admin-dashboard" | "admin-suppliers" | "supplier-details"
  | "worksites" | "document-types"
  | "document-analysis" | "expirations" | "notifications" | "history"
  | "boletim" | "autorizacao-excepcional" | "recebimento-material";

export type DocStatus = "approved" | "pending" | "expired" | "waiting" | "rejected" | "correction";

export type SupplierStatus = "apt" | "pending" | "blocked";
