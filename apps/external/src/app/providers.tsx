import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { BrowserRouter } from "react-router-dom";

import {
  changePassword as changePasswordRequest,
  getAuthenticatedUser,
  logout as logoutRequest,
  refreshAuthSession,
} from "../shared/api/auth";

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "../shared/auth/session";

import type {
  AuthToken,
  ChangePasswordRequest,
} from "../shared/types/auth";

type AuthContextValue = {
  auth: AuthToken | null;

  isCheckingSession: boolean;

  handleLogin: (
    authToken: AuthToken,
  ) => void;

  handleLogout: () => Promise<void>;

  handleChangePassword: (
    data: ChangePasswordRequest,
  ) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AppProvidersProps = {
  children: ReactNode;
};

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    auth,
    setAuth,
  ] =
    useState<AuthToken | null>(
      null,
    );

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedSession =
        getAuthSession();

      if (!storedSession) {
        if (!cancelled) {
          setIsCheckingSession(
            false,
          );
        }

        return;
      }

      try {
        const user =
          await getAuthenticatedUser(
            storedSession.accessToken,
          );

        if (cancelled) {
          return;
        }

        const validatedSession: AuthToken =
          {
            ...storedSession,
            user,
          };

        saveAuthSession(
          validatedSession,
        );

        setAuth(
          validatedSession,
        );
      } catch {
        try {
          const refreshedSession =
            await refreshAuthSession(
              storedSession.refreshToken,
            );

          const user =
            await getAuthenticatedUser(
              refreshedSession.accessToken,
            );

          if (cancelled) {
            return;
          }

          const validatedSession: AuthToken =
            {
              ...refreshedSession,
              user,
            };

          saveAuthSession(
            validatedSession,
          );

          setAuth(
            validatedSession,
          );
        } catch {
          if (cancelled) {
            return;
          }

          clearAuthSession();

          setAuth(null);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(
            false,
          );
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(
    authToken: AuthToken,
  ) {
    saveAuthSession(
      authToken,
    );

    setAuth(
      authToken,
    );
  }

  async function handleChangePassword(
    data: ChangePasswordRequest,
  ) {
    if (!auth) {
      throw new Error(
        "Sessão inválida. Faça login novamente.",
      );
    }

    const updatedAuth =
      await changePasswordRequest(
        auth.accessToken,
        data,
      );

    saveAuthSession(
      updatedAuth,
    );

    setAuth(
      updatedAuth,
    );
  }

  async function handleLogout() {
    const currentSession =
      auth;

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

  return (
    <AuthContext.Provider
      value={{
        auth,
        isCheckingSession,
        handleLogin,
        handleLogout,
        handleChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AppProviders.",
    );
  }

  return context;
}

export default function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
}