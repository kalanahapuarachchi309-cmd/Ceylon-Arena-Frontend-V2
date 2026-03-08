import ProtectedRoute from "./ProtectedRoute";
import { UserRole } from "../shared/types";

const PlayerRoute = () => <ProtectedRoute requiredRole={UserRole.PLAYER} />;

export default PlayerRoute;
