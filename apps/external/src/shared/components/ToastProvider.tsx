import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Toast from "./Toast";
import {
  ToastContext,
  type ToastVariant,
} from "./ToastContext";

type ToastProviderProps = {
  children: ReactNode;
};

type ActiveToast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  const nextId = useRef(0);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      nextId.current += 1;

      setActiveToast({
        id: nextId.current,
        message,
        variant,
      });
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {activeToast && (
        <Toast
          key={activeToast.id}
          message={activeToast.message}
          variant={activeToast.variant}
          onClose={() => {
            setActiveToast((current) =>
              current?.id === activeToast.id ? null : current,
            );
          }}
        />
      )}
    </ToastContext.Provider>
  );
}