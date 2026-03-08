import type { ChangeEvent, FormEvent } from "react";

import type { GameData, RegistrationFormValues } from "./register.types";

interface RegistrationFormViewProps {
  formData: RegistrationFormValues;
  selectedGameData?: GameData;
  loading: boolean;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RegistrationFormView = ({
  formData,
  selectedGameData,
  loading,
  onBack,
  onSubmit,
  onInputChange,
}: RegistrationFormViewProps) => (
  <div className="registration-form-container">
    <div className="selected-game-header">
      <button className="btn-back" onClick={onBack}>
        Back to Games
      </button>
    </div>

    <form className="registration-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Personal Information</h3>

        <div className="form-group">
          <label htmlFor="fullName">Team Leader Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            placeholder="Enter your full name"
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
            placeholder="+94771234567"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="promoCode">Promo Code (Optional)</label>
          <input
            type="text"
            id="promoCode"
            name="promoCode"
            value={formData.promoCode}
            onChange={onInputChange}
            placeholder="Enter promo code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaderInGameId">Leader In-Game ID *</label>
          <input
            type="text"
            id="leaderInGameId"
            name="leaderInGameId"
            value={formData.leaderInGameId}
            onChange={onInputChange}
            placeholder="Enter leader in-game id"
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
        <h3 className="form-section-title">Other 3 Players Information</h3>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member1Name">Player 2 Name *</label>
            <input
              type="text"
              id="member1Name"
              name="member1Name"
              value={formData.member1Name}
              onChange={onInputChange}
              placeholder="Enter player 2 name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="member1InGameId">Player 2 In-Game ID *</label>
            <input
              type="text"
              id="member1InGameId"
              name="member1InGameId"
              value={formData.member1InGameId}
              onChange={onInputChange}
              placeholder="Enter player 2 in-game id"
              required
            />
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member2Name">Player 3 Name *</label>
            <input
              type="text"
              id="member2Name"
              name="member2Name"
              value={formData.member2Name}
              onChange={onInputChange}
              placeholder="Enter player 3 name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="member2InGameId">Player 3 In-Game ID *</label>
            <input
              type="text"
              id="member2InGameId"
              name="member2InGameId"
              value={formData.member2InGameId}
              onChange={onInputChange}
              placeholder="Enter player 3 in-game id"
              required
            />
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member3Name">Player 4 Name *</label>
            <input
              type="text"
              id="member3Name"
              name="member3Name"
              value={formData.member3Name}
              onChange={onInputChange}
              placeholder="Enter player 4 name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="member3InGameId">Player 4 In-Game ID *</label>
            <input
              type="text"
              id="member3InGameId"
              name="member3InGameId"
              value={formData.member3InGameId}
              onChange={onInputChange}
              placeholder="Enter player 4 in-game id"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>
        <button type="button" className="btn btn-cancel" onClick={onBack} disabled={loading}>
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
          <text fontSize="20" fontWeight="bold" fill="#ffffff" letterSpacing="3" className="animated-text">
            <textPath href="#circlePath" startOffset="0%" textAnchor="start">
              {selectedGameData?.name.toUpperCase()} | {selectedGameData?.description} |{" "}
              {selectedGameData?.name.toUpperCase()} |
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  </div>
);

export default RegistrationFormView;
