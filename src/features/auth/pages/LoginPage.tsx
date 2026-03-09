import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import AuthErrorMessage from "../components/AuthErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo =
    typeof location.state === "object" &&
    location.state &&
    "redirectTo" in location.state &&
    typeof (location.state as { redirectTo?: string }).redirectTo === "string"
      ? (location.state as { redirectTo: string }).redirectTo
      : "";

  const registeredEmail =
    typeof location.state === "object" &&
    location.state &&
    "registeredEmail" in location.state &&
    typeof (location.state as { registeredEmail?: string }).registeredEmail === "string"
      ? (location.state as { registeredEmail: string }).registeredEmail
      : "";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Signed in successfully.");

      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate(APP_ROUTES.HOME);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page login-page">
      <div className="register-container login-container">
        <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.HOME)}>
          Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Player Login</span>
        </h1>
        <p className="register-subtitle">Enter your credentials to access your account</p>
        {registeredEmail ? (
          <p className="register-subtitle">Registration completed. Please sign in with {registeredEmail}.</p>
        ) : null}

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
