interface StatsBarSectionProps {
  onRegister: () => void;
}

const StatsBarSection = ({ onRegister }: StatsBarSectionProps) => (
  <>
    <section className="stats-bar">
      <iframe
        className="stats-video-bg"
        src="https://www.youtube.com/embed/RVwCB1zSy_Q?autoplay=1&mute=1&loop=1&playlist=RVwCB1zSy_Q&controls=0&modestbranding=1&rel=0&showinfo=0"
        title="Stats background video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>LKR 400,000</h3>
            <p>Champions</p>
          </div>
          <div className="stat-item">
            <h3>LKR 250,000</h3>
            <p>Runner Up</p>
          </div>
          <div className="stat-item">
            <h3>LKR 5,000</h3>
            <p>Gift Pack for Last 100 Players (Last 25 Teams)</p>
          </div>
          <div className="stat-item">
            <h3>LKR 1,000</h3>
            <p>Gift Pack for First 400 Registered Players</p>
          </div>
          <div className="stat-item">
            <h3>Store</h3>
            <p>Not Urgent</p>
          </div>
        </div>
      </div>
    </section>

    <section className="stats-register-cta">
      <div className="container">
        <button className="btn btn-primary" onClick={onRegister}>
          Register Now
        </button>
      </div>
    </section>
  </>
);

export default StatsBarSection;

