import type { KeyboardEvent, MouseEvent } from "react";

interface FeaturedGamesSectionProps {
  freefireImg: string;
  pubgImg: string;
  codImg: string;
  valoranImg: string;
  selectedCard: number | null;
  onSelectCard: (index: number | null) => void;
  onCardMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onCardMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
  onRegister: () => void;
}

const FeaturedGamesSection = ({
  freefireImg,
  pubgImg,
  codImg,
  valoranImg,
  selectedCard,
  onSelectCard,
  onCardMouseMove,
  onCardMouseLeave,
  onRegister,
}: FeaturedGamesSectionProps) => {
  const handleKeyboardSelect =
    (index: number) =>
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === "Enter" || event.key === " ") {
        onSelectCard(selectedCard === index ? null : index);
      }
    };

  return (
    <section className="section" id="games">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Games</h2>
          <p className="section-subtitle">What's Up Gammers? Register Now!</p>
        </div>

        <div className="games-grid">
          <div
            className={`game-card has-image ${selectedCard === 0 ? "selected" : ""}`}
            style={{ backgroundImage: `url(${freefireImg})` }}
            onClick={() => onSelectCard(selectedCard === 0 ? null : 0)}
            onMouseMove={onCardMouseMove}
            onMouseLeave={onCardMouseLeave}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyboardSelect(0)}
          >
            <div className="game-badge">Free Fire</div>
            <h3>Free Fire</h3>
            <p>This is the Biggest Free Fire Tournament! Are you ready to play?</p>
            <div className="game-stats">
              <span>🎮 1,234 Active Players</span>
              <span>🏆 15 Live Tournaments</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={onRegister}>
              Join Tournament
            </button>
          </div>

          <div
            className={`game-card has-image is-disabled ${selectedCard === 1 ? "selected" : ""}`}
            style={{ backgroundImage: `url(${pubgImg})` }}
            aria-disabled="true"
          >
            <div className="game-badge">PUBG Mobile</div>
            <div className="coming-soon-badge">Coming Soon</div>
            <h3>PUBG Mobile</h3>
            <p>Intense 100-player showdowns</p>
            <div className="game-stats">
              <span>🎮 2,456 Active Players</span>
              <span>🏆 22 Live Tournaments</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled>
              Coming Soon
            </button>
          </div>

          <div
            className={`game-card has-image is-disabled ${selectedCard === 2 ? "selected" : ""}`}
            style={{ backgroundImage: `url(${codImg})` }}
            aria-disabled="true"
          >
            <div className="game-badge">Call of Duty</div>
            <div className="coming-soon-badge">Coming Soon</div>
            <h3>Call of Duty</h3>
            <p>Tactical team-based warfare</p>
            <div className="game-stats">
              <span>🎮 987 Active Players</span>
              <span>🏆 8 Live Tournaments</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled>
              Coming Soon
            </button>
          </div>

          <div
            className={`game-card has-image is-disabled ${selectedCard === 3 ? "selected" : ""}`}
            style={{ backgroundImage: `url(${valoranImg})` }}
            aria-disabled="true"
          >
            <div className="game-badge">Valorant</div>
            <div className="coming-soon-badge">Coming Soon</div>
            <h3>Valorant</h3>
            <p>5v5 character-based tactical shooter</p>
            <div className="game-stats">
              <span>🎮 1,567 Active Players</span>
              <span>🏆 12 Live Tournaments</span>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGamesSection;

