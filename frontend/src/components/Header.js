import { NavLink, Link } from 'react-router-dom';

const Header = () => (
  <header className="app-header">
    <div className="container app-header__inner">
      <Link to="/" className="brand" aria-label="Recharge Home">
        <span className="brand__mark">₹</span>
        <div>
          <div className="brand__title">Recharge Studio</div>
          <div className="tagline">Smart mobile recharges, simulated flawlessly</div>
        </div>
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          History
        </NavLink>
      </nav>

      <Link to="/" className="cta-button">
        Start Recharge
      </Link>
    </div>
  </header>
);

export default Header;
