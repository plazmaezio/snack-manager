import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { UserType } from "../types";

interface RoleRouteProps {
  children: ReactNode;
  /** Roles allowed to access this route. @default ["ADMIN"] */
  allowedRoles?: UserType[];
}

const RoleRoute = ({ children, allowedRoles = ["ADMIN"] }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.type)) return <Navigate to="/" />;

  return <>{children}</>;
};

export default RoleRoute;
