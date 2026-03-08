import type { CSSProperties } from "react";

export type GameType = "freefire" | "pubg" | "cod" | "valorant" | null;

export interface RegistrationFormValues {
  playerName: string;
  email: string;
  password: string;
  phone: string;
  promocode: string;
  leaderAddress: string;
  teamName: string;
  gameId: string;
  player2Name: string;
  player2GameId: string;
  player3Name: string;
  player3GameId: string;
  player4Name: string;
  player4GameId: string;
  player5Name: string;
  player5GameId: string;
}

export interface GameData {
  id: GameType;
  name: string;
  icon: string;
  description: string;
  teamSizes: string[];
  color: string;
  lightColor: string;
  imagePath: string;
  rgbColor: string;
  disabled?: boolean;
}

export type GameCardStyle = CSSProperties & {
  "--game-color": string;
  "--game-color-light": string;
  "--game-rgb": string;
};

export const defaultRegistrationFormValues: RegistrationFormValues = {
  playerName: "",
  email: "",
  password: "",
  phone: "",
  promocode: "",
  leaderAddress: "",
  teamName: "",
  gameId: "",
  player2Name: "",
  player2GameId: "",
  player3Name: "",
  player3GameId: "",
  player4Name: "",
  player4GameId: "",
  player5Name: "",
  player5GameId: "",
};

