interface HomeNavigationProps {
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onSignIn: () => void;
  onRegister: () => void;
  onCosplay: () => void;
}

const HomeNavigation = ({
  mobileMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onSignIn,
  onRegister,
  onCosplay,
}: HomeNavigationProps) => (
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
          <li>
            <a href="#home" onClick={onCloseMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="#games" onClick={onCloseMenu}>
              Games
            </a>
          </li>
          <li>
            <a href="#events" onClick={onCloseMenu}>
              Events
            </a>
          </li>
          <li>
            <a href="#about" onClick={onCloseMenu}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={onCloseMenu}>
              Contact Us
            </a>
          </li>
          <li className="mobile-only">
            <button
              className="btn btn-secondary"
              onClick={() => {
                onSignIn();
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
                onRegister();
                onCloseMenu();
              }}
              style={{ width: "100%" }}
            >
              Register
            </button>
          </li>
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
              🎭 Cosplay Registration
            </button>
          </li>
        </ul>

        <div className="nav-cta desktop-only">
          <button className="btn btn-secondary" onClick={onSignIn}>
            Sign In
          </button>
          <button className="btn btn-secondary" onClick={onRegister}>
            Register
          </button>
          <button
            className="btn btn-primary"
            onClick={onCosplay}
            style={{ background: "linear-gradient(135deg,#b44dff,#ff2d78)", boxShadow: "0 6px 24px rgba(180,77,255,0.45)" }}
          >
            🎭 Cosplay
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default HomeNavigation;

