import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import { APP_ROUTES } from "../shared/constants/routes";
import AdminRoute from "./AdminRoute";
import GuestRoute from "./GuestRoute";
import PlayerRoute from "./PlayerRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import UserDashboardPage from "../features/dashboard/pages/UserDashboardPage";
import PublicEventDetailPage from "../features/events/pages/PublicEventDetailPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/home/pages/NotFoundPage";
import EventRegistrationConfirmPage from "../features/registrations/pages/EventRegistrationConfirmPage";
import EventRegistrationPaymentPage from "../features/registrations/pages/EventRegistrationPaymentPage";
import PaymentPage from "../features/payment-flow/pages/PaymentPage";
import CosplayRegistrationPage from "../features/register-flow/pages/CosplayRegistrationPage";
import RegisterPage from "../features/register-flow/pages/RegisterPage";

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path={APP_ROUTES.HOME} element={<HomePage />} />
      <Route path={APP_ROUTES.EVENTS} element={<HomePage />} />
      <Route path={APP_ROUTES.EVENT_DETAILS} element={<PublicEventDetailPage />} />
      <Route path={APP_ROUTES.COSPLAY} element={<CosplayRegistrationPage />} />
      <Route path={APP_ROUTES.PAYMENT} element={<PaymentPage />} />
    </Route>

    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path={APP_ROUTES.SIGN_IN} element={<LoginPage />} />
        <Route path={APP_ROUTES.LOGIN} element={<Navigate to={APP_ROUTES.SIGN_IN} replace />} />
        <Route path={APP_ROUTES.LOGIN_LEGACY} element={<Navigate to={APP_ROUTES.SIGN_IN} replace />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>
    </Route>

    <Route element={<PlayerRoute />}>
      <Route path={APP_ROUTES.EVENT_REGISTER_CONFIRM} element={<EventRegistrationConfirmPage />} />
      <Route path={APP_ROUTES.EVENT_REGISTER_PAYMENT} element={<EventRegistrationPaymentPage />} />

      <Route element={<DashboardLayout />}>
        <Route path={APP_ROUTES.PLAYER_DASHBOARD} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.PLAYER_DASHBOARD_TEAM} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.PLAYER_DASHBOARD_EVENTS} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD} replace />} />
        <Route path={APP_ROUTES.PROFILE} element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD} replace />} />
        <Route path={APP_ROUTES.MY_TEAM} element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD_TEAM} replace />} />
        <Route
          path={APP_ROUTES.MY_REGISTRATIONS}
          element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD_EVENTS} replace />}
        />
        <Route
          path={APP_ROUTES.MY_REGISTRATION_DETAILS}
          element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD_EVENTS} replace />}
        />
        <Route path={APP_ROUTES.MY_PAYMENTS} element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD_EVENTS} replace />} />
        <Route
          path={APP_ROUTES.MY_PAYMENT_DETAILS}
          element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD_EVENTS} replace />}
        />
        <Route path={APP_ROUTES.SETTINGS} element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD} replace />} />
        <Route
          path={APP_ROUTES.CHANGE_PASSWORD}
          element={<Navigate to={APP_ROUTES.PLAYER_DASHBOARD} replace />}
        />
      </Route>
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_HOME} element={<Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path={APP_ROUTES.ADMIN_EVENTS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_REGISTRATIONS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_PAYMENTS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_USERS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_USER_DETAILS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_TEAMS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_TEAM_DETAILS} element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<Navigate to={APP_ROUTES.ADMIN_USERS} replace />} />
        <Route path="/admin/users/:id" element={<AdminDashboardPage />} />
        <Route path="/admin/teams" element={<Navigate to={APP_ROUTES.ADMIN_TEAMS} replace />} />
        <Route path="/admin/teams/:id" element={<AdminDashboardPage />} />
        <Route path="/admin/events" element={<Navigate to={APP_ROUTES.ADMIN_EVENTS} replace />} />
        <Route path="/admin/registrations" element={<Navigate to={APP_ROUTES.ADMIN_REGISTRATIONS} replace />} />
        <Route path="/admin/payments" element={<Navigate to={APP_ROUTES.ADMIN_PAYMENTS} replace />} />
      </Route>
    </Route>

    <Route path={APP_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
