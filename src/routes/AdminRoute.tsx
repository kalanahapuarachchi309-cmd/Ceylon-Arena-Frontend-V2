import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../shared/types";

const AdminRoute = () => <ProtectedRoute requiredRole={UserRole.ADMIN} />;

export default AdminRoute;

