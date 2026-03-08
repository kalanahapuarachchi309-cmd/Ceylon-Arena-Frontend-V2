import { Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import { APP_ROUTES } from "../shared/constants/routes";
import AdminRoute from "./AdminRoute";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import UserDashboardPage from "../features/dashboard/pages/UserDashboardPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/home/pages/NotFoundPage";
import PaymentPage from "../features/payment-flow/pages/PaymentPage";
import CosplayRegistrationPage from "../features/register-flow/pages/CosplayRegistrationPage";
import RegisterPage from "../features/register-flow/pages/RegisterPage";

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path={APP_ROUTES.HOME} element={<HomePage />} />
      <Route path={APP_ROUTES.EVENTS} element={<HomePage />} />
      <Route path={APP_ROUTES.EVENT_DETAILS} element={<HomePage />} />
      <Route path={APP_ROUTES.COSPLAY} element={<CosplayRegistrationPage />} />
      <Route path={APP_ROUTES.PAYMENT} element={<PaymentPage />} />
    </Route>

    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.LOGIN_LEGACY} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path={APP_ROUTES.DASHBOARD} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.MY_TEAM} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.MY_REGISTRATIONS} element={<UserDashboardPage />} />
        <Route path={APP_ROUTES.MY_PAYMENTS} element={<UserDashboardPage />} />
      </Route>
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path={APP_ROUTES.ADMIN_HOME} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_EVENTS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_PAYMENTS} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.ADMIN_USERS} element={<AdminDashboardPage />} />
      </Route>
    </Route>

    <Route path={APP_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;

