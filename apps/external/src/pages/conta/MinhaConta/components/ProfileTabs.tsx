import Icon from "../../../../shared/components/Icon";

export type ProfileTabId =
  | "dados"
  | "acesso"
  | "historico";

type ProfileTabsProps = {
  activeTab: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
};

const tabs: {
  id: ProfileTabId;
  label: string;
  icon: string;
}[] = [
  {
    id: "dados",
    label: "Dados Cadastrais",
    icon: "building",
  },
  {
    id: "acesso",
    label: "Acesso e Segurança",
    icon: "shield",
  },
  {
    id: "historico",
    label: "Histórico de Alterações",
    icon: "list",
  },
];

export default function ProfileTabs({
  activeTab,
  onChange,
}: ProfileTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        marginBottom: 20,

        background:
          "rgba(226, 232, 240, 0.72)",

        border:
          "1px solid rgba(148, 163, 184, 0.16)",

        borderRadius: 11,
        padding: 4,

        width: "fit-content",

        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() =>
              onChange(tab.id)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,

              padding: "8px 18px",

              background: isActive
                ? "rgba(255, 255, 255, 0.94)"
                : "transparent",

              border: "none",
              borderRadius: 8,

              cursor: "pointer",

              fontFamily:
                "'Inter', sans-serif",

              fontSize: 13,

              fontWeight: isActive
                ? 700
                : 500,

              color: isActive
                ? "#b51224"
                : "#374151",

              boxShadow: isActive
                ? "0 2px 6px rgba(15, 23, 42, 0.08)"
                : "none",

              transition:
                "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            <Icon
              name={tab.icon}
              size={15}
              color={
                isActive
                  ? "#b51224"
                  : "#64748b"
              }
            />

            {tab.label}
          </button>
        );
      })}
    </div>
  );
}