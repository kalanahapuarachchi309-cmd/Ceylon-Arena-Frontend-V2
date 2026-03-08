import { Lightbulb, Target, Trophy } from "lucide-react";

const AboutSection = () => (
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
              <Target size={40} strokeWidth={2} />
            </div>
            <h3>Our Mission</h3>
            <p>
              Hurry up! Gammers. We're bringing you the Biggest Prize Pool in Sri Lankan Gaming History! Be Ready!
              For The Biggest Live Battle where champions are made!
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon" aria-hidden="true">
              <Trophy size={40} strokeWidth={2} />
            </div>
            <h3>What We Offer</h3>
            <p>
              What's Up Gammers? The Biggest Free Fire Tournament is here! Register Now! Are you ready to play and
              compete for the biggest prize pool ever?
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon" aria-hidden="true">
              <Lightbulb size={40} strokeWidth={2} />
            </div>
            <h3>Our Vision</h3>
            <p>
              Yo! Who wanna be the Champs? Hurry up! For the Enrollments. Be there! To win the Biggest Prize Pool in
              Sri Lankan gaming history!
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
              <p>Over LKR 500K in tournament prizes annually</p>
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
);

export default AboutSection;

