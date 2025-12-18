const Footer = () => (
  <footer className="footer">
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
      <div>© {new Date().getFullYear()} Recharge Studio. Built for portfolio demonstrations.</div>
      <div>Made with the MERN stack • Simulation only</div>
    </div>
  </footer>
);

export default Footer;
