import type { DashboardUser } from "./dashboard.types";

interface DashboardSidebarProps {
  user: DashboardUser;
  winRate: string;
  kdr: string;
}

const DashboardSidebar = ({ user, winRate, kdr }: DashboardSidebarProps) => (
  <div className="sidebar">
    <div className="profile-card">
      <div className="profile-avatar">
        <div className="avatar-placeholder">
          <span>{user.playerName.charAt(0)}</span>
        </div>
      </div>
      <h2 className="player-name">{user.playerName}</h2>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Total Matches</span>
          <span className="stat-value">{user.stats.totalMatches}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{winRate}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">K/D Ratio</span>
          <span className="stat-value">{kdr}</span>
        </div>
      </div>

      <div className="divider"></div>

      <div className="profile-info">
        <div className="info-row">
          <span className="info-label">Email</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phone</span>
          <span className="info-value">{user.phone}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Address</span>
          <span className="info-value">{user.address}</span>
        </div>
        {user.promoCode && (
          <div className="info-row">
            <span className="info-label">Promo Code</span>
            <span className="info-value promo">{user.promoCode}</span>
          </div>
        )}
      </div>

      <button className="edit-profile-btn">Edit Profile</button>
    </div>

    <div className="quick-stats-card">
      <h3>Performance</h3>
      <div className="stats-grid">
        <div className="mini-stat">
          <div className="mini-stat-icon">🏆</div>
          <div className="mini-stat-value">{user.stats.wins}</div>
          <div className="mini-stat-label">Wins</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-icon">💀</div>
          <div className="mini-stat-value">{user.stats.kills}</div>
          <div className="mini-stat-label">Kills</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-icon">🎯</div>
          <div className="mini-stat-value">{user.stats.assists}</div>
          <div className="mini-stat-label">Assists</div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSidebar;

