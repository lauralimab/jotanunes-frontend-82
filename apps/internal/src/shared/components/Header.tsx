import type { ReactNode } from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Header({
  title,
  subtitle,
  actions,
}: HeaderProps) {
  return (
<div
  style={{
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 64,
    flexShrink: 0,

    boxShadow:
      "0 3px 12px rgba(15, 23, 42, 0.06)",

    position: "relative",
    zIndex: 20,
  }}
>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 12.5,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}