import LoginBrandPanel from "./components/LoginBrandPanel";
import LoginForm from "./components/LoginForm";
import styles from "./Login.module.css";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <main className={styles.entryPage}>
      <div className={styles.entryShell}>
        <LoginBrandPanel />
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}
