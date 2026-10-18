export default function RFStatusBadge({ status }: { status: string }) {
  if (status === "definido")  return <span className="badge badge-success">✅ Definido</span>;
  if (status === "parcial")   return <span className="badge badge-warning">🟡 Parcialmente definido</span>;
  return <span className="badge badge-gray">🔵 Validar com cliente</span>;
}
