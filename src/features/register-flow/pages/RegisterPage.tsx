import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import AuthErrorMessage from "../../auth/components/AuthErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import RegistrationFormView from "../components/RegistrationFormView";
import {
  defaultRegistrationFormValues,
  type RegistrationFormValues,
} from "../components/register.types";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultRegistrationFormValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        promoCode: formData.promoCode || undefined,
        teamName: formData.teamName,
        primaryGame: formData.primaryGame,
        leaderInGameId: formData.leaderInGameId,
        members: [
          {
            name: formData.member1Name,
            inGameId: formData.member1InGameId,
          },
          {
            name: formData.member2Name,
            inGameId: formData.member2InGameId,
          },
          {
            name: formData.member3Name,
            inGameId: formData.member3InGameId,
          },
        ],
      });

      setFormData(defaultRegistrationFormValues);
      navigate(APP_ROUTES.LOGIN, {
        replace: true,
        state: {
          registered: true,
          registeredEmail: formData.email,
        },
      });
    } catch (submitError) {
      setErrorMessage(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setErrorMessage(null);
    navigate(APP_ROUTES.HOME);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.HOME)}>
          Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Team Registration</span>
        </h1>
        <p className="register-subtitle">Create your leader account and team</p>

        <AuthErrorMessage message={errorMessage} />

        <RegistrationFormView
          formData={formData}
          loading={loading}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
