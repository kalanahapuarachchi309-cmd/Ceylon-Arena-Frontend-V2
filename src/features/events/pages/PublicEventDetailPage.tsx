import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HomeNavigation from "../../home/components/HomeNavigation";
import { useAuth } from "../../auth/hooks/useAuth";
import { eventsApi } from "../api/eventsApi";
import type { EventEntity } from "../types/event.types";
import { paymentsApi } from "../../payments/api/paymentsApi";
import type { PaymentEntity } from "../../payments/types/payment.types";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import type { RegistrationEntity } from "../../registrations/types/registration.types";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDateTime } from "../../../shared/lib/date";
import { getErrorMessage, normalizeApiError } from "../../../shared/utils/errorHandler";
import { UserRole } from "../../../shared/types";

import "../../../components/Register.css";

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

const PublicEventDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [registration, setRegistration] = useState<RegistrationEntity | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentEntity | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(defaultPaymentForm);

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) {
        setError("Event slug is missing.");
        setEventLoading(false);
        return;
      }

      try {
        setEventLoading(true);
        setError(null);
        const response = await eventsApi.getPublicEventBySlug(slug);
        setEvent(response);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setEventLoading(false);
      }
    };

    void loadEvent();
  }, [slug]);

  const eventId = useMemo(() => resolveEntityId(event), [event]);
  const registrationId = useMemo(() => resolveEntityId(registration), [registration]);

  const resolveExistingRegistration = async (targetEventId: string) => {
    const registrations = await registrationsApi.getMyRegistrations({ page: 1, limit: 100 });
    const existing = registrations.find((item) => {
      const nestedEventId = resolveEntityId(item.event);
      return item.eventId === targetEventId || nestedEventId === targetEventId;
    });
    return existing ?? null;
  };

  const handleRegister = async () => {
    if (isRegistering) {
      return;
    }

    setError(null);
    setMessage(null);
    setCreatedPayment(null);

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
      setIsRegistering(true);
      const createdRegistration = await registrationsApi.createRegistration({ eventId });
      setRegistration(createdRegistration);
      setMessage("Registration created successfully. Submit your bank transfer payment below.");
    } catch (submitError) {
      const normalized = normalizeApiError(submitError);
      const fallbackMessage = normalized.message.toLowerCase();
      if (normalized.statusCode === 409 || fallbackMessage.includes("already")) {
        try {
          const existingRegistration = await resolveExistingRegistration(eventId);
          if (existingRegistration) {
            setRegistration(existingRegistration);
            setMessage("You are already registered for this event. Submit payment below.");
            return;
          }
        } catch (lookupError) {
          setError(getErrorMessage(lookupError));
          return;
        }
      }

      setError(normalized.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePaymentFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === "slip") {
      setPaymentForm((prev) => ({
        ...prev,
        slip: files?.[0] ?? null,
      }));
      return;
    }

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPayment = async (eventValue: FormEvent<HTMLFormElement>) => {
    eventValue.preventDefault();
    if (isSubmittingPayment) {
      return;
    }

    setError(null);
    setMessage(null);

    if (!registrationId) {
      setError("Registration must be created before payment.");
      return;
    }

    if (
      !paymentForm.slip ||
      !paymentForm.transactionReference ||
      !paymentForm.bankName ||
      !paymentForm.accountHolder
    ) {
      setError("Please provide slip, transaction reference, bank name, and account holder.");
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const payment = await paymentsApi.submitPayment(registrationId, {
        slip: paymentForm.slip,
        transactionReference: paymentForm.transactionReference,
        bankName: paymentForm.bankName,
        accountHolder: paymentForm.accountHolder,
      });
      setCreatedPayment(payment);
      setMessage("Payment submitted successfully. You can track status from My Registrations.");
      setPaymentForm(defaultPaymentForm);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <>
      <HomeNavigation
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        showSectionLinks={false}
      />

      <div className="register-page">
        <div className="register-container">
          <button className="btn-home-nav" onClick={() => navigate(APP_ROUTES.EVENTS)}>
            Back to Events
          </button>

          <h1 className="register-title">
            <span className="gradient-text">{eventLoading ? "Loading Event..." : event?.title || "Event"}</span>
          </h1>
          <p className="register-subtitle">{event?.gameName || "Event Details"}</p>

          <div className="registration-form-container">
            <div className="registration-form">
              {error ? <p className="register-subtitle">{error}</p> : null}
              {message ? <p className="register-subtitle">{message}</p> : null}

              {eventLoading ? (
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
                      <label>Rules</label>
                      <input value={event.rules || "-"} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <input value={event.status} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Banner</label>
                      <input value={event.bannerImage || "-"} readOnly />
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
                      disabled={isRegistering || !eventId || Boolean(registrationId)}
                    >
                      {registrationId ? "Registered" : isRegistering ? "Registering..." : "Register / Join Event"}
                    </button>
                    <button type="button" className="btn btn-cancel" onClick={() => navigate(APP_ROUTES.EVENTS)}>
                      Back to Events
                    </button>
                  </div>

                  {registrationId ? (
                    <form className="form-section" onSubmit={handleSubmitPayment}>
                      <h3 className="form-section-title">Bank Transfer Payment</h3>

                      <div className="form-group">
                        <label>Registration ID</label>
                        <input value={registrationId} readOnly />
                      </div>

                      <div className="form-group">
                        <label htmlFor="transactionReference">Transaction Reference *</label>
                        <input
                          id="transactionReference"
                          name="transactionReference"
                          value={paymentForm.transactionReference}
                          onChange={handlePaymentFieldChange}
                          placeholder="Enter bank transaction reference"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="bankName">Bank Name *</label>
                        <input
                          id="bankName"
                          name="bankName"
                          value={paymentForm.bankName}
                          onChange={handlePaymentFieldChange}
                          placeholder="Enter your bank name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="accountHolder">Account Holder *</label>
                        <input
                          id="accountHolder"
                          name="accountHolder"
                          value={paymentForm.accountHolder}
                          onChange={handlePaymentFieldChange}
                          placeholder="Enter account holder name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="slip">Upload Bank Slip *</label>
                        <input id="slip" name="slip" type="file" accept="image/*" onChange={handlePaymentFieldChange} required />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-submit" disabled={isSubmittingPayment || Boolean(createdPayment)}>
                          {createdPayment ? "Payment Submitted" : isSubmittingPayment ? "Submitting..." : "Submit Payment"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-cancel"
                          onClick={() => navigate(APP_ROUTES.MY_REGISTRATIONS)}
                        >
                          Go to My Registrations
                        </button>
                      </div>
                    </form>
                  ) : null}

                  {createdPayment ? (
                    <div className="form-section">
                      <h3 className="form-section-title">Payment Status</h3>
                      <div className="form-group">
                        <label>Status</label>
                        <input value={createdPayment.status} readOnly />
                      </div>
                      <div className="form-group">
                        <label>Transaction Reference</label>
                        <input value={createdPayment.transactionReference || "-"} readOnly />
                      </div>
                    </div>
                  ) : null}
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
    </>
  );
};

export default PublicEventDetailPage;
