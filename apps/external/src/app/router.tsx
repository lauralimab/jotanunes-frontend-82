import {
  useState,
  type ComponentProps,
} from "react";

import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import PortalLayout from "./layouts/PortalLayout";

import LoginPage from "../pages/auth/Login";
import EsqueciSenhaPage from "../pages/auth/EsqueciSenha";

import InicioPage from "../pages/inicio/Inicio";

import DocumentosPage from "../pages/documentos/Documentos";
import EnviarDocumentoPage from "../pages/documentos/EnviarDocumento";
import PendenciasPage from "../pages/documentos/Pendencias";

import TrabalhadoresPage from "../pages/trabalhadores/Trabalhadores";

import DadosEmpresaPage from "../pages/conta/DadosEmpresa";
import MinhaContaPage from "../pages/conta/MinhaConta";

import NaoEncontradoPage from "../pages/erros/NaoEncontrado";

import { ROUTES } from "../shared/constants/routes";

import type { AuthToken } from "../shared/types/auth";
import type { Screen } from "../shared/types/navigation";

type Documents =
  ComponentProps<typeof DocumentosPage>["documents"];

type Workers =
  ComponentProps<
    typeof TrabalhadoresPage
  >["trabalhadores"];

type AppRouterProps = {
  auth: AuthToken | null;

  onLogin: (
    authToken: AuthToken,
  ) => void;

  onLogout: () => void | Promise<void>;

  documents: Documents;

  workers: Workers;
};

const SCREEN_ROUTES: Partial<
  Record<Screen, string>
> = {
  "supplier-dashboard": ROUTES.home,

  "company-data": ROUTES.companyData,

  employees: ROUTES.workers,

  documents: ROUTES.documents,

  "send-document":
    ROUTES.sendDocument,

  pendencies: ROUTES.pendencies,

  "supplier-profile": ROUTES.account,

  login: ROUTES.login,

  "forgot-password":
    ROUTES.forgotPassword,
};

function getScreenFromPath(
  pathname: string,
): Screen {
  if (
    pathname === ROUTES.sendDocument
  ) {
    return "send-document";
  }

  if (
    pathname === ROUTES.documents
  ) {
    return "documents";
  }

  if (
    pathname === ROUTES.workers
  ) {
    return "employees";
  }

  if (
    pathname === ROUTES.companyData
  ) {
    return "company-data";
  }

  if (
    pathname === ROUTES.pendencies
  ) {
    return "pendencies";
  }

  if (
    pathname === ROUTES.account
  ) {
    return "supplier-profile";
  }

  return "supplier-dashboard";
}

type PortalRouteLayoutProps = {
  auth: AuthToken | null;

  onLogout: () =>
    | void
    | Promise<void>;
};

function PortalRouteLayout({
  auth,
  onLogout,
}: PortalRouteLayoutProps) {
  const navigate = useNavigate();

  const location = useLocation();

  const [navOpen, setNavOpen] =
    useState(false);

  if (!auth) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
      />
    );
  }

  const screen = getScreenFromPath(
    location.pathname,
  );

  function handleNav(
    targetScreen: Screen,
  ) {
    const route =
      SCREEN_ROUTES[targetScreen];

    if (!route) {
      return;
    }

    navigate(route);
  }

  return (
    <PortalLayout
      screen={screen}
      onNav={handleNav}
      onLogout={() =>
        void onLogout()
      }
      navOpen={navOpen}
      onOpenNav={() =>
        setNavOpen(true)
      }
      onCloseNav={() =>
        setNavOpen(false)
      }
    >
      <Outlet />
    </PortalLayout>
  );
}

export default function AppRouter({
  auth,
  onLogin,
  onLogout,
  documents,
  workers,
}: AppRouterProps) {
  const navigate = useNavigate();

  function navigateByScreen(
    screen: Screen,
  ) {
    const route =
      SCREEN_ROUTES[screen];

    if (!route) {
      return;
    }

    navigate(route);
  }

  return (
    <Routes>
      <Route
        path={ROUTES.login}
        element={
          auth ? (
            <Navigate
              to={ROUTES.home}
              replace
            />
          ) : (
            <LoginPage
              onLogin={onLogin}
              onForgotPassword={() =>
                navigate(
                  ROUTES.forgotPassword,
                )
              }
            />
          )
        }
      />

      <Route
        path={ROUTES.forgotPassword}
        element={
          auth ? (
            <Navigate
              to={ROUTES.home}
              replace
            />
          ) : (
            <EsqueciSenhaPage
              onBack={() =>
                navigate(ROUTES.login)
              }
            />
          )
        }
      />

      <Route
        element={
          <PortalRouteLayout
            auth={auth}
            onLogout={onLogout}
          />
        }
      >
        <Route
          path={ROUTES.home}
          element={
            <InicioPage
              documents={documents}
              onNav={navigateByScreen}
            />
          }
        />

        <Route
          path={ROUTES.companyData}
          element={
            <DadosEmpresaPage />
          }
        />

        <Route
          path={ROUTES.documents}
          element={
            <DocumentosPage
              documents={documents}
              onNav={navigateByScreen}
            />
          }
        />

        <Route
          path={ROUTES.sendDocument}
          element={
            <EnviarDocumentoPage
              onCancel={() =>
                navigate(
                  ROUTES.documents,
                )
              }
            />
          }
        />

        <Route
          path={ROUTES.pendencies}
          element={
            <PendenciasPage
              documents={documents}
              onNav={navigateByScreen}
            />
          }
        />

        <Route
          path={ROUTES.workers}
          element={
            <TrabalhadoresPage
              trabalhadores={workers}
              onNav={
                navigateByScreen
              }
            />
          }
        />

        <Route
          path={ROUTES.account}
          element={
            <MinhaContaPage />
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <NaoEncontradoPage />
        }
      />
    </Routes>
  );
}