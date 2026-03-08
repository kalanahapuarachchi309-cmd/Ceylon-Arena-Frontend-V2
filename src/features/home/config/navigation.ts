import { APP_ROUTES } from "../../../shared/constants/routes";

export interface LandingNavigationItem {
  label: string;
  to: string;
}

export type LandingAuthNavigationState = "guest" | "player" | "admin";

export interface LandingNavigationAction {
  label: string;
  to: string;
}

export const landingSectionNavigationItems: LandingNavigationItem[] = [
  { label: "Home", to: "#home" },
  { label: "Games", to: "#games" },
  { label: "Events", to: "#events" },
  { label: "About", to: "#about" },
  { label: "Contact Us", to: "#contact" },
];

export const compactNavigationItems: LandingNavigationItem[] = [
  { label: "Home", to: APP_ROUTES.HOME },
  { label: "Events", to: APP_ROUTES.EVENTS },
];

export const landingActionNavigation: Record<
  LandingAuthNavigationState,
  LandingNavigationAction[]
> = {
  guest: [
    { label: "Sign In", to: APP_ROUTES.SIGN_IN },
    { label: "Register", to: APP_ROUTES.REGISTER },
    { label: "Cosplay", to: APP_ROUTES.COSPLAY },
  ],
  player: [
    { label: "Profile", to: APP_ROUTES.PLAYER_DASHBOARD },
    { label: "Logout", to: "logout" },
  ],
  admin: [
    { label: "Admin Profile", to: APP_ROUTES.ADMIN_DASHBOARD },
    { label: "Logout", to: "logout" },
  ],
};
