
import AppRouter from "./app/router";

import { useAuth } from "./app/providers";

import SessionSkeleton from "./shared/components/SessionSkeleton";

import {
  MOCK_DOCUMENTS,
} from "./shared/mocks/portal";

export default function App() {
  const {
    auth,
    isCheckingSession,
    handleLogin,
    handleLogout,
  } = useAuth();

  if (isCheckingSession) {
    return <SessionSkeleton />;
  }

  return (
    <AppRouter
      auth={auth}
      onLogin={handleLogin}
      onLogout={handleLogout}
      documents={MOCK_DOCUMENTS}
    />
  );
}
