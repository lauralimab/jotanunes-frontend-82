import type { CSSProperties, ReactNode } from "react";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  loading?: boolean;
  children?: ReactNode;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  borderRadius?: CSSProperties["borderRadius"];
};

export default function Skeleton({ loading = true, children, width, height, borderRadius }: SkeletonProps) {
  if (!loading) return <>{children}</>;

  return (
    <span aria-hidden="true" className={width !== undefined || height !== undefined || borderRadius !== undefined ? styles.block : styles.text}
      style={{ width, height, borderRadius }}>
      <span className={styles.content}>{children}</span>
    </span>
  );
}
