import classNames from 'classnames';
import { formatCurrency } from '../utils/helpers';

const PlanCard = ({ plan, isActive, onSelect }) => (
  <button
    type="button"
    className={classNames('plan-card', { 'is-active': isActive })}
    onClick={() => onSelect(plan)}
    aria-pressed={isActive}
  >
    <div className="plan-card__price">{formatCurrency(plan.amount)}</div>
    <div className="plan-card__meta">
      <span>{plan.validity}</span>
      <span>{plan.data}</span>
      <span>{plan.type}</span>
    </div>
    <p className="plan-card__description">{plan.description}</p>
    {plan.benefits?.length ? (
      <div className="chips">
        {plan.benefits.map((benefit) => (
          <span key={benefit} className="chip">
            {benefit}
          </span>
        ))}
      </div>
    ) : null}
  </button>
);

export default PlanCard;
