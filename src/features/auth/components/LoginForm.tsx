import type { ChangeEvent, FormEvent } from "react";

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

const LoginForm = ({ values, loading, onSubmit, onChange, onGoRegister }: LoginFormProps) => (
  <form className="registration-form" onSubmit={onSubmit}>
    <div className="form-section">
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={onChange}
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
          value={values.password}
          onChange={onChange}
          placeholder="Enter your password"
          required
        />
      </div>
    </div>

    <div className="form-actions">
      <button type="submit" className="btn btn-submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <button type="button" className="btn btn-cancel" onClick={onGoRegister}>
        Go to Register
      </button>
    </div>
  </form>
);

export default LoginForm;
