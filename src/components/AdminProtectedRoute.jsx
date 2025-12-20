import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminAuthService from "../services/AdminAuthService";

export default function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      if (AdminAuthService.isTokenExpired()) {
        AdminAuthService.logout();
        window.location.href = '/admin/login';
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
