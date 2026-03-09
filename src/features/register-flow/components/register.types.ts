import type { CSSProperties } from "react";

export type GameType = "freefire" | "pubg" | "cod" | "valorant" | null;

export interface RegistrationFormValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  promoCode: string;
  teamName: string;
  primaryGame: string;
  leaderInGameId: string;
  member1Name: string;
  member1InGameId: string;
  member2Name: string;
  member2InGameId: string;
  member3Name: string;
  member3InGameId: string;
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
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  promoCode: "",
  teamName: "",
  primaryGame: "",
  leaderInGameId: "",
  member1Name: "",
  member1InGameId: "",
  member2Name: "",
  member2InGameId: "",
  member3Name: "",
  member3InGameId: "",
};
