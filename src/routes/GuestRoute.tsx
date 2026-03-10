import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { APP_ROUTES } from "../shared/constants/routes";
import { UserRole } from "../shared/types";

const GuestRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  // Keep post-registration players on the event selection journey.
  if (location.pathname === APP_ROUTES.REGISTER && user.role === UserRole.PLAYER) {
    return <Navigate to={APP_ROUTES.EVENTS} replace />;
  }

  if (user.role === UserRole.ADMIN) {
    return <Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <Navigate to={APP_ROUTES.HOME} replace />;
};

export default GuestRoute;
