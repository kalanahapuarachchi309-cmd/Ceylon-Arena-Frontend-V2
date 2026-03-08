import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { eventsApi } from "../../events/api/eventsApi";
import type { EventEntity } from "../../events/types/event.types";
import { paymentsApi } from "../../payments/api/paymentsApi";
import type { PaymentEntity } from "../../payments/types/payment.types";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import type { RegistrationEntity } from "../../registrations/types/registration.types";
import { teamsApi } from "../../teams/api/teamsApi";
import type { TeamEntity } from "../../teams/types/team.types";
import { usersApi } from "../../users/api/usersApi";
import type { UserEntity } from "../../users/types/user.types";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDateTime } from "../../../shared/lib/date";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/AdminDashboard.css";
import "../../../components/Register.css";

interface EventFormState {
  id?: string;
  title: string;
  gameName: string;
  description: string;
  bannerImage: string;
  rules: string;
  entryFee: number;
  currency: string;
  maxTeams: number;
  registrationOpenAt: string;
  registrationCloseAt: string;
  eventStartAt: string;
  eventEndAt: string;
  status: EventEntity["status"];
}

interface RegistrationReviewState {
  status: RegistrationEntity["status"];
  notes: string;
}

interface PaymentReviewState {
  status: Exclude<PaymentEntity["status"], "PENDING">;
  adminNote: string;
}

interface ConfirmActionState {
  type: "delete-event" | "delete-payment";
  id: string;
}

const emptyEventForm: EventFormState = {
  title: "",
  gameName: "",
  description: "",
  bannerImage: "",
  rules: "",
  entryFee: 0,
  currency: "LKR",
  maxTeams: 32,
  registrationOpenAt: "",
  registrationCloseAt: "",
  eventStartAt: "",
  eventEndAt: "",
  status: "DRAFT",
};

const toInputDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const toIsoDateTime = (value: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetailMatch = useMatch(APP_ROUTES.ADMIN_USER_DETAILS);
  const teamDetailMatch = useMatch(APP_ROUTES.ADMIN_TEAM_DETAILS);
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<UserEntity[]>([]);
  const [teams, setTeams] = useState<TeamEntity[]>([]);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationEntity[]>([]);
  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamEntity | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationEntity | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentEntity | null>(null);
  const [eventForm, setEventForm] = useState<EventFormState>(emptyEventForm);
  const [registrationReview, setRegistrationReview] = useState<RegistrationReviewState>({
    status: "PENDING_PAYMENT",
    notes: "",
  });
  const [paymentReview, setPaymentReview] = useState<PaymentReviewState>({
    status: "APPROVED",
    adminNote: "",
  });
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const tab = useMemo(() => {
    if (userDetailMatch?.params.id) return "user-detail";
    if (teamDetailMatch?.params.id) return "team-detail";
    if (location.pathname === APP_ROUTES.ADMIN_USERS) return "users";
    if (location.pathname === APP_ROUTES.ADMIN_TEAMS) return "teams";
    if (location.pathname === APP_ROUTES.ADMIN_EVENTS) return "events";
    if (location.pathname === APP_ROUTES.ADMIN_REGISTRATIONS) return "registrations";
    if (location.pathname === APP_ROUTES.ADMIN_PAYMENTS) return "payments";
    return "overview";
  }, [location.pathname, teamDetailMatch?.params.id, userDetailMatch?.params.id]);

  const paymentsByRegistrationId = useMemo(() => {
    const map = new Map<string, PaymentEntity>();
    payments.forEach((paymentItem) => {
      const key = paymentItem.registrationId || resolveEntityId(paymentItem.registration);
      if (key && !map.has(key)) {
        map.set(key, paymentItem);
      }
    });
    return map;
  }, [payments]);

  const loadUsers = async () => setUsers(await usersApi.getUsers({ page: 1, limit: 50 }));
  const loadTeams = async () => setTeams(await teamsApi.getTeams({ page: 1, limit: 50 }));
  const loadEvents = async () => setEvents(await eventsApi.getEvents({ page: 1, limit: 50 }));
  const loadRegistrations = async () => setRegistrations(await registrationsApi.getRegistrations({ page: 1, limit: 100 }));
  const loadPayments = async () => setPayments(await paymentsApi.getPayments({ page: 1, limit: 100 }));

  useEffect(() => {
    const loadTabData = async () => {
      try {
        setError(null);
        if (tab === "overview") {
          await Promise.all([loadUsers(), loadTeams(), loadEvents(), loadRegistrations(), loadPayments()]);
        } else if (tab === "users") {
          await loadUsers();
        } else if (tab === "teams") {
          await loadTeams();
        } else if (tab === "events") {
          await loadEvents();
        } else if (tab === "registrations") {
          await Promise.all([loadRegistrations(), loadPayments()]);
        } else if (tab === "payments") {
          await loadPayments();
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };
    void loadTabData();
  }, [tab]);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (userDetailMatch?.params.id) {
          setSelectedUser(await usersApi.getUserById(userDetailMatch.params.id));
        } else {
          setSelectedUser(null);
        }

        if (teamDetailMatch?.params.id) {
          setSelectedTeam(await teamsApi.getTeamById(teamDetailMatch.params.id));
        } else {
          setSelectedTeam(null);
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };
    void loadDetails();
  }, [teamDetailMatch?.params.id, userDetailMatch?.params.id]);

  useEffect(() => {
    if (tab !== "registrations") {
      setSelectedRegistration(null);
    }
    if (tab !== "payments") {
      setSelectedPayment(null);
    }
  }, [tab]);

  const handleRoleChange = async (id: string, role: UserEntity["role"]) => {
    try {
      await usersApi.changeUserRole(id, { role: role === "ADMIN" ? "PLAYER" : "ADMIN" });
      setMessage("User role updated.");
      await loadUsers();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handleStatusChange = async (id: string, isActive?: boolean) => {
    try {
      await usersApi.changeUserStatus(id, { isActive: !isActive });
      setMessage("User status updated.");
      await loadUsers();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handleEventSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { id, ...payload } = eventForm;
      if (eventForm.id) {
        await eventsApi.updateEvent(eventForm.id, payload);
        setMessage("Event updated.");
      } else {
        await eventsApi.createEvent(payload);
        setMessage("Event created.");
      }
      setEventForm(emptyEventForm);
      await loadEvents();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handleEventDelete = (id: string) => {
    setConfirmAction({ type: "delete-event", id });
  };

  const handlePaymentDelete = (id: string) => {
    setConfirmAction({ type: "delete-payment", id });
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) {
      return;
    }

    try {
      if (confirmAction.type === "delete-event") {
        await eventsApi.deleteEvent(confirmAction.id);
        setMessage("Event deleted.");
        await loadEvents();
      } else if (confirmAction.type === "delete-payment") {
        await paymentsApi.deletePayment(confirmAction.id);
        setMessage("Payment deleted.");
        await loadPayments();
      }
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setConfirmAction(null);
    }
  };

  const handleOpenRegistration = async (id: string) => {
    try {
      setError(null);
      const detail = await registrationsApi.getRegistrationById(id);
      setSelectedRegistration(detail);
      setRegistrationReview({
        status: detail.status,
        notes: detail.notes || "",
      });
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handleRegistrationReviewChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setRegistrationReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistrationReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const registrationEntityId = resolveEntityId(selectedRegistration);
    if (!registrationEntityId) {
      setError("Registration id is missing.");
      return;
    }

    try {
      await registrationsApi.updateRegistrationStatus(registrationEntityId, {
        status: registrationReview.status,
        notes: registrationReview.notes || undefined,
      });
      setMessage("Registration status updated.");
      await Promise.all([loadRegistrations(), loadPayments()]);
      await handleOpenRegistration(registrationEntityId);
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handleOpenPayment = async (id: string) => {
    try {
      setError(null);
      const detail = await paymentsApi.getPaymentById(id);
      setSelectedPayment(detail);
      setPaymentReview({
        status: detail.status === "REJECTED" ? "REJECTED" : "APPROVED",
        adminNote: detail.adminNote || "",
      });
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  const handlePaymentReviewChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPaymentReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const paymentEntityId = resolveEntityId(selectedPayment);
    if (!paymentEntityId) {
      setError("Payment id is missing.");
      return;
    }

    try {
      await paymentsApi.reviewPayment(paymentEntityId, {
        status: paymentReview.status,
        adminNote: paymentReview.adminNote || undefined,
      });
      setMessage("Payment review updated.");
      await loadPayments();
      await handleOpenPayment(paymentEntityId);
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <button className="btn-back-to-home" onClick={() => navigate(APP_ROUTES.HOME)}>Back to Home</button>
        <div className="admin-title-section">
          <h1 className="admin-title">ADMIN CONTROL CENTER</h1>
          <p className="admin-welcome">Welcome, {user?.fullName || user?.playerName || "Admin"}</p>
        </div>
        <button className="btn-back-to-home" onClick={() => void logout().then(() => navigate(APP_ROUTES.LOGIN))}>Logout</button>
      </div>

      <div className="admin-nav">
        <button className={`nav-btn ${tab === "overview" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_HOME)}>Overview</button>
        <button className={`nav-btn ${tab.startsWith("user") ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_USERS)}>Users</button>
        <button className={`nav-btn ${tab.startsWith("team") ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_TEAMS)}>Teams</button>
        <button className={`nav-btn ${tab === "events" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_EVENTS)}>Events</button>
        <button className={`nav-btn ${tab === "registrations" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_REGISTRATIONS)}>Registrations</button>
        <button className={`nav-btn ${tab === "payments" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.ADMIN_PAYMENTS)}>Payments</button>
      </div>

      <div className="admin-content">
        {error ? <p className="register-subtitle">{error}</p> : null}
        {message ? <p className="register-subtitle">{message}</p> : null}

        {tab === "overview" && (
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-info"><h3>Users</h3><p className="metric-value">{users.length}</p></div></div>
            <div className="metric-card"><div className="metric-info"><h3>Teams</h3><p className="metric-value">{teams.length}</p></div></div>
            <div className="metric-card"><div className="metric-info"><h3>Events</h3><p className="metric-value">{events.length}</p></div></div>
            <div className="metric-card"><div className="metric-info"><h3>Registrations</h3><p className="metric-value">{registrations.length}</p></div></div>
            <div className="metric-card"><div className="metric-info"><h3>Payments</h3><p className="metric-value">{payments.length}</p></div></div>
          </div>
        )}

        {tab === "users" && (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Action</th></tr></thead>
            <tbody>{users.map((item) => {
              const id = resolveEntityId(item);
              return (
              <tr key={id || item.email}>
                <td>{item.fullName || item.playerName}</td><td>{item.email}</td><td>{item.role}</td><td>{String(item.isActive ?? item.status ?? false)}</td>
                <td>
                  <button className="action-btn" disabled={!id} onClick={() => id && navigate(`/admin/users/${id}`)}>View</button>
                  <button className="action-btn" disabled={!id} onClick={() => id && handleRoleChange(id, item.role)}>Toggle Role</button>
                  <button className="action-btn" disabled={!id} onClick={() => id && handleStatusChange(id, item.isActive ?? item.status)}>Toggle Active</button>
                </td>
              </tr>
            );})}</tbody>
          </table>
        )}

        {tab === "user-detail" && selectedUser && (
          <div className="section-card">
            <h3>User Detail</h3>
            <p>{selectedUser.fullName || selectedUser.playerName}</p><p>{selectedUser.email}</p><p>{selectedUser.role}</p>
          </div>
        )}

        {tab === "teams" && (
          <table className="admin-table">
            <thead><tr><th>Team</th><th>Game</th><th>Leader</th><th>Active</th><th>Action</th></tr></thead>
            <tbody>{teams.map((item) => {
              const id = resolveEntityId(item);
              return <tr key={id || item.teamName}><td>{item.teamName}</td><td>{item.primaryGame}</td><td>{item.leaderInGameId}</td><td>{String(item.isActive ?? false)}</td><td><button className="action-btn" disabled={!id} onClick={() => id && navigate(`/admin/teams/${id}`)}>View</button></td></tr>;
            })}</tbody>
          </table>
        )}

        {tab === "team-detail" && selectedTeam && (
          <div className="section-card">
            <h3>Team Detail</h3>
            <p>{selectedTeam.teamName}</p><p>{selectedTeam.primaryGame}</p><p>{selectedTeam.leaderInGameId}</p>
          </div>
        )}

        {tab === "events" && (
          <>
            <form className="registration-form" onSubmit={handleEventSave}>
              <div className="form-group"><label>Title</label><input value={eventForm.title} onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))} required /></div>
              <div className="form-group"><label>Game Name</label><input value={eventForm.gameName} onChange={(e) => setEventForm((p) => ({ ...p, gameName: e.target.value }))} required /></div>
              <div className="form-group"><label>Description</label><input value={eventForm.description} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} required /></div>
              <div className="form-group"><label>Banner Image URL</label><input value={eventForm.bannerImage} onChange={(e) => setEventForm((p) => ({ ...p, bannerImage: e.target.value }))} /></div>
              <div className="form-group"><label>Rules</label><input value={eventForm.rules} onChange={(e) => setEventForm((p) => ({ ...p, rules: e.target.value }))} /></div>
              <div className="form-row-two-col"><div className="form-group"><label>Entry Fee</label><input type="number" min={0} value={eventForm.entryFee} onChange={(e) => setEventForm((p) => ({ ...p, entryFee: Number(e.target.value) }))} /></div><div className="form-group"><label>Currency</label><input value={eventForm.currency} onChange={(e) => setEventForm((p) => ({ ...p, currency: e.target.value }))} /></div></div>
              <div className="form-group"><label>Max Teams</label><input type="number" min={1} value={eventForm.maxTeams} onChange={(e) => setEventForm((p) => ({ ...p, maxTeams: Number(e.target.value) }))} required /></div>
              <div className="form-row-two-col"><div className="form-group"><label>Registration Opens</label><input type="datetime-local" value={toInputDateTime(eventForm.registrationOpenAt)} onChange={(e) => setEventForm((p) => ({ ...p, registrationOpenAt: toIsoDateTime(e.target.value) }))} required /></div><div className="form-group"><label>Registration Closes</label><input type="datetime-local" value={toInputDateTime(eventForm.registrationCloseAt)} onChange={(e) => setEventForm((p) => ({ ...p, registrationCloseAt: toIsoDateTime(e.target.value) }))} required /></div></div>
              <div className="form-row-two-col"><div className="form-group"><label>Event Starts</label><input type="datetime-local" value={toInputDateTime(eventForm.eventStartAt)} onChange={(e) => setEventForm((p) => ({ ...p, eventStartAt: toIsoDateTime(e.target.value) }))} required /></div><div className="form-group"><label>Event Ends</label><input type="datetime-local" value={toInputDateTime(eventForm.eventEndAt)} onChange={(e) => setEventForm((p) => ({ ...p, eventEndAt: toIsoDateTime(e.target.value) }))} required /></div></div>
              <div className="form-group"><label>Status</label><select value={eventForm.status} onChange={(e) => setEventForm((p) => ({ ...p, status: e.target.value as EventEntity["status"] }))}><option>DRAFT</option><option>PUBLISHED</option><option>ACTIVE</option><option>CLOSED</option><option>CANCELLED</option></select></div>
              <div className="form-actions"><button className="btn btn-submit" type="submit">{eventForm.id ? "Update Event" : "Create Event"}</button>{eventForm.id ? <button className="btn btn-cancel" type="button" onClick={() => setEventForm(emptyEventForm)}>Cancel Edit</button> : null}</div>
            </form>
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Status</th><th>Start</th><th>Action</th></tr></thead>
              <tbody>{events.map((item) => {
                const id = resolveEntityId(item);
                return <tr key={id || item.slug}><td>{item.title}</td><td>{item.status}</td><td>{formatDateTime(item.eventStartAt)}</td><td><button className="action-btn" disabled={!id} onClick={() => id && setEventForm({ ...emptyEventForm, ...item, id })}>Edit</button><button className="action-btn" disabled={!id} onClick={() => id && handleEventDelete(id)}>Delete</button></td></tr>;
              })}</tbody>
            </table>
          </>
        )}

        {tab === "registrations" && (
          <>
            <table className="admin-table">
              <thead><tr><th>Event</th><th>Team</th><th>Status</th><th>Payment</th><th>Updated</th><th>Action</th></tr></thead>
              <tbody>{registrations.map((item) => {
                const id = resolveEntityId(item);
                const linkedPayment = id ? paymentsByRegistrationId.get(id) : undefined;
                const paymentEntityId = resolveEntityId(linkedPayment);
                return (
                  <tr key={id || item.eventId}>
                    <td>{item.event?.title || item.eventId}</td>
                    <td>{item.team?.teamName || item.teamId}</td>
                    <td>{item.status}</td>
                    <td>{linkedPayment ? `${linkedPayment.status} (${linkedPayment.transactionReference || "-"})` : "NOT_SUBMITTED"}</td>
                    <td>{formatDateTime(item.updatedAt || item.createdAt)}</td>
                    <td>
                      <button className="action-btn" disabled={!id} onClick={() => id && void handleOpenRegistration(id)}>View</button>
                      <button className="action-btn" disabled={!paymentEntityId} onClick={() => paymentEntityId && void handleOpenPayment(paymentEntityId)}>
                        Payment
                      </button>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>

            {selectedRegistration ? (
              <form className="registration-form" onSubmit={handleRegistrationReviewSubmit}>
                <div className="form-section">
                  <h3 className="form-section-title">Registration Detail</h3>
                  <div className="form-group"><label>Registration ID</label><input value={resolveEntityId(selectedRegistration) || "-"} readOnly /></div>
                  <div className="form-group"><label>Event</label><input value={selectedRegistration.event?.title || selectedRegistration.eventId} readOnly /></div>
                  <div className="form-group"><label>Team</label><input value={selectedRegistration.team?.teamName || selectedRegistration.teamId} readOnly /></div>
                  <div className="form-group"><label>Status</label><select name="status" value={registrationReview.status} onChange={handleRegistrationReviewChange}><option>PENDING_PAYMENT</option><option>PAYMENT_SUBMITTED</option><option>CONFIRMED</option><option>REJECTED</option><option>CANCELLED</option></select></div>
                  <div className="form-group"><label>Notes</label><input name="notes" value={registrationReview.notes} onChange={handleRegistrationReviewChange} placeholder="Add admin notes" /></div>
                </div>
                <div className="form-actions"><button className="btn btn-submit" type="submit">Update Registration</button></div>
              </form>
            ) : null}
          </>
        )}

        {tab === "payments" && (
          <>
            <table className="admin-table">
              <thead><tr><th>Registration</th><th>Status</th><th>Reference</th><th>Bank</th><th>Created</th><th>Action</th></tr></thead>
              <tbody>{payments.map((item) => {
                const id = resolveEntityId(item);
                return (
                  <tr key={id || item.registrationId}>
                    <td>{item.registrationId}</td>
                    <td>{item.status}</td>
                    <td>{item.transactionReference || "-"}</td>
                    <td>{item.bankName || "-"}</td>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <button className="action-btn" disabled={!id} onClick={() => id && void handleOpenPayment(id)}>View</button>
                      <button className="action-btn" disabled={!id} onClick={() => id && handlePaymentDelete(id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>

            {selectedPayment ? (
              <form className="registration-form" onSubmit={handlePaymentReviewSubmit}>
                <div className="form-section">
                  <h3 className="form-section-title">Payment Review</h3>
                  <div className="form-group"><label>Payment ID</label><input value={resolveEntityId(selectedPayment) || "-"} readOnly /></div>
                  <div className="form-group"><label>Registration ID</label><input value={selectedPayment.registrationId} readOnly /></div>
                  <div className="form-group"><label>Current Status</label><input value={selectedPayment.status} readOnly /></div>
                  <div className="form-group"><label>Review Status</label><select name="status" value={paymentReview.status} onChange={handlePaymentReviewChange}><option>APPROVED</option><option>REJECTED</option></select></div>
                  <div className="form-group"><label>Admin Note</label><input name="adminNote" value={paymentReview.adminNote} onChange={handlePaymentReviewChange} placeholder="Add review notes" /></div>
                  <div className="form-group"><label>Slip URL</label><input value={selectedPayment.slipUrl || selectedPayment.slipFilePath || "-"} readOnly /></div>
                </div>
                <div className="form-actions"><button className="btn btn-submit" type="submit">Submit Review</button></div>
              </form>
            ) : null}
          </>
        )}
      </div>

      {confirmAction ? (
        <div className="payment-modal-overlay">
          <div className="payment-modal" style={{ maxWidth: "560px" }}>
            <button className="modal-close-btn" type="button" onClick={() => setConfirmAction(null)}>
              ×
            </button>
            <div className="modal-header">
              <div className="modal-title-info">
                <h3 className="modal-player-name">Confirm Action</h3>
                <p className="admin-subtitle">
                  {confirmAction.type === "delete-event"
                    ? "Delete this event permanently?"
                    : "Delete this payment record permanently?"}
                </p>
              </div>
            </div>
            <div className="modal-body" style={{ gridTemplateColumns: "1fr" }}>
              <div className="modal-action-buttons">
                <button className="modal-action-btn reject" type="button" onClick={() => setConfirmAction(null)}>
                  Cancel
                </button>
                <button className="modal-action-btn verify" type="button" onClick={() => void executeConfirmAction()}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;
