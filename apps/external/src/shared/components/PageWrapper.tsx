import type { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({
  children,
}: PageWrapperProps) {
  return (
    <div
      style={{
        padding: 28,
        maxWidth: 1180,
      }}
    >
      {children}
    </div>
  );
}