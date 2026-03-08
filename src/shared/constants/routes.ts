export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  LOGIN: "/login",
  LOGIN_LEGACY: "/sign",
  REGISTER: "/register",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  CHANGE_PASSWORD: "/change-password",
  EVENTS: "/events",
  EVENT_DETAILS: "/events/:slug",
  EVENT_REGISTER_CONFIRM: "/events/:slug/register/confirm",
  EVENT_REGISTER_PAYMENT: "/events/:slug/register/payment",
  DASHBOARD: "/dashboard",
  PLAYER_DASHBOARD: "/dashboard/player",
  PLAYER_DASHBOARD_TEAM: "/dashboard/player/team",
  PLAYER_DASHBOARD_EVENTS: "/dashboard/player/events",
  MY_TEAM: "/my-team",
  MY_REGISTRATIONS: "/my-registrations",
  MY_REGISTRATION_DETAILS: "/my-registrations/:id",
  MY_PAYMENTS: "/my-payments",
  MY_PAYMENT_DETAILS: "/my-payments/:id",
  ADMIN_DASHBOARD: "/dashboard/admin",
  ADMIN_HOME: "/admin",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_USER_DETAILS: "/dashboard/admin/users/:id",
  ADMIN_TEAMS: "/dashboard/admin/teams",
  ADMIN_TEAM_DETAILS: "/dashboard/admin/teams/:id",
  ADMIN_EVENTS: "/dashboard/admin/events",
  ADMIN_REGISTRATIONS: "/dashboard/admin/registrations",
  ADMIN_PAYMENTS: "/dashboard/admin/payments",
  COSPLAY: "/cosplay",
  PAYMENT: "/payment",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const toEventRoute = (slug: string) => `/events/${slug}`;
export const toEventRegistrationConfirmRoute = (slug: string) =>
  `/events/${slug}/register/confirm`;
export const toEventRegistrationPaymentRoute = (slug: string) =>
  `/events/${slug}/register/payment`;
export const toRegistrationDetailsRoute = (registrationId: string) =>
  `/my-registrations/${registrationId}`;
export const toPaymentDetailsRoute = (paymentId: string) => `/my-payments/${paymentId}`;
export const toAdminUserDetailsRoute = (userId: string) => `/dashboard/admin/users/${userId}`;
export const toAdminTeamDetailsRoute = (teamId: string) => `/dashboard/admin/teams/${teamId}`;
