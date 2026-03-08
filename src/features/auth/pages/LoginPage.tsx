import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import AuthErrorMessage from "../components/AuthErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { UserRole } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const session = await login({
        email: formData.email,
        password: formData.password,
      });

      alert(`Welcome back, ${session.user.playerName}!`);

      if (session.user.role === UserRole.ADMIN) {
        navigate(APP_ROUTES.ADMIN_HOME);
      } else {
        navigate(APP_ROUTES.DASHBOARD);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.HOME)}>
          ← Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Player Login</span>
        </h1>
        <p className="register-subtitle">Enter your credentials to access your account</p>

        <AuthErrorMessage message={errorMessage} />

        <LoginForm
          values={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onGoRegister={() => navigate(APP_ROUTES.REGISTER)}
        />
      </div>
    </div>
  );
};

export default LoginPage;
