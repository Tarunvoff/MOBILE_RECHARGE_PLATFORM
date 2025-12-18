import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchOperators,
  fetchOperatorPlans,
  initiateRecharge as initiateRechargeApi,
  fetchServices,
} from '../services/api';
import OperatorCard from './OperatorCard';
import PlanCard from './PlanCard';
import { formatCurrency } from '../utils/helpers';
import { SERVICE_CATALOG, getServiceDefinition } from '../constants/services';

const paymentMethods = ['UPI', 'Card', 'Wallet'];

const DEFAULT_SERVICE = SERVICE_CATALOG[0];

const RechargeForm = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState(SERVICE_CATALOG);
  const [serviceType, setServiceType] = useState(DEFAULT_SERVICE.id);
  const [identifier, setIdentifier] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [loadingOperators, setLoadingOperators] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoadingOperators(true);
      try {
        const [servicesResponse, operatorsResponse] = await Promise.all([
          fetchServices().catch(() => null),
          fetchOperators({ serviceType }),
        ]);

        if (!isMounted) return;

        if (servicesResponse?.data?.data?.length) {
          const serverServices = servicesResponse.data.data.map((service) => {
            const localDefinition = getServiceDefinition(service.id);
            return localDefinition ? { ...localDefinition } : service;
          });
          setServices(serverServices);
        }

        setOperators(operatorsResponse.data.data || []);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoadingOperators(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const definition = getServiceDefinition(serviceType) || DEFAULT_SERVICE;
    setSelectedOperator(null);
    setOperators([]);
    setPlans([]);
    setSelectedPlan(null);
    setIdentifier('');
    setCustomAmount('');

    const loadOperators = async () => {
      setLoadingOperators(true);
      try {
        const response = await fetchOperators({ serviceType: definition.id });
        if (isMounted) {
          setOperators(response.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoadingOperators(false);
        }
      }
    };

    loadOperators();

    return () => {
      isMounted = false;
    };
  }, [serviceType]);

  useEffect(() => {
    const definition = getServiceDefinition(serviceType) || DEFAULT_SERVICE;
    const planRequired = definition?.planRequired;
    const isIdentifierValid = definition?.identifierPattern?.test(identifier.trim());

    if (!planRequired) {
      setPlans([]);
      setLoadingPlans(false);
      return;
    }

    if (!selectedOperator || !isIdentifierValid) {
      setPlans([]);
      setSelectedPlan(null);
      return;
    }

    let isMounted = true;
    setLoadingPlans(true);
    fetchOperatorPlans(selectedOperator.code, identifier.trim())
      .then((response) => {
        if (isMounted) {
          setPlans(response.data.data || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingPlans(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedOperator, serviceType, identifier]);

  const serviceDefinition = useMemo(
    () => getServiceDefinition(serviceType) || DEFAULT_SERVICE,
    [serviceType]
  );

  const isIdentifierValid = useMemo(() => {
    if (!identifier) return false;
    if (!serviceDefinition.identifierPattern) return true;
    return serviceDefinition.identifierPattern.test(identifier.trim());
  }, [identifier, serviceDefinition]);

  const summaryAmount = useMemo(() => {
    if (serviceDefinition.planRequired) {
      return selectedPlan?.amount || 0;
    }
    return customAmount ? Number(customAmount) : 0;
  }, [customAmount, selectedPlan, serviceDefinition.planRequired]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const planRequired = serviceDefinition.planRequired;

    if (!isIdentifierValid || !selectedOperator || (planRequired && !selectedPlan)) {
      setError('Please complete all fields with valid data.');
      return;
    }

    setSubmitting(true);
    try {
      const amountValue = planRequired ? Number(selectedPlan.amount) : Number(customAmount);

      if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      const payload = {
        serviceType: serviceDefinition.id,
        identifier: identifier.trim(),
        operator: {
          name: selectedOperator.name,
          code: selectedOperator.code,
        },
        plan: planRequired ? { id: selectedPlan.id } : undefined,
        amount: amountValue,
        paymentMethod,
      };

      const response = await initiateRechargeApi(payload);
      const { transactionId, status: initialStatus } = response.data.data;
      navigate(`/status/${transactionId}`, {
        state: {
          meta: {
            serviceType: serviceDefinition.id,
            identifier: identifier.trim(),
            operator: selectedOperator,
            plan: planRequired ? selectedPlan : null,
            paymentMethod,
            amount: amountValue,
            status: initialStatus,
          },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setServiceType(DEFAULT_SERVICE.id);
    setIdentifier('');
    setCustomAmount('');
    setSelectedOperator(null);
    setSelectedPlan(null);
    setPaymentMethod(paymentMethods[0]);
    setError(null);
  };

  return (
    <form className="card" onSubmit={handleSubmit} aria-label="Recharge form">
      <div className="card-header">
        <div>
          <h2 className="card-title">Recharge details</h2>
          <p className="muted">Pick a service, add account details, and confirm your recharge in seconds.</p>
        </div>
      </div>

      <div className="grid" style={{ gap: '1.25rem' }}>
        <div className="form-group">
          <label htmlFor="service">Service type</label>
          <div className="pill-group" role="radiogroup" aria-label="Select recharge service">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`pill-button${serviceType === service.id ? ' is-active' : ''}`}
                onClick={() => setServiceType(service.id)}
                role="radio"
                aria-checked={serviceType === service.id}
              >
                <span aria-hidden>{service.icon || '⭐'}</span>
                {service.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="identifier">{serviceDefinition.identifierLabel}</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            className="text-input"
            placeholder={serviceDefinition.identifierPlaceholder}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            aria-invalid={identifier ? !isIdentifierValid : false}
          />
          <p className="helper-text">{serviceDefinition.identifierHint}</p>
          {identifier && !isIdentifierValid ? (
            <p className="error-text">Enter a valid {serviceDefinition.identifierLabel.toLowerCase()}.</p>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="payment">Payment method</label>
          <div className="pill-group" role="group" aria-label="Select payment method">
            {paymentMethods.map((method) => (
              <button
                key={method}
                type="button"
                className={`pill-button${paymentMethod === method ? ' is-active' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="muted" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
            Select operator
          </label>
          {loadingOperators ? (
            <div className="grid grid--3col">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="operator-card skeleton" style={{ height: '160px' }} aria-hidden />
              ))}
            </div>
          ) : (
            <div className="operator-grid">
              {operators.map((operator) => (
                <OperatorCard
                  key={operator.code}
                  operator={operator}
                  isActive={selectedOperator?.code === operator.code}
                  onSelect={(value) => {
                    setSelectedOperator(value);
                    setSelectedPlan(null);
                  }}
                />
              ))}
            </div>
          )}
          {!selectedOperator && !loadingOperators ? (
            <p className="helper-text" style={{ marginTop: '0.75rem' }}>
              Choose your operator to unlock curated plans and offers.
            </p>
          ) : null}
          {selectedOperator && serviceDefinition.planRequired && !isIdentifierValid ? (
            <p className="error-text" style={{ marginTop: '0.75rem' }}>
              Enter valid account details to fetch plans for {selectedOperator.name}.
            </p>
          ) : null}
        </div>

        {serviceDefinition.planRequired ? (
          <div>
            <label className="muted" style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
              Select plan
            </label>
            <div style={{ position: 'relative' }}>
              {loadingPlans ? (
                <div className="grid grid--2col">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="plan-card skeleton" style={{ height: '180px' }} aria-hidden />
                  ))}
                </div>
              ) : plans.length ? (
                <div className="grid grid--2col">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      isActive={selectedPlan?.id === plan.id}
                      onSelect={setSelectedPlan}
                    />
                  ))}
                </div>
              ) : (
                <div className="alert alert--info">
                  {selectedOperator
                    ? 'No plans available for this operator at the moment.'
                    : 'Select an operator to view available plans.'}
                </div>
              )}
              {loadingPlans ? (
                <div className="loading-overlay" aria-hidden>
                  <div className="spinner" />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="amount">{serviceDefinition.amountLabel}</label>
            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              className="text-input"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              required
            />
            <p className="helper-text">Enter the amount you wish to pay for this service.</p>
          </div>
        )}
      </div>

      {summaryAmount > 0 ? (
        <div className="card" style={{ marginTop: '1.5rem', boxShadow: 'none', border: '1px solid var(--color-border)' }}>
          <div className="card-title" style={{ marginBottom: '0.75rem' }}>Recharge summary</div>
          <div className="details-list">
            <div className="details-item">
              <div className="details-item__label">Operator</div>
              <div className="details-item__value">{selectedOperator?.name || '—'}</div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Plan</div>
              <div className="details-item__value">
                {serviceDefinition.planRequired ? selectedPlan?.name : `${serviceDefinition.name} payment`}
              </div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Benefits</div>
              <div className="details-item__value" style={{ maxWidth: '360px', color: 'var(--color-muted)' }}>
                {serviceDefinition.planRequired
                  ? selectedPlan?.description || 'Recharge details will be shared after confirmation.'
                  : 'Recharge details will be shared after confirmation.'}
              </div>
            </div>
            <div className="details-item">
              <div className="details-item__label">Amount</div>
              <div className="details-item__value">{formatCurrency(summaryAmount)}</div>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="alert alert--danger" style={{ marginTop: '1.5rem' }} role="alert">
          {error}
        </div>
      ) : null}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          type="submit"
          className="primary-button"
          disabled={
            submitting ||
            !isIdentifierValid ||
            !selectedOperator ||
            (serviceDefinition.planRequired && !selectedPlan) ||
            (!serviceDefinition.planRequired && (!customAmount || Number(customAmount) <= 0))
          }
        >
          {submitting ? 'Processing…' : 'Recharge Now'}
        </button>
        <button type="button" className="ghost-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default RechargeForm;
