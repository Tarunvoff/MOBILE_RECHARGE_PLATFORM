import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchRechargeSummary } from '../services/api';
import { formatCurrency, formatDateTime, maskIdentifier, getServiceDisplay } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const quickActions = [
  {
    icon: '📱',
    title: 'Mobile Recharge',
    description: 'Browse curated plans and recharge instantly.',
    cta: 'Recharge now',
    to: '/recharge',
  },
  {
    icon: '🕒',
    title: 'View History',
    description: 'Analyse every recharge with detailed breakdowns.',
    cta: 'Review history',
    to: '/history',
  },
  {
    icon: '📊',
    title: 'Recharge Status',
    description: 'Track the live status of recent transactions.',
    cta: 'Track status',
    to: '/history',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRechargeSummary();
      setSummary(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const stats = useMemo(() => {
    if (!summary) {
      return [
        {
          label: 'Recharges Done',
          value: '—',
          meta: 'Start your first recharge to unlock analytics.',
        },
        {
          label: 'Total Amount Spent',
          value: formatCurrency(0),
          meta: 'Track every rupee across operators.',
        },
        {
          label: 'Last Recharge',
          value: 'No activity yet',
          meta: 'Complete a recharge to view details.',
        },
      ];
    }

    const { totalRecharges, totalAmount, successRate, status, lastRecharge } = summary;
    return [
      {
        label: 'Recharges Done',
        value: totalRecharges.toString(),
        meta: `${status.success} success • ${status.pending} pending • ${status.failed} failed`,
      },
      {
        label: 'Total Amount Spent',
        value: formatCurrency(totalAmount || 0),
        meta: `Success rate ${successRate}%`,
      },
      {
        label: 'Last Recharge',
        value: lastRecharge
          ? `${lastRecharge.operator?.name} • ${formatCurrency(lastRecharge.amount)}`
          : 'No activity yet',
        meta: lastRecharge ? formatDateTime(lastRecharge.createdAt) : 'Complete a recharge to view details.',
      },
    ];
  }, [summary]);

  const recentRecharges = summary?.recentRecharges ?? [];
  const serviceBreakdown = summary?.services ?? [];

  return (
    <div className="dashboard" style={{ display: 'grid', gap: '3rem' }}>
      <section className="dashboard-hero">
        <div>
          <h1 className="dashboard-hero__title">Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}!</h1>
          <p className="dashboard-hero__subtitle">
            Monitor your recharge performance, explore intelligent plan recommendations, and stay in control of every
            transaction.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="cta-button outline" onClick={loadSummary} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh insights'}
          </button>
          <button type="button" className="cta-button primary" onClick={() => navigate('/recharge')}>
            Start a recharge
          </button>
        </div>
      </section>

      {error ? (
        <div className="alert alert--danger" role="alert">
          {error}
        </div>
      ) : null}

      <section className="section" aria-label="Recharge performance metrics" style={{ gap: '2.5rem' }}>
        <header className="section__header">
          <div>
            <h2 className="section__title">Performance at a glance</h2>
            <p style={{ color: 'var(--rx-muted)', marginTop: '0.4rem' }}>
              Real-time metrics from your recent recharges.
            </p>
          </div>
        </header>
        <div className="stats-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="stat-card skeleton" aria-hidden />
              ))
            : stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <span className="stat-card__label">{stat.label}</span>
                  <span className="stat-card__value">{stat.value}</span>
                  <span className="stat-card__meta">{stat.meta}</span>
                </div>
              ))}
        </div>
      </section>

      {summary ? (
        <section className="section" style={{ display: 'grid', gap: '1.75rem' }}>
          <header className="section__header">
            <div>
              <h2 className="section__title">Status overview</h2>
              <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
                Instant visibility into how your transactions are performing across operators.
              </p>
            </div>
          </header>
          <div className="status-distribution" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="status-chip status-chip--success">Success · {summary.status.success}</div>
            <div className="status-chip status-chip--warning">Pending · {summary.status.pending}</div>
            <div className="status-chip status-chip--danger">Failed · {summary.status.failed}</div>
            <div className="status-chip status-chip--default">Success rate · {summary.successRate}%</div>
          </div>
        </section>
      ) : null}

      {serviceBreakdown.length ? (
        <section className="section" aria-label="Service distribution">
          <header className="section__header">
            <div>
              <h2 className="section__title">Services performance</h2>
              <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
                Compare uptake and outcomes across recharge services.
              </p>
            </div>
          </header>
          <div className="stats-grid">
            {serviceBreakdown.map((service) => {
              const meta = getServiceDisplay(service.id);
              const successRate = service.totalTransactions
                ? Math.round((service.status.success / service.totalTransactions) * 100)
                : 0;
              return (
                <div key={service.id} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem' }} aria-hidden>
                      {meta.icon}
                    </span>
                    <span className="status-chip status-chip--default" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {service.totalTransactions} txns
                    </span>
                  </div>
                  <span className="stat-card__label">{meta.name}</span>
                  <span className="stat-card__value">{formatCurrency(service.totalAmount || 0)}</span>
                  <span className="stat-card__meta">
                    {service.status.success} success • {service.status.failed} failed • {service.status.pending} pending · Success
                    rate {successRate}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="section" aria-label="Quick recharge actions">
        <header className="section__header">
          <div>
            <h2 className="section__title">Quick Actions</h2>
            <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
              Jump straight into the flows you use most often.
            </p>
          </div>
        </header>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              className="quick-card"
              onClick={() => navigate(action.to)}
            >
              <div className="quick-card__icon" aria-hidden>
                {action.icon}
              </div>
              <div style={{ fontWeight: 600 }}>{action.title}</div>
              <p style={{ color: 'var(--rx-muted)', lineHeight: 1.6 }}>{action.description}</p>
              <span className="plan-card-dark__cta" style={{ width: 'fit-content' }}>
                {action.cta}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section" aria-label="Recent transactions">
        <header className="section__header">
          <div>
            <h2 className="section__title">Recent Transactions</h2>
            <p style={{ color: 'var(--rx-muted)', marginTop: '0.35rem' }}>
              Track the latest transactions and jump into detailed status in a click.
            </p>
          </div>
          <button type="button" className="plan-card-dark__cta" onClick={() => navigate('/history')}>
            View full history →
          </button>
        </header>

        {loading ? (
          <div className="empty-state" aria-hidden>
            <div className="empty-state__title">Loading transactions…</div>
            <p>Your latest recharges will appear here in seconds.</p>
          </div>
        ) : !recentRecharges.length ? (
          <div className="empty-state">
            <div className="empty-state__title">No transactions yet</div>
            <p>
              Kickstart your RechargeX journey with your first recharge — your transaction timeline will appear here
              instantly.
            </p>
            <button type="button" className="empty-state__cta" onClick={() => navigate('/recharge')}>
              Make your first recharge
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern" aria-label="Recent recharges">
              <thead>
                <tr>
                  <th scope="col">Transaction</th>
                  <th scope="col">Service</th>
                  <th scope="col">Identifier</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Operator</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRecharges.map((item) => (
                  <tr key={item.transactionId}>
                    <td>{item.transactionId}</td>
                    <td>{getServiceDisplay(item.serviceType).name}</td>
                    <td>{maskIdentifier(item.identifier, item.serviceType)}</td>
                    <td>{maskIdentifier(item.mobileNumber, 'MOBILE')}</td>
                    <td>{item.operator?.name}</td>
                    <td>{item.plan?.name}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="plan-card-dark__cta"
                        onClick={() => navigate(`/status/${item.transactionId}`)}
                      >
                        View status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
