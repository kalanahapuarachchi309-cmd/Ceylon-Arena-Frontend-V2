import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { APP_ROUTES } from "../shared/constants/routes";
import { UserRole } from "../shared/types";

const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={user.role === UserRole.ADMIN ? APP_ROUTES.ADMIN_HOME : APP_ROUTES.DASHBOARD}
      replace
    />
  );
};

export default GuestRoute;

