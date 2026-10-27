import { useState } from "react";

import Header from "../../../shared/components/Header";

import Icon from "../../../shared/components/Icon";

import PageWrapper from "../../../shared/components/PageWrapper";

import StatusBadge from "../../../shared/components/StatusBadge";

import ProfileTabs, {

  type ProfileTabId,

} from "./components/ProfileTabs";

import ChangePasswordModal from "./components/ChangePasswordModal";

import DadosCadastraisTab, {
  type AccountForm,
} from "./components/DadosCadastraisTab";

import AcessoSegurancaTab from "./components/AcessoSegurancaTab";

import HistoricoTab from "./components/HistoricoTab";
import { useToast } from "../../../shared/components/ToastContext";

export default function MinhaContaPage() {

  const [editMode, setEditMode] = useState(false);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] =
    useState<ProfileTabId>("dados");

  const [showPassModal, setShowPassModal] =

    useState(false);

  const [passForm, setPassForm] = useState({

    atual: "",

    nova: "",

    confirmar: "",

  });

  const [form, setForm] = useState<AccountForm>({

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
    field: keyof AccountForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave() {
    setEditMode(false);

    showToast(
      "Alteração realizada com sucesso.",
      "success",
    );
  }

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
          <DadosCadastraisTab
            form={form}
            editMode={editMode}
            onFieldChange={handleField}
          />
        )}

        {activeTab === "acesso" && (
          <AcessoSegurancaTab
            emailLogin={form.emailLogin}
            onChangePassword={() =>
              setShowPassModal(true)
            }
          />
        )}

        {activeTab === "historico" && (
          <HistoricoTab />
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

            setPassForm({
              atual: "",
              nova: "",
              confirmar: "",
            });

            showToast(
              "Senha alterada com sucesso.",
              "success",
            );
          }}
        />
      )}
    </>
  );
}