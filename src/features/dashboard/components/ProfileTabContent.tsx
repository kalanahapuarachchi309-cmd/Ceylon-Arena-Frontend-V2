import type { DashboardUser } from "./dashboard.types";

interface ProfileTabContentProps {
  user: DashboardUser;
}

const ProfileTabContent = ({ user }: ProfileTabContentProps) => (
  <div className="tab-content profile-tab">
    <div className="overview-section">
      <h3>Account Information</h3>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon">👤</div>
          <div className="info-details">
            <span className="detail-label">Player Name</span>
            <span className="detail-value">{user.playerName}</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📧</div>
          <div className="info-details">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📱</div>
          <div className="info-details">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phone}</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📍</div>
          <div className="info-details">
            <span className="detail-label">Address</span>
            <span className="detail-value">{user.address}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="overview-section">
      <h3>Account Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <span className="status-title">Account Status</span>
          <span className="status-badge active">{user.status ? "Active" : "Inactive"}</span>
        </div>
        <div className="status-item">
          <span className="status-title">Member Since</span>
          <span className="status-value">
            {user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A"}
          </span>
        </div>
        <div className="status-item">
          <span className="status-title">Account Tier</span>
          <span className="status-badge premium">{user.role || "PLAYER"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileTabContent;

