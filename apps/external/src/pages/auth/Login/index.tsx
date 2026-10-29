import type { AuthToken } from "../../../shared/types/auth";

import LoginBrandPanel from "./components/LoginBrandPanel";
import LoginForm from "./components/LoginForm";

import styles from "./Login.module.css";

type LoginPageProps = {
  onLogin: (auth: AuthToken) => void;
  onForgotPassword: () => void;
};

export default function LoginPage({
  onLogin,
  onForgotPassword,
}: LoginPageProps) {
  return (
    <main className={styles.entryPage}>
      <div className={styles.entryShell}>
        <LoginBrandPanel />

        <LoginForm
          onLogin={onLogin}
          onForgotPassword={onForgotPassword}
        />
      </div>
    </main>
  );
}