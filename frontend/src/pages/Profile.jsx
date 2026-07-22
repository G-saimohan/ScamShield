import PageContainer from "../layouts/PageContainer.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { formatDateTime } from "../utils/formatters.js";

export default function Profile() {
  const { user } = useAuth();

  return (
    <PageContainer title="Profile" subtitle="Current authenticated threat analyst credentials and session context.">
      <div className="row justify-content-center animate-fade-in">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card border border-secondary border-opacity-25 bg-dark bg-opacity-70 text-white rounded-4 shadow-sm overflow-hidden">
            <div className="card-header border-bottom border-secondary border-opacity-25 bg-dark bg-opacity-40 p-3 d-flex align-items-center">
              <i className="bi bi-person-badge text-info me-2 fs-5" />
              <h3 className="h6 fw-bold mb-0 text-light text-uppercase tracking-wider">Analyst Profile Details</h3>
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-info bg-opacity-15 text-info rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase border border-info border-opacity-30 fs-3" style={{ width: "64px", height: "64px" }}>
                  {(user?.username || user?.email || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="h5 fw-bold text-light mb-1">{user?.username || "Threat Analyst"}</h4>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis text-uppercase tracking-wider fs-9 px-2">{user?.role || "user"}</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="row border-bottom border-secondary border-opacity-10 pb-3">
                  <div className="col-4 text-muted small text-uppercase tracking-wider">Email Address</div>
                  <div className="col-8 text-light fw-semibold">{user?.email || "Not Available"}</div>
                </div>
                <div className="row border-bottom border-secondary border-opacity-10 pb-3">
                  <div className="col-4 text-muted small text-uppercase tracking-wider">User ID</div>
                  <div className="col-8 text-info fw-mono small">{user?.user_id || "Not Available"}</div>
                </div>
                <div className="row border-bottom border-secondary border-opacity-10 pb-3">
                  <div className="col-4 text-muted small text-uppercase tracking-wider">Role Authority</div>
                  <div className="col-8 text-light text-capitalize">{user?.role || "Standard User"}</div>
                </div>
                <div className="row">
                  <div className="col-4 text-muted small text-uppercase tracking-wider">Last Login Session</div>
                  <div className="col-8 text-light">{formatDateTime(user?.last_login)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
