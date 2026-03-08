interface CtaSectionProps {
  onRegister: () => void;
}

const CtaSection = ({ onRegister }: CtaSectionProps) => (
  <section className="cta-section">
    <div className="container">
      <h2>Gammers.... Are you ready for the Biggest Combat?</h2>
      <p>Be there! To win. This is the Biggest Prize Pool of Sri Lankan gaming history!</p>
      <button className="btn btn-primary" style={{ padding: "18px 60px", fontSize: "1.2rem" }} onClick={onRegister}>
        Create Account
      </button>
    </div>
  </section>
);

export default CtaSection;

