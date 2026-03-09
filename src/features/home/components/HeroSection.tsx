interface HeroSectionProps {
  logoImg: string;
  onRegister: () => void;
  onCosplay: () => void;
}

const HeroSection = ({ logoImg, onRegister, onCosplay }: HeroSectionProps) => (
  <section className="hero" id="home">
    <div className="container">
      <div className="hero-grid">
        <div className="hero-content">
          <h1>
            <div className="logo-container">
              <img src={logoImg} alt="Ceylon Arena Logo" className="animated-logo" />
            </div>
            <span className="neon-text">GAME</span> <span className="cyan-text">ON</span>
          </h1>

          <p>THE BIGGEST PRIZE POOL OF SRI LANKAN GAMING HISTORY!</p>
          <p>
            Hurry up! Gammers. We are so excited to announce you.... This is the Biggest Prize Pool of Sri Lankan
            gaming history. Yo! Who wanna be the Champs? Be Ready! For The Biggest Live Battle!
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">01</span>
              <span className="stat-label">BATTLE</span>
            </div>
            <div className="stat">
              <span className="stat-number">02</span>
              <span className="stat-label">ARENA</span>
            </div>
            <div className="stat">
              <span className="stat-number">03</span>
              <span className="stat-label">VICTORY</span>
            </div>
          </div>

          <button className="btn btn-primary hero-register-btn hero-register-desktop" onClick={onRegister}>
            Register Now
          </button>
        </div>

        <div className="hero-image-container">
          <button className="cosplay-bubble desktop-only" onClick={onCosplay} aria-label="Cosplay Registration">
            <svg className="cosplay-bubble-svg" viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 10 Q8 2 16 4 Q60 0 110 2 Q170 0 205 5 Q215 8 214 20 Q216 50 210 65 Q208 74 198 74 Q160 76 130 73 Q118 82 108 88 Q100 94 96 82 Q80 76 50 74 Q20 75 12 68 Q4 62 6 45 Q4 25 10 10 Z"
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="cosplay-bubble-text">
              are you cosplayer?
              <br />
              <em>click me!</em>
            </span>
            <span className="cosplay-bubble-squiggle s1" />
            <span className="cosplay-bubble-squiggle s2" />
            <span className="cosplay-bubble-squiggle s3" />
          </button>
          <div className="cyber-frame">
            <div className="hero-image">
              <div className="slideshow-container">
                <iframe
                  src="https://player.cloudinary.com/embed/?cloud_name=dymnfwem6&public_id=orignal_01_asqvt7&autoplay=true&muted=true&controls=true&loop=true"
                  width="640"
                  height="360"
                  style={{ height: "auto", width: "100%", aspectRatio: "640 / 360", borderRadius: "20px" }}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="corner-accent top-left"></div>
          <div className="corner-accent bottom-right"></div>
          <div className="side-accent left"></div>
          <div className="side-accent right"></div>
        </div>
      </div>
      <div className="hero-register-mobile">
        <button className="btn btn-primary hero-register-btn" onClick={onRegister}>
          Register Now
        </button>
        <button
          className="btn btn-primary hero-register-btn"
          style={{ background: "linear-gradient(135deg,#b44dff,#ff2d78)", boxShadow: "0 6px 24px rgba(180,77,255,0.45)" }}
          onClick={onCosplay}
        >
          🎭 Cosplay Reg
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;

