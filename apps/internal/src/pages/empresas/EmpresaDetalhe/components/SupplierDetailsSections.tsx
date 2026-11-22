import { useId, useRef, useState, type KeyboardEvent } from "react";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import ContextDocumentsSection from "../../../obras/components/ContextDocumentsSection";
import type { SupplierType } from "../../../../shared/types/supplyRequest";
import SupplierUsers from "./SupplierUsers";
import SupplierWorkers from "./SupplierWorkers";
import SupplierRequests from "./SupplierRequests";
import styles from "./SupplierDetailsSections.module.css";

export type SupplierDetailSection = "requests" | "documents" | "users" | "workers";

const sections: { id: SupplierDetailSection; label: string; icon: string }[] = [
  { id: "requests", label: "Solicitações", icon: "doc" },
  { id: "documents", label: "Análise de Documentos", icon: "eye" },
  { id: "users", label: "Usuários", icon: "user-check" },
  { id: "workers", label: "Funcionários", icon: "users" },
];

export function SupplierDetailsSectionsSkeleton() {
  return <div className={styles.area} role="status" aria-label="Carregando seções do fornecedor" aria-busy="true">
    <div className={styles.tabList} aria-hidden="true">{sections.map(section => <Skeleton key={section.id} width="100%" height={54} borderRadius={12} />)}</div>
    <div className={`card ${styles.panelSkeleton}`}><Skeleton width="40%" height={18} /><Skeleton width="70%" height={14} /></div>
  </div>;
}

type Props = {
  companyId: number;
  supplierType: SupplierType;
  initialSearch?: string;
  initialPage?: number;
  initialOrder?: "asc" | "desc";
  initialSort?: "document" | "supplier" | "status";
  initialSection?: SupplierDetailSection;
  onAnalyzeDocument: (documentId: number, search: string, page: number, sort: "document" | "supplier" | "status", order: "asc" | "desc") => void;
};

export default function SupplierDetailsSections({ companyId, supplierType, initialSearch = "", initialPage = 1, initialOrder, initialSort, initialSection = "requests", onAnalyzeDocument }: Props) {
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState<SupplierDetailSection>(initialSection);

  function selectSection(section: SupplierDetailSection) {
    setActiveSection(section);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % sections.length; break;
      case "ArrowLeft": next = (index - 1 + sections.length) % sections.length; break;
      case "Home": next = 0; break;
      case "End": next = sections.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectSection(sections[next].id);
    tabRefs.current[next]?.focus();
  }

  const activePanel = activeSection === "requests"
    ? <SupplierRequests companyId={companyId} supplierType={supplierType} />
    : activeSection === "documents"
      ? <ContextDocumentsSection key={`supplier-${companyId}`} companyId={companyId} initialSearch={initialSearch} initialPage={initialPage} initialOrder={initialOrder} initialSort={initialSort} onAnalyze={onAnalyzeDocument} />
      : activeSection === "users"
        ? <SupplierUsers key={`users-${companyId}`} companyId={companyId} />
        : <SupplierWorkers key={`workers-${companyId}`} companyId={companyId} />;

  return <div className={styles.area}>
    <div className={styles.tabList} role="tablist" aria-label="Seções do fornecedor">
      {sections.map((section, index) => <button key={section.id} ref={node => { tabRefs.current[index] = node; }} type="button" id={`${id}-${section.id}-tab`} role="tab" className={styles.tab} aria-selected={activeSection === section.id} aria-controls={`${id}-${section.id}-panel`} tabIndex={activeSection === section.id ? 0 : -1} onClick={() => selectSection(section.id)} onKeyDown={event => handleKeyDown(event, index)}>
        <span className={styles.icon} aria-hidden="true"><Icon name={section.icon} size={18} /></span>
        <span className={styles.label}>{section.label}</span>
      </button>)}
    </div>
    <div id={`${id}-${activeSection}-panel`} className={styles.panel} role="tabpanel" aria-labelledby={`${id}-${activeSection}-tab`} tabIndex={0}>
      {activePanel}
    </div>
  </div>;
}
