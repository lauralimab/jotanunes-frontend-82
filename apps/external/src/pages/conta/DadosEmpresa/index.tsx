import { useState } from "react";

import Header from "../../../shared/components/Header";
import PageWrapper from "../../../shared/components/PageWrapper";

export default function DadosEmpresaPage() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <Header
        title="Dados da Empresa"
        subtitle="Cadastro e atualização das informações do fornecedor"
      />

      <PageWrapper>
        <div className="card">
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Informações Cadastrais
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                label: "Razão Social *",
                val: "Serviços e Logística SA",
                full: true,
              },
              {
                label: "Nome Fantasia",
                val: "SeLog",
              },
              {
                label: "CNPJ *",
                val: "98.765.432/0001-11",
              },
              {
                label: "Inscrição Estadual",
                val: "123.456.789.000",
              },
              {
                label: "Endereço *",
                val: "Av. Contorno, 1245",
                full: true,
              },
              {
                label: "Bairro",
                val: "Funcionários",
              },
              {
                label: "Cidade *",
                val: "Belo Horizonte",
              },
              {
                label: "Estado",
                val: "MG",
              },
              {
                label: "CEP",
                val: "30110-080",
              },
              {
                label: "Telefone *",
                val: "(31) 3333-4444",
              },
              {
                label: "E-mail Corporativo *",
                val: "contato@selog.com",
              },
              {
                label: "E-mail do Responsável *",
                val: "maria@selog.com",
              },
              {
                label: "Responsável Legal *",
                val: "Maria Aparecida Silva",
                full: true,
              },
              {
                label: "CPF do Responsável *",
                val: "987.654.321-00",
              },
            ].map((field) => (
              <div
                key={field.label}
                style={{
                  gridColumn: field.full
                    ? "span 2"
                    : "span 1",
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
                  {field.label}
                </label>

                <input
                  className="input-base"
                  defaultValue={field.val}
                />
              </div>
            ))}
          </div>

          {saved && (
            <div
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: "#dcfce7",
                borderRadius: 8,
                color: "#15803d",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✓ Dados salvos com sucesso!
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
              gap: 10,
            }}
          >
            <button className="btn btn-secondary">
              Cancelar
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setSaved(true)}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}