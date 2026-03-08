import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";
import HomeNavigation from "../../home/components/HomeNavigation";
import {
  APP_ROUTES,
  toEventRegistrationConfirmRoute,
} from "../../../shared/constants/routes";
import { formatDateTime } from "../../../shared/lib/date";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { LoadingOverlay } from "../../../shared/components/custom-ui";
import { UserRole } from "../../../shared/types";

import "../../../components/Register.css";

const PublicEventDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const toast = useToast();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) {
        setErrorMessage("Event slug is missing.");
        setIsLoading(false);
        return;
      }

      setErrorMessage(null);
      setIsLoading(true);
      try {
        const response = await eventsApi.getPublicEventBySlug(slug);
        setEvent(response);
      } catch {
        setErrorMessage("Unable to load event details.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvent();
  }, [slug]);

  const registrationRoute = useMemo(
    () => (slug ? toEventRegistrationConfirmRoute(slug) : APP_ROUTES.EVENTS),
    [slug]
  );

  const handleRegisterClick = () => {
    if (isBootstrapping || !slug) {
      return;
    }

    if (!isAuthenticated || !user) {
      navigate(APP_ROUTES.SIGN_IN, { state: { redirectTo: registrationRoute } });
      return;
    }

    if (user.role !== UserRole.PLAYER) {
      toast.warning("Only player accounts can register for events.");
      return;
    }

    navigate(registrationRoute);
  };

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((previous) => !previous)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        showSectionLinks={false}
      />

      <div className="register-page">
        <LoadingOverlay isVisible={isLoading} message="Loading event details..." />
        <div className="register-container">
          <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.EVENTS)}>
            Back to Events
          </button>

          <h1 className="register-title">
            <span className="gradient-text">{event?.title || "Event Details"}</span>
          </h1>
          <p className="register-subtitle">{event?.gameName || "Public Event"}</p>

          {errorMessage ? <p className="register-subtitle">{errorMessage}</p> : null}

          {!isLoading && event ? (
            <div className="registration-form-container">
              <div className="registration-form">
                <div className="form-section">
                  <h3 className="form-section-title">Overview</h3>
                  <div className="form-group">
                    <label>Event Name</label>
                    <input value={event.title} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Game</label>
                    <input value={event.gameName} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input value={event.description} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Rules</label>
                    <input value={event.rules || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <input value={event.status} readOnly />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Schedule & Entry</h3>
                  <div className="form-group">
                    <label>Entry Fee</label>
                    <input value={`${event.currency} ${event.entryFee}`} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Maximum Teams</label>
                    <input value={String(event.maxTeams)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Registration Opens</label>
                    <input value={formatDateTime(event.registrationOpenAt)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Registration Closes</label>
                    <input value={formatDateTime(event.registrationCloseAt)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Event Starts</label>
                    <input value={formatDateTime(event.eventStartAt)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Event Ends</label>
                    <input value={formatDateTime(event.eventEndAt)} readOnly />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-submit" onClick={handleRegisterClick}>
                    Register for Event
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate(APP_ROUTES.EVENTS)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PublicEventDetailPage;
