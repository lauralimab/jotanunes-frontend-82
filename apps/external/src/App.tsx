import AppRouter from "./app/router";

import {
  useAuth,
} from "./app/providers";

import SessionSkeleton from "./shared/components/SessionSkeleton";

export default function App() {
  const {
    auth,
    isCheckingSession,
    handleLogin,
    handleLogout,
  } = useAuth();

  if (
    isCheckingSession
  ) {
    return (
      <SessionSkeleton />
    );
  }

  return (
    <AppRouter
      auth={auth}
      onLogin={
        handleLogin
      }
      onLogout={
        handleLogout
      }
    />
  );
}