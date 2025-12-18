import RechargeForm from '../components/RechargeForm';

const Home = () => (
  <div className="container">
    <section className="hero">
      <div>
        <h1 className="hero__heading">Recharge smarter with a production-ready simulator</h1>
        <p className="hero__text">
          Explore a complete end-to-end MERN stack experience simulating real-world mobile recharge flows with intelligent
          status handling, retry logic, and operator-specific plans.
        </p>
      </div>
      <div className="badge-group" aria-label="Simulator highlights">
        <span className="badge-pill">70/20/10 status simulation</span>
        <span className="badge-pill">Duplicate prevention</span>
        <span className="badge-pill">Retry-friendly</span>
      </div>
    </section>

    <div className="layout-split">
      <RechargeForm />

      <aside className="card sticky-card" aria-label="Highlights">
        <div className="card-title">Why this simulator stands out</div>
        <ul style={{ listStyle: 'none', display: 'grid', gap: '0.75rem', color: 'var(--color-muted)' }}>
          <li>• Intelligent status distribution with automatic pending resolution</li>
          <li>• Duplicate detection within 2 minutes to mimic real-world safeguards</li>
          <li>• Seamless retry flow with improved success rates</li>
          <li>• Paginated history with filters and export-ready data</li>
        </ul>
        <div className="divider" />
        <div className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          This project is built for interviews—showcase full-stack skills, discuss scaling strategies, and demonstrate
          production-level thinking without actual payment gateways.
        </div>
      </aside>
    </div>
  </div>
);

export default Home;
