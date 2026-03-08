import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import freefireImg from "../../../assets/image/Freefire.jpeg";
import pubgImg from "../../../assets/image/pubg-mobile.jpg";
import codImg from "../../../assets/image/call-of-duty.webp";
import valoranImg from "../../../assets/image/Valoran.avif";
import logoImg from "../../../assets/image/web_Site_logo/Ceylon_Arena_Logo_CMYK-01.png";
import contactBannerImg from "../../../assets/image/slide_show/slid_show_03.jpg";
import slide01 from "../../../assets/image/slide_show/slid_show_01.jpg";
import slide02 from "../../../assets/image/slide_show/slid_show_02.webp";
import slide04 from "../../../assets/image/slide_show/slid_show_04.jpg";
import slide05 from "../../../assets/image/slide_show/slid_show_05.webp";
import slide06 from "../../../assets/image/slide_show/slid_show_06.png";

import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import CtaSection from "../components/CtaSection";
import FeaturedGamesSection from "../components/FeaturedGamesSection";
import HeroSection from "../components/HeroSection";
import HomeFooter from "../components/HomeFooter";
import HomeNavigation from "../components/HomeNavigation";
import LiveEventsSection from "../components/LiveEventsSection";
import StatsBarSection from "../components/StatsBarSection";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { useAuth } from "../../auth/hooks/useAuth";
import { UserRole } from "../../../shared/types";

import "../../../components/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleRegisterClick = () => {
    if (!isAuthenticated || !user) {
      navigate(APP_ROUTES.REGISTER);
      return;
    }

    if (user.role === UserRole.ADMIN) {
      navigate(APP_ROUTES.ADMIN_DASHBOARD);
      return;
    }

    if (window.location.pathname === APP_ROUTES.HOME || window.location.pathname === APP_ROUTES.EVENTS) {
      window.location.hash = "events";
      return;
    }

    navigate(`${APP_ROUTES.HOME}#events`);
  };

  const handleCardMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const offsetX = (x - 0.5) * 12;
    const offsetY = (y - 0.5) * 8;

    element.style.setProperty("--bg-pos-x", `${50 + offsetX}%`);
    element.style.setProperty("--bg-pos-y", `${50 + offsetY}%`);
  };

  const handleCardMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--bg-pos-x", "50%");
    element.style.setProperty("--bg-pos-y", "50%");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const stripImages = [
    freefireImg,
    pubgImg,
    codImg,
    valoranImg,
    slide01,
    slide02,
    contactBannerImg,
    slide04,
    slide05,
    slide06,
    freefireImg,
    pubgImg,
    codImg,
    valoranImg,
    slide01,
    slide02,
    contactBannerImg,
    slide04,
    slide05,
    slide06,
  ];

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={toggleMobileMenu}
        onCloseMenu={closeMobileMenu}
        showSectionLinks
        onCosplay={() => navigate(APP_ROUTES.COSPLAY)}
      />

      <HeroSection
        logoImg={logoImg}
        onRegister={handleRegisterClick}
        onCosplay={() => navigate(APP_ROUTES.COSPLAY)}
      />

      <FeaturedGamesSection
        freefireImg={freefireImg}
        pubgImg={pubgImg}
        codImg={codImg}
        valoranImg={valoranImg}
        selectedCard={selectedCard}
        onSelectCard={setSelectedCard}
        onCardMouseMove={handleCardMouseMove}
        onCardMouseLeave={handleCardMouseLeave}
        onRegister={handleRegisterClick}
      />

      <LiveEventsSection />
      <StatsBarSection onRegister={handleRegisterClick} />
      <AboutSection />
      <CtaSection onRegister={handleRegisterClick} />
      <ContactSection contactBannerImg={contactBannerImg} />

      <HomeFooter
        logoImg={logoImg}
        stripImages={stripImages}
        onRegister={handleRegisterClick}
        onSignIn={() => navigate(APP_ROUTES.SIGN_IN)}
      />
    </>
  );
};

export default HomePage;
