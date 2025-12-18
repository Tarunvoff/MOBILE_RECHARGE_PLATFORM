import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="notfound">
    <div className="notfound-card">
      <div className="status-chip status-chip--default" style={{ justifySelf: 'center' }}>
        404
      </div>
      <h1>Page not found</h1>
      <p>
        Looks like you ventured beyond RechargeX&apos;s grid. Return to the dashboard or explore curated plans crafted for
        you.
      </p>
      <div className="notfound-card__actions">
        <Link to="/dashboard" className="cta-button primary">
          Go to dashboard
        </Link>
        <Link to="/recharge" className="plan-card-dark__cta">
          Browse plans →
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
