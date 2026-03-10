import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";
import EventCard from "../components/EventCard";
import HomeNavigation from "../../home/components/HomeNavigation";
import { useAuth } from "../../auth/hooks/useAuth";
import { toEventRoute, toEventRegistrationConfirmRoute, APP_ROUTES } from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDate } from "../../../shared/lib/date";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import { LoadingOverlay } from "../../../shared/components/custom-ui";
import { UserRole } from "../../../shared/types";

import "../../../components/Register.css";
import "../../../components/HomePage.css";

const EventsListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const eventsList = await eventsApi.getPublicEvents({ page: 1, limit: 100 });
        console.log("Fetched events:", eventsList);

        if (isMounted) {
          setEvents(eventsList);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load events";
        setErrorMessage(message);
        toast.error({
          title: "Events Load Failed",
          message: "Unable to load events. Please try again later.",
          dedupeKey: "events-list-load-failed",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleEventAction = (event: EventEntity) => {
    const eventId = resolveEntityId(event);
    
    if (!isAuthenticated) {
      toast.info({
        title: "Login Required",
        message: "Please sign in to register for events.",
        dedupeKey: "events-list-login-required",
      });
      navigate(APP_ROUTES.SIGN_IN);
      return;
    }

    if (user?.role === UserRole.ADMIN) {
      navigate(APP_ROUTES.ADMIN_EVENTS);
      return;
    }

    if (!event.slug) {
      toast.warning({
        title: "Event Unavailable",
        message: "This event cannot be accessed right now.",
        dedupeKey: `events-list-missing-slug-${eventId}`,
      });
      return;
    }

    // Navigate to event registration confirm page
    navigate(toEventRegistrationConfirmRoute(event.slug));
  };

  const handleEventTitleClick = (event: EventEntity) => {
    if (!event.slug) {
      toast.warning({
        title: "Event Unavailable",
        message: "Event details cannot be accessed right now.",
        dedupeKey: `events-list-details-missing-slug-${resolveEntityId(event)}`,
      });
      return;
    }

    navigate(toEventRoute(event.slug));
  };

  const publishedEvents = events.filter(
    (event) => event.status === "PUBLISHED" || event.status === "ACTIVE"
  );

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        showSectionLinks={true}
      />

      <div className="register-page">
        <LoadingOverlay isVisible={isLoading} message="Loading events..." />
        
        <div className="register-container">
          <h1 className="register-title">
            <span className="gradient-text">Gaming Events</span>
          </h1>
          <p className="register-subtitle">
            Browse and register for upcoming gaming tournaments
          </p>

          {errorMessage && (
            <div className="error-message" style={{ 
              color: "#ff6b6b", 
              textAlign: "center", 
              margin: "20px 0",
              padding: "12px",
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              borderRadius: "8px"
            }}>
              {errorMessage}
            </div>
          )}

          <div className="events-container">
            {isLoading ? (
              <div className="event-card">
                <div className="event-info">
                  <h3>Loading events...</h3>
                </div>
              </div>
            ) : publishedEvents.length === 0 ? (
              <div className="event-card">
                <div className="event-info">
                  <h3>No events available</h3>
                  <p>Check back soon for upcoming tournaments!</p>
                </div>
              </div>
            ) : (
              publishedEvents.map((event) => {
                const eventId = resolveEntityId(event);
                const prizePool =
                  typeof event.prizePool === "string" && event.prizePool.trim().length > 0
                    ? event.prizePool
                    : `${event.currency} ${Number(event.entryFee).toLocaleString()}`;

                return (
                  <EventCard
                    key={eventId || event.slug}
                    event={event}
                    onAction={handleEventAction}
                    onTitleClick={handleEventTitleClick}
                    actionLabel={isAuthenticated ? "Register" : "Sign In to Register"}
                    actionDisabled={!event.slug}
                    description={`${event.gameName} | ${formatDate(
                      event.eventStartAt || event.registrationOpenAt
                    )} | Prize Pool: ${prizePool}`}
                  />
                );
              })
            )}
          </div>

          {publishedEvents.length > 0 && (
            <div style={{ 
              textAlign: "center", 
              marginTop: "40px",
              padding: "20px"
            }}>
              <p style={{ 
                fontSize: "14px", 
                color: "#888",
                marginBottom: "12px"
              }}>
                Showing {publishedEvents.length} {publishedEvents.length === 1 ? "event" : "events"}
              </p>
              {isAuthenticated && (
                <button
                  type="button"
                  className="btn btn-submit"
                  onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD)}
                  style={{ marginTop: "12px" }}
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsListPage;
