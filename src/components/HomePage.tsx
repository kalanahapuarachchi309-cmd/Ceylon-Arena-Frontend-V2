import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import freefireImg from '../assets/image/Freefire.jpeg';
import pubgImg from '../assets/image/pubg-mobile.jpg';
import codImg from '../assets/image/call-of-duty.webp';
import valoranImg from '../assets/image/Valoran.avif';
import logoImg from '../assets/image/web_Site_logo/Ceylon_Arena_Logo_CMYK-01.png';
import contactBannerImg from '../assets/image/slide_show/slid_show_03.jpg';
import slide01 from '../assets/image/slide_show/slid_show_01.jpg';
import slide02 from '../assets/image/slide_show/slid_show_02.webp';
import slide04 from '../assets/image/slide_show/slid_show_04.jpg';
import slide05 from '../assets/image/slide_show/slid_show_05.webp';
import slide06 from '../assets/image/slide_show/slid_show_06.png';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1

    // map to small offset around center (50%) e.g., +/-10%
    const offsetX = (x - 0.5) * 12; // -6 .. 6
    const offsetY = (y - 0.5) * 8; // -4 .. 4

    el.style.setProperty('--bg-pos-x', `${50 + offsetX}%`);
    el.style.setProperty('--bg-pos-y', `${50 + offsetY}%`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // smoothly return to center
    el.style.setProperty('--bg-pos-x', `50%`);
    el.style.setProperty('--bg-pos-y', `50%`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo"> - CEYLON ARENA -</div>
            
            {/* Hamburger Menu Button */}
            <button 
              className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Desktop Navigation */}

            <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
              <li><a href="#home" onClick={closeMobileMenu}>Home</a></li>
              <li><a href="#games" onClick={closeMobileMenu}>Games</a></li>
              <li><a href="#events" onClick={closeMobileMenu}>Events</a></li>
              <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
              <li><a href="#contact" onClick={closeMobileMenu}>Contact Us</a></li>
              <li className="mobile-only">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => { navigate('/register'); closeMobileMenu(); }}
                  style={{ width: '100%' }}
                >
                  Register
                </button>
              </li>
            </ul>

            <div className="nav-cta desktop-only">
              <button className="btn btn-secondary" onClick={() => navigate('/sign')}>
                Sign In
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>
                <div className="logo-container">
                  <img 
                    src={logoImg} 
                    alt="Ceylon Arena Logo" 
                    className="animated-logo"
                  />
                </div>
                <span className="neon-text">GAME</span> <span className="cyan-text">ON</span>
              </h1>

              <p>THE BIGGEST PRIZE POOL OF SRI LANKAN GAMING HISTORY!</p>
              <p>Hurry up! Gammers. We are so excited to announce you.... This is the Biggest Prize Pool of Sri Lankan gaming history. Yo! Who wanna be the Champs? Be Ready! For The Biggest Live Battle!</p>
              
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

              <button
                className="btn btn-primary hero-register-btn hero-register-desktop"
                onClick={() => navigate('/register')}
              >
                Register Now
              </button>
            </div>

            <div className="hero-image-container">
              {/* ── Desktop cosplay speech-bubble ── */}
              <button
                className="cosplay-bubble desktop-only"
                onClick={() => navigate('/cosplay')}
                aria-label="Cosplay Registration"
              >
                <svg className="cosplay-bubble-svg" viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10 Q8 2 16 4 Q60 0 110 2 Q170 0 205 5 Q215 8 214 20 Q216 50 210 65 Q208 74 198 74 Q160 76 130 73 Q118 82 108 88 Q100 94 96 82 Q80 76 50 74 Q20 75 12 68 Q4 62 6 45 Q4 25 10 10 Z"
                    fill="none" stroke="var(--neon-cyan)" strokeWidth="2.2" strokeLinejoin="round"
                  />
                </svg>
                <span className="cosplay-bubble-text">are you cosplayer?<br /><em>click me!</em></span>
                {/* animated scribble lines */}
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
                      style={{ height: 'auto', width: '100%', aspectRatio: '640 / 360', borderRadius: '20px' }}
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
              {/* <img src={logoImg} alt="Logo Line 1" className="logo-line-scroll line1" />
              <img src={logoImg} alt="Logo Line 2" className="logo-line-scroll line2" />
              <img src={logoImg} alt="Logo Line 3" className="logo-line-scroll line3" />
              <img src={logoImg} alt="Logo Line 4" className="logo-line-scroll line4" />
              <img src={logoImg} alt="Logo Line 5" className="logo-line-scroll line5" />
              <img src={logoImg} alt="Single Logo" className="bottom-logo-scroll" /> */}
            </div>

          </div>
          <div className="hero-register-mobile">
            <button
              className="btn btn-primary hero-register-btn"
              onClick={() => navigate('/register')}
            >
              Register Now
            </button>
            <button
              className="btn btn-primary hero-register-btn"
              style={{ background: 'linear-gradient(135deg,#b44dff,#ff2d78)', boxShadow: '0 6px 24px rgba(180,77,255,0.45)' }}
              onClick={() => navigate('/cosplay')}
            >
              🎭 Cosplay Reg
            </button>
          </div>
        </div>
      </section>

         {/**/}
      {/* Featured Games Section */}
      <section className="section" id="games">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Games</h2>
            <p className="section-subtitle">What's Up Gammers? Register Now!</p>
          </div>

          <div className="games-grid">
            <div
              className={`game-card has-image ${selectedCard === 0 ? 'selected' : ''}`}
              style={{ backgroundImage: `url(${freefireImg})` }}
              onClick={() => setSelectedCard(selectedCard === 0 ? null : 0)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCard(selectedCard === 0 ? null : 0); }}
            >
              <div className="game-badge">Free Fire</div>
              <h3>Free Fire</h3>
              <p>This is the Biggest Free Fire Tournament! Are you ready to play?</p>
              <div className="game-stats">
                <span>🎮 1,234 Active Players</span>
                <span>🏆 15 Live Tournaments</span>
              </div>
              <button className="btn btn-primary" style={{width: '100%'}} onClick={() => navigate('/register')}>
                Join Tournament
              </button>
            </div>

            <div
              className={`game-card has-image is-disabled ${selectedCard === 1 ? 'selected' : ''}`}
              style={{ backgroundImage: `url(${pubgImg})` }}
              aria-disabled="true"
            >
              <div className="game-badge">PUBG Mobile</div>
              <div className="coming-soon-badge">Coming Soon</div>
              <h3>PUBG Mobile</h3>
              <p>Intense 100-player showdowns</p>
              <div className="game-stats">
                <span>🎮 2,456 Active Players</span>
                <span>🏆 22 Live Tournaments</span>
              </div>
              <button className="btn btn-primary" style={{width: '100%'}} disabled>
                Coming Soon
              </button>
            </div>

            <div
              className={`game-card has-image is-disabled ${selectedCard === 2 ? 'selected' : ''}`}
              style={{ backgroundImage: `url(${codImg})` }}
              aria-disabled="true"
            >
              <div className="game-badge">Call of Duty</div>
              <div className="coming-soon-badge">Coming Soon</div>
              <h3>Call of Duty</h3>
              <p>Tactical team-based warfare</p>
              <div className="game-stats">
                <span>🎮 987 Active Players</span>
                <span>🏆 8 Live Tournaments</span>
              </div>
              <button className="btn btn-primary" style={{width: '100%'}} disabled>
                Coming Soon
              </button>
            </div>

            <div
              className={`game-card has-image is-disabled ${selectedCard === 3 ? 'selected' : ''}`}
              style={{ backgroundImage: `url(${valoranImg})` }}
              aria-disabled="true"
            >
              <div className="game-badge">Valorant</div>
              <div className="coming-soon-badge">Coming Soon</div>
              <h3>Valorant</h3>
              <p>5v5 character-based tactical shooter</p>
              <div className="game-stats">
                <span>🎮 1,567 Active Players</span>
                <span>🏆 12 Live Tournaments</span>
              </div>
              <button className="btn btn-primary" style={{width: '100%'}} disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Events Section */}
      <section className="section live-section" id="events">
        <div className="container">
          <div className="section-header">
            <div className="live-badge">
              <div className="live-dot"></div>
              <span>LIVE ON</span>
            </div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Hurry up! For the Enrollments - Be there! To win.</p>
          </div>

          <div className="events-container">
            <div className="event-card">
              <div className="event-date">
                <span className="date-day">25</span>
                <span className="date-month">JAN</span>
              </div>
              <div className="event-info">
                <h3>Free Fire Championship 2026</h3>
                <p>Biggest Prize Pool in Sri Lankan History! | 128 Teams</p>
                <div className="event-tags">
                  <span className="tag">Battle Royale</span>
                  <span className="tag">Squad</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>

            <div className="event-card">
              <div className="event-date">
                <span className="date-day">02</span>
                <span className="date-month">FEB</span>
              </div>
              <div className="event-info">
                <h3>PUBG Pro League Season 3</h3>
                <p>Prize Pool: $75,000 | 64 Teams</p>
                <div className="event-tags">
                  <span className="tag">Professional</span>
                  <span className="tag">Squad</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>

            <div className="event-card">
              <div className="event-date">
                <span className="date-day">10</span>
                <span className="date-month">FEB</span>
              </div>
              <div className="event-info">
                <h3>Valorant Masters Cup</h3>
                <p>Prize Pool: $100,000 | 32 Teams</p>
                <div className="event-tags">
                  <span className="tag">Tactical</span>
                  <span className="tag">Team</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        {/* Video Background */}
        <iframe
          className="stats-video-bg"
          src="https://www.youtube.com/embed/RVwCB1zSy_Q?autoplay=1&mute=1&loop=1&playlist=RVwCB1zSy_Q&controls=0&modestbranding=1&rel=0&showinfo=0"
          title="Stats background video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Active Players</p>
            </div>
            <div className="stat-item">
              <h3>250+</h3>
              <p>Tournaments</p>
            </div>
            <div className="stat-item">
              <h3>$1300K+</h3>
              <p>Prize Money</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Pro Teams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Register CTA After Stats */}
      <section className="stats-register-cta">
        <div className="container">
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Register Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Game Arena</h2>
            <p className="section-subtitle">Your Premier Esports Platform</p>
          </div>

          <div className="about-content">
            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 64" role="img" focusable="false">
                    <circle cx="32" cy="32" r="28" />
                    <circle cx="32" cy="32" r="18" />
                    <circle cx="32" cy="32" r="8" />
                    <path d="M50 14l6 6-18 6 6-12z" />
                  </svg>
                </div>
                <h3>Our Mission</h3>
                <p>
                  Hurry up! Gammers. We're bringing you the Biggest Prize Pool in Sri Lankan Gaming History!
                  Be Ready! For The Biggest Live Battle where champions are made!
                </p>
              </div>

              <div className="about-card">
                <div className="about-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 64" role="img" focusable="false">
                    <path d="M18 10h28v8c0 9.4-7.6 17-17 17h-2c-9.4 0-17-7.6-17-17v-8z" />
                    <path d="M14 12H8c0 10 6 18 14 20" />
                    <path d="M50 12h6c0 10-6 18-14 20" />
                    <rect x="26" y="35" width="12" height="8" />
                    <rect x="22" y="43" width="20" height="6" />
                  </svg>
                </div>
                <h3>What We Offer</h3>
                <p>
                  What's Up Gammers? The Biggest Free Fire Tournament is here! Register Now!
                  Are you ready to play and compete for the biggest prize pool ever?
                </p>
              </div>

              <div className="about-card">
                <div className="about-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 64" role="img" focusable="false">
                    <path d="M36 4L14 34h14l-2 26 24-34H36z" />
                  </svg>
                </div>
                <h3>Our Vision</h3>
                <p>
                  Yo! Who wanna be the Champs? Hurry up! For the Enrollments.
                  Be there! To win the Biggest Prize Pool in Sri Lankan gaming history!
                </p>
              </div>
            </div>

            <div className="about-features">
              <div className="feature-item">
                <span className="feature-number">01</span>
                <div>
                  <h4>Professional Infrastructure</h4>
                  <p>State-of-the-art servers and anti-cheat systems</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">02</span>
                <div>
                  <h4>Global Community</h4>
                  <p>Players from over 50 countries competing daily</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">03</span>
                <div>
                  <h4>Prize Pools</h4>
                  <p>Over $500K in tournament prizes annually</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">04</span>
                <div>
                  <h4>24/7 Support</h4>
                  <p>Dedicated team available around the clock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Gammers.... Are you ready for the Biggest Combat?</h2>
          <p>Be there! To win. This is the Biggest Prize Pool of Sri Lankan gaming history!</p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '18px 60px', fontSize: '1.2rem' }} 
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
        </div>
      </section>

      <section className="section" aria-label="Temporary dashboard access">
        <div className="container" style={{ textAlign: 'center', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '12px 36px' }}
          >
            Temporary: Go to Dashboard
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin')}
            style={{ padding: '12px 36px', background: 'linear-gradient(45deg, #ff0080, #ff00ff)' }}
          >
            ⚡ Admin Control Center
          </button>
        </div>
      </section>

      {/* ─── Contact Us Section ─── */}
      <section className="contact-section" id="contact">
        {/* Banner with gaming image + title */}
        <div
          className="contact-banner"
          style={{ backgroundImage: `url(${contactBannerImg})` }}
        >
          <div className="contact-banner-overlay" />
          <h2 className="contact-banner-title">Contact Us</h2>
        </div>

        {/* Body */}
        <div className="contact-body">
          {/* Left */}
          <div className="contact-left">
            <h3 className="contact-heading">
              Have A Question?<br />Shoot Away!
            </h3>
            <p className="contact-desc">
              Whether you're looking to join a tournament, need help with your account,
              or want to partner with Ceylon Arena — our team is ready. Drop us a line
              and we'll get back to you faster than a headshot.
            </p>
            <div className="contact-socials">
              <span className="contact-follow">Follow Us On:</span>
              <a href="#" className="contact-social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.265.058-1.645.069-4.849.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" className="contact-social-icon" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
              <a href="#" className="contact-social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="contact-social-icon" aria-label="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </a>
              <a href="#" className="contact-social-icon" aria-label="Twitch">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>
              </a>
            </div>
          </div>

          {/* Right — form */}
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="contact-field">
              <label className="contact-label">Name <span className="contact-required">*</span></label>
              <input className="contact-input" type="text" placeholder="" required />
            </div>
            <div className="contact-field">
              <label className="contact-label">Phone No <span className="contact-required">*</span></label>
              <input className="contact-input" type="tel" placeholder="" required />
            </div>
            <div className="contact-field">
              <label className="contact-label">Your Message <span className="contact-required">*</span></label>
              <textarea className="contact-textarea" rows={5} required />
            </div>
            <button type="submit" className="contact-submit">SUBMIT</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">

        {/* ── Infinite image strip ── */}
        <div className="footer-strip" aria-hidden="true">
          <div className="footer-strip-track">
            {[freefireImg, pubgImg, codImg, valoranImg, slide01, slide02, contactBannerImg, slide04, slide05, slide06,
              freefireImg, pubgImg, codImg, valoranImg, slide01, slide02, contactBannerImg, slide04, slide05, slide06].map((src, i) => (
              <div key={i} className="footer-strip-item">
                <img src={src} alt="" className="footer-strip-img" />
                <div className="footer-strip-shine" />
              </div>
            ))}
          </div>
        </div>

        <div className="footer-inner">
          {/* ── Logo column ── */}
          <div className="footer-brand">
            <img src={logoImg} alt="Ceylon Arena" className="footer-logo" />
            <p className="footer-tagline">SRI LANKA'S PREMIER<br />ESPORTS ARENA</p>
          </div>

          {/* ── ADDRESS ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">ADDRESS</h4>
            <p className="footer-col-heading">COLOMBO HQ</p>
            <p>60 Galle Road</p>
            <p>Colombo 03</p>
            <p>Sri Lanka</p>
            <p className="footer-col-heading" style={{ marginTop: '18px' }}>KANDY ARENA</p>
            <p>14 Dalada Veediya</p>
            <p>Kandy</p>
            <p>Sri Lanka</p>
          </div>

          {/* ── SOCIALS ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">SOCIALS</h4>
            <a href="#" className="footer-link">DISCORD</a>
            <a href="#" className="footer-link">INSTAGRAM</a>
            <a href="#" className="footer-link">YOUTUBE</a>
            <a href="#" className="footer-link">TWITTER / X</a>
            <a href="#" className="footer-link">FACEBOOK</a>
          </div>

          {/* ── CONTACT ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">CONTACT</h4>
            <p>INFO@CEYLON-ARENA.LK</p>
            <p>+94 11 234 5678</p>
            <p style={{ marginTop: '12px' }}>CEYLON ARENA PVT LTD</p>
            <p>REG: PV 00123456</p>
          </div>

          {/* ── PAGES ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">PAGES</h4>
            <a href="#home"   className="footer-link">HOME</a>
            <a href="#games"  className="footer-link">GAMES</a>
            <a href="#events" className="footer-link">EVENTS</a>
            <a href="#about"  className="footer-link">ABOUT</a>
            <button className="footer-link footer-link-btn" onClick={() => navigate('/register')}>REGISTER</button>
            <button className="footer-link footer-link-btn" onClick={() => navigate('/sign')}>LOGIN</button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">COOKIES</a>
          </div>
          <p className="footer-copy">
            COPYRIGHT &copy; 2026 CEYLON ARENA PVT LTD. ALL RIGHTS RESERVED.<br />
            <span>WEBSITE BUILT WITH ❤ FOR SRI LANKAN GAMERS.</span>
          </p>
        </div>
      </footer>
    </>
  );
}