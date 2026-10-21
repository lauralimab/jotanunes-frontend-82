import { useId } from "react";
import ApiError from "../api/ApiError";
import styles from "./ErrorState.module.css";

function describeError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.kind === "configuration") return { label: "Serviço indisponível", title: "Uma pausa inesperada", description: "Não conseguimos acessar o serviço neste momento. Entre em contato com o suporte para que possamos ajudar." };
    if (error.kind === "connection") return { label: null, title: "Não conseguimos nos conectar", description: "A conexão com o serviço foi interrompida. Verifique sua internet e volte mais tarde." };
    if (error.kind === "invalid-response") return { label: "Falha no serviço", title: "Algo saiu diferente do esperado", description: "O serviço não conseguiu entregar as informações desta tela. Volte mais tarde ou entre em contato com o suporte." };
    if (error.status === 404) return { label: "404", title: "Não encontramos este conteúdo", description: "O conteúdo solicitado não está disponível. Ele pode ter sido removido ou o endereço pode estar incorreto." };
    if (error.status === 401 || error.status === 403) return { label: String(error.status), title: "Este acesso não está disponível", description: "Não foi possível autorizar o acesso a estas informações. Entre em contato com o suporte." };
    if (error.status && error.status >= 500) return { label: String(error.status), title: "O serviço precisa de um momento", description: "Encontramos um problema ao processar sua solicitação. Volte mais tarde. Se o problema continuar, entre em contato com o suporte." };
  }
  return { label: "Conteúdo indisponível", title: "Não foi possível carregar as informações", description: "Não conseguimos concluir o carregamento desta área. Volte mais tarde ou entre em contato com o suporte." };
}

export default function ErrorState({ error, compact = false }: { error: unknown; compact?: boolean }) {
  const id = useId();
  const { label, title, description } = describeError(error);

  return (
    <section className={`${styles.state} ${compact ? styles.compact : ""}`} role="alert" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
      <div className={styles.art} aria-hidden="true">
        <svg viewBox="0 0 220 180" fill="none">
          <circle cx="110" cy="90" r="76" fill="#fde8ea" />
          <circle cx="110" cy="90" r="87" stroke="#f3c5cb" strokeDasharray="4 8" />
          <rect x="54" y="46" width="112" height="38" rx="10" fill="white" stroke="#e6a6af" strokeWidth="2" />
          <rect x="54" y="94" width="112" height="38" rx="10" fill="white" stroke="#e6a6af" strokeWidth="2" />
          <path d="M71 65h34m-34 48h34" stroke="#e6a6af" strokeWidth="4" strokeLinecap="round" />
          <circle cx="145" cy="65" r="4" fill="#c01a2b" />
          <circle cx="145" cy="113" r="4" fill="#e6a6af" />
          <circle cx="166" cy="135" r="24" fill="#c01a2b" stroke="white" strokeWidth="5" />
          <path d="M166 124v12m0 8h.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 51v10m-5-5h10m142-32v8m-4-4h8" stroke="#e6a6af" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className={styles.copy}>
        {label && <span className={styles.label}>{label}</span>}
        <h2 id={`${id}-title`}>{title}</h2>
        <p id={`${id}-description`}>{description}</p>
        <span className={styles.signature}>Portal Interno · Jotanunes</span>
      </div>
    </section>
  );
}
