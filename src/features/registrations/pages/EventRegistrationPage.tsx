import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import EventCard from "../../events/components/EventCard";
import type { EventEntity } from "../../events/types/event.types";
import HomeNavigation from "../../home/components/HomeNavigation";
import { teamsApi } from "../../teams/api/teamsApi";
import type { TeamEntity } from "../../teams/types/team.types";
import {
  APP_ROUTES,
  toEventRegistrationConfirmRoute,
} from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDate } from "../../../shared/lib/date";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import {
  ButtonLoadingState,
  CustomFormSection,
  LoadingOverlay,
} from "../../../shared/components/custom-ui";
import { EventStatus } from "../../../shared/types";
import { eventsApi } from "../../events/api/eventsApi";

import "../../../components/Register.css";
import "../../../components/HomePage.css";

const EventRegistrationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, teamSummary } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [team, setTeam] = useState<TeamEntity | null>(null);
  const [isTeamLoading, setIsTeamLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsTeamLoading(true);
      setIsEventsLoading(true);

      try {
        const [teamResponse, eventsResponse] = await Promise.all([
          teamsApi.getMyTeam(),
          eventsApi.getPublicEvents({ page: 1, limit: 100 }),
        ]);

        console.log('Fetched events response:', eventsResponse);
        const eventsList = eventsResponse;
        console.log('Events list:', eventsList);
        console.log('Events list length:', eventsList.length);

        if (isMounted) {
          setTeam(teamResponse);
          setEvents(eventsList);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to load data";
        
        if (errorMessage.toLowerCase().includes("team")) {
          toast.error({
            title: "Team Load Failed",
            message: "Unable to load your team details.",
            dedupeKey: "event-register-team-load-failed",
          });
        } else {
          toast.error({
            title: "Events Load Failed",
            message: "Unable to load events.",
            dedupeKey: "event-register-events-load-failed",
          });
        }
        
        setErrorMessage(errorMessage);
      } finally {
        if (isMounted) {
          setIsTeamLoading(false);
          setIsEventsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const activeEvents = useMemo(
    () => {
      console.log('All events:', events);
      console.log('Filtering for EventStatus.ACTIVE:', EventStatus.ACTIVE);
      const filtered = events.filter((event) => {
        console.log('Event status:', event.status, 'Event title:', event.title);
        return event.status === EventStatus.ACTIVE || event.status === 'PUBLISHED';
      });
      console.log('Active/Published events:', filtered);
      return filtered;
    },
    [events]
  );

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) {
      return null;
    }

    return (
      activeEvents.find((event) => resolveEntityId(event) === selectedEventId) ??
      null
    );
  }, [activeEvents, selectedEventId]);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const stillAvailable = activeEvents.some(
      (event) => resolveEntityId(event) === selectedEventId
    );

    if (!stillAvailable) {
      setSelectedEventId(null);
    }
  }, [activeEvents, selectedEventId]);

  const handleEventSelect = (event: EventEntity) => {
    const eventId = resolveEntityId(event);
    if (!eventId) {
      toast.warning({
        title: "Event Unavailable",
        message: "This event cannot be selected right now.",
        dedupeKey: "event-register-select-missing-id",
      });
      return;
    }

    setSelectedEventId(eventId);
    setErrorMessage(null);
  };

  const handleSubmit = async (eventValue: FormEvent<HTMLFormElement>) => {
    eventValue.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!selectedEventId) {
      const message = "Please select an event before submitting registration.";
      setErrorMessage(message);
      toast.warning({
        title: "Event Required",
        message,
        dedupeKey: "event-register-submit-missing-event",
      });
      return;
    }

    if (!team?.teamName && !teamSummary?.teamName) {
      const message = "Team details are required before event registration.";
      setErrorMessage(message);
      toast.warning({
        title: "Team Required",
        message,
        dedupeKey: "event-register-submit-missing-team",
      });
      return;
    }

    if (!selectedEvent?.slug) {
      const message = "Selected event route is unavailable. Please select a different event.";
      setErrorMessage(message);
      toast.error({
        title: "Invalid Event",
        message,
        dedupeKey: "event-register-submit-missing-event-slug",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    toast.info({
      title: "Event Selected",
      message: "Continue to confirm team details and payment.",
      dedupeKey: `event-register-confirm-redirect:${selectedEventId}`,
    });

    navigate(toEventRegistrationConfirmRoute(selectedEvent.slug), {
      replace: true,
      state: {
        fromEventSelection: true,
      },
    });
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
        <LoadingOverlay
          isVisible={isEventsLoading || isTeamLoading}
          message="Loading event registration..."
        />
        <div className="register-container">
          <h1 className="register-title">
            <span className="gradient-text">Event Registration</span>
          </h1>
          <p className="register-subtitle">
            Select an active event and submit your registration
          </p>

          {errorMessage ? <p className="register-subtitle">{errorMessage}</p> : null}

          <div className="events-container">
            {isEventsLoading ? (
              <div className="event-card">
                <div className="event-info">
                  <h3>Loading events...</h3>
                </div>
              </div>
            ) : activeEvents.length === 0 ? (
              <div className="event-card">
                <div className="event-info">
                  <h3>No active events available right now</h3>
                  <p>Please check back later.</p>
                </div>
              </div>
            ) : (
              activeEvents.map((event) => {
                const eventId = resolveEntityId(event);
                console.log('Rendering event:', event.title, 'ID:', eventId, '_id:', event.id);
                const prizePool =
                  typeof event.prizePool === "string" && event.prizePool.trim().length > 0
                    ? event.prizePool
                    : `${event.currency} ${Number(event.entryFee).toLocaleString()}`;

                return (
                  <EventCard
                    key={eventId || event.slug}
                    event={event}
                    onAction={handleEventSelect}
                    onCardClick={handleEventSelect}
                    actionDisabled={!eventId}
                    actionLabel={
                      selectedEventId && eventId && selectedEventId === eventId
                        ? "Selected"
                        : "Register"
                    }
                    description={`${event.gameName} | ${formatDate(
                      event.eventStartAt || event.registrationOpenAt
                    )} | Prize Pool: ${prizePool}`}
                  />
                );
              })
            )}
          </div>

          {selectedEvent ? (
            <div className="registration-form-container">
              <form className="registration-form" onSubmit={handleSubmit}>
                <CustomFormSection title="Selected Event">
                  <div className="form-group">
                    <label>Event</label>
                    <input value={selectedEvent.title} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Game</label>
                    <input value={selectedEvent.gameName} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Event Date</label>
                    <input
                      value={formatDate(
                        selectedEvent.eventStartAt || selectedEvent.registrationOpenAt
                      )}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Prize Pool</label>
                    <input
                      value={
                        typeof selectedEvent.prizePool === "string" &&
                        selectedEvent.prizePool.trim().length > 0
                          ? selectedEvent.prizePool
                          : `${selectedEvent.currency} ${Number(
                              selectedEvent.entryFee
                            ).toLocaleString()}`
                      }
                      readOnly
                    />
                  </div>
                </CustomFormSection>

                <CustomFormSection title="Team Information">
                  <div className="form-group">
                    <label>Team Name</label>
                    <input value={team?.teamName || teamSummary?.teamName || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Team Leader</label>
                    <input value={user?.fullName || user?.playerName || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leader In-Game ID</label>
                    <input value={team?.leaderInGameId || "-"} readOnly />
                  </div>
                </CustomFormSection>

                <CustomFormSection title="Payment Method">
                  <div className="form-group">
                    <label>Method</label>
                    <input value="Bank Transfer" readOnly />
                  </div>
                </CustomFormSection>

                <div className="form-actions">
                  <ButtonLoadingState
                    type="submit"
                    className="btn btn-submit"
                    isLoading={isSubmitting}
                    loadingLabel="Submitting Registration..."
                    disabled={!selectedEventId}
                  >
                    Submit Event Registration
                  </ButtonLoadingState>

                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD)}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EventRegistrationPage;
