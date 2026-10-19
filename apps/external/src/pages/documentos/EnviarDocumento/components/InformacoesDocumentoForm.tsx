export default function InformacoesDocumentoForm() {
  return (
    <>
      <h3
        style={{
          margin: "0 0 20px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Informações do Documento
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Tipo de Documento *
          </label>

          <select
            className="select-base"
            style={{
              width: "100%",
            }}
          >
            <option>
              Selecionar tipo...
            </option>

            <option>
              Certidão Negativa Federal
            </option>

            <option>
              CNDT — Certidão de Débitos Trabalhistas
            </option>

            <option>
              Certidão Negativa FGTS
            </option>

            <option>
              Certidão Estadual
            </option>

            <option>
              Certidão Municipal
            </option>

            <option>
              Contrato Social
            </option>

            <option>
              ASO — Atestado de Saúde Ocupacional
            </option>

            <option>
              NR-35 — Trabalho em Altura
            </option>

            <option>
              Insalubridade / Periculosidade
            </option>
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Referente a *
          </label>

          <select
            className="select-base"
            style={{
              width: "100%",
            }}
          >
            <option>Empresa</option>
            <option>Carlos Souza</option>
            <option>Ana Lima</option>
            <option>João Ferreira</option>
            <option>Marcia Ramos</option>
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Data de Emissão
          </label>

          <input
            className="input-base"
            type="date"
            defaultValue="2026-09-01"
          />
        </div>

        <div>
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Data de Validade
          </label>

          <input
            className="input-base"
            type="date"
            defaultValue="2026-12-31"
          />
        </div>

        <div
          style={{
            gridColumn: "span 2",
          }}
        >
          <label
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Observações
          </label>

          <textarea
            className="input-base"
            rows={2}
            placeholder="Informações adicionais..."
            style={{
              resize: "vertical",
            }}
          />
        </div>
      </div>
    </>
  );
}