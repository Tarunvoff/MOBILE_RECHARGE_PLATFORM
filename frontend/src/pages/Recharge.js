import RechargeForm from '../components/RechargeForm';

const Recharge = () => {
  return (
    <div className="recharge-page">
      <header className="section__header" style={{ alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-hero__title">Start a recharge</h1>
          <p className="dashboard-hero__subtitle" style={{ maxWidth: '540px' }}>
            Choose your service, select an operator, and complete your recharge in seconds with our streamlined flow.
          </p>
        </div>
      </header>

      <RechargeForm />
    </div>
  );
};

export default Recharge;
