import logoDefault from "../../imports/logo.png";
import logoAlternate from "../../imports/logo-1.png";

export default function BrandLogo({ alternate = false, compact = false, white = false }: { alternate?: boolean; compact?: boolean; white?: boolean }) {
  return (
    <div className={`brand-logo${compact ? " brand-logo-compact" : ""}${white ? " brand-logo-white" : ""}`}>
      <img src={alternate ? logoAlternate : logoDefault} alt="Jotanunes Construtora" />
    </div>
  );
}
