import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.type !== "ADMIN") return <Navigate to="/" />;

  return <>{children}</>;
};

export default AdminRoute;
