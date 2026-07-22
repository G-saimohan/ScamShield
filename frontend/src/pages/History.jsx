import PageContainer from "../layouts/PageContainer.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function History() {
  return (
    <PageContainer title="History" subtitle="Historical scan logs for this analyst session.">
      <EmptyState
        icon="bi-clock-history"
        title="History Log Ready"
        description="Historical persistence features are reserved for future threat lifecycle management phases."
      />
    </PageContainer>
  );
}
