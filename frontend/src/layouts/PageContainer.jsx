export default function PageContainer({ title, subtitle, children }) {
  return (
    <section className="page-container">
      <div className="page-heading" role="banner">
        <div className="page-heading-copy">
          <span className="section-kicker">ScamShield</span>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
