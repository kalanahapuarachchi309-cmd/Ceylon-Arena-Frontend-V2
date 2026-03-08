import type { CSSProperties } from "react";

import type { GameData, GameType } from "./register.types";

interface GameSelectionViewProps {
  games: GameData[];
  onSelect: (gameId: GameType) => void;
}

const GameSelectionView = ({ games, onSelect }: GameSelectionViewProps) => (
  <div className="game-selection">
    <div className="games-selection-grid">
      {games.map((game) => (
        <div
          key={game.id}
          className={`game-selection-card ${game.disabled ? "disabled" : ""}`}
          onClick={() => !game.disabled && onSelect(game.id as GameType)}
          style={
            {
              backgroundImage: `url('${game.imagePath}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              "--game-color": game.color,
              "--game-color-light": game.lightColor,
              "--game-rgb": game.rgbColor,
            } as CSSProperties & {
              "--game-color": string;
              "--game-color-light": string;
              "--game-rgb": string;
            }
          }
        >
          <div className="game-selection-icon">
            {typeof game.icon === "string" && !game.icon.includes("/") ? (
              game.icon
            ) : (
              <img
                src={game.icon}
                alt={game.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
          {game.disabled && <div className="coming-soon">COMING SOON</div>}
          <button
            className="btn btn-select"
            style={{
              background: `linear-gradient(45deg, ${game.color}, ${game.lightColor})`,
              boxShadow: `0 0 20px ${game.color}`,
            }}
            disabled={game.disabled}
          >
            {game.disabled ? "Coming Soon" : "Select Game"}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default GameSelectionView;
