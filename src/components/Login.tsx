import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Reuse the same CSS for consistent styling
import { API_ENDPOINTS } from '../config/api';
import { setCookie } from '../utils/cookies';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed!");
        setLoading(false);
        return;
      }

      // Save tokens and user data to localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Store user role in cookie for route protection
      setCookie("userRole", data.user.role, 7); // Cookie expires in 7 days

      alert(`Welcome back, ${data.user.playerName}!`);
      
      // Redirect based on user role
      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Player Login</span>
        </h1>
        <p className="register-subtitle">Enter your credentials to access your account</p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate("/register")}
            >
              Go to Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
