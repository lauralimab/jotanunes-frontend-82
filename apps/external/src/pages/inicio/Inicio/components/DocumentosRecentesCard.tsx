import Icon from "../../../../shared/components/Icon";
import StatusBadge from "../../../../shared/components/StatusBadge";

export type DashboardDocument = {
  id: number;
  name: string;
  person: string;
  status: string;
};

type DocumentosRecentesCardProps = {
  documents: DashboardDocument[];
  onViewAll: () => void;
};

export default function DocumentosRecentesCard({
  documents,
  onViewAll,
}: DocumentosRecentesCardProps) {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Documentos Recentes
        </h3>

        <button
          className="btn btn-ghost btn-sm"
          onClick={onViewAll}
        >
          Ver todos
        </button>
      </div>

      {documents
        .slice(0, 6)
        .map((document) => (
          <div
            key={document.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="doc"
                  size={16}
                  color="#6b7280"
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {document.name}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color: "#9ca3af",
                  }}
                >
                  {document.person}
                </div>
              </div>
            </div>

            <StatusBadge
              status={document.status}
            />
          </div>
        ))}
    </div>
  );
}