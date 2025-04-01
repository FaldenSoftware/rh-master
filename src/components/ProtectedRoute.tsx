
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "mentor" | "client" | "any";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if still checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole !== "any" && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "mentor") {
      return <Navigate to="/leader" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;
