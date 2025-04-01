
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasAccess } from "@/lib/auth";

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

  // Mostrar estado de carregamento se ainda estiver verificando autenticação
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Não autenticado - redirecionar para login
  if (!isAuthenticated || !user) {
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  // Verificar acesso baseado em função
  if (!hasAccess(user, requiredRole)) {
    // Redirecionar para dashboard apropriado baseado na função
    if (user.role === "mentor") {
      return <Navigate to="/leader" replace />;
    } else {
      return <Navigate to="/client" replace />;
    }
  }

  // Renderizar filhos se todas as verificações passarem
  return <>{children}</>;
};

export default ProtectedRoute;
