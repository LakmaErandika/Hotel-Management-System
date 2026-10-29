function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <span className="footer-brand">Ceylon Heights Hotel</span>
          <p>Comfort and hospitality, every stay.</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@ceylonheights.com</p>
          <p>+94 999998765</p>
        </div>
        <div className="footer-col">
          <h4>Hours</h4>
          <p>Check-in: 2:00 PM</p>
          <p>Check-out: 11:00 AM</p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Ceylon Heights Hotel. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;