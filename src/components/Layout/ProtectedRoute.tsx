import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole | AdminRole[];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, admin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole) {
    // Handle both single role and array of roles
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!admin?.role || !allowedRoles.includes(admin.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

