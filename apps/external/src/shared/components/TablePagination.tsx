import type { ReactNode } from "react";
import styles from "./TablePagination.module.css";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

type Props = {
  totalCount: number; currentPage: number; totalPages: number; itemLabel: string;
  ariaLabel: string; onPageChange: (page: number) => void;
  loading?: boolean; disabled?: boolean; loadingText?: string; summary?: ReactNode;
};

export default function TablePagination({ totalCount, currentPage, totalPages, itemLabel, ariaLabel, onPageChange, loading = false, disabled = false, loadingText = "Carregando...", summary }: Props) {
  const pages = new Set<number>([1, totalPages]);
  const start = totalPages <= 7 ? 1 : currentPage <= 4 ? 1 : currentPage >= totalPages - 3 ? totalPages - 4 : currentPage - 1;
  const end = totalPages <= 7 ? totalPages : currentPage <= 4 ? 5 : currentPage >= totalPages - 3 ? totalPages : currentPage + 1;
  for (let page = start; page <= end; page++) pages.add(page);
  const buttons = [...pages].filter(page => page > 0 && page <= totalPages).sort((a, b) => a - b);
  return <footer className={styles.footer}>
    <span aria-live="polite">{summary ?? (loading ? loadingText : `${totalCount} ${itemLabel}${totalCount > 0 && totalPages > 0 ? ` · Página ${currentPage} de ${totalPages}` : ""}`)}</span>
    {totalPages > 1 && <nav className={styles.nav} aria-label={ariaLabel}>
      <button type="button" className={styles.button} aria-label="Página anterior" title="Página anterior" disabled={loading || disabled || currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><Chevron direction="left" /></button>
      {buttons.map((page, index) => <span key={page} className={styles.slot}>
        {index > 0 && page > buttons[index - 1] + 1 && <span className={styles.gap} aria-hidden="true">…</span>}
        <button type="button" className={styles.button} aria-label={`Página ${page}`} title={`Página ${page}`} aria-current={page === currentPage ? "page" : undefined} disabled={loading || disabled || page === currentPage} onClick={() => onPageChange(page)}>{page}</button>
      </span>)}
      <button type="button" className={styles.button} aria-label="Próxima página" title="Próxima página" disabled={loading || disabled || currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><Chevron direction="right" /></button>
    </nav>}
  </footer>;
}
