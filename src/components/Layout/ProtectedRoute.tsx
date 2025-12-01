import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, admin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && admin?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

