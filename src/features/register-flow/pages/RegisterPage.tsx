import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import AuthErrorMessage from "../../auth/components/AuthErrorMessage";
import { useAuth } from "../../auth/hooks/useAuth";
import GameSelectionView from "../components/GameSelectionView";
import RegistrationFormView from "../components/RegistrationFormView";
import { gameOptions } from "../components/gameOptions";
import {
  defaultRegistrationFormValues,
  type GameType,
  type RegistrationFormValues,
} from "../components/register.types";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { UserRole } from "../../../shared/types";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultRegistrationFormValues);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGameSelect = (gameId: GameType) => {
    setSelectedGame(gameId);
    setFormData(defaultRegistrationFormValues);
    setErrorMessage(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGame) {
      setErrorMessage("Please select a game first.");
      return;
    }

    const selectedGameData = gameOptions.find((game) => game.id === selectedGame);
    if (!selectedGameData) {
      setErrorMessage("Selected game is invalid.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const session = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        promoCode: formData.promoCode || undefined,
        teamName: formData.teamName,
        primaryGame: selectedGameData.name,
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

      if (session.user.role === UserRole.ADMIN) {
        navigate(APP_ROUTES.ADMIN_HOME);
      } else {
        navigate(APP_ROUTES.DASHBOARD);
      }
    } catch (submitError) {
      setErrorMessage(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedGame(null);
    setErrorMessage(null);
  };

  const selectedGameData = gameOptions.find((game) => game.id === selectedGame);

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.HOME)}>
          Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Game Registration</span>
        </h1>
        <p className="register-subtitle">Choose your game and join the competition</p>

        <AuthErrorMessage message={errorMessage} />

        {!selectedGame ? (
          <GameSelectionView games={gameOptions} onSelect={handleGameSelect} />
        ) : (
          <RegistrationFormView
            formData={formData}
            selectedGameData={selectedGameData}
            loading={loading}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
