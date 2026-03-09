import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";
import { useMyPayments } from "../../payments/hooks/usePayments";
import { useMyRegistrations } from "../../registrations/hooks/useRegistrations";
import { useMyTeam } from "../../teams/hooks/useTeams";
import {
  APP_ROUTES,
  toEventRoute,
  toEventRegistrationPaymentRoute,
} from "../../../shared/constants/routes";
import { resolveEntityId } from "../../../shared/api/apiTypes";
import { formatDateTime } from "../../../shared/lib/date";
import { useToast } from "../../../shared/providers/CustomToastProvider";
import {
  ButtonLoadingState,
  CustomFormSection,
  CustomModal,
  LoadingOverlay,
} from "../../../shared/components/custom-ui";

import "../../../components/Register.css";
import "../../../components/UserDashboard.css";
import "./UserDashboardPage.css";

type PlayerDashboardTab = "team" | "events";

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
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const defaultTeamFormState: TeamFormState = {
  teamName: "",
  primaryGame: "",
  leaderInGameId: "",
  member1Name: "",
  member1InGameId: "",
  member2Name: "",
  member2InGameId: "",
  member3Name: "",
  member3InGameId: "",
};

const defaultPasswordFormState: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const resolveTabFromPath = (pathname: string): PlayerDashboardTab =>
  pathname === APP_ROUTES.PLAYER_DASHBOARD_EVENTS ? "events" : "team";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user, isAuthenticated, isBootstrapping, logout, changePassword } = useAuth();

  const canLoadData = !isBootstrapping && isAuthenticated;
  const activeTab = resolveTabFromPath(location.pathname);

  const {
    team,
    updateTeam,
    refetch: refetchTeam,
    isLoading: isTeamLoading,
    error: teamError,
  } = useMyTeam({ enabled: canLoadData });
  const {
    registrations,
    isLoading: isRegistrationsLoading,
    error: registrationsError,
  } = useMyRegistrations({ page: 1, limit: 100 }, { enabled: canLoadData });
  const {
    payments,
    isLoading: isPaymentsLoading,
    error: paymentsError,
  } = useMyPayments({ page: 1, limit: 100 }, { enabled: canLoadData });

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSavingTeam, setIsSavingTeam] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [teamForm, setTeamForm] = useState<TeamFormState>(defaultTeamFormState);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(defaultPasswordFormState);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setTeamForm({
      teamName: team?.teamName ?? "",
      primaryGame: team?.primaryGame ?? "",
      leaderInGameId: team?.leaderInGameId ?? "",
      member1Name: team?.members?.[0]?.name ?? "",
      member1InGameId: team?.members?.[0]?.inGameId ?? "",
      member2Name: team?.members?.[1]?.name ?? "",
      member2InGameId: team?.members?.[1]?.inGameId ?? "",
      member3Name: team?.members?.[2]?.name ?? "",
      member3InGameId: team?.members?.[2]?.inGameId ?? "",
    });
  }, [team]);

  const paymentByRegistrationId = useMemo(() => {
    const map = new Map<string, (typeof payments)[number]>();
    payments.forEach((paymentItem) => {
      // Handle both string registrationId and nested object with _id
      const registrationIdValue = (paymentItem as any).registrationId;
      const targetRegistrationId =
        typeof registrationIdValue === 'string'
          ? registrationIdValue
          : registrationIdValue?._id || resolveEntityId(paymentItem.registration);
      if (targetRegistrationId && !map.has(targetRegistrationId)) {
        map.set(targetRegistrationId, paymentItem);
      }
    });
    return map;
  }, [payments]);

  const combinedError = actionError ?? teamError ?? registrationsError ?? paymentsError ?? null;
  const isLoading = isTeamLoading || isRegistrationsLoading || isPaymentsLoading;

  const handleTeamFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTeamForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleTeamSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    setIsSavingTeam(true);
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
      });
      await refetchTeam();
      toast.success("Team information updated.");
      setIsTeamModalOpen(false);
    } catch {
      setActionError("Unable to update team information.");
    } finally {
      setIsSavingTeam(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setActionError("Password confirmation does not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setActionError("New password must contain at least 8 characters.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully.");
      setPasswordForm(defaultPasswordFormState);
      setIsPasswordModalOpen(false);
    } catch {
      setActionError("Unable to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const registrationCards = registrations.map((registration) => {
    const registrationEntityId = resolveEntityId(registration);
    const linkedPayment = registrationEntityId
      ? paymentByRegistrationId.get(registrationEntityId)
      : undefined;

    // Support both 'event' and 'eventId' field names for populated event data
    const eventData = (registration as any).event || (registration as any).eventId;

    return {
      key: registrationEntityId || registration.eventId || registration.createdAt || Math.random().toString(),
      registrationId: registrationEntityId ?? undefined,
      eventTitle: eventData?.title || "Event",
      eventSlug: eventData?.slug || "",
      registrationStatus: registration.status,
      registrationNotes: registration.notes || "-",
      registrationUpdatedAt: formatDateTime(registration.updatedAt || registration.createdAt),
      paymentStatus: linkedPayment?.status || "NOT_SUBMITTED",
      paymentReference: linkedPayment?.transactionReference || "-",
      paymentBank: linkedPayment?.bankName || "-",
      paymentAccountHolder: linkedPayment?.accountHolder || "-",
      paymentAdminNote: linkedPayment?.adminNote || "-",
    };
  });

  const handleContinuePayment = (registrationId: string | undefined, eventSlug: string) => {
    if (!registrationId || !eventSlug) {
      toast.error("Unable to continue payment. Registration information is missing.");
      return;
    }

    const paymentRoute = `${toEventRegistrationPaymentRoute(eventSlug)}?registrationId=${registrationId}`;
    navigate(paymentRoute, {
      state: {
        registrationId,
        playerName: user?.fullName || user?.playerName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        teamName: team?.teamName || "",
        game: team?.primaryGame || "",
        leaderAddress: user?.address || "",
        gameId: team?.leaderInGameId || "",
      },
    });
  };

  return (
    <div className="user-dashboard">
      <LoadingOverlay
        isVisible={isLoading && !team}
        message="Loading dashboard..."
      />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>CEYLON ARENA PLAYER HUB</h1>
            <div className="dashboard-header-actions">
              <button className="logout-btn" onClick={() => navigate(APP_ROUTES.HOME)}>
                Home
              </button>
              <button
                className="logout-btn"
                onClick={() => void logout().then(() => navigate(APP_ROUTES.HOME))}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          <aside className="sidebar">
            <div className="profile-card">
              <h2 className="player-name">{user?.fullName || user?.playerName || "Player"}</h2>
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Team</span>
                  <span className="info-value">{team?.teamName || "Not Available"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Leader Email</span>
                  <span className="info-value">{user?.email || "-"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user?.phone || "-"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Primary Game</span>
                  <span className="info-value">{team?.primaryGame || "-"}</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="content-area">
            <div className="tabs-navigation">
              <button
                className={`tab-btn ${activeTab === "team" ? "active" : ""}`}
                onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD_TEAM)}
              >
                Team Info
              </button>
              <button
                className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
                onClick={() => navigate(APP_ROUTES.PLAYER_DASHBOARD_EVENTS)}
              >
                Registered Events
              </button>
            </div>

            {combinedError ? <p className="register-subtitle">{combinedError}</p> : null}

            {activeTab === "team" ? (
              <section className="overview-section">
                <h3>Team Information</h3>
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Team Name</span>
                      <span className="detail-value">{team?.teamName || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Primary Game</span>
                      <span className="detail-value">{team?.primaryGame || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Leader Name</span>
                      <span className="detail-value">{user?.fullName || user?.playerName || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Leader Email</span>
                      <span className="detail-value">{user?.email || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{user?.phone || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{user?.address || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Leader In-Game ID</span>
                      <span className="detail-value">{team?.leaderInGameId || "-"}</span>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-details">
                      <span className="detail-label">Members</span>
                      <span className="detail-value">{team?.members?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-member-list">
                  {(team?.members ?? []).map((member, index) => (
                    <div className="dashboard-member-item" key={`${member.name}-${index}`}>
                      <span>{member.name}</span>
                      <strong>{member.inGameId}</strong>
                    </div>
                  ))}
                </div>

                <div className="dashboard-inline-actions">
                  <button
                    type="button"
                    className="action-btn view-stats"
                    onClick={() => setIsTeamModalOpen(true)}
                  >
                    Edit Team
                  </button>
                  <button
                    type="button"
                    className="action-btn play-btn"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Change Password
                  </button>
                </div>
              </section>
            ) : (
              <section className="overview-section">
                <h3>Registered Events</h3>
                {registrationCards.length === 0 ? (
                  <div className="comparison-card">
                    <h4 className="comparison-title">No Registered Events</h4>
                    <p className="dashboard-card-subtle">
                      Register from the landing page events section to see your submissions here.
                    </p>
                    <button
                      type="button"
                      className="btn btn-submit"
                      onClick={() => navigate(APP_ROUTES.EVENTS)}
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="registered-events-grid">
                    {registrationCards.map((card) => (
                      <article className="registered-event-card" key={card.key}>
                        <div className="registered-event-header">
                          <h4>{card.eventTitle}</h4>
                          <span className="registered-event-status">{card.registrationStatus}</span>
                        </div>
                        <div className="registered-event-body">
                          <div className="registered-event-line">
                            <span>Registration Updated</span>
                            <strong>{card.registrationUpdatedAt}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Payment Status</span>
                            <strong>{card.paymentStatus}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Transaction Reference</span>
                            <strong>{card.paymentReference}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Bank</span>
                            <strong>{card.paymentBank}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Account Holder</span>
                            <strong>{card.paymentAccountHolder}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Registration Notes</span>
                            <strong>{card.registrationNotes}</strong>
                          </div>
                          <div className="registered-event-line">
                            <span>Admin Note</span>
                            <strong>{card.paymentAdminNote}</strong>
                          </div>
                        </div>
                        <div className="registered-event-actions">
                          {(card.paymentStatus === "PENDING" || card.paymentStatus === "NOT_SUBMITTED") && card.eventSlug ? (
                            <button
                              type="button"
                              className="action-btn play-btn"
                              onClick={() => handleContinuePayment(card.registrationId, card.eventSlug)}
                            >
                              Continue Payment
                            </button>
                          ) : null}
                          {card.eventSlug ? (
                            <button
                              type="button"
                              className="action-btn view-stats"
                              onClick={() => navigate(toEventRoute(card.eventSlug))}
                            >
                              View Event
                            </button>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>

      <CustomModal
        isOpen={isTeamModalOpen}
        title="Edit Team Information"
        subtitle="Update team details. Leader email remains read-only."
        onClose={() => setIsTeamModalOpen(false)}
      >
        <form className="registration-form dashboard-modal-form" onSubmit={handleTeamSubmit}>
          <CustomFormSection title="Team Details">
            <div className="form-group">
              <label>Team Name</label>
              <input
                name="teamName"
                value={teamForm.teamName}
                onChange={handleTeamFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Primary Game</label>
              <input
                name="primaryGame"
                value={teamForm.primaryGame}
                onChange={handleTeamFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Leader Email (Read Only)</label>
              <input value={user?.email || ""} readOnly />
            </div>
            <div className="form-group">
              <label>Leader In-Game ID</label>
              <input
                name="leaderInGameId"
                value={teamForm.leaderInGameId}
                onChange={handleTeamFormChange}
                required
              />
            </div>
          </CustomFormSection>

          <CustomFormSection title="Team Members">
            <div className="form-row-two-col">
              <div className="form-group">
                <label>Member 1 Name</label>
                <input
                  name="member1Name"
                  value={teamForm.member1Name}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Member 1 In-Game ID</label>
                <input
                  name="member1InGameId"
                  value={teamForm.member1InGameId}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-two-col">
              <div className="form-group">
                <label>Member 2 Name</label>
                <input
                  name="member2Name"
                  value={teamForm.member2Name}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Member 2 In-Game ID</label>
                <input
                  name="member2InGameId"
                  value={teamForm.member2InGameId}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-two-col">
              <div className="form-group">
                <label>Member 3 Name</label>
                <input
                  name="member3Name"
                  value={teamForm.member3Name}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Member 3 In-Game ID</label>
                <input
                  name="member3InGameId"
                  value={teamForm.member3InGameId}
                  onChange={handleTeamFormChange}
                  required
                />
              </div>
            </div>
          </CustomFormSection>

          <div className="form-actions">
            <ButtonLoadingState
              type="submit"
              className="btn btn-submit"
              isLoading={isSavingTeam}
              loadingLabel="Saving Team..."
            >
              Save Team
            </ButtonLoadingState>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setIsTeamModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </CustomModal>

      <CustomModal
        isOpen={isPasswordModalOpen}
        title="Change Password"
        subtitle="Use your current password and choose a secure new password."
        onClose={() => setIsPasswordModalOpen(false)}
        maxWidth={640}
      >
        <form className="registration-form dashboard-modal-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((previous) => ({
                  ...previous,
                  currentPassword: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((previous) => ({
                  ...previous,
                  newPassword: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((previous) => ({
                  ...previous,
                  confirmPassword: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="form-actions">
            <ButtonLoadingState
              type="submit"
              className="btn btn-submit"
              isLoading={isSavingPassword}
              loadingLabel="Updating Password..."
            >
              Update Password
            </ButtonLoadingState>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default UserDashboardPage;
