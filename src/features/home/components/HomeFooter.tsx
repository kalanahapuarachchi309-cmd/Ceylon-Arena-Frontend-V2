interface HomeFooterProps {
  logoImg: string;
  stripImages: string[];
  onRegister: () => void;
  onSignIn: () => void;
}

const HomeFooter = ({ logoImg, stripImages, onRegister, onSignIn }: HomeFooterProps) => (
  <footer className="footer">
    <div className="footer-strip" aria-hidden="true">
      <div className="footer-strip-track">
        {stripImages.map((src, index) => (
          <div key={index} className="footer-strip-item">
            <img src={src} alt="" className="footer-strip-img" />
            <div className="footer-strip-shine" />
          </div>
        ))}
      </div>
    </div>

    <div className="footer-inner">
      <div className="footer-brand">
        <img src={logoImg} alt="Ceylon Arena" className="footer-logo" />
        <p className="footer-tagline">
          SRI LANKA'S PREMIER
          <br />
          ESPORTS ARENA
        </p>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">ADDRESS</h4>
        <p className="footer-col-heading">No : 475,</p>
        <p>Deniyawatta Road,</p>
        <p>Battaramulla,</p>
        <p>Sri Lanka</p>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">SOCIALS</h4>

        <a href="#" className="footer-link" target="_blank" rel="noopener noreferrer"></a>

        <a
          href="https://www.instagram.com/ceylonarena?igsh=MWd4djJ0NmUxa3QwcQ=="
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSTAGRAM
        </a>

        <a href="#" className="footer-link" target="_blank" rel="noopener noreferrer"></a>

        <a href="#" className="footer-link" target="_blank" rel="noopener noreferrer"></a>

        <a
          href="https://www.facebook.com/share/1JsvmDPe6W/?mibextid=wwXIfr"
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          FACEBOOK
        </a>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">CONTACT</h4>
        <p>INFO@CEYLON-ARENA.LK</p>
        <p>Website : symphonyevents.lk</p>
        <p>+94 77 8000 553 - Dulaj Dodawaththe</p>
        <p>+94 71 8978 385 - Eranda Heshan</p>
        <p>+94 76 9363 641 - Adeepa Sasmika</p>
        <p>+94 77 8688 280 - Roshitha Vihanga</p>
        <p>+94 77 1174 362 - Hirun Kalhara</p>

        <p>Gmail : contactus.symphonyevents.lk</p>

        <p>Website : symphonyevents.lk</p>
        <p>Website : ceylonarena.com</p>
      </div>

      <div className="footer-col">
        <h4 className="footer-col-title">PAGES</h4>
        <a href="#home" className="footer-link">
          HOME
        </a>
        <a href="#games" className="footer-link">
          GAMES
        </a>
        <a href="#events" className="footer-link">
          EVENTS
        </a>
        <a href="#about" className="footer-link">
          ABOUT
        </a>
        <button className="footer-link footer-link-btn" onClick={onRegister}>
          REGISTER
        </button>
        <button className="footer-link footer-link-btn" onClick={onSignIn}>
          LOGIN
        </button>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="footer-bottom-links">
        <a href="#">PRIVACY</a>
        <a href="#">TERMS</a>
        <a href="#">COOKIES</a>
      </div>
      <p className="footer-copy">
        COPYRIGHT &copy; 2026 CEYLON ARENA PVT LTD. ALL RIGHTS RESERVED.
        <br />
        <span>WEBSITE BUILT WITH ❤ FOR SRI LANKAN GAMERS.</span>
      </p>
    </div>
  </footer>
);

export default HomeFooter;

