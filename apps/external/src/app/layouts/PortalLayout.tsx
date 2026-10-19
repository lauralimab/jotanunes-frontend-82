import {
  useState,
  type ReactNode,
} from "react";

import Icon from "../../shared/components/Icon";
import Sidebar from "./Sidebar";

type PortalLayoutProps = {
  onLogout: () => void;
  navOpen: boolean;
  onOpenNav: () => void;
  onCloseNav: () => void;
  children: ReactNode;
};

export default function PortalLayout({
  onLogout,
  navOpen,
  onOpenNav,
  onCloseNav,
  children,
}: PortalLayoutProps) {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  return (
    <div
      className="portal-background"
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar
        onLogout={onLogout}
        open={navOpen}
        onClose={onCloseNav}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() =>
          setSidebarCollapsed(
            (current) => !current,
          )
        }
      />

      <div
        className={`app-content${
          sidebarCollapsed
            ? " sidebar-collapsed"
            : ""
        }`}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        <div className="mobile-topbar">
          <button
            className="mobile-menu-btn"
            onClick={onOpenNav}
          >
            <Icon
              name="list"
              size={18}
            />

            Menu
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}