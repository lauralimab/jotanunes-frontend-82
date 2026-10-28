import { useEffect, useState } from "react";
import { getCompanyUsers } from "../../../../shared/api/company";
import type { SupplierUser } from "../../../../shared/types/company";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import Toast from "../../../../shared/components/Toast";
import ErrorState from "../../../../shared/components/ErrorState";
import SupplierUserModal, { type UserAction } from "./SupplierUserModal";
import styles from "./SupplierUsers.module.css";
import TableActions, { TableActionsSkeleton } from "../../../../shared/components/TableActions";
import TablePagination from "../../../../shared/components/TablePagination";

const PAGE_SIZE = 5;

const successMessages = { create: "Usuário cadastrado com sucesso!", activate: "Usuário ativado com sucesso!", deactivate: "Usuário inativado com sucesso!", reset: "Senha redefinida com sucesso!" };

function formatDate(value: string | null) {
  if (!value) return "Nunca acessou";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function SupplierUsersSkeleton({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? styles.embedded : `card table-card ${styles.card}`} role="status" aria-label="Carregando usuários do fornecedor" aria-busy="true">
      <div className={styles.header} style={embedded ? undefined : { padding: "0 0 1.25rem" }}><div><Skeleton width={190} height={17} /><div style={{ marginTop: 8 }}><Skeleton width="min(100%, 15rem)" height={13} /></div></div><Skeleton width={120} height={34} borderRadius={9} /></div>
      <div className={styles.tableWrapper}>
        <table className="table-base" aria-hidden="true">
          <thead><tr>{[90, 50, 55, 90, 90, 55].map((width, index) => <th key={index}><Skeleton width={width} height={12} /></th>)}</tr></thead>
          <tbody>{Array.from({ length: 3 }, (_, index) => <tr key={index}><td><Skeleton width={170} height={14} /><div style={{ marginTop: 6 }}><Skeleton width={190} height={12} /></div></td><td><Skeleton width={65} height={24} borderRadius={999} /></td><td><Skeleton width={110} height={24} borderRadius={999} /></td><td><Skeleton width={100} height={14} /></td><td><Skeleton width={100} height={14} /></td><td><TableActionsSkeleton count={1} /></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

export default function SupplierUsers({ companyId, embedded = false, onTotalChange }: { companyId: number; embedded?: boolean; onTotalChange?: (total: number | null) => void }) {
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

  useEffect(() => {
    if (result) onTotalChange?.(result.error ? null : result.users.length);
  }, [result, onTotalChange]);

  function handleSaved(user: SupplierUser) {
    if (action?.type === "create" && result) setPageNumber(Math.ceil((result.users.length + 1) / PAGE_SIZE));
    setResult(current => current ? { users: current.users.some(item => item.id === user.id) ? current.users.map(item => item.id === user.id ? user : item) : [...current.users, user], error: false } : current);
    if (action) setNotification({ message: successMessages[action.type], id: Date.now() });
    setAction(null);
  }

  if (!result) return <SupplierUsersSkeleton embedded={embedded} />;

  const totalCount = result.users.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(pageNumber, totalPages);
  const visibleUsers = result.users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <section className={embedded ? styles.embedded : `card table-card ${styles.card}`} aria-labelledby="supplier-users-title">
        <header className={styles.header} style={embedded ? undefined : { padding: "0 0.8rem 1.25rem" }}>
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
                <td><TableActions forceMenu label={`Ações do usuário ${user.name}`} actions={[
                  { label: user.active ? "Inativar usuário" : "Ativar usuário", ariaLabel: `${user.active ? "Inativar" : "Ativar"} ${user.name}`, icon: user.active ? "user-minus" : "user-check", onClick: () => setAction({ type: user.active ? "deactivate" : "activate", user }) },
                  { label: "Redefinir senha", ariaLabel: `Redefinir senha de ${user.name}`, icon: "key", onClick: () => setAction({ type: "reset", user }) },
                ]} /></td>
              </tr>)}
              {!result.users.length && <tr><td colSpan={6} className={styles.message}>Nenhum usuário cadastrado para este fornecedor.</td></tr>}
            </tbody>
          </table>
        </div>}
        {!result.error && <TablePagination totalCount={totalCount} currentPage={currentPage} totalPages={totalPages} itemLabel="usuário(s)" ariaLabel="Páginas de usuários" onPageChange={setPageNumber} />}
      </section>
      {action && <SupplierUserModal companyId={companyId} action={action} onClose={() => setAction(null)} onSaved={handleSaved} />}
      {notification && <Toast key={notification.id} message={notification.message} onClose={() => setNotification(null)} />}
    </>
  );
}
