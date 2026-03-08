interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => (
  <div className="dashboard-header">
    <div className="header-content">
      <h1>⚡ FREE FIRE DASHBOARD</h1>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  </div>
);

export default DashboardHeader;

