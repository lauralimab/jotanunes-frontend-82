import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../providers";

import BrandLogo from "../../shared/components/BrandLogo";
import Icon from "../../shared/components/Icon";
import { ROUTES } from "../../shared/constants/routes";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  const first = parts[0][0];
  const last =
    parts.length > 1
      ? parts[parts.length - 1][0]
      : "";

  return (first + last).toUpperCase();
}

type SidebarProps = {
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export default function Sidebar({
  onLogout,
  open,
  onClose,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const userName = auth?.user.name ?? "";

  const links = [
    {
      path: ROUTES.home,
      label: "Dashboard",
      icon: "home",
    },
    {
      path: ROUTES.companyData,
      label: "Dados da Empresa",
      icon: "building",
    },
    {
      path: ROUTES.workers,
      label: "Funcionários",
      icon: "users",
    },
    {
      path: ROUTES.documents,
      label: "Documentos",
      icon: "doc",
    },
    {
      path: ROUTES.sendDocument,
      label: "Enviar Documento",
      icon: "upload",
    },
    {
      path: ROUTES.pendencies,
      label: "Pendências",
      icon: "alert",
    },
    {
      path: ROUTES.account,
      label: "Meu Perfil",
      icon: "shield",
    },
  ];

  function handleNavigate(path: string) {
    navigate(path);
    onClose();
  }

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`app-sidebar${open ? " open" : ""}${
          collapsed ? " collapsed" : ""
        }`}
        style={{
          minHeight: "100vh",
          background: "#8f1320",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: "hidden",

          boxShadow:
  "4px 0 14px rgba(15, 23, 60, 0.10)",
        }}
      >
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

        <div
          className="sidebar-brand"
          style={{
            padding: "18px 16px 16px",
            borderBottom:
              "1px solid rgba(255, 255, 255, 0.14)",
            flexShrink: 0,
          }}
        >
          <div className="sidebar-logo-full">
            <BrandLogo
              alternate
              compact
              white
            />
          </div>
        </div>

        <div
          className="sidebar-hide-collapsed"
          style={{
            padding: "10px 18px 6px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color:
                "rgba(255, 255, 255, 0.65)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Portal Fornecedor
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const active =
              location.pathname === link.path;

            return (
              <div
                key={link.path}
                className={`sidebar-link${
                  active ? " active" : ""
                }`}
                onClick={() =>
                  handleNavigate(link.path)
                }
                title={
                  collapsed
                    ? link.label
                    : undefined
                }
                aria-current={
                  active
                    ? "page"
                    : undefined
                }
              >
                <span className="icon">
                  <Icon
                    name={link.icon}
                    size={18}
                  />
                </span>

                <span className="sidebar-link-label">
                  {link.label}
                </span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {getInitials(userName)}
            </div>

            <div className="sidebar-user-info">
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {userName}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color:
                    "rgba(255, 255, 255, 0.62)",
                }}
              >
                Fornecedor
              </div>
            </div>
          </div>

          <button
            className="btn btn-sm sidebar-logout-btn"
            onClick={onLogout}
            title={
              collapsed
                ? "Sair"
                : undefined
            }
          >
            <Icon
              name="logout"
              size={15}
            />

            <span className="sidebar-logout-label">
              Sair
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}