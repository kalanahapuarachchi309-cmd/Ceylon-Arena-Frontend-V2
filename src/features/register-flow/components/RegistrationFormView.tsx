import { useState, type ChangeEvent, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

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
}: RegistrationFormViewProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
  <div className="registration-form-container">
    <form className="registration-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Personal Information</h3>

        <div className="form-group">
          <label htmlFor="fullName" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Team Leader Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            placeholder="Enter your full name"
            aria-invalid={Boolean(fieldErrors.fullName)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.fullName ? <p className="form-inline-error">{fieldErrors.fullName}</p> : null}
        </div>

        <div className="form-group">
          <label htmlFor="email" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="your.email@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.email ? <p className="form-inline-error">{fieldErrors.email}</p> : null}
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="password" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Password *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="Enter your password"
                aria-invalid={Boolean(fieldErrors.password)}
                required
                style={{ fontSize: '1rem', padding: '12px 16px' }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password ? <p className="form-inline-error">{fieldErrors.password}</p> : null}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Confirm Password *
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onInputChange}
                placeholder="Confirm your password"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                required
                style={{ fontSize: '1rem', padding: '12px 16px' }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.confirmPassword ? <p className="form-inline-error">{fieldErrors.confirmPassword}</p> : null}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            WhatsApp Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="+94771234567"
            aria-invalid={Boolean(fieldErrors.phone)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.phone ? <p className="form-inline-error">{fieldErrors.phone}</p> : null}
        </div>

        <div className="form-group">
          <label htmlFor="address" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Enter your address"
            aria-invalid={Boolean(fieldErrors.address)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.address ? <p className="form-inline-error">{fieldErrors.address}</p> : null}
        </div>

        <div className="form-group">
          <label htmlFor="promoCode" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Promo Code (Optional)
          </label>
          <input
            type="text"
            id="promoCode"
            name="promoCode"
            value={formData.promoCode}
            onChange={onInputChange}
            placeholder="Enter promo code"
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaderInGameId" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Leader In-Game ID *
          </label>
          <input
            type="text"
            id="leaderInGameId"
            name="leaderInGameId"
            value={formData.leaderInGameId}
            onChange={onInputChange}
            placeholder="Enter leader in-game id"
            aria-invalid={Boolean(fieldErrors.leaderInGameId)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.leaderInGameId ? <p className="form-inline-error">{fieldErrors.leaderInGameId}</p> : null}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Team Information</h3>

        <div className="form-group">
          <label htmlFor="teamName" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Team Name *
          </label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={onInputChange}
            placeholder="Enter your team name"
            aria-invalid={Boolean(fieldErrors.teamName)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.teamName ? <p className="form-inline-error">{fieldErrors.teamName}</p> : null}
        </div>

        <div className="form-group">
          <label htmlFor="primaryGame" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Primary Game *
          </label>
          <input
            type="text"
            id="primaryGame"
            name="primaryGame"
            value={formData.primaryGame}
            onChange={onInputChange}
            placeholder="Enter team primary game"
            aria-invalid={Boolean(fieldErrors.primaryGame)}
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
          {fieldErrors.primaryGame ? <p className="form-inline-error">{fieldErrors.primaryGame}</p> : null}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Other 3 Players Information</h3>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member1Name" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 2 Name *
            </label>
            <input
              type="text"
              id="member1Name"
              name="member1Name"
              value={formData.member1Name}
              onChange={onInputChange}
              placeholder="Enter player 2 name"
              aria-invalid={Boolean(fieldErrors.member1Name)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member1Name ? <p className="form-inline-error">{fieldErrors.member1Name}</p> : null}
          </div>

          <div className="form-group">
            <label htmlFor="member1InGameId" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 2 In-Game ID *
            </label>
            <input
              type="text"
              id="member1InGameId"
              name="member1InGameId"
              value={formData.member1InGameId}
              onChange={onInputChange}
              placeholder="Enter player 2 in-game id"
              aria-invalid={Boolean(fieldErrors.member1InGameId)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member1InGameId ? (
              <p className="form-inline-error">{fieldErrors.member1InGameId}</p>
            ) : null}
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member2Name" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 3 Name *
            </label>
            <input
              type="text"
              id="member2Name"
              name="member2Name"
              value={formData.member2Name}
              onChange={onInputChange}
              placeholder="Enter player 3 name"
              aria-invalid={Boolean(fieldErrors.member2Name)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member2Name ? <p className="form-inline-error">{fieldErrors.member2Name}</p> : null}
          </div>

          <div className="form-group">
            <label htmlFor="member2InGameId" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 3 In-Game ID *
            </label>
            <input
              type="text"
              id="member2InGameId"
              name="member2InGameId"
              value={formData.member2InGameId}
              onChange={onInputChange}
              placeholder="Enter player 3 in-game id"
              aria-invalid={Boolean(fieldErrors.member2InGameId)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member2InGameId ? (
              <p className="form-inline-error">{fieldErrors.member2InGameId}</p>
            ) : null}
          </div>
        </div>

        <div className="form-row-two-col">
          <div className="form-group">
            <label htmlFor="member3Name" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 4 Name *
            </label>
            <input
              type="text"
              id="member3Name"
              name="member3Name"
              value={formData.member3Name}
              onChange={onInputChange}
              placeholder="Enter player 4 name"
              aria-invalid={Boolean(fieldErrors.member3Name)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member3Name ? <p className="form-inline-error">{fieldErrors.member3Name}</p> : null}
          </div>

          <div className="form-group">
            <label htmlFor="member3InGameId" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              Player 4 In-Game ID *
            </label>
            <input
              type="text"
              id="member3InGameId"
              name="member3InGameId"
              value={formData.member3InGameId}
              onChange={onInputChange}
              placeholder="Enter player 4 in-game id"
              aria-invalid={Boolean(fieldErrors.member3InGameId)}
              required
              style={{ fontSize: '1rem', padding: '12px 16px' }}
            />
            {fieldErrors.member3InGameId ? (
              <p className="form-inline-error">{fieldErrors.member3InGameId}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-submit" 
          disabled={loading}
          style={{ fontSize: '1.1rem', padding: '14px 28px', fontWeight: '600', letterSpacing: '0.5px' }}
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>
        <button 
          type="button" 
          className="btn btn-cancel" 
          onClick={onCancel} 
          disabled={loading}
          style={{ fontSize: '1rem', padding: '12px 24px', fontWeight: '500' }}
        >
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
};

export default RegistrationFormView;
