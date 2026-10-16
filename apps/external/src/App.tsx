import AppRouter from "./app/router";
import { useAuth } from "./app/providers";

import {
  MOCK_DOCUMENTS,
  MOCK_EMPLOYEES,
} from "./shared/mocks/portal";

export default function App() {
  const {
    auth,
    isCheckingSession,
    handleLogin,
    handleLogout,
  } = useAuth();

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