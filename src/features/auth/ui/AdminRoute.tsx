import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { canAccessAdminPanel } from "@/features/admin/lib/access";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ referrer: location.pathname }} replace />;
  }

  if (!canAccessAdminPanel(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
