import PageContainer from "../layouts/PageContainer.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { formatDateTime } from "../utils/formatters.js";

export default function Profile() {
  const { user } = useAuth();

  return (
    <PageContainer title="Profile" subtitle="Current authenticated user details.">
      <section className="result-panel">
        <dl className="profile-list">
          <dt>Username</dt>
          <dd>{user?.username}</dd>
          <dt>Email</dt>
          <dd>{user?.email}</dd>
          <dt>Role</dt>
          <dd>{user?.role}</dd>
          <dt>Last login</dt>
          <dd>{formatDateTime(user?.last_login)}</dd>
        </dl>
      </section>
    </PageContainer>
  );
}
