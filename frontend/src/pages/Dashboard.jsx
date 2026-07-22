import PageContainer from "../layouts/PageContainer.jsx";

export default function Dashboard() {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="A foundation view for future ScamShield operational insights."
    >
      <div className="placeholder-panel">
        <i className="bi bi-speedometer2" />
        <h2>Dashboard foundation ready</h2>
        <p>Analytics and charts are reserved for a later milestone.</p>
      </div>
    </PageContainer>
  );
}
