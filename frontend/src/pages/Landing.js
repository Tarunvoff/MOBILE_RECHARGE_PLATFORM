import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LANDING_OPERATORS } from '../constants/operatorLogos';

const heroImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80',
];

const services = [
  {
    icon: '📱',
    title: 'Mobile Recharge',
    description: 'Instant prepaid recharges for all major operators with exclusive plans.',
  },
  {
    icon: '📺',
    title: 'DTH Recharge',
    description: 'Keep your entertainment alive with seamless DTH top-ups.',
  },
  {
    icon: '🧾',
    title: 'Bill Payments',
    description: 'Pay electricity, water, broadband bills in one secure platform.',
  },
  {
    icon: '📶',
    title: 'Data Packs',
    description: 'Boost your mobile data with add-on packs from top providers.',
  },
];

const Landing = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="landing">
    <section className="landing__hero-new">
      <div className="landing__hero-bg">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`landing__hero-bg-image ${
              index === currentImageIndex ? 'active' : ''
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="landing__hero-overlay" />
      </div>
      <div className="landing__hero-content-new">
        <div className="landing__logo-new">⚡ RechargeX</div>
        <h1 className="landing__headline-new">
          One Platform for All Your Recharge &amp; Bill Payments
        </h1>
        <p className="landing__subtext-new">
          Fast, secure and seamless recharges across operators
        </p>
        <div className="landing__cta-group-new">
          <Link to="/login" className="btn-landing btn-landing-primary">
            Login
          </Link>
          <Link to="/signup" className="btn-landing btn-landing-outline">
            Sign Up
          </Link>
        </div>
      </div>
    </section>

    <section className="landing__services">
      <div className="landing__section-header">
        <h2 className="landing__section-title">Our Services</h2>
        <p className="landing__section-subtitle">
          Everything you need for recharges and bill payments in one place
        </p>
      </div>
      <div className="landing__services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card-new">
            <div className="service-card-new__icon-wrapper">
              <div className="service-card-new__icon">{service.icon}</div>
            </div>
            <h3 className="service-card-new__title">{service.title}</h3>
            <p className="service-card-new__description">{service.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="landing__operators">
      <div className="landing__section-header">
        <h2 className="landing__section-title">Supported Operators</h2>
        <p className="landing__section-subtitle">
          Trusted by millions across India's leading service providers
        </p>
      </div>
      <div className="landing__operators-grid">
        {LANDING_OPERATORS.map((operator) => (
          <div key={operator.name} className="operator-card-new">
            <img
              src={operator.logo}
              alt={operator.name}
              className="operator-card-new__logo"
            />
          </div>
        ))}
      </div>
    </section>

    <section className="landing__parallax">
      <div className="landing__parallax-bg" />
      <div className="landing__parallax-content">
        <h2 className="landing__parallax-title">Recharge smarter. Pay faster.</h2>
        <p className="landing__parallax-subtitle">
          Join thousands of users who trust RechargeX for their daily transactions
        </p>
      </div>
    </section>

    <footer className="landing__footer">
      <div className="landing__footer-links">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="landing__footer-copy">© {new Date().getFullYear()} RechargeX. All rights reserved.</div>
    </footer>
  </div>
  );
};

export default Landing;
