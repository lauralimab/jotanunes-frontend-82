import type { AuthToken } from "../../../shared/types/auth";

import LoginBrandPanel from "./components/LoginBrandPanel";
import LoginForm from "./components/LoginForm";

type LoginPageProps = {
  onLogin: (
    auth: AuthToken,
  ) => void;

  onForgotPassword: () => void;
};

export default function LoginPage({
  onLogin,
  onForgotPassword,
}: LoginPageProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.18)",
          width:
            "min(880px, 94vw)",
          minHeight: 560,
        }}
      >
        <LoginBrandPanel />

        <LoginForm
          onLogin={onLogin}
          onForgotPassword={
            onForgotPassword
          }
        />
      </div>
    </div>
  );
}