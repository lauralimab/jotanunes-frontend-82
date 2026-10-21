import { useEffect, useState } from "react";
import { getCompanyUsers } from "../../../../shared/api/company";
import type { SupplierUser } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import Toast from "../../../../shared/components/Toast";
import ErrorState from "../../../../shared/components/ErrorState";
import SupplierUserModal, { type UserAction } from "./SupplierUserModal";
import styles from "./SupplierUsers.module.css";

const PAGE_SIZE = 5;

const successMessages = { create: "Usuário cadastrado com sucesso!", activate: "Usuário ativado com sucesso!", deactivate: "Usuário inativado com sucesso!", reset: "Senha redefinida com sucesso!" };

function formatDate(value: string | null) {
  if (!value) return "Nunca acessou";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function SupplierUsersSkeleton() {
  return (
    <section className={`card ${styles.card}`} role="status" aria-label="Carregando usuários do fornecedor" aria-busy="true">
      <div className={styles.header} style={{ padding: "0 0 1.25rem" }}><div><Skeleton width={190} height={17} /><div style={{ marginTop: 8 }}><Skeleton width={240} height={13} /></div></div><Skeleton width={120} height={34} borderRadius={9} /></div>
      <div className={styles.tableWrapper}>
        <table className="table-base" aria-hidden="true">
          <thead><tr>{[90, 50, 55, 90, 90, 55].map((width, index) => <th key={index}><Skeleton width={width} height={12} /></th>)}</tr></thead>
          <tbody>{Array.from({ length: 3 }, (_, index) => <tr key={index}><td><Skeleton width={170} height={14} /><div style={{ marginTop: 6 }}><Skeleton width={190} height={12} /></div></td><td><Skeleton width={65} height={24} borderRadius={999} /></td><td><Skeleton width={110} height={24} borderRadius={999} /></td><td><Skeleton width={100} height={14} /></td><td><Skeleton width={100} height={14} /></td><td><div className={styles.actions}><Skeleton width={32} height={32} borderRadius={9} /><Skeleton width={32} height={32} borderRadius={9} /></div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

export default function SupplierUsers({ companyId }: { companyId: number }) {
  const [result, setResult] = useState<{ users: SupplierUser[]; error: boolean; cause?: unknown } | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [action, setAction] = useState<UserAction | null>(null);
  const [notification, setNotification] = useState<{ message: string; id: number } | null>(null);

  useEffect(() => {
    let active = true;
    getCompanyUsers(companyId).then(users => {
      if (active) setResult({ users, error: false });
    }).catch(cause => {
      if (active) setResult({ users: [], error: true, cause });
    });
    return () => { active = false; };
  }, [companyId]);

  function handleSaved(user: SupplierUser) {
    if (action?.type === "create" && result) setPageNumber(Math.ceil((result.users.length + 1) / PAGE_SIZE));
    setResult(current => current ? { users: current.users.some(item => item.id === user.id) ? current.users.map(item => item.id === user.id ? user : item) : [...current.users, user], error: false } : current);
    if (action) setNotification({ message: successMessages[action.type], id: Date.now() });
    setAction(null);
  }

  if (!result) return <SupplierUsersSkeleton />;

  const totalCount = result.users.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(pageNumber, totalPages);
  const visibleUsers = result.users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstPageButton = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageButtons = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPageButton + index);

  return (
    <>
      <section className={`card ${styles.card}`} aria-labelledby="supplier-users-title">
        <header className={styles.header} style={{ padding: "0 0.8rem 1.25rem" }}>
          <div><h3 id="supplier-users-title">Usuários</h3><p>Usuários com acesso ao Portal do Fornecedor.</p></div>
          <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(result.error)} onClick={() => setAction({ type: "create" })}><Icon name="plus" size={15} />Novo usuário</button>
        </header>
        {result.error ? <ErrorState error={result.cause} compact /> : <div className={styles.tableWrapper}>
          <table className="table-base">
            <thead><tr><th scope="col">Usuário</th><th scope="col">Status</th><th scope="col">Senha</th><th scope="col">Último acesso</th><th scope="col">Cadastrado em</th><th scope="col">Ações</th></tr></thead>
            <tbody>
              {visibleUsers.map(user => <tr key={user.id}>
                <td><div className={styles.name}>{user.name}</div><div className={styles.email}>{user.email}</div></td>
                <td><span className={`badge ${user.active ? "badge-success" : "badge-gray"}`}>{user.active ? "Ativo" : "Inativo"}</span></td>
                <td><span className={`badge ${user.mustChangePassword ? "badge-warning" : "badge-success"}`}>{user.mustChangePassword ? "Troca pendente" : "Atualizada"}</span></td>
                <td>{formatDate(user.lastAccessAt)}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td><div className={styles.actions}>
                  <button type="button" className={`btn btn-icon ${styles.softAction}`} aria-label={`${user.active ? "Inativar" : "Ativar"} ${user.name}`} title={user.active ? "Inativar usuário" : "Ativar usuário"} onClick={() => setAction({ type: user.active ? "deactivate" : "activate", user })}><Icon name={user.active ? "user-minus" : "user-check"} size={16} /></button>
                  <button type="button" className={`btn btn-icon ${styles.softAction}`} aria-label={`Redefinir senha de ${user.name}`} title="Redefinir senha" onClick={() => setAction({ type: "reset", user })}><Icon name="key" size={16} /></button>
                </div></td>
              </tr>)}
              {!result.users.length && <tr><td colSpan={6} className={styles.message}>Nenhum usuário cadastrado para este fornecedor.</td></tr>}
            </tbody>
          </table>
        </div>}
        {!result.error && <footer className={styles.pagination}>
          <span aria-live="polite">{totalCount} usuário(s){totalCount > 0 && ` · Página ${currentPage} de ${totalPages}`}</span>
          <nav aria-label="Páginas de usuários" className={styles.actions}>
            <button type="button" className="btn btn-ghost btn-icon" aria-label="Página anterior" title="Página anterior" disabled={currentPage <= 1} onClick={() => setPageNumber(currentPage - 1)}><Icon name="chevron-left" size={16} /></button>
            {totalCount > 0 && pageButtons.map(number => <button key={number} type="button" className={`btn btn-ghost btn-icon ${number === currentPage ? styles.currentPage : ""}`} aria-label={`Página ${number}`} aria-current={number === currentPage ? "page" : undefined} disabled={number === currentPage} onClick={() => setPageNumber(number)}>{number}</button>)}
            <button type="button" className="btn btn-ghost btn-icon" aria-label="Próxima página" title="Próxima página" disabled={currentPage >= totalPages} onClick={() => setPageNumber(currentPage + 1)}><Icon name="chevron-right" size={16} /></button>
          </nav>
        </footer>}
      </section>
      {action && <SupplierUserModal companyId={companyId} action={action} onClose={() => setAction(null)} onSaved={handleSaved} />}
      {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
    </>
  );
}
