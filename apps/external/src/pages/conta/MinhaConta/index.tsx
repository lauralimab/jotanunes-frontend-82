import { useState } from "react";

import Header from "../../../shared/components/Header";

import Icon from "../../../shared/components/Icon";

import PageWrapper from "../../../shared/components/PageWrapper";

import StatusBadge from "../../../shared/components/StatusBadge";

import ProfileTabs, {

  type ProfileTabId,

} from "./components/ProfileTabs";

import ChangePasswordModal from "./components/ChangePasswordModal";

export default function MinhaContaPage() {

  const [editMode, setEditMode] = useState(false);

  const [activeTab, setActiveTab] =
    useState<ProfileTabId>("dados");

  const [showPassModal, setShowPassModal] =

    useState(false);

  const [passForm, setPassForm] = useState({

    atual: "",

    nova: "",

    confirmar: "",

  });

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({

    razao: "Serviços e Logística SA",

    fantasia: "Selog",

    cnpj: "98.765.432/0001-11",

    ie: "0987654321",

    im: "—",

    cnaePrincipal:

      "7490-1/04 — Atividades de intermediação e agenciamento de serviços",

    abertura: "14/03/2008",

    porte: "Médio porte",

    email: "contato@selog.com.br",

    emailSecundario: "nfe@selog.com.br",

    telefone: "(31) 3321-9900",

    celular: "(31) 99821-4400",

    site: "www.selog.com.br",

    cep: "30150-280",

    logradouro: "Rua Espírito Santo",

    numero: "1200",

    complemento: "Sala 801",

    bairro: "Centro",

    cidade: "Belo Horizonte",

    uf: "MG",

    responsavel: "Maria da Conceição Freitas",

    cpfResponsavel: "321.987.654-00",

    cargoResponsavel: "Diretora Administrativa",

    emailResponsavel: "maria@selog.com.br",

    telefoneResponsavel: "(31) 98812-3344",

    unidade: "Belo Horizonte",

    contrato: "CT-2024-0128",

    inicioContrato: "01/03/2024",

    fimContrato: "28/02/2026",

    emailLogin: "maria@selog.com",

  });

  function handleField(

    field: keyof typeof form,

    value: string,

  ) {

    setForm((current) => ({

      ...current,

      [field]: value,

    }));

  }

  function handleSave() {

    setSaved(true);

    setEditMode(false);

    setTimeout(() => {

      setSaved(false);

    }, 3000);

  }

  const historyLog = [

    {

      data: "12/09/2026 09:14",

      acao: "Atualização de e-mail de contato",

      user: "Maria Freitas",

    },

    {

      data: "05/09/2026 14:30",

      acao: "Alteração de senha de acesso",

      user: "Maria Freitas",

    },

    {

      data: "15/08/2026 11:05",

      acao: "Cadastro inicial do perfil",

      user: "Sistema",

    },

    {

      data: "01/08/2026 16:22",

      acao: "Aceite dos termos de uso",

      user: "Maria Freitas",

    },

  ];

  const Field = ({

    label,

    field,

    type = "text",

  }: {

    label: string;

    field: keyof typeof form;

    type?: string;

  }) => (

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

            handleField(

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

            borderBottom: "1px solid #f1f5f9",

            fontWeight: 500,

          }}

        >

          {form[field] || "—"}

        </div>

      )}

    </div>

  );

  return (

    <>

      <Header

        title="Meu Perfil"

        subtitle="Gerencie as informações cadastrais e de acesso da sua empresa"

        actions={

          activeTab === "dados" ? (

            editMode ? (

              <div

                style={{

                  display: "flex",

                  gap: 8,

                }}

              >

                <button

                  className="btn btn-ghost btn-sm"

                  onClick={() =>

                    setEditMode(false)

                  }

                >

                  Cancelar

                </button>

                <button

                  className="btn btn-primary btn-sm"

                  onClick={handleSave}

                >

                  <Icon

                    name="check"

                    size={14}

                  />

                  Salvar alterações

                </button>

              </div>

            ) : (

              <button

                className="btn btn-secondary btn-sm"

                onClick={() =>

                  setEditMode(true)

                }

              >

                <Icon

                  name="edit"

                  size={14}

                />

                Editar dados

              </button>

            )

          ) : null

        }

      />

      <PageWrapper>

        {saved && (

          <div

            style={{

              background: "#dcfce7",

              border: "1px solid #bbf7d0",

              borderRadius: 10,

              padding: "12px 18px",

              marginBottom: 20,

              display: "flex",

              alignItems: "center",

              gap: 10,

              fontSize: 13.5,

              color: "#166534",

              fontWeight: 500,

            }}

          >

            <Icon

              name="check"

              size={16}

              color="#16a34a"

            />

            Dados atualizados com sucesso.

          </div>

        )}

        <div

          style={{

            background: "#fff",

            borderRadius: 14,

            border: "1px solid #e5e7eb",

            padding: "24px 28px",

            marginBottom: 20,

            display: "flex",

            alignItems: "center",

            gap: 20,

          }}

        >

          <div

            style={{

              width: 68,

              height: 68,

              borderRadius: 18,

              background:

                "linear-gradient(135deg, #8b1220 0%, #c01a2b 100%)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 26,

              fontWeight: 800,

              color: "#fff",

              flexShrink: 0,

              letterSpacing: -1,

            }}

          >

            SL

          </div>

          <div style={{ flex: 1 }}>

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: 12,

                flexWrap: "wrap",

              }}

            >

              <h2

                style={{

                  margin: 0,

                  fontSize: 20,

                  fontWeight: 800,

                  color: "#0f172a",

                  fontFamily:

                    "'DM Sans', sans-serif",

                }}

              >

                {form.razao}

              </h2>

              <StatusBadge status="pending" />

            </div>

            <div

              style={{

                display: "flex",

                gap: 20,

                marginTop: 6,

                flexWrap: "wrap",

              }}

            >

              {[

                {

                  icon: "building",

                  value: form.cnpj,

                },

                {

                  icon: "mappin",

                  value: `${form.cidade} — ${form.uf}`,

                },

                {

                  icon: "calendar",

                  value: `Contrato ${form.contrato}`,

                },

                {

                  icon: "money",

                  value: form.unidade,

                },

              ].map(({ icon, value }) => (

                <span

                  key={value}

                  style={{

                    display: "flex",

                    alignItems: "center",

                    gap: 5,

                    fontSize: 12.5,

                    color: "#6b7280",

                  }}

                >

                  <Icon

                    name={icon}

                    size={13}

                    color="#9ca3af"

                  />

                  {value}

                </span>

              ))}

            </div>

          </div>

          <div

            style={{

              display: "flex",

              gap: 32,

              textAlign: "center",

              flexShrink: 0,

            }}

          >

            {[

              {

                value: "4",

                label: "Funcionários",

              },

              {

                value: "9",

                label: "Documentos",

              },

              {

                value: "3",

                label: "Pendentes",

              },

            ].map(({ value, label }) => (

              <div key={label}>

                <div

                  style={{

                    fontSize: 22,

                    fontWeight: 800,

                    color: "#c01a2b",

                    fontFamily:

                      "'DM Sans', sans-serif",

                  }}

                >

                  {value}

                </div>

                <div

                  style={{

                    fontSize: 11,

                    color: "#9ca3af",

                    marginTop: 2,

                  }}

                >

                  {label}

                </div>

              </div>

            ))}

          </div>

        </div>

        <ProfileTabs

          activeTab={activeTab}

          onChange={setActiveTab}

        />

        {activeTab === "dados" && (

          <div

            style={{

              display: "flex",

              flexDirection: "column",

              gap: 16,

            }}

          >

            <div className="card">

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

                Identificação da Empresa

              </h3>

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

                Contato

              </h3>

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

                Endereço

              </h3>

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

                Responsável Legal

              </h3>

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

        )}

        {activeTab === "acesso" && (

          <div

            style={{

              display: "flex",

              flexDirection: "column",

              gap: 16,

            }}

          >

            <div className="card">

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

                Credenciais de Acesso

              </h3>

              <div

                style={{

                  display: "grid",

                  gridTemplateColumns:

                    "repeat(auto-fit, minmax(260px, 1fr))",

                  gap: 20,

                  marginBottom: 20,

                }}

              >

                <div>

                  <label

                    style={{

                      fontSize: 11.5,

                      fontWeight: 600,

                      color: "#6b7280",

                      display: "block",

                      marginBottom: 5,

                      textTransform:

                        "uppercase",

                      letterSpacing:

                        "0.05em",

                    }}

                  >

                    E-mail de login

                  </label>

                  <div

                    style={{

                      display: "flex",

                      alignItems: "center",

                      gap: 10,

                    }}

                  >

                    <div

                      style={{

                        fontSize: 13.5,

                        color: "#0f172a",

                        fontWeight: 600,

                      }}

                    >

                      {form.emailLogin}

                    </div>

                    <span

                      style={{

                        fontSize: 11,

                        background: "#dcfce7",

                        color: "#16a34a",

                        padding: "2px 8px",

                        borderRadius: 20,

                        fontWeight: 600,

                      }}

                    >

                      Verificado

                    </span>

                  </div>

                </div>

                <div>

                  <label

                    style={{

                      fontSize: 11.5,

                      fontWeight: 600,

                      color: "#6b7280",

                      display: "block",

                      marginBottom: 5,

                      textTransform:

                        "uppercase",

                      letterSpacing:

                        "0.05em",

                    }}

                  >

                    Último acesso

                  </label>

                  <div

                    style={{

                      fontSize: 13.5,

                      color: "#0f172a",

                      fontWeight: 500,

                    }}

                  >

                    12/09/2026 às 09:14

                  </div>

                </div>

              </div>

              <div

                style={{

                  background: "#f8fafc",

                  borderRadius: 10,

                  padding: "16px 18px",

                  border:

                    "1px solid #e5e7eb",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:

                    "space-between",

                }}

              >

                <div

                  style={{

                    display: "flex",

                    alignItems: "center",

                    gap: 14,

                  }}

                >

                  <div

                    style={{

                      width: 40,

                      height: 40,

                      borderRadius: 10,

                      background: "#fde8ea",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                    }}

                  >

                    <Icon

                      name="shield"

                      size={20}

                      color="#c01a2b"

                    />

                  </div>

                  <div>

                    <div

                      style={{

                        fontSize: 13.5,

                        fontWeight: 700,

                        color: "#0f172a",

                      }}

                    >

                      Senha de acesso

                    </div>

                    <div

                      style={{

                        fontSize: 12,

                        color: "#6b7280",

                        marginTop: 2,

                      }}

                    >

                      Última alteração:

                      05/09/2026

                    </div>

                  </div>

                </div>

                <button

                  className="btn btn-secondary btn-sm"

                  onClick={() =>

                    setShowPassModal(true)

                  }

                >

                  <Icon

                    name="edit"

                    size={14}

                  />

                  Alterar senha

                </button>

              </div>

            </div>

            <div className="card">

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

                Preferências de Notificação

              </h3>

              {[

                {

                  label:

                    "E-mail ao receber aprovação/reprovação de documentos",

                  checked: true,

                },

                {

                  label:

                    "E-mail 30 dias antes do vencimento de documentos",

                  checked: true,

                },

                {

                  label:

                    "E-mail 7 dias antes do vencimento de documentos",

                  checked: true,

                },

                {

                  label:

                    "E-mail de alerta de boletim de pagamento pendente",

                  checked: false,

                },

                {

                  label:

                    "Notificações no portal sobre correções solicitadas",

                  checked: true,

                },

              ].map(

                (preference, index) => (

                  <div

                    key={index}

                    style={{

                      display: "flex",

                      alignItems: "center",

                      justifyContent:

                        "space-between",

                      padding: "11px 0",

                      borderBottom:

                        index < 4

                          ? "1px solid #f3f4f6"

                          : "none",

                    }}

                  >

                    <span

                      style={{

                        fontSize: 13.5,

                        color: "#374151",

                      }}

                    >

                      {preference.label}

                    </span>

                    <div

                      style={{

                        width: 40,

                        height: 22,

                        borderRadius: 11,

                        background:

                          preference.checked

                            ? "#c01a2b"

                            : "#d1d5db",

                        position:

                          "relative",

                        cursor: "pointer",

                        flexShrink: 0,

                      }}

                    >

                      <div

                        style={{

                          width: 18,

                          height: 18,

                          borderRadius:

                            "50%",

                          background: "#fff",

                          position:

                            "absolute",

                          top: 2,

                          left: preference.checked

                            ? 20

                            : 2,

                          transition:

                            "left 0.18s",

                          boxShadow:

                            "0 1px 3px rgba(0,0,0,0.2)",

                        }}

                      />

                    </div>

                  </div>

                ),

              )}

            </div>

            <div

              style={{

                background: "#fffbeb",

                border: "1px solid #fcd34d",

                borderRadius: 10,

                padding: "14px 18px",

                display: "flex",

                gap: 12,

                alignItems: "flex-start",

              }}

            >

              <Icon

                name="alert"

                size={18}

                color="#d97706"

              />

              <div

                style={{

                  fontSize: 13,

                  color: "#92400e",

                  lineHeight: 1.6,

                }}

              >

                <strong>

                  Atenção (RNF01):

                </strong>{" "}

                Suas credenciais são pessoais e

                intransferíveis. O acesso ao

                sistema é monitorado conforme

                política de segurança da

                Jotanunes. Em caso de suspeita

                de acesso indevido, entre em

                contato imediatamente com{" "}

                <strong>

                  ti@jotanunes.com.br

                </strong>

                .

              </div>

            </div>

          </div>

        )}

        {activeTab === "historico" && (

          <div className="card">

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

              Histórico de Alterações do Perfil

            </h3>

            <table

              style={{

                width: "100%",

                borderCollapse: "collapse",

              }}

            >

              <thead>

                <tr

                  style={{

                    borderBottom:

                      "2px solid #f1f5f9",

                  }}

                >

                  {[

                    "Data / Hora",

                    "Ação realizada",

                    "Usuário",

                  ].map((heading) => (

                    <th

                      key={heading}

                      style={{

                        textAlign: "left",

                        fontSize: 11.5,

                        fontWeight: 700,

                        color: "#6b7280",

                        padding:

                          "0 12px 12px",

                        textTransform:

                          "uppercase",

                        letterSpacing:

                          "0.05em",

                      }}

                    >

                      {heading}

                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {historyLog.map(

                  (record, index) => (

                    <tr

                      key={index}

                      style={{

                        borderBottom:

                          "1px solid #f3f4f6",

                      }}

                    >

                      <td

                        style={{

                          padding: "12px",

                          fontSize: 13,

                          color: "#6b7280",

                          fontFamily:

                            "monospace",

                          whiteSpace:

                            "nowrap",

                        }}

                      >

                        {record.data}

                      </td>

                      <td

                        style={{

                          padding: "12px",

                          fontSize: 13.5,

                          color: "#0f172a",

                          fontWeight: 500,

                        }}

                      >

                        {record.acao}

                      </td>

                      <td

                        style={{

                          padding: "12px",

                        }}

                      >

                        <div

                          style={{

                            display: "flex",

                            alignItems:

                              "center",

                            gap: 8,

                          }}

                        >

                          <div

                            style={{

                              width: 26,

                              height: 26,

                              borderRadius:

                                "50%",

                              background:

                                record.user ===

                                "Sistema"

                                  ? "#f1f5f9"

                                  : "#fde8ea",

                              display: "flex",

                              alignItems:

                                "center",

                              justifyContent:

                                "center",

                              fontSize: 10,

                              fontWeight: 700,

                              color:

                                record.user ===

                                "Sistema"

                                  ? "#6b7280"

                                  : "#c01a2b",

                            }}

                          >

                            {record.user ===

                            "Sistema"

                              ? "S"

                              : record.user

                                  .split(" ")

                                  .map(

                                    (word) =>

                                      word[0],

                                  )

                                  .slice(0, 2)

                                  .join("")}

                          </div>

                          <span

                            style={{

                              fontSize: 13,

                              color: "#374151",

                            }}

                          >

                            {record.user}

                          </span>

                        </div>

                      </td>

                    </tr>

                  ),

                )}

              </tbody>

            </table>

          </div>

        )}

      </PageWrapper>

      {showPassModal && (

  <ChangePasswordModal

          values={passForm}

          onChange={(field, value) =>

      setPassForm((current) => ({

        ...current,

        [field]: value,

      }))

    }

          onClose={() =>

      setShowPassModal(false)

    }

          onSave={() => {

      setShowPassModal(false);

      setSaved(true);

      setTimeout(() => {

        setSaved(false);

      }, 3000);

    }}

  />

)}
    </>
  );
}
