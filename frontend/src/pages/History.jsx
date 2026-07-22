import PageContainer from "../layouts/PageContainer.jsx";

export default function History() {
  return (
    <PageContainer title="History" subtitle="Scan history will be expanded in a future milestone.">
      <div className="placeholder-panel">
        <i className="bi bi-clock-history" />
        <h2>History foundation ready</h2>
        <p>The route is protected and ready for repository-backed history views later.</p>
      </div>
    </PageContainer>
  );
}
