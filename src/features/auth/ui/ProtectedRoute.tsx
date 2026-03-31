import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { Loadbar } from "@/shared/ui";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) {
    return <Loadbar />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ referrer: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
