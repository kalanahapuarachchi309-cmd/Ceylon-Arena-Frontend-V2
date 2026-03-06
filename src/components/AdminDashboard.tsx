import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { API_BASE_URL } from '../config/api';

interface Team {
  id: string;
  name: string;
  wins: number;
  losses: number;
  totalMatches: number;
  status: 'winner' | 'active' | 'no-win';
}

interface Leader {
  id: string;
  name: string;
  wins: number;
  matches: number;
  winRate: number;
}

interface Teammate {
  id: string;
  name: string;
  team: string;
  kills: number;
  deaths: number;
  assists: number;
}

interface Event {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  prizePool: string;
}

interface Tournament {
  id: string;
  name: string;
  game: string;
  totalTeams: number;
  winnerId?: string;
  status: 'registration' | 'live' | 'finished';
  startDate: string;
}

interface Payment {
  id: string;
  playerName: string;
  email: string;
  phone: string;
  game: string;
  team: string;
  amount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  status: 'verified' | 'pending' | 'rejected';
  paymentSlipUrl: string;
  registeredAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'leaders' | 'events' | 'tournaments' | 'payments'>('overview');
  const [adminName, setAdminName] = useState<string>('Admin');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

  useEffect(() => {
    // Load admin data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData.playerName) {
          setAdminName(userData.playerName);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    }
  }, []);

  // Sample data
  const [teams] = useState<Team[]>([
    { id: '1', name: 'Thunder Warriors', wins: 8, losses: 2, totalMatches: 10, status: 'winner' },
    { id: '2', name: 'Phoenix Squad', wins: 6, losses: 4, totalMatches: 10, status: 'active' },
    { id: '3', name: 'Silent Assassins', wins: 0, losses: 5, totalMatches: 5, status: 'no-win' },
    { id: '4', name: 'Neon Knights', wins: 7, losses: 3, totalMatches: 10, status: 'winner' },
    { id: '5', name: 'Cyber Legends', wins: 0, losses: 3, totalMatches: 3, status: 'no-win' },
  ]);

  const [leaders] = useState<Leader[]>([
    { id: '1', name: 'Alex Lightning', wins: 12, matches: 15, winRate: 80 },
    { id: '2', name: 'Shadow Master', wins: 10, matches: 14, winRate: 71 },
    { id: '3', name: 'Phoenix Rising', wins: 9, matches: 12, winRate: 75 },
    { id: '4', name: 'Cyber King', wins: 8, matches: 11, winRate: 73 },
    { id: '5', name: 'Titan Blaze', wins: 7, matches: 10, winRate: 70 },
  ]);

  const [teammates] = useState<Teammate[]>([
    { id: '1', name: 'Player One', team: 'Thunder Warriors', kills: 245, deaths: 34, assists: 67 },
    { id: '2', name: 'Player Two', team: 'Thunder Warriors', kills: 198, deaths: 45, assists: 52 },
    { id: '3', name: 'Player Three', team: 'Phoenix Squad', kills: 210, deaths: 38, assists: 71 },
    { id: '4', name: 'Player Four', team: 'Neon Knights', kills: 189, deaths: 42, assists: 48 },
    { id: '5', name: 'Player Five', team: 'Silent Assassins', kills: 67, deaths: 156, assists: 12 },
  ]);

  const [events] = useState<Event[]>([
    { id: '1', name: 'Free Fire Championship 2026', date: '2026-02-15', status: 'upcoming', participants: 128, prizePool: 'Rs 50,000' },
    { id: '2', name: 'PUBG Regional Finals', date: '2026-02-20', status: 'ongoing', participants: 64, prizePool: 'Rs 75,000' },
    { id: '3', name: 'Valorant Masters', date: '2026-01-25', status: 'completed', participants: 32, prizePool: 'Rs 100,000' },
  ]);

  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch payments from backend and map to frontend Payment shape
  const fetchPayments = async (page = 1, limit = 10) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/payments?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped: Payment[] = (data.payments || []).map((p: any) => ({
        id: p._id,
        playerName: p.accountHolder || `User ${String(p.userId || '').slice(-6)}`,
        email: p.email || '',
        phone: p.accountNumber || '',
        game: p.game || '',
        team: p.team || '',
        amount: `Rs ${
          (typeof p.amount === 'number' ? p.amount : parseFloat(p.amount || 0)).toFixed(2)
        }`,
        paymentDate: p.paymentDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''),
        paymentMethod: p.paymentMethod === 'BANK' ? 'Bank Transfer' : p.paymentMethod || '',
        transactionId: p.transactionId || '',
        status: (String(p.status || '').toLowerCase() === 'verified' ? 'verified' : String(p.status || '').toLowerCase() === 'rejected' ? 'rejected' : 'pending'),
        paymentSlipUrl: p.slipFilePath || p.paymentSlipUrl || '',
        registeredAt: p.createdAt ? new Date(p.createdAt).toLocaleString() : (p.registeredAt || ''),
      }));
      setPayments(mapped);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    // fetch initially and whenever payments tab is selected
    fetchPayments();
  }, []);

  const [tournaments] = useState<Tournament[]>([
    { id: '1', name: 'Free Fire Battle Royale Season 1', game: 'Free Fire', totalTeams: 32, winnerId: '1', status: 'finished', startDate: '2026-01-10' },
    { id: '2', name: 'PUBG Squad Championship', game: 'PUBG', totalTeams: 16, winnerId: '4', status: 'finished', startDate: '2026-01-15' },
    { id: '3', name: 'Valorant Esports League', game: 'Valorant', totalTeams: 24, status: 'live', startDate: '2026-02-01' },
  ]);

  // Statistics
  const totalTeams = teams.length;
  const teamsWithWins = teams.filter(t => t.wins > 0).length;
  const teamsWithoutWins = teams.filter(t => t.wins === 0).length;
  const totalMatches = teams.reduce((sum, t) => sum + t.totalMatches, 0) / teams.length;
  const totalEvents = events.length;
  const activeTournaments = tournaments.filter(t => t.status === 'live').length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <button className="btn-back-to-home" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="admin-title-section">
          <h1 className="admin-title">⚡ ADMIN CONTROL CENTER</h1>
          <p className="admin-subtitle">Gaming Tournament Management & Analytics Hub</p>
          <p className="admin-welcome">Welcome, <span style={{ color: '#00ffff', fontWeight: 'bold' }}>{adminName}</span></p>
        </div>
        <div className="admin-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          👥 Teams & Winners
        </button>
        <button
          className={`nav-btn ${activeTab === 'leaders' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaders')}
        >
          🏆 Leaders & Stats
        </button>
        <button
          className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎯 Events
        </button>
        <button
          className={`nav-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
        >
          🎮 Tournaments
        </button>
        <button
          className={`nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments
        </button>
      </div>

      {/* Content Sections */}
      <div className="admin-content">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content overview-tab">
            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card metric-primary">
                <div className="metric-icon">👥</div>
                <div className="metric-info">
                  <h3>Total Teams</h3>
                  <p className="metric-value">{totalTeams}</p>
                  <span className="metric-label">Active Competitors</span>
                </div>
              </div>

              <div className="metric-card metric-success">
                <div className="metric-icon">🏆</div>
                <div className="metric-info">
                  <h3>Teams with Wins</h3>
                  <p className="metric-value">{teamsWithWins}</p>
                  <span className="metric-label">Victory Teams</span>
                </div>
              </div>

              <div className="metric-card metric-warning">
                <div className="metric-icon">⚠️</div>
                <div className="metric-info">
                  <h3>No Wins Yet</h3>
                  <p className="metric-value">{teamsWithoutWins}</p>
                  <span className="metric-label">Active Teams</span>
                </div>
              </div>

              <div className="metric-card metric-info-card">
                <div className="metric-icon">📈</div>
                <div className="metric-info">
                  <h3>Avg Matches</h3>
                  <p className="metric-value">{totalMatches.toFixed(1)}</p>
                  <span className="metric-label">Per Team</span>
                </div>
              </div>

              <div className="metric-card metric-secondary">
                <div className="metric-icon">🎯</div>
                <div className="metric-info">
                  <h3>Active Events</h3>
                  <p className="metric-value">{totalEvents}</p>
                  <span className="metric-label">Running Now</span>
                </div>
              </div>

              <div className="metric-card metric-accent">
                <div className="metric-icon">🎮</div>
                <div className="metric-info">
                  <h3>Live Tournaments</h3>
                  <p className="metric-value">{activeTournaments}</p>
                  <span className="metric-label">Ongoing</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              {/* Pie Chart - Team Status Distribution */}
              <div className="chart-container">
                <h3>Team Status Distribution</h3>
                <div className="pie-chart">
                  <svg viewBox="0 0 200 200" className="pie-svg">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ff0080" strokeWidth="50" strokeDasharray="125 314" strokeDashoffset="0" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#00ffff" strokeWidth="50" strokeDasharray="113 314" strokeDashoffset="-125" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ff8e53" strokeWidth="50" strokeDasharray="76 314" strokeDashoffset="-238" />
                  </svg>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#ff0080' }}></span>
                    <span>Winners: {teamsWithWins}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#00ffff' }}></span>
                    <span>Active: {teamsWithWins}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#ff8e53' }}></span>
                    <span>No Wins: {teamsWithoutWins}</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart - Team Performance */}
              <div className="chart-container">
                <h3>Top Teams Performance</h3>
                <div className="bar-chart">
                  {teams.slice(0, 4).map((team, index) => {
                    const winRate = (team.wins / team.totalMatches * 100).toFixed(0);
                    return (
                      <div key={team.id} className="bar-item">
                        <div className="bar-label">{team.name.substring(0, 10)}</div>
                        <div className="bar-container">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${winRate}%`,
                              backgroundColor: ['#ff0080', '#00ffff', '#ff8e53', '#a55eea'][index],
                            }}
                          >
                            <span className="bar-value">{winRate}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bars - Match Distribution */}
              <div className="chart-container wide">
                <h3>Wins vs Losses Distribution</h3>
                <div className="progress-bars">
                  {teams.slice(0, 5).map((team) => (
                    <div key={team.id} className="progress-item">
                      <div className="progress-header">
                        <span className="progress-title">{team.name}</span>
                        <span className="progress-stats">{team.wins}W - {team.losses}L</span>
                      </div>
                      <div className="progress-container">
                        <div
                          className="progress-bar wins"
                          style={{ width: `${(team.wins / team.totalMatches) * 100}%` }}
                        ></div>
                        <div
                          className="progress-bar losses"
                          style={{ width: `${(team.losses / team.totalMatches) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teams & Winners Tab */}
        {activeTab === 'teams' && (
          <div className="tab-content teams-tab">
            <div className="table-wrapper">
              <h2>🏆 Teams & Winners Status</h2>
              
              {/* Winners Section */}
              <div className="section-card">
                <h3 className="section-title">✨ Teams with Wins</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Wins</th>
                      <th>Losses</th>
                      <th>Total Matches</th>
                      <th>Win Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.filter(t => t.wins > 0).map((team) => (
                      <tr key={team.id} className="winner-row">
                        <td className="team-cell">
                          <span className="winner-badge">🏅</span>
                          {team.name}
                        </td>
                        <td><span className="badge wins-badge">{team.wins}</span></td>
                        <td><span className="badge losses-badge">{team.losses}</span></td>
                        <td>{team.totalMatches}</td>
                        <td>
                          <div className="progress-mini">
                            <div
                              className="progress-fill"
                              style={{ width: `${(team.wins / team.totalMatches) * 100}%` }}
                            ></div>
                          </div>
                          {((team.wins / team.totalMatches) * 100).toFixed(0)}%
                        </td>
                        <td><span className="status-badge winner">Winner</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* No Wins Section */}
              <div className="section-card">
                <h3 className="section-title">⚠️ Teams Still Looking for Their First Win</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Wins</th>
                      <th>Losses</th>
                      <th>Total Matches</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.filter(t => t.wins === 0).map((team) => (
                      <tr key={team.id} className="no-win-row">
                        <td className="team-cell">
                          <span className="no-win-badge">❌</span>
                          {team.name}
                        </td>
                        <td><span className="badge no-wins-badge">0</span></td>
                        <td><span className="badge losses-badge">{team.losses}</span></td>
                        <td>{team.totalMatches}</td>
                        <td><span className="status-badge pending">No Win Yet</span></td>
                        <td>
                          <button className="action-btn">Support</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Leaders & Stats Tab */}
        {activeTab === 'leaders' && (
          <div className="tab-content leaders-tab">
            <div className="leaders-wrapper">
              <h2>🏆 Leaderboard & Player Statistics</h2>

              {/* Leaders Table */}
              <div className="section-card">
                <h3 className="section-title">Top Players</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player Name</th>
                      <th>Wins</th>
                      <th>Matches Played</th>
                      <th>Win Rate</th>
                      <th>Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((leader, index) => (
                      <tr key={leader.id} className={`leader-row rank-${index + 1}`}>
                        <td>
                          <span className={`rank-badge rank-${index + 1}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </span>
                        </td>
                        <td className="leader-name">{leader.name}</td>
                        <td><strong>{leader.wins}</strong></td>
                        <td>{leader.matches}</td>
                        <td>
                          <div className="winrate-bar">
                            <div className="winrate-fill" style={{ width: `${leader.winRate}%` }}></div>
                            <span className="winrate-text">{leader.winRate}%</span>
                          </div>
                        </td>
                        <td>
                          {index === 0 && <span className="achievement-badge">⭐ Legend</span>}
                          {index === 1 && <span className="achievement-badge">🔥 Elite</span>}
                          {index === 2 && <span className="achievement-badge">💎 Pro</span>}
                          {index >= 3 && <span className="achievement-badge">⚡ Veteran</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Teammates Statistics */}
              <div className="section-card">
                <h3 className="section-title">Player Performance Stats</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <th>Team</th>
                      <th>Kills</th>
                      <th>Deaths</th>
                      <th>Assists</th>
                      <th>K/D Ratio</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teammates.map((teammate) => {
                      const kdRatio = (teammate.kills / (teammate.deaths || 1)).toFixed(2);
                      const performance = teammate.kills > 200 ? 'Excellent' : teammate.kills > 100 ? 'Good' : 'Average';
                      return (
                        <tr key={teammate.id}>
                          <td className="player-name">{teammate.name}</td>
                          <td><span className="team-label">{teammate.team}</span></td>
                          <td><span className="stat-badge kills">{teammate.kills}</span></td>
                          <td><span className="stat-badge deaths">{teammate.deaths}</span></td>
                          <td><span className="stat-badge assists">{teammate.assists}</span></td>
                          <td><strong>{kdRatio}</strong></td>
                          <td>
                            <span className={`performance-badge ${performance.toLowerCase()}`}>
                              {performance}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="tab-content events-tab">
            <div className="events-wrapper">
              <h2>🎯 Manage Events</h2>

              <div className="section-card">
                <div className="events-grid">
                  {events.map((event) => (
                    <div key={event.id} className="event-card-admin">
                      <div className={`event-status-badge ${event.status}`}>
                        {event.status === 'upcoming' && '📅 Upcoming'}
                        {event.status === 'ongoing' && '🔴 Ongoing'}
                        {event.status === 'completed' && '✅ Completed'}
                      </div>
                      
                      <h3 className="event-title">{event.name}</h3>
                      
                      <div className="event-details">
                        <div className="event-detail-item">
                          <span className="detail-icon">📅</span>
                          <span>{event.date}</span>
                        </div>
                        <div className="event-detail-item">
                          <span className="detail-icon">👥</span>
                          <span>{event.participants} Participants</span>
                        </div>
                        <div className="event-detail-item">
                          <span className="detail-icon">💰</span>
                          <span>Prize: {event.prizePool}</span>
                        </div>
                      </div>

                      <div className="event-actions">
                        <button className="btn-event edit">Edit</button>
                        <button className="btn-event delete">Delete</button>
                        <button className="btn-event view">View</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-event-section">
                  <button className="btn-add-event">+ Add New Event</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div className="tab-content tournaments-tab">
            <div className="tournaments-wrapper">
              <h2>🎮 Manage Tournaments</h2>

              <div className="section-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tournament Name</th>
                      <th>Game</th>
                      <th>Teams</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Winner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournaments.map((tournament) => {
                      const winner = teams.find(t => t.id === tournament.winnerId);
                      return (
                        <tr key={tournament.id}>
                          <td className="tournament-name">{tournament.name}</td>
                          <td>{tournament.game}</td>
                          <td><span className="team-count-badge">{tournament.totalTeams}</span></td>
                          <td>{tournament.startDate}</td>
                          <td>
                            <span className={`status-badge ${tournament.status}`}>
                              {tournament.status === 'registration' && '📝 Registration'}
                              {tournament.status === 'live' && '🔴 Live'}
                              {tournament.status === 'finished' && '✅ Finished'}
                            </span>
                          </td>
                          <td>
                            {winner ? (
                              <span className="winner-name">
                                🏆 {winner.name}
                              </span>
                            ) : (
                              <span className="no-winner">-</span>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="action-btn small">Edit</button>
                              <button className="action-btn small">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="add-tournament-section">
                  <button className="btn-add-tournament">+ Create Tournament</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (() => {
          const filtered = payments.filter(p => paymentFilter === 'all' || p.status === paymentFilter);
          const parseAmt = (a: string) => parseFloat(a.replace(/[^0-9.-]+/g, ''));
          const totalRevenue = payments.reduce((s, p) => s + parseAmt(p.amount), 0);
          const verifiedRevenue = payments.filter(p => p.status === 'verified').reduce((s, p) => s + parseAmt(p.amount), 0);
          const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((s, p) => s + parseAmt(p.amount), 0);
          const rejectedRevenue = payments.filter(p => p.status === 'rejected').reduce((s, p) => s + parseAmt(p.amount), 0);
          const avgAmount = totalRevenue / payments.length;
          const verifiedPct = Math.round((payments.filter(p => p.status === 'verified').length / payments.length) * 100);
          const filteredTotal = filtered.reduce((s, p) => s + parseAmt(p.amount), 0);

          return (
            <div className="tab-content payments-tab">
              <div className="payments-wrapper">

                {/* Header */}
                <div className="payments-header">
                  <h2>💳 Payment Registrations</h2>
                  <div className="payment-summary-badges">
                    <span className="pay-summary verified">{payments.filter(p => p.status === 'verified').length} Verified</span>
                    <span className="pay-summary pending">{payments.filter(p => p.status === 'pending').length} Pending</span>
                    <span className="pay-summary rejected">{payments.filter(p => p.status === 'rejected').length} Rejected</span>
                  </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="payment-kpi-grid">
                  <div className="kpi-card kpi-total">
                    <div className="kpi-icon">💰</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Total Revenue</span>
                      <span className="kpi-value">Rs {totalRevenue.toFixed(2)}</span>
                      <span className="kpi-sub">{payments.length} transactions</span>
                    </div>
                  </div>
                  <div className="kpi-card kpi-verified">
                    <div className="kpi-icon">✅</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Verified Revenue</span>
                      <span className="kpi-value">Rs {verifiedRevenue.toFixed(2)}</span>
                      <span className="kpi-sub">{verifiedPct}% success rate</span>
                    </div>
                  </div>
                  <div className="kpi-card kpi-pending">
                    <div className="kpi-icon">⏳</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Pending Revenue</span>
                      <span className="kpi-value">Rs {pendingRevenue.toFixed(2)}</span>
                      <span className="kpi-sub">{payments.filter(p => p.status === 'pending').length} awaiting review</span>
                    </div>
                  </div>
                  <div className="kpi-card kpi-rejected">
                    <div className="kpi-icon">❌</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Rejected Revenue</span>
                      <span className="kpi-value">Rs {rejectedRevenue.toFixed(2)}</span>
                      <span className="kpi-sub">{payments.filter(p => p.status === 'rejected').length} rejected</span>
                    </div>
                  </div>
                  <div className="kpi-card kpi-avg">
                    <div className="kpi-icon">📊</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Avg. Payment</span>
                      <span className="kpi-value">Rs {avgAmount.toFixed(2)}</span>
                      <span className="kpi-sub">per registration</span>
                    </div>
                  </div>
                  <div className="kpi-card kpi-rate">
                    <div className="kpi-icon">📈</div>
                    <div className="kpi-content">
                      <span className="kpi-label">Verified Rate</span>
                      <span className="kpi-value">{verifiedPct}%</span>
                      <div className="kpi-progress-bar"><div className="kpi-progress-fill" style={{width:`${verifiedPct}%`}}></div></div>
                    </div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="payment-filters">
                  {(['all', 'verified', 'pending', 'rejected'] as const).map((f) => (
                    <button
                      key={f}
                      className={`filter-btn ${paymentFilter === f ? 'active' : ''} filter-${f}`}
                      onClick={() => setPaymentFilter(f)}
                    >
                      {f === 'all' ? `🗂️ All (${payments.length})` : f === 'verified' ? `✅ Verified (${payments.filter(p=>p.status==='verified').length})` : f === 'pending' ? `⏳ Pending (${payments.filter(p=>p.status==='pending').length})` : `❌ Rejected (${payments.filter(p=>p.status==='rejected').length})`}
                    </button>
                  ))}
                </div>

                {/* Excel Table */}
                <div className="excel-table-wrapper">
                  <table className="excel-table">
                    <thead>
                      <tr>
                          <th className="col-no">#</th>
                          <th>Player Name</th>
                          <th>Phone</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Transaction ID</th>
                          <th>Payment Date</th>
                          <th>Registered At</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                      {filtered.map((payment, index) => (
                        <tr
                          key={payment.id}
                          className={`excel-row excel-row-${payment.status}`}
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <td className="col-no">{index + 1}</td>
                          <td className="excel-player">
                            <span className="excel-avatar">{payment.playerName.charAt(0)}</span>
                            {payment.playerName}
                          </td>
                          <td>{payment.phone}</td>
                          <td className="excel-amount">{payment.amount}</td>
                          <td>{payment.paymentMethod}</td>
                          <td className="excel-txn">{payment.transactionId}</td>
                          <td>{payment.paymentDate}</td>
                          <td className="excel-reg">{payment.registeredAt}</td>
                          <td>
                            <span className={`payment-status-badge ${payment.status}`}>
                              {payment.status === 'verified' && '✅ Verified'}
                              {payment.status === 'pending' && '⏳ Pending'}
                              {payment.status === 'rejected' && '❌ Rejected'}
                            </span>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <button className="excel-action-btn view" onClick={() => setSelectedPayment(payment)}>👁 View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="excel-totals-row">
                        <td className="col-no"></td>
                        <td><strong>TOTALS</strong></td>
                        <td></td>
                        <td className="excel-amount total-cell"><strong>Rs {filteredTotal.toFixed(2)}</strong></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>
                            ✅{filtered.filter(p=>p.status==='verified').length} &nbsp;
                            ⏳{filtered.filter(p=>p.status==='pending').length} &nbsp;
                            ❌{filtered.filter(p=>p.status==='rejected').length}
                          </span>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Game-wise Breakdown */}
                <div className="payment-breakdown-grid">
                  <div className="breakdown-card">
                    <h4 className="breakdown-title">💰 Revenue by Game</h4>
                    <table className="breakdown-table">
                      <thead><tr><th>Game</th><th>Count</th><th>Total</th><th>Avg</th></tr></thead>
                      <tbody>
                        {['Free Fire','PUBG','Valorant'].map(game => {
                          const gp = payments.filter(p => p.game === game);
                          const gt = gp.reduce((s,p) => s + parseAmt(p.amount), 0);
                          return (
                            <tr key={game}>
                              <td><span className="excel-game-badge">{game}</span></td>
                              <td>{gp.length}</td>
                              <td className="excel-amount">Rs {gt.toFixed(2)}</td>
                              <td className="excel-amount">Rs {gp.length ? (gt/gp.length).toFixed(2) : '0.00'}</td>
                            </tr>
                          );
                        })}
                        <tr className="breakdown-total">
                          <td><strong>TOTAL</strong></td>
                          <td><strong>{payments.length}</strong></td>
                          <td className="excel-amount"><strong>Rs {totalRevenue.toFixed(2)}</strong></td>
                          <td className="excel-amount"><strong>Rs {avgAmount.toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="breakdown-card">
                    <h4 className="breakdown-title">📋 Revenue by Method</h4>
                    <table className="breakdown-table">
                      <thead><tr><th>Method</th><th>Count</th><th>Total</th><th>Share</th></tr></thead>
                      <tbody>
                        {['Bank Transfer','Online Payment','Mobile Wallet'].map(method => {
                          const mp = payments.filter(p => p.paymentMethod === method);
                          const mt = mp.reduce((s,p) => s + parseAmt(p.amount), 0);
                          const share = totalRevenue ? Math.round((mt/totalRevenue)*100) : 0;
                          return (
                            <tr key={method}>
                              <td>{method}</td>
                              <td>{mp.length}</td>
                              <td className="excel-amount">Rs {mt.toFixed(2)}</td>
                              <td>
                                <div className="share-bar"><div className="share-fill" style={{width:`${share}%`}}></div></div>
                                <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>{share}%</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="breakdown-card">
                    <h4 className="breakdown-title">📊 Status Summary</h4>
                    <table className="breakdown-table">
                      <thead><tr><th>Status</th><th>Count</th><th>Revenue</th><th>%</th></tr></thead>
                      <tbody>
                        {(['verified','pending','rejected'] as const).map(status => {
                          const sp = payments.filter(p => p.status === status);
                          const st = sp.reduce((s,p) => s + parseAmt(p.amount), 0);
                          const pct = payments.length ? Math.round((sp.length/payments.length)*100) : 0;
                          return (
                            <tr key={status}>
                              <td><span className={`payment-status-badge ${status}`}>{status==='verified'?'✅ Verified':status==='pending'?'⏳ Pending':'❌ Rejected'}</span></td>
                              <td>{sp.length}</td>
                              <td className="excel-amount">Rs {st.toFixed(2)}</td>
                              <td>{pct}%</td>
                            </tr>
                          );
                        })}
                        <tr className="breakdown-total">
                          <td><strong>TOTAL</strong></td>
                          <td><strong>{payments.length}</strong></td>
                          <td className="excel-amount"><strong>Rs {totalRevenue.toFixed(2)}</strong></td>
                          <td><strong>100%</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="payment-modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedPayment(null)}>✕</button>

            <div className="modal-header">
              <div className="modal-avatar">{selectedPayment.playerName.charAt(0).toUpperCase()}</div>
              <div className="modal-title-info">
                <h2 className="modal-player-name">{selectedPayment.playerName}</h2>
                <span className={`payment-status-badge ${selectedPayment.status} large`}>
                  {selectedPayment.status === 'verified' && '✅ Verified'}
                  {selectedPayment.status === 'pending' && '⏳ Pending'}
                  {selectedPayment.status === 'rejected' && '❌ Rejected'}
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-details-section">
                <h3 className="modal-section-title">👤 Player Details</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Email</span>
                    <span className="modal-detail-value">{selectedPayment.email}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Phone</span>
                    <span className="modal-detail-value">{selectedPayment.phone}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Game</span>
                    <span className="modal-detail-value">{selectedPayment.game}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Team</span>
                    <span className="modal-detail-value">{selectedPayment.team}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Registered At</span>
                    <span className="modal-detail-value">{selectedPayment.registeredAt}</span>
                  </div>
                </div>

                <h3 className="modal-section-title" style={{ marginTop: '20px' }}>💳 Payment Details</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Amount</span>
                    <span className="modal-detail-value pay-amount">{selectedPayment.amount}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Method</span>
                    <span className="modal-detail-value">{selectedPayment.paymentMethod}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Date</span>
                    <span className="modal-detail-value">{selectedPayment.paymentDate}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Transaction ID</span>
                    <span className="modal-detail-value transaction-id">{selectedPayment.transactionId}</span>
                  </div>
                </div>
              </div>

              <div className="modal-slip-section">
                <h3 className="modal-section-title">🧾 Payment Slip</h3>
                <div className="slip-image-container">
                  <img
                    src={selectedPayment.paymentSlipUrl}
                    alt={`Payment slip for ${selectedPayment.playerName}`}
                    className="slip-image"
                  />
                </div>
                <div className="modal-action-buttons">
                  <button className="modal-action-btn verify" onClick={() => setSelectedPayment(null)}>✅ Verify</button>
                  <button className="modal-action-btn reject" onClick={() => setSelectedPayment(null)}>❌ Reject</button>
                  <button className="modal-action-btn download">⬇️ Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
