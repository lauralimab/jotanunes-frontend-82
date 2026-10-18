import { useState } from "react";
import PortalLayout from "./layouts/PortalLayout";
import type { Screen } from "../shared/types/portal";
import LoginPage from "../pages/auth/Login";
import InicioPage from "../pages/inicio/Inicio";
import EmpresasPage from "../pages/empresas/Empresas";
import EmpresaDetalhePage from "../pages/empresas/EmpresaDetalhe";
import AvaliarDocumentoPage from "../pages/documentos/AvaliarDocumento";
import VencimentosPage from "../pages/documentos/Vencimentos";
import BoletimPage from "../pages/documentos/Boletim";
import AutorizacaoExcepcionalPage from "../pages/autorizacoes/AutorizacaoExcepcional";
import RecebimentoMaterialPage from "../pages/materiais/RecebimentoMaterial";
import NotificacoesPage from "../pages/sistema/Notificacoes";
import HistoricoPage from "../pages/sistema/Historico";
import RequisitosPage from "../pages/sistema/Requisitos";

export default function AppRouter() {
  const [screen, setScreen] = useState<Screen>("login");
  const [navOpen, setNavOpen] = useState(false);

  const handleLogin = () => setScreen("admin-dashboard");
  const handleLogout = () => setScreen("login");
  const handleNav = (s: Screen) => setScreen(s);

  if (screen === "login") return <LoginPage onLogin={handleLogin} />;

  const renderScreen = () => {
    switch (screen) {
      case "admin-dashboard":         return <InicioPage onNav={handleNav} />;
      case "admin-suppliers":         return <EmpresasPage onNav={handleNav} />;
      case "supplier-details":        return <EmpresaDetalhePage onNav={handleNav} />;
      case "document-analysis":       return <AvaliarDocumentoPage onNav={handleNav} />;
      case "expirations":             return <VencimentosPage />;
      case "boletim":                 return <BoletimPage />;
      case "autorizacao-excepcional": return <AutorizacaoExcepcionalPage />;
      case "recebimento-material":    return <RecebimentoMaterialPage />;
      case "notifications":           return <NotificacoesPage />;
      case "history":                 return <HistoricoPage />;
      case "requisitos":              return <RequisitosPage />;
      default:                        return null;
    }
  };

  return (
    <PortalLayout
      screen={screen}
      onNav={handleNav}
      onLogout={handleLogout}
      navOpen={navOpen}
      onOpenNav={() => setNavOpen(true)}
      onCloseNav={() => setNavOpen(false)}
    >
      {renderScreen()}
    </PortalLayout>
  );
}
