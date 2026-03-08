import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { formatDateTime } from "../../../shared/lib/date";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { UserRole } from "../../../shared/types";

import "../../../components/Register.css";

const PublicEventDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) {
        setError("Event slug is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await eventsApi.getPublicEventBySlug(slug);
        setEvent(response);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvent();
  }, [slug]);

  const eventId = useMemo(() => resolveEntityId(event), [event]);

  const handleRegister = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!eventId) {
      setError("Unable to resolve event id.");
      return;
    }

    if (!isAuthenticated || !user) {
      navigate(APP_ROUTES.LOGIN, { state: { redirectTo: window.location.pathname } });
      return;
    }

    if (user.role !== UserRole.PLAYER) {
      setError("Only players can register for events.");
      return;
    }

    try {
      setIsSubmitting(true);
      await registrationsApi.createRegistration({ eventId });
      setSuccessMessage("Registration created successfully.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.HOME)}>
          Back to Home
        </button>

        <h1 className="register-title">
          <span className="gradient-text">{isLoading ? "Loading Event..." : event?.title || "Event"}</span>
        </h1>
        <p className="register-subtitle">{event?.gameName || "Event Details"}</p>

        <div className="registration-form-container">
          <div className="registration-form">
            {error ? <p className="register-subtitle">{error}</p> : null}
            {successMessage ? <p className="register-subtitle">{successMessage}</p> : null}

            {isLoading ? (
              <div className="form-section">
                <h3 className="form-section-title">Loading...</h3>
              </div>
            ) : event ? (
              <>
                <div className="form-section">
                  <h3 className="form-section-title">Event Overview</h3>
                  <div className="form-group">
                    <label>Title</label>
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
                    <label>Status</label>
                    <input value={event.status} readOnly />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Schedule & Fee</h3>
                  <div className="form-group">
                    <label>Entry Fee</label>
                    <input value={`${event.currency} ${event.entryFee}`} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Max Teams</label>
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
                    <label>Event Start</label>
                    <input value={formatDateTime(event.eventStartAt)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Event End</label>
                    <input value={formatDateTime(event.eventEndAt)} readOnly />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-submit"
                    onClick={handleRegister}
                    disabled={isSubmitting || !eventId}
                  >
                    {isSubmitting ? "Registering..." : "Register Team"}
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={() => navigate(APP_ROUTES.EVENTS)}>
                    Back to Events
                  </button>
                </div>
              </>
            ) : (
              <div className="form-section">
                <h3 className="form-section-title">Event not found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetailPage;
