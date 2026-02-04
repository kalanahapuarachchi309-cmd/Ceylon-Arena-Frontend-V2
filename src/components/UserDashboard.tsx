import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

interface IGame {
  game: string;
  gameId: string;
  teamName: string;
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
}

interface IUser {
  playerName: string;
  email: string;
  phone: string;
  promoCode?: string;
  address: string;
  games: IGame[];
  stats: {
    totalMatches: number;
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    assists: number;
    topTenFinishes: number;
    averagePlacement: number;
  };
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'games' | 'stats'>('stats');
  const [user, setUser] = useState<IUser>({
    playerName: "SHADOW KILLER",
    email: "shadow@freefire.com",
    phone: "+1 (555) 999-8888",
    promoCode: "FF2026PRO",
    address: "Battle Arena, Victory Street",
    stats: {
      totalMatches: 150,
      wins: 45,
      losses: 105,
      kills: 1250,
      deaths: 380,
      assists: 290,
      topTenFinishes: 89,
      averagePlacement: 12.5
    },
    games: [
      {
        game: "Free Fire",
        gameId: "FF2026001",
        teamName: "Shadow Legends",
        player1Name: "Shadow Killer",
        player2Name: "Night Hunter",
        player3Name: "Storm Breaker",
        player4Name: "Phoenix Rider"
      }
    ]
  });

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(prevUser => ({
          ...prevUser,
          playerName: userData.playerName || prevUser.playerName,
          email: userData.email || prevUser.email,
          phone: userData.phone || prevUser.phone,
          promoCode: userData.promocode || prevUser.promoCode,
          address: userData.leaderAddress || prevUser.address
        }));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const winRate = ((user.stats.wins / user.stats.totalMatches) * 100).toFixed(1);
  const kdr = (user.stats.kills / user.stats.deaths).toFixed(2);
  // const lossRate = ((user.stats.losses / user.stats.totalMatches) * 100).toFixed(1);

  // Team comparison data (mock data for demonstration)
  const teamComparison = [
    { team: "Shadow Legends", winRate: 30, kills: 1250, avgPlacement: 12.5, color: "#ff0080" },
    { team: "Storm Riders", winRate: 28, kills: 1180, avgPlacement: 14.2, color: "#00ffff" },
    { team: "Night Hawks", winRate: 25, kills: 1050, avgPlacement: 15.8, color: "#ffd93d" },
    { team: "Fire Dragons", winRate: 22, kills: 980, avgPlacement: 17.3, color: "#ff00ff" },
    { team: "Ice Warriors", winRate: 20, kills: 890, avgPlacement: 18.9, color: "#00d4ff" }
  ];

  // const maxKills = Math.max(...teamComparison.map(t => t.kills));

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>⚡ FREE FIRE DASHBOARD</h1>
            <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Left Sidebar - User Profile Card */}
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

            {/* Quick Stats */}
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

          {/* Right Content Area */}
          <div className="content-area">
            {/* Tabs */}
            <div className="tabs-navigation">
              <button 
                className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Statistics
              </button>
              <button 
                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
                onClick={() => setActiveTab('games')}
              >
                My Game ({user.games.length})
              </button>
            </div>

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="tab-content stats-tab">
                {/* Win Rate Overview */}
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

                {/* Charts Grid */}
                <div className="charts-grid">
                  {/* Pie Chart - Win/Loss Distribution */}
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
                          strokeDasharray={`${(user.stats.wins / user.stats.totalMatches) * 502.65} 502.65`}
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
                          strokeDasharray={`${(user.stats.losses / user.stats.totalMatches) * 502.65} 502.65`}
                          strokeDashoffset={`-${(user.stats.wins / user.stats.totalMatches) * 502.65}`}
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
                          <span className="legend-color" style={{backgroundColor: '#ff0080'}}></span>
                          <span className="legend-text">Wins: {user.stats.wins}</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color" style={{backgroundColor: '#00ffff'}}></span>
                          <span className="legend-text">Losses: {user.stats.losses}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kill Stats */}
                  <div className="chart-card">
                    <h4 className="chart-title">Combat Statistics</h4>
                    <div className="combat-stats">
                      <div className="combat-stat-item">
                        <div className="combat-stat-header">
                          <span className="combat-stat-label">Total Kills</span>
                          <span className="combat-stat-value">{user.stats.kills}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill kills-fill" 
                            style={{width: '100%'}}
                          ></div>
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
                            style={{width: `${(user.stats.deaths / user.stats.kills) * 100}%`}}
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
                            style={{width: `${(user.stats.assists / user.stats.kills) * 100}%`}}
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
                            style={{width: `${(user.stats.topTenFinishes / user.stats.totalMatches) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Comparison */}
                <div className="comparison-section">
                  <h3 className="section-title">Team Comparison</h3>
                  
                  <div className="comparison-tables">
                    {/* Win Rate Table */}
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
                            {teamComparison.map((team, index) => (
                              <tr key={index} className={index === 0 ? 'highlight-row' : ''}>
                                <td className="rank-cell">
                                  <span className="rank-badge" style={{backgroundColor: team.color}}>
                                    #{index + 1}
                                  </span>
                                </td>
                                <td className="team-cell">{team.team}</td>
                                <td className="stat-cell">
                                  <span className="stat-highlight" style={{color: team.color}}>
                                    {team.winRate}%
                                  </span>
                                </td>
                                <td className="matches-cell">
                                  {Math.floor(team.kills / 8)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Kill Count Table */}
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
                            {teamComparison.map((team, index) => (
                              <tr key={index} className={index === 0 ? 'highlight-row' : ''}>
                                <td className="rank-cell">
                                  <span className="rank-badge" style={{backgroundColor: team.color}}>
                                    #{index + 1}
                                  </span>
                                </td>
                                <td className="team-cell">{team.team}</td>
                                <td className="stat-cell">
                                  <span className="stat-highlight" style={{color: team.color}}>
                                    {team.kills}
                                  </span>
                                </td>
                                <td className="matches-cell">
                                  {(team.kills / Math.floor(team.kills / 8)).toFixed(1)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Overview Tab */}
            {activeTab === 'profile' && (
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
                      <span className="status-badge active">Active</span>
                    </div>
                    <div className="status-item">
                      <span className="status-title">Member Since</span>
                      <span className="status-value">January 2026</span>
                    </div>
                    <div className="status-item">
                      <span className="status-title">Account Tier</span>
                      <span className="status-badge premium">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Games Tab */}
            {activeTab === 'games' && (
              <div className="tab-content games-tab">
                <div className="games-container">
                  {user.games.length > 0 ? (
                    user.games.map((game, index) => (
                      <div key={index} className="game-card">
                        <div className="game-header">
                          <h3 className="game-title">{game.game}</h3>
                          <span className="game-id">ID: {game.gameId}</span>
                        </div>
                        
                        <div className="game-team">
                          <h4>Team: {game.teamName}</h4>
                        </div>

                        <div className="team-players">
                          <div className="players-list">
                            <div className="player-slot">
                              <span className="slot-number">1</span>
                              <span className="player-name">{game.player1Name}</span>
                            </div>
                            <div className="player-slot">
                              <span className="slot-number">2</span>
                              <span className="player-name">{game.player2Name}</span>
                            </div>
                            <div className="player-slot">
                              <span className="slot-number">3</span>
                              <span className="player-name">{game.player3Name}</span>
                            </div>
                            <div className="player-slot">
                              <span className="slot-number">4</span>
                              <span className="player-name">{game.player4Name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="game-actions">
                          <button className="action-btn view-stats">View Stats</button>
                          <button className="action-btn play-btn">Play Now</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-games">
                      <p>No games registered yet. Join a game to get started!</p>
                      <button className="join-btn">Browse Games</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;