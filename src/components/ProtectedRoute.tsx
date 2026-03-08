import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/cookies';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = '/sign' 
}: ProtectedRouteProps) => {
  const userRole = getUserRole();

  // If no role found in cookie, redirect to login
  if (!userRole) {
    alert('Please login to access this page');
    return <Navigate to={redirectTo} replace />;
  }

  // If specific role required, check if user has it
  if (requiredRole && userRole !== requiredRole) {
    alert('You do not have permission to access this page');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
