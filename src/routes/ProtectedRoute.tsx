import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";
import { APP_ROUTES } from "../shared/constants/routes";
import { useToast } from "../shared/providers/CustomToastProvider";
import { UserRole } from "../shared/types";

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (isLoading || (isAuthenticated && user)) {
      return;
    }

    toast.info({
      title: "Sign In Required",
      message: "Please sign in to continue.",
      dedupeKey: `auth-required:${location.pathname}`,
    });
  }, [isAuthenticated, isLoading, location.pathname, toast, user]);

  useEffect(() => {
    if (isLoading || !requiredRole || !user || user.role === requiredRole) {
      return;
    }

    toast.warning({
      title: "Access Denied",
      message: "You do not have permission to view this page.",
      dedupeKey: `auth-role-denied:${location.pathname}`,
    });
  }, [isLoading, location.pathname, requiredRole, toast, user]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={APP_ROUTES.SIGN_IN}
        replace
        state={{
          redirectTo: location.pathname,
          reason: "auth-required",
        }}
      />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to={APP_ROUTES.UNAUTHORIZED}
        replace
        state={{
          reason: "role-mismatch",
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
