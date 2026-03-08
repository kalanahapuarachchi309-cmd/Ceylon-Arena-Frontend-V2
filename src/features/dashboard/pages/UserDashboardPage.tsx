import { useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardTabs from "../components/DashboardTabs";
import GamesTabContent from "../components/GamesTabContent";
import ProfileTabContent from "../components/ProfileTabContent";
import StatsTabContent from "../components/StatsTabContent";
import type { DashboardTab } from "../components/dashboard.types";
import { useDashboardProfile } from "../hooks/useDashboardProfile";

import "../../../components/UserDashboard.css";

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("stats");
  const { user, isLoading, handleLogout, winRate, kdr, teamComparison } = useDashboardProfile();

  if (isLoading) {
    return null;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <DashboardHeader onLogout={handleLogout} />

        <div className="dashboard-main">
          <DashboardSidebar user={user} winRate={winRate} kdr={kdr} />

          <div className="content-area">
            <DashboardTabs activeTab={activeTab} gamesCount={user.games.length} onTabChange={setActiveTab} />

            {activeTab === "stats" && (
              <StatsTabContent user={user} winRate={winRate} kdr={kdr} teamComparison={teamComparison} />
            )}

            {activeTab === "profile" && <ProfileTabContent user={user} />}

            {activeTab === "games" && <GamesTabContent games={user.games} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
