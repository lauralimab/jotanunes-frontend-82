import type { ReactNode } from "react";
import styles from "./Header.module.css";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return <header className={styles.header}>
    <div className={styles.heading}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>;
}
