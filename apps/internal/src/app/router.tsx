import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortalLayout from "./layouts/PortalLayout";
import type { Screen } from "../shared/types/portal";
import LoginPage from "../pages/auth/Login";
import InicioPage from "../pages/inicio/Inicio";
import EmpresasPage from "../pages/empresas/Empresas";
import EmpresaDetalhePage from "../pages/empresas/EmpresaDetalhe";
import type { SupplierDetailSection } from "../pages/empresas/EmpresaDetalhe/components/SupplierDetailsSections";
import ObrasPage from "../pages/obras/Obras";
import ObraDetalhePage from "../pages/obras/ObraDetalhe";
import TiposDocumentosPage from "../pages/documentos/TiposDocumentos";
import AvaliarDocumentoPage from "../pages/documentos/AvaliarDocumento";
import VencimentosPage from "../pages/documentos/Vencimentos";
import BoletimPage from "../pages/documentos/Boletim";
import AutorizacaoExcepcionalPage from "../pages/autorizacoes/AutorizacaoExcepcional";
import RecebimentoMaterialPage from "../pages/materiais/RecebimentoMaterial";
import NotificacoesPage from "../pages/sistema/Notificacoes";
import HistoricoPage from "../pages/sistema/Historico";
import Header from "../shared/components/Header";
import PageWrapper from "../shared/components/PageWrapper";

type ResolvedRoute = { screen: Screen; companyId?: number; workSiteId?: number } | { screen: null };

function resolveRoute(pathname: string): ResolvedRoute {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const paths: Record<string, Screen> = {
    "/": "login",
    "/login": "login",
    "/dashboard": "admin-dashboard",
    "/fornecedores": "admin-suppliers",
    "/obras": "worksites",
    "/tipos-documentos": "document-types",
    "/documentos/analise": "document-analysis",
    "/vencimentos": "expirations",
    "/boletim-pagamento": "boletim",
    "/autorizacoes-excepcionais": "autorizacao-excepcional",
    "/recebimento-material": "recebimento-material",
    "/notificacoes": "notifications",
    "/historico": "history",
  };

  if (paths[normalizedPath]) return { screen: paths[normalizedPath] };

  const supplierMatch = normalizedPath.match(/^\/fornecedores\/(\d+)$/);
  if (supplierMatch) {
    const companyId = Number(supplierMatch[1]);
    if (Number.isSafeInteger(companyId) && companyId > 0) return { screen: "supplier-details", companyId };
  }

  const workSiteMatch = normalizedPath.match(/^\/obras\/(\d+)$/);
  if (workSiteMatch) {
    const workSiteId = Number(workSiteMatch[1]);
    if (Number.isSafeInteger(workSiteId) && workSiteId > 0) return { screen: "worksites", workSiteId };
  }

  return { screen: null };
}

const screenPaths: Partial<Record<Screen, string>> = {
  login: "/login",
  "admin-dashboard": "/dashboard",
  "admin-suppliers": "/fornecedores",
  worksites: "/obras",
  "document-types": "/tipos-documentos",
  "document-analysis": "/documentos/analise",
  expirations: "/vencimentos",
  boletim: "/boletim-pagamento",
  "autorizacao-excepcional": "/autorizacoes-excepcionais",
  "recebimento-material": "/recebimento-material",
  notifications: "/notificacoes",
  history: "/historico",
};

export default function AppRouter() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const route = resolveRoute(pathname);
  const editSupplierOnOpen = new URLSearchParams(search).get("editar") === "true";
  const queryParams = new URLSearchParams(search);
  const hasWorkSiteContext = queryParams.has("obraId");
  const workSiteOrigin = Number(queryParams.get("obraId"));
  const workSiteOriginId = Number.isSafeInteger(workSiteOrigin) && workSiteOrigin > 0 ? workSiteOrigin : null;
  const initialDocumentPageValue = Number(queryParams.get("documentPage"));
  const initialDocumentPage = Number.isSafeInteger(initialDocumentPageValue) && initialDocumentPageValue > 0 ? initialDocumentPageValue : 1;
  const initialDocumentOrder = queryParams.get("documentOrder") === "desc" ? "desc" : "asc";
  const initialSortValue = queryParams.get("documentSort");
  const initialDocumentSort = initialSortValue === "supplier" || initialSortValue === "status" ? initialSortValue : "document";
  const returnPageValue = Number(queryParams.get("returnPage"));
  const returnPage = Number.isSafeInteger(returnPageValue) && returnPageValue > 0 ? returnPageValue : 1;
  const returnOrder = queryParams.get("returnOrder") === "desc" ? "desc" : "asc";
  const returnSortValue = queryParams.get("returnSort");
  const returnSort = returnSortValue === "supplier" || returnSortValue === "status" ? returnSortValue : "document";
  const hasDocumentContext = queryParams.has("documentId");
  const documentIdValue = Number(queryParams.get("documentId"));
  const requestedDocumentId = Number.isSafeInteger(documentIdValue) && documentIdValue > 0 ? documentIdValue : undefined;
  const invalidDocumentId = hasDocumentContext && requestedDocumentId === undefined;
  const hasCompanyContext = queryParams.has("companyId");
  const companyIdValue = Number(queryParams.get("companyId"));
  const documentCompanyId = Number.isSafeInteger(companyIdValue) && companyIdValue > 0 ? companyIdValue : null;
  const invalidCompanyContext = (hasCompanyContext && documentCompanyId === null) || (hasCompanyContext && hasWorkSiteContext);
  const returnWorkSiteValue = Number(queryParams.get("returnWorkSiteId"));
  const returnWorkSiteId = Number.isSafeInteger(returnWorkSiteValue) && returnWorkSiteValue > 0 ? returnWorkSiteValue : null;
  const supplierSectionValue = queryParams.get("supplierSection");
  const initialSupplierSection: SupplierDetailSection = supplierSectionValue === "documents" || supplierSectionValue === "users" || supplierSectionValue === "workers" ? supplierSectionValue : "requests";

  function handleNav(screen: Screen) {
    const path = screenPaths[screen];
    if (path) navigate(path);
    else if (screen === "supplier-details") navigate("/fornecedores");
  }

  if (route.screen === "login") {
    return <LoginPage onLogin={() => navigate("/dashboard")} />;
  }

  const activeScreen = route.screen === "supplier-details" ? "admin-suppliers" : route.screen;

  return (
    <PortalLayout
      screen={activeScreen}
      onNav={handleNav}
      onLogout={() => navigate("/login", { replace: true })}
      navOpen={navOpen}
      onOpenNav={() => setNavOpen(true)}
      onCloseNav={() => setNavOpen(false)}
    >
      {route.screen === null ? (
        <>
          <Header title="Página não encontrada" />
          <PageWrapper>
            <div className="card">
              <p style={{ marginTop: 0 }}>A página solicitada não existe.</p>
              <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Ir para o Dashboard</button>
            </div>
          </PageWrapper>
        </>
      ) : route.screen === "worksites" ? route.workSiteId
        ? <ObraDetalhePage key={route.workSiteId} workSiteId={route.workSiteId} onBack={() => navigate("/obras")} onOpenSupplier={companyId => navigate(`/fornecedores/${companyId}?obraId=${route.workSiteId}`)} initialDocumentSearch={queryParams.get("documentSearch") ?? ""} initialDocumentPage={initialDocumentPage} initialDocumentOrder={initialDocumentOrder} initialDocumentSort={initialDocumentSort} onAnalyzeDocument={(documentId, documentSearch, documentPage, documentSort, documentOrder) => {
          const params = new URLSearchParams({ obraId: String(route.workSiteId), documentId: String(documentId), returnSearch: documentSearch, returnPage: String(documentPage), returnSort: documentSort, returnOrder: documentOrder });
          navigate(`/documentos/analise?${params.toString()}`);
        }} />
        : <ObrasPage onSelectWorkSite={id => navigate(`/obras/${id}`)} />
        : route.screen === "document-types" ? <TiposDocumentosPage />
        : route.screen === "admin-dashboard" ? <InicioPage onNav={handleNav} />
        : route.screen === "admin-suppliers" ? <EmpresasPage onSelectCompany={id => navigate(`/fornecedores/${id}`)} onEditCompany={id => navigate(`/fornecedores/${id}?editar=true`)} />
          : route.screen === "supplier-details" ? <EmpresaDetalhePage onNav={screen => { if (screen === "admin-suppliers" && workSiteOriginId) navigate(`/obras/${workSiteOriginId}`); else handleNav(screen); }} companyId={route.companyId!} editOnOpen={editSupplierOnOpen} initialDocumentSearch={queryParams.get("documentSearch") ?? ""} initialDocumentPage={initialDocumentPage} initialDocumentOrder={initialDocumentOrder} initialDocumentSort={initialDocumentSort} initialSection={initialSupplierSection} onAnalyzeDocument={(documentId, documentSearch, documentPage, documentSort, documentOrder) => {
            const params = new URLSearchParams({ companyId: String(route.companyId), documentId: String(documentId), returnSearch: documentSearch, returnPage: String(documentPage), returnSort: documentSort, returnOrder: documentOrder, returnSection: "documents" });
            if (workSiteOriginId) params.set("returnWorkSiteId", String(workSiteOriginId));
            navigate(`/documentos/analise?${params.toString()}`);
          }} onEditClose={() => navigate(`/fornecedores/${route.companyId}${workSiteOriginId ? `?obraId=${workSiteOriginId}` : ""}`, { replace: true })} />
            : route.screen === "document-analysis" ? <AvaliarDocumentoPage onNav={handleNav} workSiteId={hasWorkSiteContext && workSiteOriginId ? workSiteOriginId : undefined} companyId={hasCompanyContext && documentCompanyId ? documentCompanyId : undefined} invalidWorkSiteId={(hasWorkSiteContext && workSiteOriginId === null) || (hasDocumentContext && workSiteOriginId === null && !hasCompanyContext)} invalidCompanyId={invalidCompanyContext || (hasDocumentContext && !hasWorkSiteContext && !hasCompanyContext)} invalidDocumentId={invalidDocumentId} requestedDocumentId={requestedDocumentId} onBackToContext={() => {
              const previousSearch = queryParams.get("returnSearch") ?? "";
              const params = new URLSearchParams();
              if (previousSearch) params.set("documentSearch", previousSearch);
              params.set("documentPage", String(returnPage));
              params.set("documentOrder", returnOrder);
              params.set("documentSort", returnSort);
              if (documentCompanyId && !invalidCompanyContext) {
                if (returnWorkSiteId) params.set("obraId", String(returnWorkSiteId));
                params.set("supplierSection", queryParams.get("returnSection") === "people" || queryParams.get("returnSection") === "requests" ? queryParams.get("returnSection")! : "documents");
                navigate(`/fornecedores/${documentCompanyId}?${params.toString()}`);
                return;
              }
              if (invalidCompanyContext) { navigate("/fornecedores"); return; }
              if (!workSiteOriginId) { navigate("/obras"); return; }
              params.delete("documentSearch");
              params.delete("documentPage");
              if (previousSearch) params.set("documentSearch", previousSearch);
              params.set("documentPage", String(returnPage));
              params.set("documentOrder", returnOrder);
              params.set("documentSort", returnSort);
              navigate(`/obras/${workSiteOriginId}?${params.toString()}`);
            }} />
              : route.screen === "expirations" ? <VencimentosPage />
                : route.screen === "boletim" ? <BoletimPage />
                  : route.screen === "autorizacao-excepcional" ? <AutorizacaoExcepcionalPage />
                    : route.screen === "recebimento-material" ? <RecebimentoMaterialPage />
                      : route.screen === "notifications" ? <NotificacoesPage />
                        : route.screen === "history" ? <HistoricoPage />
                          : null}
    </PortalLayout>
  );
}
