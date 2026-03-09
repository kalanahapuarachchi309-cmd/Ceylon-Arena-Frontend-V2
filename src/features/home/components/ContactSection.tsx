import type { FormEvent } from "react";
import { Facebook, Instagram } from "lucide-react";

import { useToast } from "../../../shared/providers/CustomToastProvider";

interface ContactSectionProps {
  contactBannerImg: string;
}

const ContactSection = ({ contactBannerImg }: ContactSectionProps) => {
  const toast = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success({
      title: "Message Received",
      message: "Thanks for reaching out. Our team will contact you soon.",
      dedupeKey: "contact-form-submit",
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-banner" style={{ backgroundImage: `url(${contactBannerImg})` }}>
        <div className="contact-banner-overlay" />
        <h2 className="contact-banner-title">Contact Us</h2>
      </div>

      <div className="contact-body">
        <div className="contact-left">
          <h3 className="contact-heading">
            Have A Question?
            <br />
            Shoot Away!
          </h3>
          <p className="contact-desc">
            Whether you're looking to join a tournament, need help with your account, or want to partner with Ceylon
            Arena - our team is ready. Drop us a line and we'll get back to you faster than a headshot.
          </p>
          <div className="contact-socials">
            <span className="contact-follow">Follow Us On:</span>

            <a
              href="https://www.instagram.com/ceylonarena?igsh=MWd4djJ0NmUxa3QwcQ=="
              className="contact-social-icon instagram"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.facebook.com/share/1JsvmDPe6W/?mibextid=wwXIfr"
              className="contact-social-icon facebook"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label className="contact-label">
              Name <span className="contact-required">*</span>
            </label>
            <input className="contact-input" type="text" placeholder="" required />
          </div>
          <div className="contact-field">
            <label className="contact-label">
              Phone No <span className="contact-required">*</span>
            </label>
            <input className="contact-input" type="tel" placeholder="" required />
          </div>
          <div className="contact-field">
            <label className="contact-label">
              Your Message <span className="contact-required">*</span>
            </label>
            <textarea className="contact-textarea" rows={5} required />
          </div>
          <button type="submit" className="contact-submit">
            SUBMIT
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
