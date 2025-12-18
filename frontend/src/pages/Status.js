import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchRechargeStatus, retryRecharge } from '../services/api';
import { formatCurrency, formatDateTime, maskIdentifier, getServiceDisplay } from '../utils/helpers';

const STATUS_UI = {
  SUCCESS: {
    icon: '✅',
    iconStyle: { background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' },
    title: 'Recharge Successful',
    description: 'Your recharge was processed successfully.',
  },
  FAILED: {
    icon: '❌',
    iconStyle: { background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' },
    title: 'Recharge Failed',
    description: 'Something went wrong during processing. You can retry the recharge.',
  },
  PENDING: {
    icon: '⏳',
    iconStyle: { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
    title: 'Processing your recharge…',
    description: 'Hang tight! We are checking with the operator. This usually resolves within 30 seconds.',
  },
};

const Status = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackMeta = location.state?.meta;

  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const loadStatus = useCallback(
    async (showLoader = false) => {
      if (!transactionId) return;

      if (showLoader) {
        setLoading(true);
      }

      try {
        setError(null);
        const response = await fetchRechargeStatus(transactionId);
        const recharge = response.data.data;
        setStatusData(recharge);

        if (recharge.status === 'PENDING') {
          if (!pollRef.current) {
            pollRef.current = setInterval(() => {
              loadStatus(false);
            }, 5000);
          }
        } else {
          stopPolling();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [transactionId, stopPolling]
  );

  useEffect(() => {
    loadStatus(true);
    return () => stopPolling();
  }, [loadStatus, stopPolling]);

  const ui = useMemo(() => {
    const currentStatus = statusData?.status || fallbackMeta?.status || 'PENDING';
    return STATUS_UI[currentStatus] || STATUS_UI.PENDING;
  }, [fallbackMeta, statusData]);

  const displayData = statusData || fallbackMeta;
  const serviceMeta = useMemo(() => getServiceDisplay(displayData?.serviceType), [displayData?.serviceType]);

  const handleRetry = async () => {
    if (!transactionId) return;

    setRetrying(true);
    setError(null);
    try {
      const response = await retryRecharge(transactionId);
      const { newTransactionId } = response.data.data;

      navigate(`/status/${newTransactionId}`, {
        replace: false,
        state: {
          meta: {
            serviceType: displayData?.serviceType,
            identifier: displayData?.identifier,
            mobileNumber: displayData?.mobileNumber,
            operator: displayData?.operator,
            plan: displayData?.plan,
            paymentMethod: displayData?.paymentMethod,
            status: 'PENDING',
            amount: displayData?.amount,
          },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying(false);
    }
  };

  if (loading && !statusData && !fallbackMeta) {
    return (
      <div className="container">
        <div className="status-layout">
          <div className="status-card skeleton" style={{ height: '320px' }} aria-hidden />
          <div className="details-card skeleton" style={{ height: '320px' }} aria-hidden />
        </div>
      </div>
    );
  }

  if (error && !displayData) {
    return (
      <div className="container">
        <div className="status-layout">
          <div className="status-card">
            <div className="status-icon" style={ui.iconStyle} aria-hidden>
              ⚠️
            </div>
            <h2 className="status-title">Unable to fetch status</h2>
            <p className="status-description">{error}</p>
            <div className="status-actions">
              <button type="button" className="primary-button" onClick={() => loadStatus(true)}>
                Retry
              </button>
              <button type="button" className="ghost-button" onClick={() => navigate('/')}>Go Home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recharge status</h1>
          <p className="page-subtitle">Track the latest update for your transaction in real time.</p>
        </div>
      </div>

      <div className="status-layout">
        <div className="status-card" role="status" aria-live="polite">
          <div className="status-icon" style={ui.iconStyle} aria-hidden>
            {ui.icon}
          </div>
          <h2 className="status-title">{ui.title}</h2>
          <p className="status-description">{ui.description}</p>

          <div style={{ marginBottom: '0.75rem' }}>
            <StatusBadge status={displayData?.status} />
          </div>

          {displayData?.status === 'FAILED' && displayData?.failureReason ? (
            <div className="alert alert--danger" role="alert">
              {displayData.failureReason}
            </div>
          ) : null}

          {displayData?.status === 'PENDING' ? (
            <p className="helper-text" style={{ marginTop: '0.75rem' }}>
              We will auto-refresh every 5 seconds. Feel free to check back or navigate away—your recharge will continue
              processing.
            </p>
          ) : null}

          <div className="status-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="ghost-button" onClick={() => navigate('/')}>
              New Recharge
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/history')}>
              View History
            </button>
            {displayData?.status === 'FAILED' ? (
              <button type="button" className="primary-button" onClick={handleRetry} disabled={retrying}>
                {retrying ? 'Retrying…' : 'Retry Recharge'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="details-card">
          <div className="card-title" style={{ marginBottom: '1rem' }}>
            Transaction details
          </div>
          <div className="details-list">
            <div className="details-item">
              <div className="details-item__label">Transaction ID</div>
              <div className="details-item__value">{displayData?.transactionId || transactionId}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Service</div>
              <div className="details-item__value">
                <span aria-hidden style={{ marginRight: '0.4rem' }}>{serviceMeta.icon}</span>
                {serviceMeta.name}
              </div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Identifier</div>
              <div className="details-item__value">{maskIdentifier(displayData?.identifier, displayData?.serviceType)}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Linked mobile</div>
              <div className="details-item__value">{maskIdentifier(displayData?.mobileNumber, 'MOBILE')}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Operator</div>
              <div className="details-item__value">{displayData?.operator?.name}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Plan</div>
              <div className="details-item__value">{displayData?.plan?.name}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Amount</div>
              <div className="details-item__value">{formatCurrency(displayData?.amount || displayData?.plan?.amount || 0)}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Payment method</div>
              <div className="details-item__value">{displayData?.paymentMethod}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Created at</div>
              <div className="details-item__value">{formatDateTime(displayData?.createdAt)}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Resolved at</div>
              <div className="details-item__value">{formatDateTime(displayData?.resolvedAt)}</div>
            </div>
          </div>

          {error ? (
            <div className="alert alert--danger" style={{ marginTop: '1.5rem' }} role="alert">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Status;
