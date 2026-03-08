interface LiveEventsSectionProps {
  onRegister: () => void;
}

const LiveEventsSection = ({ onRegister }: LiveEventsSectionProps) => (
  <section className="section live-section" id="events">
    <div className="container">
      <div className="section-header">
        <div className="live-badge">
          <div className="live-dot"></div>
          <span>LIVE ON</span>
        </div>
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">Hurry up! For the Enrollments - Be there! To win.</p>
      </div>

      <div className="events-container">
        <div className="event-card">
          <div className="event-date">
            <span className="date-day">25</span>
            <span className="date-month">JAN</span>
          </div>
          <div className="event-info">
            <h3>Free Fire Championship 2026</h3>
            <p>Biggest Prize Pool in Sri Lankan History! | 128 Teams</p>
            <div className="event-tags">
              <span className="tag">Battle Royale</span>
              <span className="tag">Squad</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onRegister}>
            Register
          </button>
        </div>

        <div className="event-card">
          <div className="event-date">
            <span className="date-day">02</span>
            <span className="date-month">FEB</span>
          </div>
          <div className="event-info">
            <h3>PUBG Pro League Season 3</h3>
            <p>Prize Pool: LKR 75,000 | 64 Teams</p>
            <div className="event-tags">
              <span className="tag">Professional</span>
              <span className="tag">Squad</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onRegister}>
            Register
          </button>
        </div>

        <div className="event-card">
          <div className="event-date">
            <span className="date-day">10</span>
            <span className="date-month">FEB</span>
          </div>
          <div className="event-info">
            <h3>Valorant Masters Cup</h3>
            <p>Prize Pool: LKR 100,000 | 32 Teams</p>
            <div className="event-tags">
              <span className="tag">Tactical</span>
              <span className="tag">Team</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default LiveEventsSection;

