import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isLoading, initialized } = useAuth();
  const location = useLocation();

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center text-white/50 text-sm">
        Loading admin session...
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== "admin") {
    return <Navigate to="/admin-auth" replace state={{ from: location.pathname || "/admin" }} />;
  }

  return children;
}
