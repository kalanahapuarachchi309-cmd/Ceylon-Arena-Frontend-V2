import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { usePublicEvents } from "../../events/hooks/useEvents";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { formatDate } from "../../../shared/lib/date";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { UserRole } from "../../../shared/types";

const formatDateParts = (value?: string) => {
  if (!value) {
    return { day: "--", month: "---" };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
  };
};

const LiveEventsSection = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { events, isLoading, error } = usePublicEvents({ page: 1, limit: 3 });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);

  const visibleEvents = useMemo(() => events.slice(0, 3), [events]);

  const handleEventOpen = (slug?: string) => {
    if (!slug) {
      return;
    }
    navigate(`/events/${slug}`);
  };

  const handleRegister = async (eventId: string, slug?: string) => {
    setActionError(null);
    setActionSuccess(null);

    if (!isAuthenticated || !user) {
      navigate(APP_ROUTES.LOGIN, { state: { redirectTo: slug ? `/events/${slug}` : APP_ROUTES.EVENTS } });
      return;
    }

    if (user.role !== UserRole.PLAYER) {
      setActionError("Only players can register for events.");
      return;
    }

    setPendingEventId(eventId);
    try {
      await registrationsApi.createRegistration({ eventId });
      setActionSuccess("Registration created. You can manage it from My Registrations.");
    } catch (registerError) {
      setActionError(getErrorMessage(registerError));
    } finally {
      setPendingEventId(null);
    }
  };

  return (
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

        {actionError ? <p className="section-subtitle" style={{ marginBottom: "1rem" }}>{actionError}</p> : null}
        {actionSuccess ? <p className="section-subtitle" style={{ marginBottom: "1rem" }}>{actionSuccess}</p> : null}
        {error ? <p className="section-subtitle" style={{ marginBottom: "1rem" }}>{error}</p> : null}

        <div className="events-container">
          {isLoading ? (
            <div className="event-card">
              <div className="event-info">
                <h3>Loading events...</h3>
              </div>
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="event-card">
              <div className="event-info">
                <h3>No public events available right now</h3>
                <p>Please check back later.</p>
              </div>
            </div>
          ) : (
            visibleEvents.map((event) => {
              const eventId = resolveEntityId(event);
              const eventDate = formatDateParts(event.eventStartAt || event.registrationOpenAt);
              return (
                <div className="event-card" key={eventId || event.slug}>
                  <div className="event-date">
                    <span className="date-day">{eventDate.day}</span>
                    <span className="date-month">{eventDate.month}</span>
                  </div>
                  <div className="event-info">
                    <h3 style={{ cursor: "pointer" }} onClick={() => handleEventOpen(event.slug)}>
                      {event.title}
                    </h3>
                    <p>
                      {event.gameName} | {event.currency} {event.entryFee} | {event.maxTeams} Teams
                    </p>
                    <div className="event-tags">
                      <span className="tag">{event.status}</span>
                      <span className="tag">{formatDate(event.registrationCloseAt)}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => eventId && handleRegister(eventId, event.slug)}
                    disabled={!eventId || pendingEventId === eventId}
                  >
                    {pendingEventId === eventId ? "Registering..." : "Register"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveEventsSection;
