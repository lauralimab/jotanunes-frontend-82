import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import styles from "./Toast.module.css";

type ToastProps = {
  message: string;
  duration?: number;
  variant?: "success" | "error" | "info";
  onClose: () => void;
};

const variantIcons = { success: "check", error: "alert", info: "info" };

export default function Toast({ message, duration = 4000, variant = "success", onClose }: ToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timeout = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(timeout);
  }, [duration]);

  return createPortal(
    <div className={`${styles.toast} ${styles[variant]}`} role={variant === "error" ? "alert" : "status"} aria-live={variant === "error" ? "assertive" : "polite"}>
      <Icon name={variantIcons[variant]} size={17} />
      <span>{message}</span>
    </div>,
    document.body,
  );
}
