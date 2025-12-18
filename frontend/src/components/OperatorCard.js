const OperatorCard = ({ operator, isActive, onSelect }) => (
  <button
    type="button"
    className={`operator-card${isActive ? ' is-active' : ''}`}
    onClick={() => onSelect(operator)}
    aria-pressed={isActive}
  >
    <div className="operator-card__logo" aria-hidden>
      <img src={operator.logo} alt={`${operator.name} logo`} loading="lazy" />
    </div>
    <div>
      <div className="operator-card__name">{operator.name}</div>
      <div className="muted">Code: {operator.code}</div>
    </div>
  </button>
);

export default OperatorCard;
