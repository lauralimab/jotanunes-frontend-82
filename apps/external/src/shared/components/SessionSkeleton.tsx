
import Skeleton from "./Skeleton";

const cardStyle = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.07)",
  borderRadius: 14,
  padding: 22,
};

export default function SessionSkeleton() {
  return (
    <div
      role="status"
      aria-label="Verificando sessão"
      aria-busy="true"
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          minHeight: 85,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          gap: 20,
        }}
      >
        <div>
          <Skeleton
            width={190}
            height={24}
            borderRadius={6}
          />

          <div style={{ marginTop: 10 }}>
            <Skeleton
              width={260}
              height={12}
            />
          </div>
        </div>

        <Skeleton
          width={140}
          height={36}
          borderRadius={8}
        />
      </div>

      {/* Conteúdo */}
      <main
        style={{
          width: "100%",
          maxWidth: 1250,
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        <Skeleton
          width={200}
          height={22}
        />

        <div style={{ marginTop: 10 }}>
          <Skeleton
            width={310}
            height={13}
          />
        </div>

        {/* Cards do Dashboard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 18,
            marginTop: 28,
            marginBottom: 26,
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              style={cardStyle}
            >
              <Skeleton
                width="65%"
                height={13}
              />

              <div style={{ marginTop: 22 }}>
                <Skeleton
                  width="40%"
                  height={30}
                  borderRadius={6}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <Skeleton
                  width="80%"
                  height={11}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Área principal */}
        <div style={cardStyle}>
          <Skeleton
            width={230}
            height={19}
          />

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <Skeleton
              width={260}
              height={40}
              borderRadius={8}
            />

            <Skeleton
              width={150}
              height={40}
              borderRadius={8}
            />
          </div>

          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              style={{
                padding: "16px 0",
                borderTop:
                  "1px solid rgba(15,23,42,0.05)",
              }}
            >
              <Skeleton
                width="100%"
                height={20}
                borderRadius={6}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
