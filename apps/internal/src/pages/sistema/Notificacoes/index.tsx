import { useState } from "react";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import { MOCK_NOTIFICATIONS } from "../../../shared/mocks/portal";

export default function NotificacoesPage() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const unread = items.filter(n => !n.read).length;
  const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
    success: { icon: "check",   color: "#16a34a", bg: "#dcfce7" },
    warning: { icon: "clock",   color: "#d97706", bg: "#fff7ed" },
    danger:  { icon: "alert",   color: "#dc2626", bg: "#fee2e2" },
    info:    { icon: "doc",     color: "#c01a2b", bg: "#fde8ea" },
  };
  return (
    <>
      <Header title="Notificações" subtitle={`RF12/RF15 — ${unread} não lida(s)`}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => setItems(items.map(n => ({ ...n, read: true })))}>Marcar todas como lidas</button>} />
      <PageWrapper>
        <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map(n => {
            const cfg = iconMap[n.type];
            return (
              <div key={n.id} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: n.read ? 0.65 : 1, borderLeft: `3px solid ${cfg.color}`, cursor: "pointer" }}
                onClick={() => setItems(items.map(item => item.id === n.id ? { ...item, read: true } : item))}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={cfg.icon} size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 13.5, color: "#0f172a", fontWeight: n.read ? 400 : 600 }}>{n.msg}</p>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{n.time}</span>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c01a2b", flexShrink: 0, marginTop: 4 }} />}
              </div>
            );
          })}
        </div>
      </PageWrapper>
    </>
  );
}
