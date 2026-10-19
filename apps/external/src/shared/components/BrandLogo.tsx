import logoDefault from "@/imports/logo.png";
import logoAlternate from "@/imports/logo-1.png";

type BrandLogoProps = {
  alternate?: boolean;
  compact?: boolean;
  white?: boolean;
};

export default function BrandLogo({
  alternate = false,
  compact = false,
  white = false,
}: BrandLogoProps) {
  return (
    <div
      className={`brand-logo${compact ? " brand-logo-compact" : ""}${
        white ? " brand-logo-white" : ""
      }`}
    >
      <img
        src={alternate ? logoAlternate : logoDefault}
        alt="Jotanunes Construtora"
      />
    </div>
  );
}