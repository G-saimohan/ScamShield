import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-block mb-4">
          <span className="brand-mark">S</span>
          <div>
            <strong>ScamShield</strong>
            <small>Secure scam intelligence</small>
          </div>
        </div>
        <h1>Welcome back</h1>
        <p className="text-secondary">Sign in to scan URLs and review threat intelligence.</p>
        {error ? <div className="alert alert-danger">{error}</div> : null}
        <form className="d-grid gap-3" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="form-label">
            Password
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="btn btn-info" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          New to ScamShield? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
