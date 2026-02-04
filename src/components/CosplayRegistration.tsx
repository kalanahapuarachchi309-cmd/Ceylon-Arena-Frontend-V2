import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/image/web_Site_logo/Ceylon_Arena_Logo_CMYK-01.png';
import freefireImg from '../assets/image/Freefire.jpeg';
import pubgImg from '../assets/image/pubg-mobile.jpg';
import codImg from '../assets/image/call-of-duty.webp';
import valoranImg from '../assets/image/Valoran.avif';
import './CosplayRegistration.css';

const GAMES = [
  { id: 'freefire',     label: 'Free Fire',       img: freefireImg },
  { id: 'pubg',         label: 'PUBG Mobile',      img: pubgImg     },
  { id: 'cod',          label: 'Call of Duty',     img: codImg      },
  { id: 'valorant',     label: 'Valorant',         img: valoranImg  },
];

export default function CosplayRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', game: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]   = useState<{ name?: string; age?: string; game?: string }>({});
  const [glitch,  setGlitch]  = useState(false);

  /* periodically trigger glitch on the title */
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 320);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())               e.name = 'Name is required';
    const age = Number(form.age);
    if (!form.age)                       e.age  = 'Age is required';
    else if (isNaN(age) || age < 5 || age > 99) e.age = 'Enter a valid age (5–99)';
    if (!form.game)                      e.game = 'Select your game';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="cosplay-page">

      {/* ── Floating particles ── */}
      <div className="cosplay-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="cosplay-particle" style={{
            '--delay': `${(i * 0.37) % 6}s`,
            '--x':     `${(i * 13 + 7) % 100}%`,
            '--size':  `${2 + (i % 3)}px`,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* ── Pulser rings ── */}
      <div className="cosplay-pulsers" aria-hidden="true">
        <div className="cosplay-pulser p1" />
        <div className="cosplay-pulser p2" />
        <div className="cosplay-pulser p3" />
      </div>

      {/* ── Thunder bolts ── */}
      <div className="cosplay-thunders" aria-hidden="true">
        {[1,2,3,4,5].map(n => (
          <svg key={n} className={`cosplay-thunder t${n}`} viewBox="0 0 40 90" xmlns="http://www.w3.org/2000/svg">
            <polyline points="26,2 10,42 22,42 8,88 36,34 20,34 32,2" fill="currentColor" />
          </svg>
        ))}
      </div>

      {/* ── Scanline overlay ── */}
      <div className="cosplay-scanlines" aria-hidden="true" />

      {/* ── Nav back ── */}
      <nav className="cosplay-nav">
        <img src={logoImg} alt="Ceylon Arena" className="cosplay-nav-logo" />
        <button className="btn btn-secondary cosplay-back-btn" onClick={() => navigate('/')}>
          ← BACK TO HOME
        </button>
      </nav>

      {/* ── Main content ── */}
      <main className="cosplay-main">
        <div className="cosplay-layout">

          {/* ── LEFT — branding ── */}
          <div className="cosplay-left">
            <p className="cosplay-sub-label">◈ CEYLON ARENA PRESENTS ◈</p>
            <h1 className={`cosplay-title ${glitch ? 'glitch' : ''}`} data-text="COSPLAY REGISTRATION">
              COSPLAY<br /><span className="cosplay-title-accent">REGISTRATION</span>
            </h1>
            <p className="cosplay-tagline">Dress as your champion.<br />Claim the arena.</p>
            <div className="cosplay-divider">
              <span /><span className="cosplay-divider-gem" /><span />
            </div>
            <ul className="cosplay-perks">
              <li><span className="perk-icon">⚡</span> Open to all ages</li>
              <li><span className="perk-icon">🎮</span> All featured games eligible</li>
              <li><span className="perk-icon">🏆</span> Prize pool for best costume</li>
              <li><span className="perk-icon">📸</span> Professional photo shoot</li>
            </ul>
          </div>

          {/* ── RIGHT — form / success ── */}
          <div className="cosplay-right">
            {submitted ? (
              <div className="cosplay-success">
                <div className="cosplay-success-icon">✦</div>
                <h2 className="cosplay-success-title">YOU'RE IN, <span>{form.name.toUpperCase()}</span>!</h2>
                <p>Game: <strong>{GAMES.find(g => g.id === form.game)?.label}</strong> &nbsp;|&nbsp; Age: <strong>{form.age}</strong></p>
                <p className="cosplay-success-note">Our team will contact you with event details. Get your costume ready, champion!</p>
                <button className="cosplay-cta-btn" onClick={() => navigate('/')}>
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <form className="cosplay-form" onSubmit={handleSubmit} noValidate>

                {/* Name + Age side by side */}
                <div className="cosplay-row">
                  <div className={`cosplay-field ${errors.name ? 'has-error' : ''}`}>
                    <label className="cosplay-label">
                      <span className="cosplay-label-num">01</span> NAME
                    </label>
                    <div className="cosplay-input-wrap">
                      <input className="cosplay-input" type="text" placeholder="Full name"
                        value={form.name} onChange={e => handleChange('name', e.target.value)} />
                      <div className="cosplay-input-bar" />
                    </div>
                    {errors.name && <span className="cosplay-error">{errors.name}</span>}
                  </div>

                  <div className={`cosplay-field ${errors.age ? 'has-error' : ''}`}>
                    <label className="cosplay-label">
                      <span className="cosplay-label-num">02</span> AGE
                    </label>
                    <div className="cosplay-input-wrap">
                      <input className="cosplay-input" type="number" min={5} max={99} placeholder="Age"
                        value={form.age} onChange={e => handleChange('age', e.target.value)} />
                      <div className="cosplay-input-bar" />
                    </div>
                    {errors.age && <span className="cosplay-error">{errors.age}</span>}
                  </div>
                </div>

                {/* Game selector */}
                <div className={`cosplay-field ${errors.game ? 'has-error' : ''}`}>
                  <label className="cosplay-label">
                    <span className="cosplay-label-num">03</span> SELECT YOUR GAME
                  </label>
                  <div className="cosplay-game-grid">
                    {GAMES.map(g => (
                      <button key={g.id} type="button"
                        className={`cosplay-game-card ${form.game === g.id ? 'selected' : ''}`}
                        onClick={() => handleChange('game', g.id)}
                        style={{ '--bg': `url(${g.img})` } as React.CSSProperties}
                      >
                        <div className="cosplay-game-overlay" />
                        <span className="cosplay-game-label">{g.label}</span>
                        <div className="cosplay-game-select-ring" />
                      </button>
                    ))}
                  </div>
                  {errors.game && <span className="cosplay-error">{errors.game}</span>}
                </div>

                {/* Submit */}
                <div className="cosplay-submit-row">
                  <button type="submit" className="cosplay-cta-btn">
                    <span className="cosplay-cta-shine" />
                    REGISTER AS COSPLAYER
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
