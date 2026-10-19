import Icon from "../../../../shared/components/Icon";

type ProgressoDocumentalCardProps = {
  onCorrectDocument: () => void;
};

const progressItems = [
  {
    label: "Documentos da Empresa",
    done: 6,
    total: 8,
    color: "#16a34a",
  },
  {
    label: "Documentos dos Funcionários",
    done: 5,
    total: 8,
    color: "#d97706",
  },
];

export default function ProgressoDocumentalCard({
  onCorrectDocument,
}: ProgressoDocumentalCardProps) {
  return (
    <div className="card">
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Progresso Documental
      </h3>

      {progressItems.map((progress) => (
        <div
          key={progress.label}
          style={{
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#374151",
              }}
            >
              {progress.label}
            </span>

            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {progress.done} /{" "}
              {progress.total}
            </span>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  (progress.done /
                    progress.total) *
                  100
                }%`,
                background:
                  progress.color,
              }}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          background: "#fef9c3",
          borderRadius: 8,
          padding: 14,
          border: "1px solid #fde68a",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#92400e",
            marginBottom: 8,
          }}
        >
          Correção Solicitada
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: "#78350f",
          }}
        >
          <strong>
            Insalubridade /
            Periculosidade
          </strong>{" "}
          — João Ferreira
          <br />

          <span
            style={{
              color: "#92400e",
            }}
          >
            Motivo: Assinatura do médico
            responsável ausente.
          </span>
        </div>

        <button
          className="btn btn-warning btn-sm"
          style={{
            marginTop: 10,
          }}
          onClick={onCorrectDocument}
        >
          <Icon
            name="upload"
            size={13}
          />

          Corrigir agora
        </button>
      </div>
    </div>
  );
}