import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchRechargeHistory } from '../services/api';
import { formatCurrency, formatDateTime, maskIdentifier, getServiceDisplay } from '../utils/helpers';
import { SERVICE_CATALOG } from '../constants/services';

const DEFAULT_FILTERS = {
  status: 'ALL',
  serviceType: 'ALL',
  mobileNumber: '',
  identifier: '',
  transactionId: '',
  startDate: '',
  endDate: '',
  page: 1,
};

const History = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [historyData, setHistoryData] = useState({ recharges: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: filters.page,
          limit: 10,
        };

        if (filters.status && filters.status !== 'ALL') {
          params.status = filters.status;
        }
        if (filters.serviceType && filters.serviceType !== 'ALL') {
          params.serviceType = filters.serviceType;
        }
        if (filters.identifier) {
          params.identifier = filters.identifier.trim();
        }
        if (filters.mobileNumber) {
          params.mobileNumber = filters.mobileNumber;
        }
        if (filters.transactionId) {
          params.transactionId = filters.transactionId.trim();
        }
        if (filters.startDate) {
          params.startDate = filters.startDate;
        }
        if (filters.endDate) {
          params.endDate = filters.endDate;
        }

        const response = await fetchRechargeHistory(params);
        setHistoryData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleExportCsv = () => {
    const rows = historyData.recharges || [];
    if (!rows.length) return;

    const header = [
      'Transaction ID',
      'Service Type',
      'Identifier',
      'Mobile Number',
      'Operator',
      'Plan',
      'Amount',
      'Status',
      'Payment Method',
      'Created At',
      'Resolved At',
    ];

    const csvRows = rows.map((row) => [
      row.transactionId,
      row.serviceType,
      row.identifier,
      row.mobileNumber,
      row.operator?.name,
      row.plan?.name,
      row.amount,
      row.status,
      row.paymentMethod,
      formatDateTime(row.createdAt),
      formatDateTime(row.resolvedAt),
    ]);

    const csvContent = [header, ...csvRows]
      .map((line) => line.map((value) => `"${value ?? ''}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `recharge-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { recharges, pagination } = historyData;

  return (
    <div className="history-page" style={{ display: 'grid', gap: '2rem' }}>
      <section className="dashboard-hero">
        <div>
          <h1 className="dashboard-hero__title">Recharge history</h1>
          <p className="dashboard-hero__subtitle">
            Review transactions, export detailed reports, and keep your recharge journey audit-ready.
          </p>
        </div>
        <button
          type="button"
          className="cta-button outline"
          onClick={handleExportCsv}
          disabled={!recharges?.length}
        >
          Export CSV
        </button>
      </section>

      <section className="section">
        <div className="history-filters">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(event) => handleFilterChange('status', event.target.value)}
            >
              <option value="ALL">All</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="service-type">Service</label>
            <select
              id="service-type"
              value={filters.serviceType}
              onChange={(event) => handleFilterChange('serviceType', event.target.value)}
            >
              <option value="ALL">All services</option>
              {SERVICE_CATALOG.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="identifier-filter">Identifier</label>
            <input
              id="identifier-filter"
              type="text"
              placeholder="Search identifier"
              value={filters.identifier}
              onChange={(event) => handleFilterChange('identifier', event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile-filter">Mobile number</label>
            <input
              id="mobile-filter"
              type="tel"
              placeholder="Search number"
              value={filters.mobileNumber}
              onChange={(event) => handleFilterChange('mobileNumber', event.target.value)}
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label htmlFor="transaction-filter">Transaction ID</label>
            <input
              id="transaction-filter"
              type="text"
              placeholder="Search transaction"
              value={filters.transactionId}
              onChange={(event) => handleFilterChange('transactionId', event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="start-date">Start date</label>
            <input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(event) => handleFilterChange('startDate', event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End date</label>
            <input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(event) => handleFilterChange('endDate', event.target.value)}
            />
          </div>
          <div>
            <button type="button" className="cta-button outline" onClick={handleReset}>
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <div className="alert alert--danger" role="alert">
          {error}
        </div>
      ) : null}

      <section className="section" style={{ gap: '1.5rem' }}>
        {loading ? (
          <div className="empty-state">Loading history…</div>
        ) : !recharges?.length ? (
          <div className="empty-state">
            <div className="empty-state__title">No transactions found</div>
            <p>
              Try adjusting your filters or initiate a new recharge to see it appear here.
            </p>
            <Link to="/recharge" className="plan-card-dark__cta" style={{ marginTop: '1.5rem' }}>
              Make Your First Recharge →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern" aria-label="Recharge history">
              <thead>
                <tr>
                  <th scope="col">Transaction ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Service</th>
                  <th scope="col">Identifier</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Operator</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recharges.map((item) => (
                  <tr key={item.transactionId}>
                    <td>{item.transactionId}</td>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>{getServiceDisplay(item.serviceType).name}</td>
                    <td>{maskIdentifier(item.identifier, item.serviceType)}</td>
                    <td>{maskIdentifier(item.mobileNumber)}</td>
                    <td>{item.operator?.name}</td>
                    <td>{item.plan?.name}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/status/${item.transactionId}`} className="plan-card-dark__cta">
                          View
                        </Link>
                        {item.status === 'FAILED' ? (
                          <Link to={`/status/${item.transactionId}`} className="cta-button primary" style={{ padding: '0.55rem 1.2rem' }}>
                            Retry
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {recharges?.length ? (
        <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalRecords} records
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="cta-button outline"
              onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
              disabled={!pagination.hasPrev}
            >
              Previous
            </button>
            <button
              type="button"
              className="cta-button outline"
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default History;
