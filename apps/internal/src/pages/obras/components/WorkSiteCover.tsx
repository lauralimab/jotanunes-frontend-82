import styles from "../obras.module.css";

export default function WorkSiteCover() {
  return <div className={styles.workSiteCover} aria-hidden="true">
    <img src="/images/worksite-cover.jpeg" alt="" loading="lazy" decoding="async" />
  </div>;
}
