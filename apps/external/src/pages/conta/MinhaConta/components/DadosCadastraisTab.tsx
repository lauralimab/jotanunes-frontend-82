import { createContext, useContext } from "react";

type AccountForm = {
    razao: string;
    fantasia: string;
    cnpj: string;
    ie: string;
    im: string;
    cnaePrincipal: string;
    abertura: string;
    porte: string;
    email: string;
    emailSecundario: string;
    telefone: string;
    celular: string;
    site: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    responsavel: string;
    cpfResponsavel: string;
    cargoResponsavel: string;
    emailResponsavel: string;
    telefoneResponsavel: string;
    unidade: string;
    contrato: string;
    inicioContrato: string;
    fimContrato: string;
    emailLogin: string;
};

export type { AccountForm };

type DadosCadastraisTabProps = {
    form: AccountForm;
    editMode: boolean;
    onFieldChange: (
        field: keyof AccountForm,
        value: string,
    ) => void;
};

type FieldProps = {
    label: string;
    field: keyof AccountForm;
    type?: string;
};

type FieldContextValue = {
    form: AccountForm;
    editMode: boolean;
    onFieldChange: (
        field: keyof AccountForm,
        value: string,
    ) => void;
};

const FieldContext =
    createContext<FieldContextValue>({
        form: {} as AccountForm,
        editMode: false,
        onFieldChange: () => {},
    });

function Field({
    label,
    field,
    type = "text",
}: FieldProps) {
    const { form, editMode, onFieldChange } =
        useContext(FieldContext);

    return (
        <div>
            <label
                style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}
            >
                {label}
            </label>

            {editMode ? (
                <input
                    className="input-base"
                    type={type}
                    value={form[field]}
                    onChange={(event) =>
                        onFieldChange(
                            field,
                            event.target.value,
                        )
                    }
                    style={{
                        fontSize: 13.5,
                    }}
                />
            ) : (
                <div
                    style={{
                        fontSize: 13.5,
                        color: "#0f172a",
                        padding: "8px 0",
                        borderBottom:
                            "1px solid #f1f5f9",
                        fontWeight: 500,
                    }}
                >
                    {form[field] || "—"}
                </div>
            )}
        </div>
    );
}

function SectionTitle({
    children,
}: {
    children: string;
}) {
    return (
        <h3
            style={{
                margin: "0 0 18px",
                fontSize: 13.5,
                fontWeight: 700,
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
        >
            <span
                style={{
                    width: 4,
                    height: 16,
                    background: "#c01a2b",
                    borderRadius: 2,
                    display: "inline-block",
                }}
            />

            {children}
        </h3>
    );
}

export default function DadosCadastraisTab({
    form,
    editMode,
    onFieldChange,
}: DadosCadastraisTabProps) {
    return (
        <FieldContext.Provider
            value={{ form, editMode, onFieldChange }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div className="card">
                    <SectionTitle>
                        Identificação da Empresa
                    </SectionTitle>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "14px 20px",
                        }}
                    >
                        <div
                            style={{
                                gridColumn: "span 2",
                            }}
                        >
                            <Field
                                label="Razão Social"
                                field="razao"
                            />
                        </div>

                        <Field
                            label="Nome Fantasia"
                            field="fantasia"
                        />

                        <Field
                            label="CNPJ"
                            field="cnpj"
                        />

                        <Field
                            label="Inscrição Estadual"
                            field="ie"
                        />

                        <Field
                            label="Inscrição Municipal"
                            field="im"
                        />

                        <div
                            style={{
                                gridColumn: "span 2",
                            }}
                        >
                            <Field
                                label="CNAE Principal"
                                field="cnaePrincipal"
                            />
                        </div>

                        <Field
                            label="Porte"
                            field="porte"
                        />

                        <Field
                            label="Data de Abertura"
                            field="abertura"
                        />

                        <Field
                            label="Unidade Jotanunes"
                            field="unidade"
                        />

                        <Field
                            label="Contrato"
                            field="contrato"
                        />

                        <Field
                            label="Início do Contrato"
                            field="inicioContrato"
                        />

                        <Field
                            label="Fim do Contrato"
                            field="fimContrato"
                        />
                    </div>
                </div>

                <div className="card">
                    <SectionTitle>
                        Contato
                    </SectionTitle>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "14px 20px",
                        }}
                    >
                        <div
                            style={{
                                gridColumn: "span 2",
                            }}
                        >
                            <Field
                                label="E-mail Principal"
                                field="email"
                                type="email"
                            />
                        </div>

                        <Field
                            label="E-mail NF-e"
                            field="emailSecundario"
                            type="email"
                        />

                        <Field
                            label="Telefone"
                            field="telefone"
                        />

                        <Field
                            label="Celular / WhatsApp"
                            field="celular"
                        />

                        <Field
                            label="Site"
                            field="site"
                        />
                    </div>
                </div>

                <div className="card">
                    <SectionTitle>
                        Endereço
                    </SectionTitle>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "14px 20px",
                        }}
                    >
                        <Field
                            label="CEP"
                            field="cep"
                        />

                        <div
                            style={{
                                gridColumn: "span 2",
                            }}
                        >
                            <Field
                                label="Logradouro"
                                field="logradouro"
                            />
                        </div>

                        <Field
                            label="Número"
                            field="numero"
                        />

                        <Field
                            label="Complemento"
                            field="complemento"
                        />

                        <Field
                            label="Bairro"
                            field="bairro"
                        />

                        <Field
                            label="Cidade"
                            field="cidade"
                        />

                        <Field
                            label="UF"
                            field="uf"
                        />
                    </div>
                </div>

                <div className="card">
                    <SectionTitle>
                        Responsável Legal
                    </SectionTitle>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "14px 20px",
                        }}
                    >
                        <div
                            style={{
                                gridColumn: "span 2",
                            }}
                        >
                            <Field
                                label="Nome Completo"
                                field="responsavel"
                            />
                        </div>

                        <Field
                            label="CPF"
                            field="cpfResponsavel"
                        />

                        <Field
                            label="Cargo"
                            field="cargoResponsavel"
                        />

                        <Field
                            label="E-mail"
                            field="emailResponsavel"
                            type="email"
                        />

                        <Field
                            label="Telefone"
                            field="telefoneResponsavel"
                        />
                    </div>
                </div>
            </div>
        </FieldContext.Provider>
    );
}
