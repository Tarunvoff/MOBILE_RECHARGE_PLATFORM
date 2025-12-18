const preferences = [
  {
    title: 'Plan Alerts',
    description: 'Get notified when your favourite plans drop price or data boosts are available.',
    status: 'Enabled',
  },
  {
    title: 'Payment Safety Lock',
    description: 'Two-step verification for new payment methods and high-value recharges.',
    status: 'Enabled',
  },
  {
    title: 'Smart Recommendations',
    description: 'AI-assisted curation of best-fit plans based on usage trends.',
    status: 'Enabled',
  },
];

const Profile = () => (
  <div className="profile-page" style={{ display: 'grid', gap: '2rem' }}>
    <section className="dashboard-hero">
      <div>
        <h1 className="dashboard-hero__title">Profile overview</h1>
        <p className="dashboard-hero__subtitle">
          Manage your premium RechargeX identity, security preferences, and personalization controls.
        </p>
      </div>
    </section>

    <section className="section" style={{ display: 'grid', gap: '1.8rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="dashboard-shell__avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>
          TV
        </div>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 600 }}>Tarun V</div>
          <div style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>tarun.v@rechargex.io</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.45)', marginTop: '0.35rem' }}>Member since May 2024</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--rx-muted)' }}>KYC STATUS</div>
        <div style={{ display: 'inline-flex', gap: '0.6rem', alignItems: 'center' }}>
          <span className="status-chip status-chip--success">Verified</span>
          <span style={{ color: 'var(--rx-muted)' }}>Last updated on 12 Oct 2025</span>
        </div>
      </div>
    </section>

    <section className="section" style={{ display: 'grid', gap: '1.4rem' }}>
      <header>
        <h2 className="section__title">Security preferences</h2>
        <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
          Stay protected with adaptive security controls and detailed device history.
        </p>
      </header>
      <div style={{ display: 'grid', gap: '1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Primary login device</div>
            <p style={{ color: 'var(--rx-muted)', marginTop: '0.2rem' }}>MacBook Pro • Chrome 129 • Last active 2 minutes ago</p>
          </div>
          <button type="button" className="plan-card-dark__cta">
            Manage devices
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Multi-factor authentication</div>
            <p style={{ color: 'var(--rx-muted)', marginTop: '0.2rem' }}>Activated with OTP + FaceID</p>
          </div>
          <button type="button" className="cta-button primary" style={{ padding: '0.55rem 1.4rem' }}>
            Update
          </button>
        </div>
      </div>
    </section>

    <section className="section" style={{ display: 'grid', gap: '1.4rem' }}>
      <header>
        <h2 className="section__title">Personalization</h2>
        <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
          Tailor your RechargeX experience with intelligent preferences and insights.
        </p>
      </header>
      <div className="quick-actions" style={{ gap: '1rem' }}>
        {preferences.map((preference) => (
          <div key={preference.title} className="quick-card" style={{ gap: '0.65rem' }}>
            <div style={{ fontWeight: 600 }}>{preference.title}</div>
            <p style={{ color: 'var(--rx-muted)', lineHeight: 1.6 }}>{preference.description}</p>
            <span className="status-chip status-chip--default">{preference.status}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Profile;
