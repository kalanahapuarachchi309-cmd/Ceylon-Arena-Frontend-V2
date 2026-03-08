import type { ChangeEvent, FormEvent } from "react";

import type { RegistrationFormValues } from "./register.types";

interface RegistrationFormViewProps {
  formData: RegistrationFormValues;
  fieldErrors: Partial<Record<keyof RegistrationFormValues, string>>;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RegistrationFormView = ({
  formData,
  fieldErrors,
  loading,
  onCancel,
  onSubmit,
  onInputChange,
}: RegistrationFormViewProps) => (
  <div className="registration-form-container">
    <div className="selected-game-header">
      <button className="btn-back" onClick={onCancel} disabled={loading}>
        Cancel
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
            aria-invalid={Boolean(fieldErrors.fullName)}
            required
          />
          {fieldErrors.fullName ? <p className="form-inline-error">{fieldErrors.fullName}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
          {fieldErrors.email ? <p className="form-inline-error">{fieldErrors.email}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.password)}
            required
          />
          {fieldErrors.password ? <p className="form-inline-error">{fieldErrors.password}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.phone)}
            required
          />
          {fieldErrors.phone ? <p className="form-inline-error">{fieldErrors.phone}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.address)}
            required
          />
          {fieldErrors.address ? <p className="form-inline-error">{fieldErrors.address}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.leaderInGameId)}
            required
          />
          {fieldErrors.leaderInGameId ? <p className="form-inline-error">{fieldErrors.leaderInGameId}</p> : null}
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
            aria-invalid={Boolean(fieldErrors.teamName)}
            required
          />
          {fieldErrors.teamName ? <p className="form-inline-error">{fieldErrors.teamName}</p> : null}
        </div>

        <div className="form-group">
          <label htmlFor="primaryGame">Primary Game *</label>
          <input
            type="text"
            id="primaryGame"
            name="primaryGame"
            value={formData.primaryGame}
            onChange={onInputChange}
            placeholder="Enter team primary game"
            aria-invalid={Boolean(fieldErrors.primaryGame)}
            required
          />
          {fieldErrors.primaryGame ? <p className="form-inline-error">{fieldErrors.primaryGame}</p> : null}
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
              aria-invalid={Boolean(fieldErrors.member1Name)}
              required
            />
            {fieldErrors.member1Name ? <p className="form-inline-error">{fieldErrors.member1Name}</p> : null}
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
              aria-invalid={Boolean(fieldErrors.member1InGameId)}
              required
            />
            {fieldErrors.member1InGameId ? (
              <p className="form-inline-error">{fieldErrors.member1InGameId}</p>
            ) : null}
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
              aria-invalid={Boolean(fieldErrors.member2Name)}
              required
            />
            {fieldErrors.member2Name ? <p className="form-inline-error">{fieldErrors.member2Name}</p> : null}
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
              aria-invalid={Boolean(fieldErrors.member2InGameId)}
              required
            />
            {fieldErrors.member2InGameId ? (
              <p className="form-inline-error">{fieldErrors.member2InGameId}</p>
            ) : null}
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
              aria-invalid={Boolean(fieldErrors.member3Name)}
              required
            />
            {fieldErrors.member3Name ? <p className="form-inline-error">{fieldErrors.member3Name}</p> : null}
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
              aria-invalid={Boolean(fieldErrors.member3InGameId)}
              required
            />
            {fieldErrors.member3InGameId ? (
              <p className="form-inline-error">{fieldErrors.member3InGameId}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={loading}>
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
              {(formData.primaryGame || "TEAM REGISTRATION").toUpperCase()} | LEADER ACCOUNT + TEAM |{" "}
              {(formData.primaryGame || "TEAM REGISTRATION").toUpperCase()} |
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  </div>
);

export default RegistrationFormView;
