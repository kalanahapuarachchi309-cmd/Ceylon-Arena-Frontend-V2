import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { usePublicEvents } from "../../events/hooks/useEvents";
import { useMyPayments } from "../../payments/hooks/usePayments";
import { paymentsApi } from "../../payments/api/paymentsApi";
import type { PaymentEntity } from "../../payments/types/payment.types";
import { useMyRegistrations } from "../../registrations/hooks/useRegistrations";
import { registrationsApi } from "../../registrations/api/registrationsApi";
import type { RegistrationEntity } from "../../registrations/types/registration.types";
import { useMyTeam } from "../../teams/hooks/useTeams";
import { APP_ROUTES } from "../../../shared/constants/routes";
import { formatDateTime } from "../../../shared/lib/date";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { getErrorMessage } from "../../../shared/utils/errorHandler";

import "../../../components/Register.css";
import "../../../components/UserDashboard.css";

interface TeamFormState {
  teamName: string;
  primaryGame: string;
  leaderInGameId: string;
  member1Name: string;
  member1InGameId: string;
  member2Name: string;
  member2InGameId: string;
  member3Name: string;
  member3InGameId: string;
  isActive: boolean;
}

const defaultTeamForm: TeamFormState = {
  teamName: "",
  primaryGame: "",
  leaderInGameId: "",
  member1Name: "",
  member1InGameId: "",
  member2Name: "",
  member2InGameId: "",
  member3Name: "",
  member3InGameId: "",
  isActive: true,
};

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationDetailMatch = useMatch(APP_ROUTES.MY_REGISTRATION_DETAILS);
  const paymentDetailMatch = useMatch(APP_ROUTES.MY_PAYMENT_DETAILS);

  const { user, logout, logoutAll, changePassword } = useAuth();
  const { events } = usePublicEvents({ page: 1, limit: 6 });
  const { team, updateTeam, refetch: refetchTeam } = useMyTeam();
  const { registrations, createRegistration, refetch: refetchRegistrations } = useMyRegistrations({ page: 1, limit: 20 });
  const { payments, submitPayment, refetch: refetchPayments } = useMyPayments({ page: 1, limit: 20 });

  const [teamForm, setTeamForm] = useState<TeamFormState>(defaultTeamForm);
  const [registrationDetail, setRegistrationDetail] = useState<RegistrationEntity | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentEntity | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    transactionReference: "",
    bankName: "",
    accountHolder: "",
    slip: null as File | null,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const registrationId = registrationDetailMatch?.params.id ?? null;
  const paymentId = paymentDetailMatch?.params.id ?? null;

  const view = useMemo(() => {
    if (registrationId) return "registration-detail";
    if (paymentId) return "payment-detail";
    if (location.pathname === APP_ROUTES.MY_TEAM) return "team";
    if (location.pathname === APP_ROUTES.MY_REGISTRATIONS) return "registrations";
    if (location.pathname === APP_ROUTES.MY_PAYMENTS) return "payments";
    if (location.pathname === APP_ROUTES.CHANGE_PASSWORD) return "security";
    return "dashboard";
  }, [location.pathname, paymentId, registrationId]);

  useEffect(() => {
    setTeamForm({
      teamName: team?.teamName ?? "",
      primaryGame: team?.primaryGame ?? "",
      leaderInGameId: team?.leaderInGameId ?? "",
      member1Name: team?.members?.[0]?.name ?? "",
      member1InGameId: team?.members?.[0]?.inGameId ?? team?.members?.[0]?.gameId ?? "",
      member2Name: team?.members?.[1]?.name ?? "",
      member2InGameId: team?.members?.[1]?.inGameId ?? team?.members?.[1]?.gameId ?? "",
      member3Name: team?.members?.[2]?.name ?? "",
      member3InGameId: team?.members?.[2]?.inGameId ?? team?.members?.[2]?.gameId ?? "",
      isActive: team?.isActive ?? true,
    });
  }, [team]);

  useEffect(() => {
    const load = async () => {
      if (!registrationId) {
        setRegistrationDetail(null);
        return;
      }
      try {
        setRegistrationDetail(await registrationsApi.getRegistrationById(registrationId));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };
    void load();
  }, [registrationId]);

  useEffect(() => {
    const load = async () => {
      if (!paymentId) {
        setPaymentDetail(null);
        return;
      }
      try {
        setPaymentDetail(await paymentsApi.getPaymentById(paymentId));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };
    void load();
  }, [paymentId]);

  const showError = (value: unknown) => setError(getErrorMessage(value));

  const handleTeamChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setTeamForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTeamSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await updateTeam({
        teamName: teamForm.teamName,
        primaryGame: teamForm.primaryGame,
        leaderInGameId: teamForm.leaderInGameId,
        members: [
          { name: teamForm.member1Name, inGameId: teamForm.member1InGameId },
          { name: teamForm.member2Name, inGameId: teamForm.member2InGameId },
          { name: teamForm.member3Name, inGameId: teamForm.member3InGameId },
        ],
        isActive: teamForm.isActive,
      });
      setMessage("Team updated successfully.");
      await refetchTeam();
    } catch (submitError) {
      showError(submitError);
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    setMessage(null);
    setError(null);
    try {
      await createRegistration({ eventId });
      setMessage("Registration created.");
      await refetchRegistrations();
    } catch (submitError) {
      showError(submitError);
    }
  };

  const handlePaymentFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name === "slip") {
      setPaymentForm((prev) => ({ ...prev, slip: files?.[0] ?? null }));
      return;
    }
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registrationId || !paymentForm.slip) {
      setError("Registration id and slip are required.");
      return;
    }
    setMessage(null);
    setError(null);
    try {
      const created = await submitPayment(registrationId, {
        slip: paymentForm.slip,
        transactionReference: paymentForm.transactionReference || undefined,
        bankName: paymentForm.bankName || undefined,
        accountHolder: paymentForm.accountHolder || undefined,
      });
      const id = resolveEntityId(created);
      setMessage("Payment submitted.");
      await refetchPayments();
      if (id) navigate(`/my-payments/${id}`);
    } catch (submitError) {
      showError(submitError);
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }
    setMessage(null);
    setError(null);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (submitError) {
      showError(submitError);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>CEYLON ARENA PLAYER HUB</h1>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="logout-btn" onClick={() => void logoutAll().then(() => navigate(APP_ROUTES.LOGIN))}>
                Logout All
              </button>
              <button className="logout-btn" onClick={() => void logout().then(() => navigate(APP_ROUTES.HOME))}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="sidebar">
            <div className="profile-card">
              <h2 className="player-name">{user?.fullName || user?.playerName || "Player"}</h2>
              <div className="profile-info">
                <div className="info-row"><span className="info-label">Email</span><span className="info-value">{user?.email || "N/A"}</span></div>
                <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{user?.phone || "N/A"}</span></div>
                <div className="info-row"><span className="info-label">Role</span><span className="info-value">{user?.role || "PLAYER"}</span></div>
              </div>
            </div>
          </div>

          <div className="content-area">
            <div className="tabs-navigation">
              <button className={`tab-btn ${view === "dashboard" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.DASHBOARD)}>Dashboard</button>
              <button className={`tab-btn ${view === "team" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.MY_TEAM)}>My Team</button>
              <button className={`tab-btn ${view.startsWith("registration") ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.MY_REGISTRATIONS)}>Registrations</button>
              <button className={`tab-btn ${view.startsWith("payment") ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.MY_PAYMENTS)}>Payments</button>
              <button className={`tab-btn ${view === "security" ? "active" : ""}`} onClick={() => navigate(APP_ROUTES.CHANGE_PASSWORD)}>Security</button>
            </div>

            {error ? <p className="register-subtitle">{error}</p> : null}
            {message ? <p className="register-subtitle">{message}</p> : null}

            {view === "dashboard" && (
              <div className="comparison-card">
                <h4 className="comparison-title">Available Events</h4>
                <table className="comparison-table">
                  <thead><tr><th>Event</th><th>Status</th><th>Fee</th><th>Action</th></tr></thead>
                  <tbody>
                    {events.map((eventItem) => {
                      const id = resolveEntityId(eventItem);
                      return (
                        <tr key={id || eventItem.slug}>
                          <td>{eventItem.title}</td>
                          <td>{eventItem.status}</td>
                          <td>{eventItem.currency} {eventItem.entryFee}</td>
                          <td>
                            <button className="action-btn view-stats" onClick={() => navigate(`/events/${eventItem.slug}`)}>View</button>
                            <button className="action-btn play-btn" onClick={() => id && handleRegisterEvent(id)} disabled={!id}>Register</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {view === "team" && (
              <form className="registration-form" onSubmit={handleTeamSubmit}>
                <div className="form-group"><label>Team Name</label><input name="teamName" value={teamForm.teamName} onChange={handleTeamChange} required /></div>
                <div className="form-group"><label>Primary Game</label><input name="primaryGame" value={teamForm.primaryGame} onChange={handleTeamChange} required /></div>
                <div className="form-group"><label>Leader In-Game ID</label><input name="leaderInGameId" value={teamForm.leaderInGameId} onChange={handleTeamChange} required /></div>
                <div className="form-row-two-col"><div className="form-group"><label>Member 1</label><input name="member1Name" value={teamForm.member1Name} onChange={handleTeamChange} required /></div><div className="form-group"><label>Member 1 In-Game ID</label><input name="member1InGameId" value={teamForm.member1InGameId} onChange={handleTeamChange} required /></div></div>
                <div className="form-row-two-col"><div className="form-group"><label>Member 2</label><input name="member2Name" value={teamForm.member2Name} onChange={handleTeamChange} required /></div><div className="form-group"><label>Member 2 In-Game ID</label><input name="member2InGameId" value={teamForm.member2InGameId} onChange={handleTeamChange} required /></div></div>
                <div className="form-row-two-col"><div className="form-group"><label>Member 3</label><input name="member3Name" value={teamForm.member3Name} onChange={handleTeamChange} required /></div><div className="form-group"><label>Member 3 In-Game ID</label><input name="member3InGameId" value={teamForm.member3InGameId} onChange={handleTeamChange} required /></div></div>
                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}><label>Active</label><input type="checkbox" name="isActive" checked={teamForm.isActive} onChange={handleTeamChange} /></div>
                <div className="form-actions"><button className="btn btn-submit" type="submit">Update Team</button></div>
              </form>
            )}

            {view === "registrations" && (
              <table className="comparison-table">
                <thead><tr><th>Event</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead>
                <tbody>
                  {registrations.map((item) => {
                    const id = resolveEntityId(item);
                    return (
                      <tr key={id || item.eventId}>
                        <td>{item.event?.title || item.eventId}</td>
                        <td>{item.status}</td>
                        <td>{formatDateTime(item.updatedAt || item.createdAt)}</td>
                        <td><button className="action-btn view-stats" onClick={() => id && navigate(`/my-registrations/${id}`)}>View</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {view === "registration-detail" && registrationDetail && (
              <>
                <div className="info-grid">
                  <div className="info-card"><div className="info-details"><span className="detail-label">Event</span><span className="detail-value">{registrationDetail.event?.title || registrationDetail.eventId}</span></div></div>
                  <div className="info-card"><div className="info-details"><span className="detail-label">Status</span><span className="detail-value">{registrationDetail.status}</span></div></div>
                </div>
                <form className="registration-form" onSubmit={handleSubmitPayment}>
                  <div className="form-group"><label>Transaction Reference</label><input name="transactionReference" value={paymentForm.transactionReference} onChange={handlePaymentFieldChange} /></div>
                  <div className="form-group"><label>Bank Name</label><input name="bankName" value={paymentForm.bankName} onChange={handlePaymentFieldChange} /></div>
                  <div className="form-group"><label>Account Holder</label><input name="accountHolder" value={paymentForm.accountHolder} onChange={handlePaymentFieldChange} /></div>
                  <div className="form-group"><label>Slip</label><input name="slip" type="file" accept="image/*" onChange={handlePaymentFieldChange} required /></div>
                  <div className="form-actions"><button className="btn btn-submit" type="submit">Submit Payment</button></div>
                </form>
              </>
            )}

            {view === "payments" && (
              <table className="comparison-table">
                <thead><tr><th>Status</th><th>Reference</th><th>Created</th><th>Action</th></tr></thead>
                <tbody>
                  {payments.map((item) => {
                    const id = resolveEntityId(item);
                    return (
                      <tr key={id || item.registrationId}>
                        <td>{item.status}</td>
                        <td>{item.transactionReference || "-"}</td>
                        <td>{formatDateTime(item.createdAt)}</td>
                        <td><button className="action-btn view-stats" onClick={() => id && navigate(`/my-payments/${id}`)}>View</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {view === "payment-detail" && paymentDetail && (
              <div className="info-grid">
                <div className="info-card"><div className="info-details"><span className="detail-label">Status</span><span className="detail-value">{paymentDetail.status}</span></div></div>
                <div className="info-card"><div className="info-details"><span className="detail-label">Reference</span><span className="detail-value">{paymentDetail.transactionReference || "-"}</span></div></div>
                <div className="info-card"><div className="info-details"><span className="detail-label">Admin Note</span><span className="detail-value">{paymentDetail.adminNote || "-"}</span></div></div>
              </div>
            )}

            {view === "security" && (
              <form className="registration-form" onSubmit={handlePasswordChange}>
                <div className="form-group"><label>Current Password</label><input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))} required /></div>
                <div className="form-group"><label>New Password</label><input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))} required /></div>
                <div className="form-group"><label>Confirm Password</label><input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))} required /></div>
                <div className="form-actions"><button className="btn btn-submit" type="submit">Change Password</button></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
