import Icon from "../../../../shared/components/Icon";

type Props = {
  companyDone: number;
  companyTotal: number;

  workerDone: number;
  workerTotal: number;

  problemCount: number;

  onViewPendencies: () => void;
};

function percentage(
  done: number,
  total: number,
) {
  if (total === 0) {
    return 0;
  }

  return Math.round(
    (done / total) * 100,
  );
}

export default function ProgressoDocumentalCard({
  companyDone,
  companyTotal,
  workerDone,
  workerTotal,
  problemCount,
  onViewPendencies,
}: Props) {
  const progressItems = [
    {
      label:
        "Documentos da Empresa",

      done:
        companyDone,

      total:
        companyTotal,
    },
    {
      label:
        "Documentos dos Funcionários",

      done:
        workerDone,

      total:
        workerTotal,
    },
  ];

  return (
    <div className="card">
      <h3
        style={{
          margin:
            "0 0 16px",

          fontSize: 14,

          fontWeight: 700,
        }}
      >
        Progresso Documental
      </h3>

      {progressItems.map(
        (progress) => {
          const notApplicable =
            progress.total === 0;

          const value =
            notApplicable
              ? 0
              : percentage(
                  progress.done,
                  progress.total,
                );

          return (
            <div
              key={
                progress.label
              }
              style={{
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  marginBottom: 6,

                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 13,

                    color:
                      "#374151",
                  }}
                >
                  {
                    progress.label
                  }
                </span>

                <span
                  style={{
                    fontSize: 13,

                    fontWeight:
                      600,

                    color:
                      notApplicable
                        ? "#64748b"
                        : "#111827",
                  }}
                >
                  {notApplicable
                    ? "Não se aplica"
                    : `${progress.done} / ${progress.total}`}
                </span>
              </div>

              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width:
                      notApplicable
                        ? "0%"
                        : `${value}%`,

                    background:
                      value === 100 &&
                      !notApplicable
                        ? "#16a34a"
                        : "#c01a2b",
                  }}
                />
              </div>
            </div>
          );
        },
      )}

      {problemCount > 0 ? (
        <div
          style={{
            background:
              "#fef2f2",

            borderRadius: 8,

            padding: 14,

            border:
              "1px solid #fecaca",
          }}
        >
          <div
            style={{
              fontSize: 12,

              fontWeight: 700,

              color:
                "#b91c1c",

              marginBottom: 6,
            }}
          >
            Correção necessária
          </div>

          <div
            style={{
              fontSize: 12.5,

              color:
                "#7f1d1d",
            }}
          >
            {problemCount}{" "}
            documento(s)
            rejeitado(s) ou
            vencido(s) precisam
            de regularização.
          </div>

          <button
            className="btn btn-danger btn-sm"
            style={{
              marginTop: 10,
            }}
            onClick={
              onViewPendencies
            }
          >
            <Icon
              name="alert"
              size={13}
            />

            Ver pendências
          </button>
        </div>
      ) : (
        <div
          style={{
            background:
              "#f0fdf4",

            borderRadius: 8,

            padding: 14,

            border:
              "1px solid #bbf7d0",

            color:
              "#15803d",

            fontSize: 12.5,

            display:
              "flex",

            alignItems:
              "center",

            gap: 8,
          }}
        >
          <Icon
            name="check"
            size={15}
          />

          Nenhum documento rejeitado ou vencido.
        </div>
      )}
    </div>
  );
}