import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortalLayout from "./layouts/PortalLayout";
import type { Screen } from "../shared/types/portal";
import LoginPage from "../pages/auth/Login";
import InicioPage from "../pages/inicio/Inicio";
import EmpresasPage from "../pages/empresas/Empresas";
import EmpresaDetalhePage from "../pages/empresas/EmpresaDetalhe";
import ObrasPage from "../pages/obras/Obras";
import ObraDetalhePage from "../pages/obras/ObraDetalhe";
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
    if (Number.isSafeInteger(workSiteId) && workSiteId > 0) return { screen: "worksite-details", workSiteId };
  }

  return { screen: null };
}

const screenPaths: Partial<Record<Screen, string>> = {
  login: "/login",
  "admin-dashboard": "/dashboard",
  "admin-suppliers": "/fornecedores",
  worksites: "/obras",
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

  function handleNav(screen: Screen) {
    const path = screenPaths[screen];
    if (path) navigate(path);
    else if (screen === "supplier-details") navigate("/fornecedores");
  }

  if (route.screen === "login") {
    return <LoginPage onLogin={() => navigate("/dashboard")} />;
  }

  const activeScreen = route.screen === "supplier-details" ? "admin-suppliers" : route.screen === "worksite-details" ? "worksites" : route.screen;

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
      ) : route.screen === "worksites" ? <ObrasPage onSelectWorkSite={id => navigate(`/obras/${id}`)} />
        : route.screen === "worksite-details" ? <ObraDetalhePage key={route.workSiteId} workSiteId={route.workSiteId!} onBack={() => navigate("/obras")} />
        : route.screen === "admin-dashboard" ? <InicioPage onNav={handleNav} />
        : route.screen === "admin-suppliers" ? <EmpresasPage onSelectCompany={id => navigate(`/fornecedores/${id}`)} onEditCompany={id => navigate(`/fornecedores/${id}?editar=true`)} />
          : route.screen === "supplier-details" ? <EmpresaDetalhePage onNav={handleNav} companyId={route.companyId!} editOnOpen={editSupplierOnOpen} onEditClose={() => navigate(`/fornecedores/${route.companyId}`, { replace: true })} />
            : route.screen === "document-analysis" ? <AvaliarDocumentoPage onNav={handleNav} />
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
