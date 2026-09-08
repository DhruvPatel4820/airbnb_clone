import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  const location = useLocation();

  // ==========================================
  // AUTH CHECK LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div className="spinner"></div>

        <p>Checking admin access...</p>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
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
  // LOGGED IN BUT NOT ADMIN
  // ==========================================

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // ADMIN
  // ==========================================

  return <Outlet />;
}

export default AdminRoute;
