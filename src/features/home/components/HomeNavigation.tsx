import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import {
  compactNavigationItems,
  landingActionNavigation,
  landingSectionNavigationItems,
  type LandingAuthNavigationState,
  type LandingNavigationAction,
} from "../config/navigation";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { UserRole } from "../../../shared/types";

interface HomeNavigationProps {
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  showSectionLinks?: boolean;
  onCosplay?: () => void;
}

const cosplayButtonStyle = {
  background: "linear-gradient(135deg,#b44dff,#ff2d78)",
  boxShadow: "0 6px 24px rgba(180,77,255,0.45)",
} as const;

const HomeNavigation = ({
  mobileMenuOpen,
  onToggleMenu,
  onCloseMenu,
  showSectionLinks = true,
  onCosplay,
}: HomeNavigationProps) => {
  const navigate = useNavigate();
  const {
    user,
    teamSummary,
    isAuthenticated,
    isBootstrapping,
    logout,
    refreshTeamSummary,
  } = useAuth();

  const isPlayer = user?.role === UserRole.PLAYER;
  const isAdmin = user?.role === UserRole.ADMIN;
  const showAuthenticatedUi = !isBootstrapping && isAuthenticated;

  useEffect(() => {
    if (!isPlayer || !isAuthenticated || isBootstrapping || teamSummary?.teamName) {
      return;
    }

    void refreshTeamSummary();
  }, [
    isAuthenticated,
    isBootstrapping,
    isPlayer,
    refreshTeamSummary,
    teamSummary?.teamName,
  ]);

  const primaryLinks = showSectionLinks
    ? landingSectionNavigationItems
    : compactNavigationItems;

  const authNavigationState = useMemo<LandingAuthNavigationState>(() => {
    if (!showAuthenticatedUi) {
      return "guest";
    }
    return isAdmin ? "admin" : "player";
  }, [isAdmin, showAuthenticatedUi]);

  const actionNavigationItems = landingActionNavigation[authNavigationState];

  const handleSectionNavigate = (to: string) => {
    if (!to.startsWith("#")) {
      navigate(to);
      onCloseMenu();
      return;
    }

    if (
      window.location.pathname !== APP_ROUTES.HOME &&
      window.location.pathname !== APP_ROUTES.EVENTS
    ) {
      navigate(`${APP_ROUTES.HOME}${to}`);
      onCloseMenu();
      return;
    }

    window.location.hash = to.slice(1);
    onCloseMenu();
  };

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.HOME);
    onCloseMenu();
  };

  const handleAction = async (item: LandingNavigationAction) => {
    if (item.to === "logout") {
      await handleLogout();
      return;
    }

    if (item.label === "Cosplay" && onCosplay) {
      onCosplay();
      onCloseMenu();
      return;
    }

    navigate(item.to);
    onCloseMenu();
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <div className="logo"> - CEYLON ARENA -</div>

          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={onToggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
            {primaryLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to.startsWith("#") ? link.to : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleSectionNavigate(link.to);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {actionNavigationItems.map((item) => (
              <li className="mobile-only" key={item.label}>
                <button
                  className={item.label === "Cosplay" ? "btn btn-primary" : "btn btn-secondary"}
                  onClick={() => void handleAction(item)}
                  style={{
                    width: "100%",
                    ...(item.label === "Cosplay" ? cosplayButtonStyle : {}),
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-cta desktop-only">
            {actionNavigationItems.map((item) => (
              <button
                key={item.label}
                className={item.label === "Cosplay" ? "btn btn-primary" : "btn btn-secondary"}
                onClick={() => void handleAction(item)}
                style={item.label === "Cosplay" ? cosplayButtonStyle : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavigation;
