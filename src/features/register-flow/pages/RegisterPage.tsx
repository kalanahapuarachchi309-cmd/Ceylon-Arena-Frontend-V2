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
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultRegistrationFormValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegistrationFormValues, string>>>({});

  const validateForm = (values: RegistrationFormValues) => {
    const errors: Partial<Record<keyof RegistrationFormValues, string>> = {};

    if (values.fullName.trim().length < 3) {
      errors.fullName = "Leader name must be at least 3 characters.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (values.phone.trim().length < 9) {
      errors.phone = "Enter a valid phone number.";
    }
    if (values.address.trim().length < 5) {
      errors.address = "Address is required.";
    }
    if (values.teamName.trim().length < 2) {
      errors.teamName = "Team name is required.";
    }
    if (values.primaryGame.trim().length < 2) {
      errors.primaryGame = "Primary game is required.";
    }
    if (values.leaderInGameId.trim().length < 2) {
      errors.leaderInGameId = "Leader in-game ID is required.";
    }

    const memberFields: Array<[keyof RegistrationFormValues, keyof RegistrationFormValues]> = [
      ["member1Name", "member1InGameId"],
      ["member2Name", "member2InGameId"],
      ["member3Name", "member3InGameId"],
    ];

    memberFields.forEach(([nameField, idField], index) => {
      if (values[nameField].trim().length < 2) {
        errors[nameField] = `Player ${index + 2} name is required.`;
      }
      if (values[idField].trim().length < 2) {
        errors[idField] = `Player ${index + 2} in-game ID is required.`;
      }
    });

    return errors;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => {
      if (!(name in prev)) {
        return prev;
      }
      const nextErrors = { ...prev };
      delete nextErrors[name as keyof RegistrationFormValues];
      return nextErrors;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setErrorMessage("Please fix the highlighted form fields.");
        toast.error("Please fix form errors before continuing.");
        return;
      }

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
      setFieldErrors({});
      toast.success("Team registration completed. Please sign in.");
      navigate(APP_ROUTES.SIGN_IN, {
        replace: true,
        state: {
          registered: true,
          registeredEmail: formData.email,
        },
      });
    } catch (submitError) {
      const message = getErrorMessage(submitError);
      setErrorMessage(message);
      toast.error(message);
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
          fieldErrors={fieldErrors}
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
