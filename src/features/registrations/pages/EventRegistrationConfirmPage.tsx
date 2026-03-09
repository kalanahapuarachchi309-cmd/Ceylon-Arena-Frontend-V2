import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { eventsApi } from "../../events/api/eventsApi";
import type { EventEntity } from "../../events/types/event.types";
import HomeNavigation from "../../home/components/HomeNavigation";
import { registrationsApi } from "../api/registrationsApi";
import type { RegistrationEntity } from "../types/registration.types";
import { teamsApi } from "../../teams/api/teamsApi";
import type { TeamEntity } from "../../teams/types/team.types";
import {
  APP_ROUTES,
  toEventRegistrationPaymentRoute,
} from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDateTime } from "../../../shared/lib/date";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import {
  ButtonLoadingState,
  CustomFormSection,
  LoadingOverlay,
} from "../../../shared/components/custom-ui";
import { normalizeApiError } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";

const EventRegistrationConfirmPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [team, setTeam] = useState<TeamEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      if (!slug) {
        const message = "Event slug is missing.";
        setErrorMessage(message);
        toast.error({
          title: "Registration Setup Failed",
          message,
          dedupeKey: "event-registration-confirm-missing-slug",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [eventResponse, teamResponse] = await Promise.all([
          eventsApi.getPublicEventBySlug(slug),
          teamsApi.getMyTeam(),
        ]);

        setEvent(eventResponse);
        setTeam(teamResponse);
      } catch {
        const message = "Unable to load event confirmation details.";
        setErrorMessage(message);
        toast.error({
          title: "Load Failed",
          message,
          dedupeKey: "event-registration-confirm-load-failed",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadPageData();
  }, [slug, toast]);

  const eventId = useMemo(() => resolveEntityId(event), [event]);

  const findExistingRegistration = async (targetEventId: string) => {
    const registrations = await registrationsApi.getMyRegistrations({ page: 1, limit: 100 });
    return (
      registrations.find((registration) => {
        const nestedEventId = resolveEntityId(registration.event);
        return (
          registration.eventId === targetEventId || nestedEventId === targetEventId
        );
      }) ?? null
    );
  };

  const navigateToPayment = (registration: RegistrationEntity) => {
    if (!slug) {
      return;
    }

    const registrationId = resolveEntityId(registration);
    if (!registrationId) {
      setErrorMessage("Registration was created but no id was returned.");
      return;
    }

    const paymentRoute = `${toEventRegistrationPaymentRoute(slug)}?registrationId=${registrationId}`;
    navigate(paymentRoute, {
      state: {
        registrationId,
        event,
        team,
      },
    });
  };

  const handleProceedToPayment = async () => {
    if (!eventId) {
      const message = "Event id is missing.";
      setErrorMessage(message);
      toast.error({
        title: "Registration Failed",
        message,
      });
      return;
    }

    if (!team) {
      const message = "Team information is missing. Please update your profile first.";
      setErrorMessage(message);
      toast.warning({
        title: "Team Required",
        message,
        dedupeKey: "event-registration-confirm-team-missing",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const registration = await registrationsApi.createRegistration({ eventId });
      toast.success("Registration confirmed. Proceed with payment.");
      navigateToPayment(registration);
      return;
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      const isAlreadyRegistered =
        normalizedError.statusCode === 409 ||
        normalizedError.message.toLowerCase().includes("already");

      if (!isAlreadyRegistered) {
        setErrorMessage(normalizedError.message);
        toast.error({
          title: "Registration Failed",
          message: normalizedError.message,
        });
        return;
      }

      try {
        const existingRegistration = await findExistingRegistration(eventId);
        if (!existingRegistration) {
          const message = "Registration already exists, but could not be retrieved.";
          setErrorMessage(message);
          toast.error({
            title: "Registration Lookup Failed",
            message,
            dedupeKey: "event-registration-existing-not-found",
          });
          return;
        }
        toast.info("Existing registration found. Continue with payment.");
        navigateToPayment(existingRegistration);
      } catch {
        const message = "Unable to resolve existing registration.";
        setErrorMessage(message);
        toast.error({
          title: "Registration Lookup Failed",
          message,
          dedupeKey: "event-registration-existing-resolve-failed",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
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
        <LoadingOverlay isVisible={isLoading} message="Loading event confirmation..." />
        <div className="register-container">
          <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.EVENTS)}>
            Back to Events
          </button>

          <h1 className="register-title">
            <span className="gradient-text">Confirm Event Registration</span>
          </h1>
          <p className="register-subtitle">
            Review your event and team details before payment
          </p>

          {errorMessage ? <p className="register-subtitle">{errorMessage}</p> : null}

          {!isLoading && event ? (
            <div className="registration-form-container">
              <div className="registration-form">
                <CustomFormSection title="Event Details">
                  <div className="form-group">
                    <label>Event</label>
                    <input value={event.title} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Game</label>
                    <input value={event.gameName} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Entry Fee</label>
                    <input value={`${event.currency} ${event.entryFee}`} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Registration Closes</label>
                    <input value={formatDateTime(event.registrationCloseAt)} readOnly />
                  </div>
                </CustomFormSection>

                <CustomFormSection title="Team Confirmation">
                  <div className="form-group">
                    <label>Team Name</label>
                    <input value={team?.teamName || "No team found"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Primary Game</label>
                    <input value={team?.primaryGame || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leader Name</label>
                    <input value={user?.fullName || user?.playerName || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leader Email</label>
                    <input value={user?.email || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leader In-Game ID</label>
                    <input value={team?.leaderInGameId || "-"} readOnly />
                  </div>

                  {team?.members?.map((member, index) => (
                    <div className="form-row-two-col" key={`${member.name}-${index}`}>
                      <div className="form-group">
                        <label>Member {index + 2} Name</label>
                        <input value={member.name} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Member {index + 2} In-Game ID</label>
                        <input value={member.inGameId} readOnly />
                      </div>
                    </div>
                  ))}
                </CustomFormSection>

                <div className="form-actions">
                  <ButtonLoadingState
                    type="button"
                    className="btn btn-submit"
                    isLoading={isSubmitting}
                    loadingLabel="Creating Registration..."
                    onClick={() => void handleProceedToPayment()}
                    disabled={!team}
                  >
                    Proceed to Payment
                  </ButtonLoadingState>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD)}
                  >
                    Go to Profile
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

export default EventRegistrationConfirmPage;
