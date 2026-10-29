import type { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  return (
    <main className={`page-wrapper ${className}`}>
      <div className="page-wrapper-inner">
        {children}
      </div>
    </main>
  );
}
