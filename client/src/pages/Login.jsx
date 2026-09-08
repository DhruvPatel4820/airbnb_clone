import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    loading: authLoading,
    user,
    getCurrentUser,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // REDIRECT IF ALREADY LOGGED IN
  // ==========================================

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ----------------------------------------
      // LOGIN API
      // ----------------------------------------

      await api.post("/auth/login", formData);

      // ----------------------------------------
      // GET CURRENT USER
      // This returns the logged-in user
      // including role
      // ----------------------------------------

      const loggedInUser = await getCurrentUser();

      // ----------------------------------------
      // CHECK USER ROLE
      // ----------------------------------------

      if (loggedInUser?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // AUTH CHECK LOADING
  // ==========================================

  if (authLoading) {
    return (
      <main className="auth-page">
        <div className="auth-loading">
          <div className="spinner"></div>

          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ALREADY AUTHENTICATED
  // ==========================================

  if (isAuthenticated) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* HEADER */}

          <div className="auth-header">
            <h1>Welcome back</h1>

            <p>Login to continue to Wanderlust</p>
          </div>

          {/* ERROR */}

          {error && <div className="alert alert-error">{error}</div>}

          {/* FORM */}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* EMAIL */}

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
