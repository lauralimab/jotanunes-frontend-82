import BrandLogo from "../../shared/components/BrandLogo";
import Icon from "../../shared/components/Icon";

import type { Screen } from "../../shared/types/navigation";

type SidebarProps = {
  screen: Screen;
  onNav: (screen: Screen) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  screen,
  onNav,
  onLogout,
  open,
  onClose,
}: SidebarProps) {
  const links: {
    id: Screen;
    label: string;
    icon: string;
  }[] = [
    {
      id: "supplier-dashboard",
      label: "Dashboard",
      icon: "home",
    },
    {
      id: "company-data",
      label: "Dados da Empresa",
      icon: "building",
    },
    {
      id: "employees",
      label: "Funcionários",
      icon: "users",
    },
    {
      id: "documents",
      label: "Documentos",
      icon: "doc",
    },
    {
      id: "send-document",
      label: "Enviar Documento",
      icon: "upload",
    },
    {
      id: "pendencies",
      label: "Pendências",
      icon: "alert",
    },
    {
      id: "supplier-profile",
      label: "Meu Perfil",
      icon: "shield",
    },
  ];

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`app-sidebar${open ? " open" : ""}`}
        style={{
          width: 232,
          minHeight: "100vh",
          background: "#1a0a0c",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "18px 16px 16px",
            borderBottom: "1px solid #2d1216",
            flexShrink: 0,
          }}
        >
          <BrandLogo
            alternate
            compact
            white
          />
        </div>

        <div
          style={{
            padding: "10px 18px 6px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#6b3a42",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Portal Fornecedor
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "0 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {links.map((link) => (
            <div
              key={link.id}
              className={`sidebar-link${
                screen === link.id ? " active" : ""
              }`}
              onClick={() => {
                onNav(link.id);
                onClose();
              }}
            >
              <span className="icon">
                <Icon
                  name={link.icon}
                  size={17}
                />
              </span>

              {link.label}
            </div>
          ))}
        </nav>

        <div
          style={{
            padding: "14px 14px 18px",
            borderTop: "1px solid #2d1216",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#c01a2b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              FL
            </div>

            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#e2e8f0",
                }}
              >
                Felipe Lima
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#7a3a42",
                }}
              >
                Fornecedor
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{
              width: "100%",
              justifyContent: "center",
              color: "#7a3a42",
              borderColor: "#2d1216",
            }}
            onClick={onLogout}
          >
            <Icon
              name="logout"
              size={14}
            />

            Sair
          </button>
        </div>
      </aside>
    </>
  );
}