import BrandLogo from "../../../../shared/components/BrandLogo";
import watermark from "../../../../imports/jotanunes.svg";
import styles from "../Login.module.css";

export default function LoginBrandPanel() {
  return (
    <section className={styles.brandPanel}>
      <div className={styles.brandLogo}>
        <BrandLogo alternate white />
      </div>

      <div className={styles.brandCopy}>
        <h2>Gestão que constrói</h2>
        <p>
          Centralize a análise e a gestão de documentos de fornecedores e funcionários terceirizados.
        </p>
      </div>

      <img
        className={styles.brandWatermark}
        src={watermark}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </section>
  );
}
