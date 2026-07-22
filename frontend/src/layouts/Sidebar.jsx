import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { to: "/scanner", icon: "bi-shield-check", label: "Scanner" },
  { to: "/threat-intelligence", icon: "bi-bug", label: "Threat Intel" },
  { to: "/history", icon: "bi-clock-history", label: "History" },
  { to: "/profile", icon: "bi-person", label: "Profile" },
  { to: "/settings", icon: "bi-gear", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-mark">S</span>
        <div>
          <strong>ScamShield</strong>
          <small>Threat Defense</small>
        </div>
      </div>
      <nav className="nav flex-column gap-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-link">
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
