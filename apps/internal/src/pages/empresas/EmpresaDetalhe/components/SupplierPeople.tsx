import { useId, useRef, useState, type KeyboardEvent } from "react";
import Skeleton from "../../../../shared/components/Skeleton";
import Icon from "../../../../shared/components/Icon";
import SupplierUsers, { SupplierUsersSkeleton } from "./SupplierUsers";
import SupplierWorkers from "./SupplierWorkers";
import styles from "./SupplierPeople.module.css";

const tabs = [
  { id: "users", label: "Usuários", icon: "user-check" },
  { id: "workers", label: "Funcionários", icon: "users" },
] as const;
type PeopleTab = (typeof tabs)[number]["id"];

export function SupplierPeopleSkeleton() {
  return <div className={styles.area} role="status" aria-label="Carregando usuários e funcionários do fornecedor" aria-busy="true">
    <div className={styles.tabList} aria-hidden="true">{tabs.map(tab => <Skeleton key={tab.id} width="100%" height={54} borderRadius={12} />)}</div>
    <div className={`card table-card ${styles.card}`}><SupplierUsersSkeleton embedded /></div>
  </div>;
}

export default function SupplierPeople({ companyId }: { companyId: number }) {
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<PeopleTab>("users");
  const [usersCount, setUsersCount] = useState<number | null>();
  const [workersCount, setWorkersCount] = useState<number | null>();

  function selectTab(tab: PeopleTab) {
    setActiveTab(tab);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % tabs.length; break;
      case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return <div className={styles.area}>
    <div className={styles.tabList} role="tablist" aria-label="Usuários e funcionários do fornecedor">
        {tabs.map((tab, index) => {
          const count = tab.id === "users" ? usersCount : workersCount;
          return <button key={tab.id} ref={node => { tabRefs.current[index] = node; }}
          type="button" id={`${id}-${tab.id}-tab`} role="tab" className={styles.tab}
          aria-selected={activeTab === tab.id} aria-controls={`${id}-${tab.id}-panel`} tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => selectTab(tab.id)} onKeyDown={event => handleKeyDown(event, index)}>
            <span className={styles.icon} aria-hidden="true"><Icon name={tab.icon} size={18} /></span>
            <span className={styles.label}>{tab.label}</span>
            <span className={styles.count} aria-busy={count === undefined} title={count === null ? "Quantidade indisponível" : undefined}>
              {count === undefined ? <Skeleton width={18} height={12} /> : count === null ? "—" : count.toLocaleString("pt-BR")}
            </span>
          </button>;
        })}
    </div>
    <div className={`card table-card ${styles.card}`}>
      <div id={`${id}-users-panel`} className={styles.panel} role="tabpanel" aria-labelledby={`${id}-users-tab`} hidden={activeTab !== "users"} tabIndex={0}>
        <SupplierUsers companyId={companyId} embedded onTotalChange={setUsersCount} />
      </div>
      <div id={`${id}-workers-panel`} className={styles.panel} role="tabpanel" aria-labelledby={`${id}-workers-tab`} hidden={activeTab !== "workers"} tabIndex={0}>
        <SupplierWorkers companyId={companyId} embedded onTotalChange={setWorkersCount} />
      </div>
    </div>
  </div>;
}
