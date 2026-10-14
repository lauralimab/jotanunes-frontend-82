import { useEffect, useState } from "react";
import PortalLayout from "./app/layouts/PortalLayout";
import type { Screen } from "./shared/types/navigation";
import LoginPage from "./pages/auth/Login";
import EsqueciSenhaPage from "./pages/auth/EsqueciSenha";
import InicioPage from "./pages/inicio/Inicio";
import DocumentosPage from "./pages/documentos/Documentos";
import EnviarDocumentoPage from "./pages/documentos/EnviarDocumento";
import TrabalhadoresPage from "./pages/trabalhadores/Trabalhadores";
import MinhaContaPage from "./pages/conta/MinhaConta";
import PendenciasPage from "./pages/documentos/Pendencias";
import DadosEmpresaPage from "./pages/conta/DadosEmpresa";

import {
  getAuthenticatedUser,
  logout as logoutRequest,
  refreshAuthSession,
} from "./shared/api/auth";

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "./shared/auth/session";

import type { AuthToken } from "./shared/types/auth";

type DocStatus = "approved" | "pending" | "expired" | "waiting" | "rejected" | "correction";

type SupplierStatus = "apt" | "pending" | "blocked";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS = [
  { id: 1, name: "Certidão Negativa Federal", person: "Construtora BH Ltda", type: "company", status: "approved" as DocStatus, validity: "15/12/2026", uploadedAt: "05/09/2026" },
  { id: 2, name: "CNDT — Certidão de Débitos Trabalhistas", person: "Construtora BH Ltda", type: "company", status: "approved" as DocStatus, validity: "20/12/2026", uploadedAt: "05/09/2026" },
  { id: 3, name: "Certidão Negativa FGTS", person: "Serviços e Logística SA", type: "company", status: "pending" as DocStatus, validity: "10/10/2026", uploadedAt: "08/09/2026" },
  { id: 4, name: "Contrato Social", person: "Serviços e Logística SA", type: "company", status: "waiting" as DocStatus, validity: "—", uploadedAt: "—" },
  { id: 5, name: "ASO — Atestado de Saúde Ocupacional", person: "Carlos Souza", type: "employee", status: "expired" as DocStatus, validity: "01/08/2026", uploadedAt: "05/03/2026" },
  { id: 6, name: "NR-35 — Trabalho em Altura", person: "Ana Lima", type: "employee", status: "approved" as DocStatus, validity: "30/11/2026", uploadedAt: "01/09/2026" },
  { id: 7, name: "Certidão Estadual", person: "TechClean Terceirizados", type: "company", status: "rejected" as DocStatus, validity: "—", uploadedAt: "03/09/2026" },
  { id: 8, name: "Insalubridade / Periculosidade", person: "João Ferreira", type: "employee", status: "correction" as DocStatus, validity: "15/10/2026", uploadedAt: "09/09/2026" },
  { id: 9, name: "Certidão Negativa Municipal", person: "Vigilância Suprema Eireli", type: "company", status: "pending" as DocStatus, validity: "20/10/2026", uploadedAt: "08/09/2026" },
];

const MOCK_EMPLOYEES = [
  { id: 1, name: "Carlos Souza", cpf: "123.456.789-00", role: "Auxiliar de Limpeza", status: "pending" as SupplierStatus, pendingDocs: 2 },
  { id: 2, name: "Ana Lima", cpf: "987.654.321-00", role: "Supervisora", status: "apt" as SupplierStatus, pendingDocs: 0 },
  { id: 3, name: "João Ferreira", cpf: "456.789.123-00", role: "Eletricista", status: "pending" as SupplierStatus, pendingDocs: 1 },
  { id: 4, name: "Marcia Ramos", cpf: "321.654.987-00", role: "Pintura", status: "apt" as SupplierStatus, pendingDocs: 0 },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [navOpen, setNavOpen] = useState(false);

  const [auth, setAuth] = useState<AuthToken | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedSession = getAuthSession();

      if (!storedSession) {
        if (!cancelled) {
          setIsCheckingSession(false);
        }

        return;
      }

      try {
        const user = await getAuthenticatedUser(
          storedSession.accessToken,
        );

        if (cancelled) {
          return;
        }

        const validatedSession: AuthToken = {
          ...storedSession,
          user,
        };

        saveAuthSession(validatedSession);
        setAuth(validatedSession);
        setScreen("supplier-dashboard");
      } catch {
        try {
          const refreshedSession = await refreshAuthSession(
            storedSession.refreshToken,
          );

          const user = await getAuthenticatedUser(
            refreshedSession.accessToken,
          );

          if (cancelled) {
            return;
          }

          const validatedSession: AuthToken = {
            ...refreshedSession,
            user,
          };

          saveAuthSession(validatedSession);
          setAuth(validatedSession);
          setScreen("supplier-dashboard");
        } catch {
          if (cancelled) {
            return;
          }

          clearAuthSession();
          setAuth(null);
          setScreen("login");
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(authToken: AuthToken) {
    saveAuthSession(authToken);
    setAuth(authToken);
    setScreen("supplier-dashboard");
  }

  async function handleLogout() {
    const currentSession = auth;

    clearAuthSession();
    setAuth(null);
    setScreen("login");

    if (!currentSession) {
      return;
    }

    try {
      await logoutRequest(currentSession.accessToken);
    } catch {
      // A sessão local já foi encerrada.
    }
  }

  const handleNav = (s: Screen) => {
    setScreen(s);
  };

  if (isCheckingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          color: "#6b7280",
          fontSize: 14,
        }}
      >
        Verificando sessão...
      </div>
    );
  }

  if (!auth) {
    if (screen === "forgot-password") {
      return (
        <EsqueciSenhaPage
          onBack={() => setScreen("login")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => setScreen("forgot-password")}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "supplier-dashboard":
        return (
          <InicioPage
            onNav={handleNav}
            documents={MOCK_DOCUMENTS}
          />
        );

      case "company-data":
        return <DadosEmpresaPage />;

      case "employees":
        return (
          <TrabalhadoresPage
            trabalhadores={MOCK_EMPLOYEES}
            onNav={handleNav}
          />
        );

      case "documents":
        return (
          <DocumentosPage
            documents={MOCK_DOCUMENTS}
            onNav={handleNav}
          />
        );

      case "send-document":
        return (
          <EnviarDocumentoPage
            onCancel={() => handleNav("documents")}
          />
        );

      case "pendencies":
        return (
          <PendenciasPage
            documents={MOCK_DOCUMENTS}
            onNav={handleNav}
          />
        );

      case "supplier-profile":
        return <MinhaContaPage />;

      default:
        return (
          <InicioPage
            onNav={handleNav}
            documents={MOCK_DOCUMENTS}
          />
        );
    }
  };

  return (
    <PortalLayout
      screen={screen}
      onNav={handleNav}
      onLogout={() => void handleLogout()}
      navOpen={navOpen}
      onOpenNav={() => setNavOpen(true)}
      onCloseNav={() => setNavOpen(false)}
    >
      {renderScreen()}
    </PortalLayout>
  );

}