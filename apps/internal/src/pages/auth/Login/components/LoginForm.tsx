import dashboardIllustration from "../../../../imports/componente-arte-login.png";
import styles from "../Login.module.css";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  return (
    <section className={styles.welcomePanel}>
      <div className={styles.welcomeContent}>
        <div className={styles.welcomeHeading}>
          <p className={styles.welcomeEyebrow}>Bem-vindo ao</p>
          <h1>Painel Interno</h1>
          <p className={styles.welcomeDescription}>
            Um só lugar para acompanhar a documentação e organizar o trabalho.
          </p>
        </div>

        <img
          className={styles.dashboardIllustration}
          src={dashboardIllustration}
          alt="Ilustração do painel de gestão documental"
          draggable={false}
        />

        <button
          type="button"
          className={`btn btn-primary ${styles.accessButton}`}
          onClick={onLogin}
        >
          Acessar painel <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
