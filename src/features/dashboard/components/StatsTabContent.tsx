import type { DashboardUser, TeamComparisonRow } from "./dashboard.types";

interface StatsTabContentProps {
  user: DashboardUser;
  winRate: string;
  kdr: string;
  teamComparison: TeamComparisonRow[];
}

const StatsTabContent = ({ user, winRate, kdr, teamComparison }: StatsTabContentProps) => {
  const safeTotalMatches = Math.max(user.stats.totalMatches, 1);
  const safeKills = Math.max(user.stats.kills, 1);

  return (
    <div className="tab-content stats-tab">
      <div className="stats-overview">
        <div className="stats-header">
          <h3>Performance Overview</h3>
          <div className="stats-summary">
            <div className="summary-item">
              <span className="summary-label">Win Rate</span>
              <span className="summary-value win">{winRate}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Kills</span>
              <span className="summary-value kills">{user.stats.kills}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">K/D Ratio</span>
              <span className="summary-value kd">{kdr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4 className="chart-title">Win/Loss Distribution</h4>
          <div className="pie-chart-container">
            <svg className="pie-chart" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#ff0080"
                strokeWidth="40"
                strokeDasharray={`${(user.stats.wins / safeTotalMatches) * 502.65} 502.65`}
                transform="rotate(-90 100 100)"
                className="pie-segment wins"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#00ffff"
                strokeWidth="40"
                strokeDasharray={`${(user.stats.losses / safeTotalMatches) * 502.65} 502.65`}
                strokeDashoffset={`-${(user.stats.wins / safeTotalMatches) * 502.65}`}
                transform="rotate(-90 100 100)"
                className="pie-segment losses"
              />
              <text x="100" y="95" textAnchor="middle" className="pie-center-text">
                <tspan className="pie-percentage">{winRate}%</tspan>
              </text>
              <text x="100" y="115" textAnchor="middle" className="pie-label">
                Win Rate
              </text>
            </svg>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#ff0080" }}></span>
                <span className="legend-text">Wins: {user.stats.wins}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: "#00ffff" }}></span>
                <span className="legend-text">Losses: {user.stats.losses}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title">Combat Statistics</h4>
          <div className="combat-stats">
            <div className="combat-stat-item">
              <div className="combat-stat-header">
                <span className="combat-stat-label">Total Kills</span>
                <span className="combat-stat-value">{user.stats.kills}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill kills-fill" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="combat-stat-item">
              <div className="combat-stat-header">
                <span className="combat-stat-label">Deaths</span>
                <span className="combat-stat-value">{user.stats.deaths}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill deaths-fill"
                  style={{ width: `${safeKills ? (user.stats.deaths / safeKills) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="combat-stat-item">
              <div className="combat-stat-header">
                <span className="combat-stat-label">Assists</span>
                <span className="combat-stat-value">{user.stats.assists}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill assists-fill"
                  style={{ width: `${safeKills ? (user.stats.assists / safeKills) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="combat-stat-item">
              <div className="combat-stat-header">
                <span className="combat-stat-label">Top 10 Finishes</span>
                <span className="combat-stat-value">{user.stats.topTenFinishes}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill top10-fill"
                  style={{ width: `${(user.stats.topTenFinishes / safeTotalMatches) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="comparison-section">
        <h3 className="section-title">Team Comparison</h3>

        <div className="comparison-tables">
          <div className="comparison-card">
            <h4 className="comparison-title">Win Rate Comparison</h4>
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Win Rate</th>
                    <th>Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {teamComparison.length > 0 ? (
                    teamComparison.map((team, index) => (
                      <tr key={index} className={index === 0 ? "highlight-row" : ""}>
                        <td className="rank-cell">
                          <span className="rank-badge" style={{ backgroundColor: team.color }}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="team-cell">{team.team}</td>
                        <td className="stat-cell">
                          <span className="stat-highlight" style={{ color: team.color }}>
                            {team.winRate}%
                          </span>
                        </td>
                        <td className="matches-cell">{Math.floor(team.kills / 8)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No team comparison data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="comparison-card">
            <h4 className="comparison-title">Kill Count Comparison</h4>
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Total Kills</th>
                    <th>Avg/Match</th>
                  </tr>
                </thead>
                <tbody>
                  {teamComparison.length > 0 ? (
                    teamComparison.map((team, index) => (
                      <tr key={index} className={index === 0 ? "highlight-row" : ""}>
                        <td className="rank-cell">
                          <span className="rank-badge" style={{ backgroundColor: team.color }}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="team-cell">{team.team}</td>
                        <td className="stat-cell">
                          <span className="stat-highlight" style={{ color: team.color }}>
                            {team.kills}
                          </span>
                        </td>
                        <td className="matches-cell">
                          {(team.kills / Math.max(Math.floor(team.kills / 8), 1)).toFixed(1)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No team comparison data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTabContent;

