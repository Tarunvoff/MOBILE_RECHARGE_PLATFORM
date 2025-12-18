import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startSession } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your registered email/mobile and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await loginRequest({ identifier: identifier.trim(), password });
      const { token, user } = response.data.data;
      startSession(token, user);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
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
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Fast, secure access to your premium recharge dashboard.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-identifier">Mobile Number / Email</label>
            <input
              id="login-identifier"
              type="text"
              placeholder="Enter registered mobile or email"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="alert alert--danger" role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <footer className="auth-card__footer">
          New user?{' '}
          <Link to="/signup" aria-label="Create a RechargeX account">
            Sign up
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default Login;
