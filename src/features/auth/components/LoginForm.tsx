import { useState, type ChangeEvent, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  values: LoginValues;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGoRegister: () => void;
}

const LoginForm = ({ values, loading, onSubmit, onChange, onGoRegister }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form className="registration-form" onSubmit={onSubmit}>
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="email" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={onChange}
            placeholder="your.email@example.com"
            required
            style={{ fontSize: '1rem', padding: '12px 16px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            Password *
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={onChange}
              placeholder="Enter your password"
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
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-submit" 
          disabled={loading}
          style={{ fontSize: '1.1rem', padding: '14px 28px', fontWeight: '600', letterSpacing: '0.5px' }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button 
          type="button" 
          className="btn btn-cancel" 
          onClick={onGoRegister}
          style={{ fontSize: '1rem', padding: '12px 24px', fontWeight: '500' }}
        >
          Go to Register
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
