import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recharge', label: 'Recharge' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-shell">
      <header className="dashboard-shell__nav">
        <span className="dashboard-shell__brand">⚡ RechargeX</span>

        <nav className="dashboard-shell__links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `dashboard-shell__link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-shell__user">
          <div className="dashboard-shell__avatar" aria-hidden>
            {initials || 'RX'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'RechargeX User'}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{user?.email}</div>
          </div>
          <button
            type="button"
            className="dashboard-shell__logout"
            aria-label="Log out"
            onClick={() => {
              logout({ redirect: false });
              navigate('/login', { replace: true });
            }}
          >
            ⎋
          </button>
        </div>
      </header>

      <main className="dashboard-shell__content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
