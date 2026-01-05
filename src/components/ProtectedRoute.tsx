// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Optional: only require admin for specific routes
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only check admin if requireAdmin is true
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />; // Or show a message
  }

  return <>{children}</>;
};

export default ProtectedRoute;