import BrandLogo from "../../shared/components/BrandLogo";
import Icon from "../../shared/components/Icon";
import type { Screen } from "../../shared/types/portal";

export default function Sidebar({ screen, onNav, onLogout, open, onClose, collapsed, onToggleCollapsed }: { screen: Screen | null; onNav: (s: Screen) => void; onLogout: () => void; open: boolean; onClose: () => void; collapsed: boolean; onToggleCollapsed: () => void }) {
  const links: { id: Screen; label: string; icon: string; group?: string }[] = [
    { id: "admin-dashboard",         label: "Dashboard",                icon: "dashboard" },
    { id: "admin-suppliers",         label: "Fornecedores",             icon: "companies", group: "Operações" },
    { id: "worksites",               label: "Obras",                    icon: "crane",     group: "Operações" },
    { id: "document-types",          label: "Tipos de documentos",      icon: "doc",       group: "Operações" },
    { id: "document-analysis",       label: "Análise de Documentos",    icon: "eye",       group: "Operações" },
    { id: "expirations",             label: "Vencimentos",              icon: "calendar",  group: "Operações" },
  ];

  let lastGroup = "";
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar${open ? " open" : ""}${collapsed ? " collapsed" : ""}`} style={{ width: 232, height: "100dvh", minHeight: 0, background: "#8f1320", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflow: "hidden", boxShadow: "4px 0 14px rgba(15, 23, 60, 0.10)" }}>
      <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
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
            name={collapsed ? "sidebar-expand" : "sidebar-collapse"}
            size={20}
          />
        </button>
      <div className="sidebar-brand" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.14)", flexShrink: 0 }}>
        <div className="sidebar-logo-full"><BrandLogo alternate compact white /></div>
      </div>
      <nav className="sidebar-nav">
      <div className="sidebar-hide-collapsed" style={{ padding: "10px 4px 6px" }}>
        <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.65)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Painel Interno
        </div>
      </div>
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
        <button className="btn btn-sm sidebar-logout-btn" onClick={onLogout} title={collapsed ? "Sair" : undefined}>
          <Icon name="logout" size={15} /><span className="sidebar-logout-label">Sair</span>
        </button>
      </div>
      </aside>
    </>
  );
}
