import Skeleton from "../../../../shared/components/Skeleton";
import type { Screen } from "../../../../shared/types/portal";
import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";
import { MOCK_DOCUMENTS } from "../../../../shared/mocks/portal";



export default function DocumentosRecentesCard({ onNav, loading = false }: { onNav: (screen: Screen) => void; loading?: boolean }) {
  return (
<div className="card" aria-busy={loading} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}><Skeleton loading={loading}>Documentos Aguardando Análise</Skeleton></h3>
              <Skeleton loading={loading} borderRadius={8}><button className="btn btn-ghost btn-sm" disabled={loading} onClick={() => onNav("admin-suppliers")}>Ver todos</button></Skeleton>
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table-base">
              <thead><tr><th><Skeleton loading={loading}>Documento</Skeleton></th><th><Skeleton loading={loading}>Fornecedor</Skeleton></th><th><Skeleton loading={loading}>Status</Skeleton></th><th><Skeleton loading={loading}>Ação</Skeleton></th></tr></thead>
              <tbody>
                {MOCK_DOCUMENTS.filter(d => ["pending","correction"].includes(d.status)).map(d => (
                  <tr key={d.id}>
                    <td><div style={{ fontSize: 13, fontWeight: 600 }}><Skeleton loading={loading}>{d.name}</Skeleton></div><div style={{ fontSize: 11.5, color: "#9ca3af" }}><Skeleton loading={loading}>{d.uploadedAt}</Skeleton></div></td>
                    <td style={{ fontSize: 13 }}><Skeleton loading={loading}>{d.person}</Skeleton></td>
                    <td><Skeleton loading={loading} borderRadius={999}><StatusBadge status={d.status} /></Skeleton></td>
                    <td><Skeleton loading={loading} borderRadius={8}><button className="btn btn-primary btn-sm" disabled={loading} onClick={() => onNav("document-analysis")}><Icon name="eye" size={13} />Analisar</button></Skeleton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
  );
}
