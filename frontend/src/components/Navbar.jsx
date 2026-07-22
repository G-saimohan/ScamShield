import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { formatDateTime } from "../utils/formatters.js";

export default function Navbar({ onToggleSidebar }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    const name = user?.username || user?.email || "A";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="topbar d-flex align-items-center justify-content-between px-4 py-3 bg-dark bg-opacity-70 border-bottom border-secondary border-opacity-25 backdrop-blur shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link text-white p-0 d-md-none border-0"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <i className="bi bi-list fs-3" />
        </button>
        <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
          <span className="brand-mark bg-info text-dark fw-extrabold d-flex align-items-center justify-content-center rounded-3 fs-5" style={{ width: "36px", height: "36px" }}>S</span>
          <span className="text-light fw-bold h5 mb-0 d-none d-sm-inline-block tracking-tight">ScamShield</span>
        </Link>
      </div>

      <div className="flex-grow-1 mx-4 d-none d-md-block" style={{ maxWidth: "420px" }}>
        <div className="input-group input-group-sm border border-secondary border-opacity-25 rounded-3 bg-dark bg-opacity-50 overflow-hidden">
          <span className="input-group-text bg-transparent border-0 text-muted">
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            className="form-control bg-transparent border-0 text-white placeholder-secondary"
            placeholder="Search threats, domains, URLs..."
            aria-label="Search"
            disabled
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative cursor-pointer text-muted hover-text-light px-2">
          <i className="bi bi-bell fs-5" />
          <span className="position-absolute top-0 start-50 translate-middle-y badge rounded-circle bg-danger p-1" style={{ width: "6px", height: "6px" }} />
        </div>

        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-link p-0 border-0 d-flex align-items-center gap-2 text-decoration-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="bg-info bg-opacity-15 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase border border-info border-opacity-30" style={{ width: "36px", height: "36px", fontSize: "0.95rem" }}>
              {getInitials()}
            </div>
          </button>

          {dropdownOpen ? (
            <div className="position-absolute end-0 mt-2 bg-dark border border-secondary border-opacity-25 rounded-3 shadow-lg p-3 z-3" style={{ width: "260px" }}>
              <div className="pb-3 border-bottom border-secondary border-opacity-15">
                <h6 className="mb-0 text-light fw-bold">{user?.username || "Analyst"}</h6>
                <span className="text-muted small d-block text-truncate">{user?.email}</span>
                <span className="badge bg-secondary-subtle text-secondary-emphasis mt-1.5 fs-8 text-uppercase tracking-wider px-2">{user?.role || "User"}</span>
              </div>
              <div className="py-2 d-flex flex-column gap-1 border-bottom border-secondary border-opacity-15">
                <Link to="/profile" className="d-flex align-items-center gap-2 text-muted text-decoration-none py-1 hover-text-light small" onClick={() => setDropdownOpen(false)}>
                  <i className="bi bi-person" /> Profile Account
                </Link>
                <Link to="/settings" className="d-flex align-items-center gap-2 text-muted text-decoration-none py-1 hover-text-light small" onClick={() => setDropdownOpen(false)}>
                  <i className="bi bi-gear" /> Preferences & Settings
                </Link>
              </div>
              <div className="pt-2">
                <div className="text-muted fs-8 mb-2">
                  Last login: <br />
                  <strong className="text-light">{formatDateTime(user?.last_login)}</strong>
                </div>
                <button
                  className="btn btn-danger btn-sm w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  type="button"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right" />
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
