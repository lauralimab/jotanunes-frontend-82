export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: 28, maxWidth: 1180 }}>{children}</div>;
}
