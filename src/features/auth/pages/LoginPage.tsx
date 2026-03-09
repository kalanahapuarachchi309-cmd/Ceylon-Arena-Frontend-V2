import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import AuthErrorMessage from "../components/AuthErrorMessage";
import { useAuth } from "../hooks/useAuth";
import HomeNavigation from "../../home/components/HomeNavigation";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const signInReason =
    typeof location.state === "object" &&
      location.state &&
      "reason" in location.state &&
      typeof (location.state as { reason?: string }).reason === "string"
      ? (location.state as { reason: string }).reason
      : "";

  useEffect(() => {
    if (registeredEmail) {
      toast.success({
        title: "Registration Complete",
        message: `Account created for ${registeredEmail}. Sign in to continue.`,
        dedupeKey: `login-registered:${registeredEmail}`,
      });
    }

    if (signInReason === "auth-required") {
      toast.info({
        title: "Sign In Needed",
        message: "Please sign in to continue to your requested page.",
        dedupeKey: `login-auth-required:${redirectTo || "home"}`,
      });
    }
  }, [redirectTo, registeredEmail, signInReason, toast]);

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
      const message = getErrorMessage(error);
      setErrorMessage(message);
      toast.error({
        title: "Sign In Failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        showSectionLinks={false}
      />
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            <span className="gradient-text">Player Login</span>
          </h1>
          <p className="register-subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem', opacity: 0.9 }}>
            Enter your credentials to access your account
          </p>
          {registeredEmail ? (
            <p className="register-subtitle" style={{
              fontSize: '1rem',
              lineHeight: '1.5',
              marginBottom: '1.5rem',
              padding: '12px 20px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '8px',
              color: '#00ff88'
            }}>
              ✓ Registration completed. Please sign in with <strong>{registeredEmail}</strong>
            </p>
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
    </>
  );
};

export default LoginPage;
