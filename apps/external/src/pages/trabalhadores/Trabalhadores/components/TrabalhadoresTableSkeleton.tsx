import Skeleton from "../../../../shared/components/Skeleton";

export default function TrabalhadoresTableSkeleton() {
  return (
    <div
      className="card"
      role="status"
      aria-label="Carregando funcionários"
      aria-busy="true"
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Skeleton width={280} height={40} borderRadius={8} />
        <Skeleton width={130} height={40} borderRadius={8} />
      </div>

      <table className="table-base">
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 5 }, (_, index) => (
            <tr key={index}>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Skeleton
                    width={32}
                    height={32}
                    borderRadius="50%"
                  />

                  <Skeleton width={140} height={14} />
                </div>
              </td>

              <td>
                <Skeleton width={120} height={14} />
              </td>

              <td>
                <Skeleton
                  width={68}
                  height={23}
                  borderRadius={999}
                />
              </td>

              <td>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <Skeleton width={55} height={28} borderRadius={6} />
                  <Skeleton width={58} height={28} borderRadius={6} />
                  <Skeleton width={70} height={28} borderRadius={6} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}