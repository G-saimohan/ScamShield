import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <span>ScamShield</span>
          <span>Explainable AI for safer digital decisions.</span>
        </div>
      </footer>
    </div>
  );
}
