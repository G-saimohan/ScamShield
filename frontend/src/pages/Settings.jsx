import PageContainer from "../layouts/PageContainer.jsx";
import { useTheme } from "../hooks/useTheme.js";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageContainer title="Settings" subtitle="Basic settings foundation for later milestones.">
      <section className="result-panel">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2>Theme mode</h2>
            <p className="text-secondary mb-0">Placeholder context is wired for future UI polish.</p>
          </div>
          <button className="btn btn-outline-light" type="button" onClick={toggleTheme}>
            <i className="bi bi-circle-half me-2" />
            {theme}
          </button>
        </div>
      </section>
    </PageContainer>
  );
}
