import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}

        <Link to="/" className="navbar-logo">
          Wanderlust
        </Link>

        {/* NAVIGATION */}

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          {loading ? (
            <span className="navbar-loading">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span className="navbar-welcome">
                Welcome, {user?.fullName || user?.username}
              </span>

              <Link to="/my-bookings" className="navbar-link">
                My Bookings
              </Link>

              <Link to="/my-listings" className="navbar-link">
                My Listings
              </Link>

              <Link to="/listings/create" className="navbar-link">
                Create Listing
              </Link>

              {user?.role === "admin" && (
                <Link to="/admin" className="navbar-link navbar-admin">
                  Admin
                </Link>
              )}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>

              <Link to="/register" className="navbar-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;