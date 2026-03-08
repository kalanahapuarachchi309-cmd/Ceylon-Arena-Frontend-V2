import type { DashboardTab } from "./dashboard.types";

interface DashboardTabsProps {
  activeTab: DashboardTab;
  gamesCount: number;
  onTabChange: (tab: DashboardTab) => void;
}

const DashboardTabs = ({ activeTab, gamesCount, onTabChange }: DashboardTabsProps) => (
  <div className="tabs-navigation">
    <button className={`tab-btn ${activeTab === "stats" ? "active" : ""}`} onClick={() => onTabChange("stats")}>
      Statistics
    </button>
    <button className={`tab-btn ${activeTab === "profile" ? "active" : ""}`} onClick={() => onTabChange("profile")}>
      Profile Overview
    </button>
    <button className={`tab-btn ${activeTab === "games" ? "active" : ""}`} onClick={() => onTabChange("games")}>
      My Game ({gamesCount})
    </button>
  </div>
);

export default DashboardTabs;

