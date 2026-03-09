import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { APP_ROUTES } from "../shared/constants/routes";

const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  return <Navigate to={APP_ROUTES.HOME} replace />;
};

export default GuestRoute;
