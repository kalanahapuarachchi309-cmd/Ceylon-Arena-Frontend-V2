import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import GameSelectionView from "../components/GameSelectionView";
import RegistrationFormView from "../components/RegistrationFormView";
import { gameOptions } from "../components/gameOptions";
import {
  defaultRegistrationFormValues,
  type GameType,
  type RegistrationFormValues,
} from "../components/register.types";

import "../../../components/Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [formData, setFormData] = useState<RegistrationFormValues>(defaultRegistrationFormValues);

  const handleGameSelect = (gameId: GameType) => {
    setSelectedGame(gameId);
    setFormData(defaultRegistrationFormValues);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    navigate("/payment", {
      state: {
        playerName: formData.playerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        promocode: formData.promocode,
        leaderAddress: formData.leaderAddress,
        game: selectedGame,
        gameId: formData.gameId,
        teamName: formData.teamName,
        player2Name: formData.player2Name,
        player2GameId: formData.player2GameId,
        player3Name: formData.player3Name,
        player3GameId: formData.player3GameId,
        player4Name: formData.player4Name,
        player4GameId: formData.player4GameId,
        player5Name: formData.player5Name,
        player5GameId: formData.player5GameId,
      },
    });
  };

  const handleBack = () => {
    setSelectedGame(null);
  };

  const selectedGameData = gameOptions.find((game) => game.id === selectedGame);

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">Game Registration</span>
        </h1>
        <p className="register-subtitle">Choose your game and join the competition</p>

        {!selectedGame ? (
          <GameSelectionView games={gameOptions} onSelect={handleGameSelect} />
        ) : (
          <RegistrationFormView
            formData={formData}
            selectedGameData={selectedGameData}
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
