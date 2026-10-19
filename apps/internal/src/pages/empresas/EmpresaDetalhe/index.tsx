import { useEffect, useState } from "react";
import { getCompany } from "../../../shared/api/company";
import type { Company } from "../../../shared/types/company";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import Skeleton from "../../../shared/components/Skeleton";
import type { Screen } from "../../../shared/types/portal";

type Props = { onNav: (screen: Screen) => void; companyId: number | null };

const statuses = {
  1: { label: "Documentação pendente", className: "badge-warning" },
  2: { label: "Apto", className: "badge-success" },
  3: { label: "Não apto", className: "badge-orange" },
  4: { label: "Bloqueado", className: "badge-danger" },
} as const;

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 14 ? digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : value || "—";
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
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Contato</h3>
          <div style={{ display: "grid", gap: 16 }}>
            {[110, 180, 120].map((width, index) => <div key={index}><Skeleton width={75} height={11} /><div style={{ marginTop: 6 }}><Skeleton width={width} height={15} /></div></div>)}
          </div>
        </section>
        <section className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Endereço</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
            {[90, 35, 100, 100, 160, 110, 45].map((width, index) => <div key={index}><Skeleton width={75} height={11} /><div style={{ marginTop: 6 }}><Skeleton width={width} height={15} /></div></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EmpresaDetalhePage({ onNav, companyId }: Props) {
  const [result, setResult] = useState<{ companyId: number; retry: number; company: Company | null; error: string } | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    if (companyId === null) return () => { active = false; };
    getCompany(companyId).then(result => {
      if (active) setResult({ companyId, retry, company: result, error: "" });
    }).catch(cause => {
      if (active) setResult({ companyId, retry, company: null, error: cause instanceof Error ? cause.message : "Não foi possível carregar os dados do fornecedor." });
    });

    return () => { active = false; };
  }, [companyId, retry]);

  const resultMatchesRoute = result?.companyId === companyId && result.retry === retry;
  const loading = companyId !== null && !resultMatchesRoute;
  const company = resultMatchesRoute ? result.company : null;
  const error = companyId === null ? "Selecione um fornecedor na lista para ver os detalhes." : resultMatchesRoute ? result.error : "";
  const status = company ? statuses[company.status as keyof typeof statuses] : undefined;
  const name = company?.corporateName || company?.tradeName || "Fornecedor";
  const initials = name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Header title="Detalhes do Fornecedor"
        actions={<><button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>← Voltar</button><button className="btn btn-primary btn-sm" onClick={() => onNav("document-analysis")}><Icon name="eye" size={14} />Analisar Docs</button></>} />
      <PageWrapper>
        {loading ? <CompanyDetailsSkeleton />
          : error ? <div className="card" role="alert" style={{ color: "#b91c1c" }}>
            {error}{companyId !== null && <> <button className="btn btn-secondary btn-sm" onClick={() => setRetry(value => value + 1)}>Tentar novamente</button></>}
            {companyId === null && <> <button className="btn btn-secondary btn-sm" onClick={() => onNav("admin-suppliers")}>Voltar para fornecedores</button></>}
          </div>
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
                    <Detail label="Telefone" value={company.phone} />
                  </div>
                </section>
                <section className="card">
                  <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Endereço</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16 }}>
                    <Detail label="CEP" value={company.address.zipCode} />
                    <Detail label="Estado" value={company.address.state} />
                    <Detail label="Cidade" value={company.address.city} />
                    <Detail label="Bairro" value={company.address.neighborhood} />
                    <Detail label="Logradouro" value={company.address.street} />
                    <Detail label="Complemento" value={company.address.complement} />
                    <Detail label="Número" value={company.address.number} />
                  </div>
                </section>
              </div>
            </>}
      </PageWrapper>
    </>
  );
}
