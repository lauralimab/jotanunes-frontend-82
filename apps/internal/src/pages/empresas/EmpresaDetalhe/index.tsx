import { useEffect, useState } from "react";
import { getCompany } from "../../../shared/api/company";
import type { Company } from "../../../shared/types/company";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import Skeleton from "../../../shared/components/Skeleton";
import Toast from "../../../shared/components/Toast";
import NovoFornecedorModal from "../Empresas/components/NovoFornecedorModal";
import ExcluirFornecedorModal from "../Empresas/components/ExcluirFornecedorModal";
import SupplierPeople, { SupplierPeopleSkeleton } from "./components/SupplierPeople";
import ErrorState from "../../../shared/components/ErrorState";
import type { Screen } from "../../../shared/types/portal";

type Props = { onNav: (screen: Screen) => void; companyId: number | null; editOnOpen: boolean; onEditClose: () => void };

const statuses = {
  1: { label: "Pendente", className: "badge-warning" },
  2: { label: "Apto", className: "badge-success" },
  3: { label: "Não apto", className: "badge-orange" },
  4: { label: "Bloqueado", className: "badge-danger" },
} as const;

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 14 ? digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : value || "—";
}

function formatPhone(value?: string | null) {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  if (digits.length === 11) return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return value;
}

function formatCep(value?: string | null) {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  return digits.length === 8 ? digits.replace(/^(\d{5})(\d{3})$/, "$1-$2") : value;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 500, overflowWrap: "anywhere" }}>{value || "—"}</div>
    </div>
  );
}

function CompanyDetailsSkeleton() {
  return (
    <div role="status" aria-label="Carregando dados do fornecedor" aria-busy="true">
      <div className="card" style={{ marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Skeleton width={64} height={64} borderRadius={12} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Skeleton width={220} height={24} />
            <Skeleton width={145} height={24} borderRadius={999} />
            <Skeleton width={105} height={24} borderRadius={999} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px 24px" }}>
            {[100, 130, 115, 125].map((width, index) => <div key={index}><Skeleton width={80} height={11} /><div style={{ marginTop: 6 }}><Skeleton width={width} height={15} /></div></div>)}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <section className="card">
          <div style={{ height: 17, marginBottom: 16 }}><Skeleton width={58} height={17} /></div>
          <div style={{ display: "grid", gap: 16 }}>
            {[110, 180, 120].map((width, index) => <div key={index}><Skeleton width={75} height={11} /><div style={{ marginTop: 6 }}><Skeleton width={width} height={15} /></div></div>)}
          </div>
        </section>
        <section className="card">
          <div style={{ height: 17, marginBottom: 16 }}><Skeleton width={72} height={17} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
            {[90, 35, 100, 100, 160, 110, 45].map((width, index) => <div key={index}><Skeleton width={75} height={11} /><div style={{ marginTop: 6 }}><Skeleton width={width} height={15} /></div></div>)}
          </div>
        </section>
      </div>
      <SupplierPeopleSkeleton />
    </div>
  );
}

export default function EmpresaDetalhePage({ onNav, companyId, editOnOpen, onEditClose }: Props) {
  const [result, setResult] = useState<{ companyId: number; company: Company | null; error: string; cause?: unknown } | null>(null);
  const [localEditOpen, setLocalEditOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let active = true;
    if (companyId === null) return () => { active = false; };
    getCompany(companyId).then(result => {
      if (active) setResult({ companyId, company: result, error: "" });
    }).catch(cause => {
      if (active) setResult({ companyId, company: null, error: cause instanceof Error ? cause.message : "Não foi possível carregar os dados do fornecedor.", cause });
    });

    return () => { active = false; };
  }, [companyId]);

  const resultMatchesRoute = result?.companyId === companyId;
  const loading = companyId !== null && !resultMatchesRoute;
  const company = resultMatchesRoute ? result.company : null;
  const error = companyId === null ? "Selecione um fornecedor na lista para ver os detalhes." : resultMatchesRoute ? result.error : "";
  const status = company ? statuses[company.status as keyof typeof statuses] : undefined;
  const name = company?.corporateName || company?.tradeName || "Fornecedor";
  const initials = name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const editOpen = editOnOpen || localEditOpen;

  function closeEdit() {
    setLocalEditOpen(false);
    onEditClose();
  }

  function handleUpdated(updated: Company) {
    setResult({ companyId: updated.id, company: updated, error: "" });
    setLocalEditOpen(false);
    onEditClose();
    setShowSuccessNotification(true);
  }

  return (
    <>
      <Header title="Detalhes do Fornecedor"
        actions={<><button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>← Voltar</button>{company && <><button className="btn btn-secondary btn-sm" onClick={() => setLocalEditOpen(true)}><Icon name="edit" size={14} />Editar fornecedor</button><button type="button" className="btn btn-primary btn-sm" onClick={() => setShowDeleteModal(true)}><Icon name="trash" size={14} />Excluir fornecedor</button></>}</>} />
      <PageWrapper>
        {loading ? <CompanyDetailsSkeleton />
          : error ? companyId === null ? <div className="card" role="alert">{error} <button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>Voltar para fornecedores</button></div> : <ErrorState error={result?.cause} />
            : company && <>
              <div className="card" style={{ marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div aria-hidden="true" style={{ width: 64, height: 64, borderRadius: 12, background: "#fde8ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#c01a2b", flexShrink: 0 }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{name}</h2>
                    {status && <span className={`badge ${status.className}`}>{status.label}</span>}
                    <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed" }}><Icon name="package" size={11} />{company.supplierType === 1 ? "Material" : "Mão de obra"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px 24px" }}>
                    <Detail label="CNPJ" value={company.formattedCnpj || formatCnpj(company.cnpj)} />
                    <Detail label="Nome fantasia" value={company.tradeName} />
                    <Detail label="Inscrição estadual" value={company.stateRegistration} />
                    <Detail label="Última atualização" value={formatDate(company.updatedAt)} />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                <section className="card">
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Contato</h3>
                  <div style={{ display: "grid", gap: 16 }}>
                    <Detail label="Responsável" value={company.responsibleName} />
                    <Detail label="E-mail" value={company.email} />
                    <Detail label="Telefone" value={formatPhone(company.phone)} />
                  </div>
                </section>
                <section className="card">
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Endereço</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
                    <Detail label="CEP" value={formatCep(company.address.zipCode)} />
                    <Detail label="Estado" value={company.address.state} />
                    <Detail label="Cidade" value={company.address.city} />
                    <Detail label="Bairro" value={company.address.neighborhood} />
                    <Detail label="Logradouro" value={company.address.street} />
                    <Detail label="Número" value={company.address.number} />
                    <Detail label="Complemento" value={company.address.complement} />
                  </div>
                </section>
              </div>
              <SupplierPeople key={company.id} companyId={company.id} />
            </>}
      </PageWrapper>
      {company && editOpen && <NovoFornecedorModal initialCompany={company} onClose={closeEdit} onSaved={handleUpdated} />}
      {company && showDeleteModal && <ExcluirFornecedorModal company={company} onClose={() => setShowDeleteModal(false)} onDeleted={() => onNav("admin-suppliers")} />}
      {showSuccessNotification && <Toast message="Fornecedor atualizado com sucesso!" onClose={() => setShowSuccessNotification(false)} />}
    </>
  );
}
