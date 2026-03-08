import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { UserRole } from "../../../shared/types";

interface HomeNavigationProps {
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  showSectionLinks?: boolean;
  onCosplay?: () => void;
}

interface NavLinkItem {
  label: string;
  to: string;
}

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
  }, [isAuthenticated, isBootstrapping, isPlayer, refreshTeamSummary, teamSummary?.teamName]);

  const playerIdentity = useMemo(() => {
    const leaderName = user?.fullName || user?.playerName || "Leader";
    const teamName = teamSummary?.teamName || "Team";
    return `${teamName} (${leaderName})`;
  }, [teamSummary?.teamName, user?.fullName, user?.playerName]);

  const baseLinks: NavLinkItem[] = showSectionLinks
    ? [
        { label: "Home", to: "#home" },
        { label: "Games", to: "#games" },
        { label: "Events", to: "#events" },
        { label: "About", to: "#about" },
        { label: "Contact Us", to: "#contact" },
      ]
    : [
        { label: "Home", to: APP_ROUTES.HOME },
        { label: "Events", to: APP_ROUTES.EVENTS },
      ];

  const playerLinks: NavLinkItem[] = [
    { label: "Profile", to: APP_ROUTES.PROFILE },
    { label: "My Team", to: APP_ROUTES.MY_TEAM },
    { label: "My Registrations", to: APP_ROUTES.MY_REGISTRATIONS },
    { label: "My Payments", to: APP_ROUTES.MY_PAYMENTS },
    { label: "Settings", to: APP_ROUTES.SETTINGS },
  ];

  const adminLinks: NavLinkItem[] = [
    { label: "Admin Users", to: APP_ROUTES.ADMIN_USERS },
    { label: "Admin Teams", to: APP_ROUTES.ADMIN_TEAMS },
    { label: "Admin Events", to: APP_ROUTES.ADMIN_EVENTS },
    { label: "Admin Registrations", to: APP_ROUTES.ADMIN_REGISTRATIONS },
    { label: "Admin Payments", to: APP_ROUTES.ADMIN_PAYMENTS },
    { label: "Profile", to: APP_ROUTES.PROFILE },
  ];

  const handleLinkNavigate = (to: string) => {
    if (to.startsWith("#")) {
      if (window.location.pathname !== APP_ROUTES.HOME && window.location.pathname !== APP_ROUTES.EVENTS) {
        navigate(`${APP_ROUTES.HOME}${to}`);
      } else {
        window.location.hash = to.slice(1);
      }
      onCloseMenu();
      return;
    }

    navigate(to);
    onCloseMenu();
  };

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.HOME);
    onCloseMenu();
  };

  const authLinks = showAuthenticatedUi ? (isAdmin ? adminLinks : playerLinks) : [];

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
            {baseLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to.startsWith("#") ? link.to : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleLinkNavigate(link.to);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {authLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to}
                  onClick={(event) => {
                    event.preventDefault();
                    handleLinkNavigate(link.to);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}

            {!showAuthenticatedUi ? (
              <>
                <li className="mobile-only">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      navigate(APP_ROUTES.LOGIN);
                      onCloseMenu();
                    }}
                    style={{ width: "100%" }}
                  >
                    Sign In
                  </button>
                </li>
                <li className="mobile-only">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      navigate(APP_ROUTES.REGISTER);
                      onCloseMenu();
                    }}
                    style={{ width: "100%" }}
                  >
                    Register Your Team
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-only">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      if (isAdmin) {
                        navigate(APP_ROUTES.ADMIN_HOME);
                      } else {
                        navigate(APP_ROUTES.PROFILE);
                      }
                      onCloseMenu();
                    }}
                    style={{ width: "100%" }}
                  >
                    {isAdmin ? `Admin (${user?.fullName || user?.playerName || "User"})` : playerIdentity}
                  </button>
                </li>
                <li className="mobile-only">
                  <button className="btn btn-secondary" onClick={() => void handleLogout()} style={{ width: "100%" }}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {!showAuthenticatedUi && onCosplay ? (
              <li className="mobile-only">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onCosplay();
                    onCloseMenu();
                  }}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#b44dff,#ff2d78)",
                    boxShadow: "0 6px 24px rgba(180,77,255,0.45)",
                  }}
                >
                  Cosplay Registration
                </button>
              </li>
            ) : null}
          </ul>

          <div className="nav-cta desktop-only">
            {!showAuthenticatedUi ? (
              <>
                <button className="btn btn-secondary" onClick={() => navigate(APP_ROUTES.LOGIN)}>
                  Sign In
                </button>
                <button className="btn btn-secondary" onClick={() => navigate(APP_ROUTES.REGISTER)}>
                  Register Your Team
                </button>
                {onCosplay ? (
                  <button
                    className="btn btn-primary"
                    onClick={onCosplay}
                    style={{
                      background: "linear-gradient(135deg,#b44dff,#ff2d78)",
                      boxShadow: "0 6px 24px rgba(180,77,255,0.45)",
                    }}
                  >
                    Cosplay
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(isAdmin ? APP_ROUTES.ADMIN_HOME : APP_ROUTES.PROFILE)}
                >
                  {isAdmin ? `Admin (${user?.fullName || user?.playerName || "User"})` : playerIdentity}
                </button>
                <button className="btn btn-secondary" onClick={() => void handleLogout()}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavigation;
