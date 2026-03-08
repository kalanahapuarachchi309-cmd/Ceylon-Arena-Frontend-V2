import type { UserGame } from "./dashboard.types";

interface GamesTabContentProps {
  games: UserGame[];
}

const GamesTabContent = ({ games }: GamesTabContentProps) => (
  <div className="tab-content games-tab">
    <div className="games-container">
      {games.length > 0 ? (
        games.map((game, index) => (
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
                  <span className="player-name">{game.gameId}</span>
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
);

export default GamesTabContent;

