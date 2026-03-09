import freeFireImage from "../../../assets/image/intro-image-card/free_fire-intro.jpg";
import pubgImage from "../../../assets/image/intro-image-card/pubg-intro.jpg";
import codImage from "../../../assets/image/intro-image-card/call of duty-intro.webp";
import valorantImage from "../../../assets/image/intro-image-card/valorant-intro.webp";
import freeFireLogo from "../../../assets/image/gamming-logo/Free-fire-logo.png";

import type { GameData } from "./register.types";

export const gameOptions: GameData[] = [
  {
    id: "freefire",
    name: "Free Fire",
    icon: freeFireLogo,
    description: "Clash Squad 4vs4",
    teamSizes: ["Solo", "Duo", "Squad (4)"],
    color: "#ff6b6b",
    lightColor: "#ff8b8b",
    rgbColor: "255, 107, 107",
    imagePath: freeFireImage,
    disabled: false,
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    icon: "🎯",
    description: "100-Player Showdowns",
    teamSizes: ["Solo", "Duo", "Squad (4)"],
    color: "#ff8e53",
    lightColor: "#ffab7a",
    rgbColor: "255, 142, 83",
    imagePath: pubgImage,
    disabled: true,
  },
  {
    id: "cod",
    name: "Call of Duty",
    icon: "⚔️",
    description: "Tactical Team Warfare",
    teamSizes: ["Solo", "2v2", "5v5"],
    color: "#a55eea",
    lightColor: "#c37fff",
    rgbColor: "165, 94, 234",
    imagePath: codImage,
    disabled: true,
  },
  {
    id: "valorant",
    name: "Valorant",
    icon: "💎",
    description: "5v5 Tactical Shooter",
    teamSizes: ["5v5 Team"],
    color: "#00b894",
    lightColor: "#1dd1a1",
    rgbColor: "0, 184, 148",
    imagePath: valorantImage,
    disabled: true,
  },
];

