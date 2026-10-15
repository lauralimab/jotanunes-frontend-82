import {
  useState,
  type ComponentProps,
} from "react";

import {
  Navigate,
  Outlet,
  Route,
  Routes,
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

type Documents =
  ComponentProps<typeof DocumentosPage>["documents"];

type Workers =
  ComponentProps<
    typeof TrabalhadoresPage
  >["trabalhadores"];

const PAGE_ROUTES = {
  documents: ROUTES.documents,
  "send-document": ROUTES.sendDocument,
  pendencies: ROUTES.pendencies,
} as const;

type PageDestination =
  keyof typeof PAGE_ROUTES;

type AppRouterProps = {
  auth: AuthToken | null;

  onLogin: (
    authToken: AuthToken,
  ) => void;

  onLogout: () => void | Promise<void>;

  documents: Documents;

  workers: Workers;
};

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

  return (
    <PortalLayout
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

  function navigateByDestination(
    destination: PageDestination,
  ) {
    navigate(
      PAGE_ROUTES[destination],
    );
  }

  return (
    <Routes>
      {/* LOGIN */}
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

      {/* ESQUECI MINHA SENHA */}
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

      {/* ÁREA AUTENTICADA */}
      <Route
        element={
          <PortalRouteLayout
            auth={auth}
            onLogout={onLogout}
          />
        }
      >
        {/* DASHBOARD */}
        <Route
          path={ROUTES.home}
          element={
            <InicioPage
              documents={documents}
              onNav={
                navigateByDestination
              }
            />
          }
        />

        {/* DADOS DA EMPRESA */}
        <Route
          path={ROUTES.companyData}
          element={
            <DadosEmpresaPage />
          }
        />

        {/* DOCUMENTOS */}
        <Route
          path={ROUTES.documents}
          element={
            <DocumentosPage
              documents={documents}
              onNav={
                navigateByDestination
              }
            />
          }
        />

        {/* ENVIAR DOCUMENTO */}
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

        {/* PENDÊNCIAS */}
        <Route
          path={ROUTES.pendencies}
          element={
            <PendenciasPage
              documents={documents}
              onNav={
                navigateByDestination
              }
            />
          }
        />

        {/* TRABALHADORES */}
        <Route
          path={ROUTES.workers}
          element={
            <TrabalhadoresPage
              trabalhadores={workers}
              onNav={
                navigateByDestination
              }
            />
          }
        />

        {/* MINHA CONTA */}
        <Route
          path={ROUTES.account}
          element={
            <MinhaContaPage />
          }
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <NaoEncontradoPage />
        }
      />
    </Routes>
  );
}