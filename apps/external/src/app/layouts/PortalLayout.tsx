import type { ReactNode } from "react";

import Icon from "../../shared/components/Icon";
import type { Screen } from "../../shared/types/navigation";

import Sidebar from "./Sidebar";

type PortalLayoutProps = {
  screen: Screen;
  onNav: (screen: Screen) => void;
  onLogout: () => void;
  navOpen: boolean;
  onOpenNav: () => void;
  onCloseNav: () => void;
  children: ReactNode;
};

export default function PortalLayout({
  screen,
  onNav,
  onLogout,
  navOpen,
  onOpenNav,
  onCloseNav,
  children,
}: PortalLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Sidebar
        screen={screen}
        onNav={onNav}
        onLogout={onLogout}
        open={navOpen}
        onClose={onCloseNav}
      />

      <div
        className="app-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
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