import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div>
        <span className="text-secondary small">Signed in as</span>
        <strong className="d-block">{user?.username || user?.email || "Analyst"}</strong>
      </div>
      <button className="btn btn-outline-light btn-sm" type="button" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2" />
        Logout
      </button>
    </header>
  );
}
