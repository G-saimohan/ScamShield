import PageContainer from "../layouts/PageContainer.jsx";

const roadmap = ["Expanded media forensics", "Live feed enrichment", "User-facing policy insights"];
const stack = ["React + Vite", "Flask + Python", "MongoDB", "Bootstrap Icons", "Explainable AI heuristics"];

export default function About() {
  return (
    <PageContainer
      title="About ScamShield"
      subtitle="A premium AI security platform designed to help people verify suspicious content before it becomes a costly mistake."
    >
      <div className="about-shell">
        <section className="glass-panel about-hero">
          <div className="about-hero-copy">
            <span className="section-kicker">Project overview</span>
            <h2>Explainable protection for phishing, scams, and digital deception.</h2>
            <p>
              ScamShield unifies URL inspection, text analysis, threat intelligence, and AI-generated
              reporting into one polished experience so users can understand risk quickly and act with
              clarity.
            </p>
            <a className="btn-premium-primary" href="https://github.com/" target="_blank" rel="noreferrer">
              <i className="bi bi-github" />
              View GitHub repository
            </a>
          </div>
          <div className="about-hero-points">
            {[
              { icon: "bi-diagram-3", title: "Architecture", detail: "frontend and backend separated by clear API contracts" },
              { icon: "bi-cpu", title: "AI Pipeline", detail: "lightweight scoring with explainable reasoning" },
              { icon: "bi-shield-shaded", title: "Detection Workflow", detail: "risk scoring and recommendations from every scan" },
            ].map((point) => (
              <div key={point.title} className="about-point-card">
                <i className={`bi ${point.icon}`} />
                <div>
                  <strong>{point.title}</strong>
                  <span>{point.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-grid">
          <article className="glass-panel about-card">
            <span className="section-kicker">Architecture</span>
            <h3>Modular, service-oriented structure</h3>
            <p>
              The application follows a clear split between the public frontend experience and the Flask
              backend services responsible for threat detection and historical record management.
            </p>
          </article>
          <article className="glass-panel about-card">
            <span className="section-kicker">Technology stack</span>
            <ul>
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-panel about-card">
            <span className="section-kicker">AI pipeline</span>
            <p>
              Incoming content is scored, compared with known threat signals, and translated into readable
              insights so end users can understand both the result and the rationale behind it.
            </p>
          </article>
          <article className="glass-panel about-card">
            <span className="section-kicker">Detection workflow</span>
            <p>
              The workflow flows from input intake to classification, evidence gathering, risk scoring, and
              concrete guidance for safe follow-up actions.
            </p>
          </article>
          <article className="glass-panel about-card about-card-wide">
            <span className="section-kicker">Future roadmap</span>
            <ul>
              {roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </PageContainer>
  );
}
