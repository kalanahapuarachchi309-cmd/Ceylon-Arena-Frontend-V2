import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { usePublicEvents } from "../../events/hooks/useEvents";
import { formatDate } from "../../../shared/lib/date";
import { resolveEntityId } from "../../../shared/api/apiTypes";

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
  const { events, isLoading, error } = usePublicEvents({ page: 1, limit: 100 });

  const visibleEvents = useMemo(() => events, [events]);

  const handleEventOpen = (slug?: string, eventId?: string | null) => {
    if (!slug) {
      return;
    }
    navigate(`/events/${slug}`, {
      state: eventId ? { eventId } : undefined,
    });
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
                    onClick={() => handleEventOpen(event.slug, eventId)}
                    disabled={!event.slug}
                  >
                    View & Register
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
