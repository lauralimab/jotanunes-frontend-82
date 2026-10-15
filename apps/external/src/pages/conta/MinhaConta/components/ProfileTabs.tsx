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
        background: "#f1f5f9",
        borderRadius: 10,
        padding: 4,
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 18px",
            background:
              activeTab === tab.id
                ? "#fff"
                : "transparent",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight:
              activeTab === tab.id
                ? 700
                : 500,
            color:
              activeTab === tab.id
                ? "#c01a2b"
                : "#6b7280",
            boxShadow:
              activeTab === tab.id
                ? "0 1px 4px rgba(0,0,0,0.08)"
                : "none",
            transition: "all 0.15s",
          }}
        >
          <Icon
            name={tab.icon}
            size={15}
            color={
              activeTab === tab.id
                ? "#c01a2b"
                : "#9ca3af"
            }
          />

          {tab.label}
        </button>
      ))}
    </div>
  );
}
