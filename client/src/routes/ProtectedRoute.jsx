import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Checking authentication...</h2>
      </div>
    );
  }

  // ==========================================
  // NOT AUTHENTICATED
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // ==========================================
  // AUTHENTICATED
  // ==========================================

  return <Outlet />;
}

export default ProtectedRoute;
