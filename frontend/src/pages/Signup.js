import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup as signupRequest } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.email.trim() || !form.mobileNumber.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      await signupRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        password: form.password,
      });
      setSuccess('Account created successfully. Please log in to continue.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <span className="landing__logo" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            ⚡ RechargeX
          </span>
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Unlock personalized recharges, curated plans, and lightning-fast checkouts.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="e.g. Tarun Verma"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-mobile">Mobile Number</label>
            <input
              id="signup-mobile"
              name="mobileNumber"
              type="tel"
              placeholder="Enter mobile number"
              autoComplete="tel"
              value={form.mobileNumber}
              onChange={handleChange}
              pattern="[6-9]\d{9}"
              required
            />
          </div>
          <div>
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Enter email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Create password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {error ? (
            <div className="alert alert--danger" role="alert">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="alert alert--success" role="status">
              {success}
            </div>
          ) : null}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <footer className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" aria-label="Sign in to RechargeX">
            Login
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
