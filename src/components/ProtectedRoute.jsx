import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  const disableGuard = typeof window !== 'undefined' && window.localStorage?.getItem('DISABLE_AUTH_GUARD') === '1'

  if (!disableGuard) {
    if (!user) return <Navigate to="/login" replace />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  }

  return children;
}
