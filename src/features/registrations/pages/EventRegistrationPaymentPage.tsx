import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { eventsApi } from "../../events/api/eventsApi";
import type { EventEntity } from "../../events/types/event.types";
import HomeNavigation from "../../home/components/HomeNavigation";
import { paymentsApi } from "../../payments/api/paymentsApi";
import { registrationsApi } from "../api/registrationsApi";
import type { RegistrationEntity } from "../types/registration.types";
import { teamsApi } from "../../teams/api/teamsApi";
import type { TeamEntity } from "../../teams/types/team.types";
import {
  APP_ROUTES,
  toEventRegistrationConfirmRoute,
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

interface EventRegistrationPaymentPageState {
  registrationId?: string;
  event?: EventEntity;
  team?: TeamEntity | null;
}

interface PaymentFormState {
  transactionReference: string;
  bankName: string;
  accountHolder: string;
  slip: File | null;
}

const defaultPaymentForm: PaymentFormState = {
  transactionReference: "",
  bankName: "",
  accountHolder: "",
  slip: null,
};

const EventRegistrationPaymentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();

  const navigationState = (location.state ?? {}) as EventRegistrationPaymentPageState;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [event, setEvent] = useState<EventEntity | null>(navigationState.event ?? null);
  const [team, setTeam] = useState<TeamEntity | null>(navigationState.team ?? null);
  const [registration, setRegistration] = useState<RegistrationEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(defaultPaymentForm);

  const registrationIdFromQuery = searchParams.get("registrationId");

  const registrationId = useMemo(
    () =>
      registrationIdFromQuery ??
      navigationState.registrationId ??
      resolveEntityId(registration),
    [navigationState.registrationId, registration, registrationIdFromQuery]
  );

  useEffect(() => {
    const loadPageData = async () => {
      if (!slug) {
        setErrorMessage("Event slug is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const initialEvent = navigationState.event ?? null;
        const initialTeam = navigationState.team ?? null;
        const [eventResponse, teamResponse] = await Promise.all([
          initialEvent ? Promise.resolve(initialEvent) : eventsApi.getPublicEventBySlug(slug),
          initialTeam ? Promise.resolve(initialTeam) : teamsApi.getMyTeam(),
        ]);

        setEvent(eventResponse);
        setTeam(teamResponse);

        const primaryRegistrationId = registrationIdFromQuery ?? navigationState.registrationId;

        if (primaryRegistrationId) {
          const registrationDetail = await registrationsApi.getRegistrationById(primaryRegistrationId);
          setRegistration(registrationDetail);
          return;
        }

        const resolvedEventId =
          resolveEntityId(eventResponse) ??
          eventResponse.id ??
          null;
        if (!resolvedEventId) {
          return;
        }

        const myRegistrations = await registrationsApi.getMyRegistrations({ page: 1, limit: 100 });
        const matchingRegistration =
          myRegistrations.find((item) => {
            const nestedEventId = resolveEntityId(item.event);
            return item.eventId === resolvedEventId || nestedEventId === resolvedEventId;
          }) ?? null;

        setRegistration(matchingRegistration);
      } catch {
        setErrorMessage("Unable to load payment submission details.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPageData();
  }, [
    navigationState.event,
    navigationState.registrationId,
    navigationState.team,
    registrationIdFromQuery,
    slug,
  ]);

  const handleFieldChange = (eventValue: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = eventValue.target;
    if (name === "slip") {
      setPaymentForm((previous) => ({ ...previous, slip: files?.[0] ?? null }));
      return;
    }
    setPaymentForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmitPayment = async (eventValue: FormEvent<HTMLFormElement>) => {
    eventValue.preventDefault();
    if (!registrationId) {
      setErrorMessage("Registration id is missing. Please confirm event registration again.");
      return;
    }

    if (
      !paymentForm.slip ||
      !paymentForm.transactionReference ||
      !paymentForm.bankName ||
      !paymentForm.accountHolder
    ) {
      setErrorMessage(
        "Please provide transaction reference, bank name, account holder and payment slip."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await paymentsApi.submitPayment(registrationId, {
        slip: paymentForm.slip,
        transactionReference: paymentForm.transactionReference,
        bankName: paymentForm.bankName,
        accountHolder: paymentForm.accountHolder,
      });
      toast.success("Payment submitted successfully.");
      navigate(APP_ROUTES.PLAYER_DASHBOARD_EVENTS, { replace: true });
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(normalizedError.message);
      toast.error(normalizedError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registrationStatus = registration?.status ?? "PENDING_PAYMENT";

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((previous) => !previous)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        showSectionLinks={false}
      />

      <div className="register-page">
        <LoadingOverlay isVisible={isLoading} message="Loading payment form..." />
        <div className="register-container">
          <button
            className="btn-home-nav"
            onClick={() =>
              navigate(slug ? toEventRegistrationConfirmRoute(slug) : APP_ROUTES.EVENTS)
            }
          >
            Back to Confirmation
          </button>

          <h1 className="register-title">
            <span className="gradient-text">Submit Payment</span>
          </h1>
          <p className="register-subtitle">
            Upload your bank slip to complete event registration
          </p>

          {errorMessage ? <p className="register-subtitle">{errorMessage}</p> : null}

          {!isLoading && event ? (
            <div className="registration-form-container">
              <form className="registration-form" onSubmit={handleSubmitPayment}>
                <CustomFormSection title="Registration Overview">
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
                    <label>Event Start</label>
                    <input value={formatDateTime(event.eventStartAt)} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Registration ID</label>
                    <input value={registrationId || "Not found"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Registration Status</label>
                    <input value={registrationStatus} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Team</label>
                    <input value={team?.teamName || "-"} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leader Email</label>
                    <input value={user?.email || "-"} readOnly />
                  </div>
                </CustomFormSection>

                <CustomFormSection title="Bank Transfer Details">
                  <div className="form-group">
                    <label htmlFor="transactionReference">Transaction Reference *</label>
                    <input
                      id="transactionReference"
                      name="transactionReference"
                      value={paymentForm.transactionReference}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bankName">Bank Name *</label>
                    <input
                      id="bankName"
                      name="bankName"
                      value={paymentForm.bankName}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="accountHolder">Account Holder *</label>
                    <input
                      id="accountHolder"
                      name="accountHolder"
                      value={paymentForm.accountHolder}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="slip">Upload Bank Slip *</label>
                    <input
                      id="slip"
                      name="slip"
                      type="file"
                      accept="image/*"
                      onChange={handleFieldChange}
                      required
                    />
                  </div>
                </CustomFormSection>

                <div className="form-actions">
                  <ButtonLoadingState
                    type="submit"
                    className="btn btn-submit"
                    isLoading={isSubmitting}
                    loadingLabel="Submitting Payment..."
                    disabled={!registrationId}
                  >
                    Submit Payment
                  </ButtonLoadingState>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD_EVENTS)}
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

export default EventRegistrationPaymentPage;
