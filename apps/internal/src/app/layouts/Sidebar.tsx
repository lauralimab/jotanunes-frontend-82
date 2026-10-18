import BrandLogo from "../../shared/components/BrandLogo";
import Icon from "../../shared/components/Icon";
import type { Screen } from "../../shared/types/portal";

export default function Sidebar({ screen, onNav, onLogout, open, onClose }: { screen: Screen; onNav: (s: Screen) => void; onLogout: () => void; open: boolean; onClose: () => void }) {
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
    { id: "requisitos",              label: "Requisitos do Sistema",    icon: "info",      group: "Sistema" },
  ];

  let lastGroup = "";
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar${open ? " open" : ""}`} style={{ width: 232, minHeight: "100vh", background: "#1a0a0c", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 16px", borderBottom: "1px solid #2d1216", flexShrink: 0 }}>
        <BrandLogo alternate compact white />
      </div>
      <div style={{ padding: "10px 18px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: "#6b3a42", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Painel Interno
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((l) => {
          const showHeader = l.group && l.group !== lastGroup;
          if (showHeader) lastGroup = l.group!;
          return (
            <div key={l.id}>
              {showHeader && <div style={{ fontSize: 9, color: "#3d1820", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 4px 4px" }}>{l.group}</div>}
              <div className={`sidebar-link${screen === l.id ? " active" : ""}`} onClick={() => { onNav(l.id); onClose(); }}>
                <span className="icon"><Icon name={l.icon} size={17} /></span>
                {l.label}
              </div>
            </div>
          );
        })}
      </nav>
      <div style={{ padding: "14px 14px 18px", borderTop: "1px solid #2d1216", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c01a2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            AC
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>Ana Carvalho</div>
            <div style={{ fontSize: 11, color: "#7a3a42" }}>Analista Jotanunes</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", color: "#7a3a42", borderColor: "#2d1216" }} onClick={onLogout}>
          <Icon name="logout" size={14} />Sair
        </button>
      </div>
      </aside>
    </>
  );
}
