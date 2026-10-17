import type { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({
  children,
}: PageWrapperProps) {
  return (
    <main className="page-wrapper">
      <div className="page-wrapper-inner">
        {children}
      </div>
    </main>
  );
}