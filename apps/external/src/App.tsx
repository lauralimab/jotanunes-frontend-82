import { useEffect, useState } from "react";

import AppRouter from "./app/router";

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

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Temporário até a integração das páginas com os endpoints reais.

const MOCK_DOCUMENTS = [
  {
    id: 1,
    name: "Certidão Negativa Federal",
    person: "Construtora BH Ltda",
    type: "company",
    status: "approved",
    validity: "15/12/2026",
    uploadedAt: "05/09/2026",
  },
  {
    id: 2,
    name: "CNDT — Certidão de Débitos Trabalhistas",
    person: "Construtora BH Ltda",
    type: "company",
    status: "approved",
    validity: "20/12/2026",
    uploadedAt: "05/09/2026",
  },
  {
    id: 3,
    name: "Certidão Negativa FGTS",
    person: "Serviços e Logística SA",
    type: "company",
    status: "pending",
    validity: "10/10/2026",
    uploadedAt: "08/09/2026",
  },
  {
    id: 4,
    name: "Contrato Social",
    person: "Serviços e Logística SA",
    type: "company",
    status: "waiting",
    validity: "—",
    uploadedAt: "—",
  },
  {
    id: 5,
    name: "ASO — Atestado de Saúde Ocupacional",
    person: "Carlos Souza",
    type: "employee",
    status: "expired",
    validity: "01/08/2026",
    uploadedAt: "05/03/2026",
  },
  {
    id: 6,
    name: "NR-35 — Trabalho em Altura",
    person: "Ana Lima",
    type: "employee",
    status: "approved",
    validity: "30/11/2026",
    uploadedAt: "01/09/2026",
  },
  {
    id: 7,
    name: "Certidão Estadual",
    person: "TechClean Terceirizados",
    type: "company",
    status: "rejected",
    validity: "—",
    uploadedAt: "03/09/2026",
  },
  {
    id: 8,
    name: "Insalubridade / Periculosidade",
    person: "João Ferreira",
    type: "employee",
    status: "correction",
    validity: "15/10/2026",
    uploadedAt: "09/09/2026",
  },
  {
    id: 9,
    name: "Certidão Negativa Municipal",
    person: "Vigilância Suprema Eireli",
    type: "company",
    status: "pending",
    validity: "20/10/2026",
    uploadedAt: "08/09/2026",
  },
];

const MOCK_EMPLOYEES = [
  {
    id: 1,
    name: "Carlos Souza",
    cpf: "123.456.789-00",
    role: "Auxiliar de Limpeza",
    status: "pending",
    pendingDocs: 2,
  },
  {
    id: 2,
    name: "Ana Lima",
    cpf: "987.654.321-00",
    role: "Supervisora",
    status: "apt",
    pendingDocs: 0,
  },
  {
    id: 3,
    name: "João Ferreira",
    cpf: "456.789.123-00",
    role: "Eletricista",
    status: "pending",
    pendingDocs: 1,
  },
  {
    id: 4,
    name: "Marcia Ramos",
    cpf: "321.654.987-00",
    role: "Pintura",
    status: "apt",
    pendingDocs: 0,
  },
];

export default function App() {
  const [auth, setAuth] = useState<AuthToken | null>(null);

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

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
      } catch {
        try {
          const refreshedSession =
            await refreshAuthSession(
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
        } catch {
          if (cancelled) {
            return;
          }

          clearAuthSession();
          setAuth(null);
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
  }

  async function handleLogout() {
    const currentSession = auth;

    clearAuthSession();
    setAuth(null);

    if (!currentSession) {
      return;
    }

    try {
      await logoutRequest(
        currentSession.accessToken,
      );
    } catch {
      // A sessão local já foi encerrada.
    }
  }

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

  return (
    <AppRouter
      auth={auth}
      onLogin={handleLogin}
      onLogout={handleLogout}
      documents={MOCK_DOCUMENTS}
      workers={MOCK_EMPLOYEES}
    />
  );
}