import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Switch.module.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role" | "children" | "className"> & { label: ReactNode; className?: string };

export default function Switch({ label, className = "", id, ...inputProps }: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return <label htmlFor={inputId} className={`${styles.switch} ${className}`}>
    <span className={styles.control}>
      <input {...inputProps} id={inputId} type="checkbox" role="switch" className={styles.input} />
      <span className={styles.track} aria-hidden="true" />
    </span>
    <span className={styles.label}>{label}</span>
  </label>;
}
