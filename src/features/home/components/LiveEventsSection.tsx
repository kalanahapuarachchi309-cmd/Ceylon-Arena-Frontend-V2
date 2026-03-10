import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import EventCard from "../../events/components/EventCard";
import { usePublicEvents } from "../../events/hooks/useEvents";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import {
  APP_ROUTES,
  toEventRegistrationConfirmRoute,
  toEventRoute,
} from "../../../shared/constants/routes";
import { UserRole } from "../../../shared/types";

const LiveEventsSection = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user, isBootstrapping } = useAuth();
  const { events, isLoading, error } = usePublicEvents({ page: 1, limit: 100 });

  const visibleEvents = useMemo(() => events, [events]);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error({
      title: "Events Load Failed",
      message: error,
      dedupeKey: `home-live-events-load:${error}`,
    });
  }, [error, toast]);

  const handleEventOpen = (slug?: string, eventId?: string | null) => {
    if (!slug) {
      toast.warning({
        title: "Unavailable Event",
        message: "This event is missing a route identifier.",
        dedupeKey: "home-live-events-missing-slug",
      });
      return;
    }
    navigate(toEventRoute(slug), {
      state: eventId ? { eventId } : undefined,
    });
  };

  const handleEventRegister = (slug?: string) => {
    if (!slug) {
      return;
    }

    const targetPath = toEventRegistrationConfirmRoute(slug);

    if (isBootstrapping || !isAuthenticated || !user) {
      toast.info({
        title: "Sign In Required",
        message: "Please sign in with a player account to register.",
        dedupeKey: `home-live-events-auth-required:${slug}`,
      });
      navigate(APP_ROUTES.SIGN_IN, { state: { redirectTo: targetPath } });
      return;
    }

    if (user.role !== UserRole.PLAYER) {
      toast.warning("Only player accounts can register for events.");
      return;
    }

    navigate(targetPath);
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
              return (
                <EventCard
                  key={eventId || event.slug}
                  event={event}
                  onTitleClick={() => handleEventOpen(event.slug, eventId)}
                  onAction={() => handleEventRegister(event.slug)}
                  actionDisabled={!event.slug}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveEventsSection;
