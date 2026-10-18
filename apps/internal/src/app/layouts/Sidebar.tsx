import BrandLogo from "../../shared/components/BrandLogo";
import Icon from "../../shared/components/Icon";
import type { Screen } from "../../shared/types/portal";

export default function Sidebar({ screen, onNav, onLogout, open, onClose, collapsed, onToggleCollapsed }: { screen: Screen; onNav: (s: Screen) => void; onLogout: () => void; open: boolean; onClose: () => void; collapsed: boolean; onToggleCollapsed: () => void }) {
  const links: { id: Screen; label: string; icon: string; group?: string }[] = [
    { id: "admin-dashboard",         label: "Dashboard",                icon: "home" },
    { id: "admin-suppliers",         label: "Fornecedores",             icon: "building",  group: "Operações" },
    { id: "document-analysis",       label: "Análise de Documentos",    icon: "eye",       group: "Operações" },
    { id: "expirations",             label: "Vencimentos",              icon: "calendar",  group: "Operações" },
    { id: "boletim",                 label: "Boletim de Pagamento",     icon: "money",     group: "Operações" },
    { id: "autorizacao-excepcional", label: "Autorizações Excepcionais",icon: "star",      group: "Controle" },
    { id: "recebimento-material",    label: "Recebimento de Material",  icon: "package",   group: "Controle" },
    { id: "notifications",           label: "Notificações",             icon: "bell",      group: "Sistema" },
    { id: "history",                 label: "Histórico",                icon: "list",      group: "Sistema" },
  ];

  let lastGroup = "";
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar${open ? " open" : ""}${collapsed ? " collapsed" : ""}`} style={{ width: 232, minHeight: "100vh", background: "#8f1320", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowY: "auto", boxShadow: "4px 0 14px rgba(15, 23, 60, 0.10)" }}>
      <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapsed}
          title={
            collapsed
              ? "Expandir menu"
              : "Recolher menu"
          }
          aria-label={
            collapsed
              ? "Expandir menu"
              : "Recolher menu"
          }
        >
          <Icon
            name="list"
            size={20}
          />
        </button>
      <div className="sidebar-brand" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.14)", flexShrink: 0 }}>
        <div className="sidebar-logo-full"><BrandLogo alternate compact white /></div>
      </div>
      <div className="sidebar-hide-collapsed" style={{ padding: "10px 18px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.65)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Painel Interno
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => {
          const showHeader = l.group && l.group !== lastGroup;
          if (showHeader) lastGroup = l.group!;
          return (
            <div key={l.id}>
              {showHeader && <div className="sidebar-hide-collapsed" style={{ fontSize: 9, color: "rgba(255, 255, 255, 0.65)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 4px 4px" }}>{l.group}</div>}
              <div className={`sidebar-link${screen === l.id ? " active" : ""}`} onClick={() => { onNav(l.id); onClose(); }} title={collapsed ? l.label : undefined}>
                <span className="icon"><Icon name={l.icon} size={18} /></span>
                <span className="sidebar-link-label" style={{ whiteSpace: "normal" }}>{l.label}</span>
              </div>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            AC
          </div>
          <div className="sidebar-user-info">
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#ffffff" }}>Ana Carvalho</div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.62)" }}>Analista Jotanunes</div>
          </div>
        </div>
        <button className="btn btn-sm sidebar-logout-btn" onClick={onLogout} title={collapsed ? "Sair" : undefined}>
          <Icon name="logout" size={15} /><span className="sidebar-logout-label">Sair</span>
        </button>
      </div>
      </aside>
    </>
  );
}
