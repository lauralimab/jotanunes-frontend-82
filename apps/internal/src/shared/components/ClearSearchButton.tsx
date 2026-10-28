import Icon from "./Icon";
import styles from "./ClearSearchButton.module.css";

export default function ClearSearchButton({ onClear }: { onClear: () => void }) {
  return <button type="button" className={styles.button} aria-label="Limpar busca" title="Limpar busca" onClick={event => {
    onClear();
    event.currentTarget.parentElement?.querySelector("input")?.focus();
  }}><Icon name="x" size={15} /></button>;
}
