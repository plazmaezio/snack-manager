import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
};

export default ProtectedRoute;
