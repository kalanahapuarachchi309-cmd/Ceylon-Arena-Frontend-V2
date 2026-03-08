import type { ChangeEvent, FormEvent } from "react";

import type { GameData, RegistrationFormValues } from "./register.types";

interface RegistrationFormViewProps {
  formData: RegistrationFormValues;
  selectedGameData?: GameData;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RegistrationFormView = ({
  formData,
  selectedGameData,
  onBack,
  onSubmit,
  onInputChange,
}: RegistrationFormViewProps) => (
  <div className="registration-form-container">
    <div className="selected-game-header">
      <button className="btn-back" onClick={onBack}>
        ← Back to Games
      </button>
    </div>

    <form className="registration-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Personal Information</h3>

        <div className="form-group">
          <label htmlFor="playerName">Team Leader Name *</label>
          <input
            type="text"
            id="playerName"
            name="playerName"
            value={formData.playerName}
            onChange={onInputChange}
            placeholder="Enter your Real name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">WhatsApp Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="promocode">Promo Code (Optional)</label>
          <input
            type="text"
            id="promocode"
            name="promocode"
            value={formData.promocode}
            onChange={onInputChange}
            placeholder="Enter promo code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaderAddress">Leader Address *</label>
          <input
            type="text"
            id="leaderAddress"
            name="leaderAddress"
            value={formData.leaderAddress}
            onChange={onInputChange}
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gameId">Leader Free Fire Game ID *</label>
          <input
            type="text"
            id="gameId"
            name="gameId"
            value={formData.gameId}
            onChange={onInputChange}
            placeholder="Enter Free Fire game ID"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Team Information</h3>

        <div className="form-group">
          <label htmlFor="teamName">Team Name *</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={onInputChange}
            placeholder="Enter your team name"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Other 4 Players Information</h3>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="player2Name">Player 2 Name *</label>
            <input
              type="text"
              id="player2Name"
              name="player2Name"
              value={formData.player2Name}
              onChange={onInputChange}
              placeholder="Enter player 2 Real name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="player2GameId">Player 2 Free Fire Game ID *</label>
            <input
              type="text"
              id="player2GameId"
              name="player2GameId"
              value={formData.player2GameId}
              onChange={onInputChange}
              placeholder="Enter Free Fire game ID"
              required
            />
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="player3Name">Player 3 Name *</label>
            <input
              type="text"
              id="player3Name"
              name="player3Name"
              value={formData.player3Name}
              onChange={onInputChange}
              placeholder="Enter player 3 Real name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="player3GameId">Player 3 Free Fire Game ID *</label>
            <input
              type="text"
              id="player3GameId"
              name="player3GameId"
              value={formData.player3GameId}
              onChange={onInputChange}
              placeholder="Enter Free Fire game ID"
              required
            />
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="player4Name">Player 4 Name *</label>
            <input
              type="text"
              id="player4Name"
              name="player4Name"
              value={formData.player4Name}
              onChange={onInputChange}
              placeholder="Enter player 4 Real name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="player4GameId">Player 4 Free Fire Game ID *</label>
            <input
              type="text"
              id="player4GameId"
              name="player4GameId"
              value={formData.player4GameId}
              onChange={onInputChange}
              placeholder="Enter Free Fire game ID"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-submit">
          Complete Registration
        </button>
        <button type="button" className="btn btn-cancel" onClick={onBack}>
          Cancel
        </button>
      </div>
    </form>

    <div className="selected-game-info">
      <div className="selected-game-info-wrapper">
        <svg className="selected-game-info-text" viewBox="0 0 280 280">
          <defs>
            <path
              id="circlePath"
              d="M 140, 140 m -110, 0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0"
            />
          </defs>
          <text
            fontSize="20"
            fontWeight="bold"
            fill="#ffffff"
            letterSpacing="3"
            className="animated-text"
          >
            <textPath href="#circlePath" startOffset="0%" textAnchor="start">
              {selectedGameData?.name.toUpperCase()} • {selectedGameData?.description} •{" "}
              {selectedGameData?.name.toUpperCase()} •
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  </div>
);

export default RegistrationFormView;

