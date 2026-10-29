import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submit — no backend endpoint; this is a demo contact form
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <div className="contact-grid">
        <div>
          <h3>Get in touch</h3>
          <p>Ceylon Heights Hotel<br />Polhena, Matara, Sri Lanka</p>
          <p>Phone: +94 999998765</p>
          <p>Email: support@ceylonheights.com</p>
          <p>Front desk: 24 hours</p>
        </div>

        <form className="form-panel" style={{ margin: 0 }} onSubmit={handleSubmit}>
          <h3>Send a message</h3>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            style={{ width: "100%", padding: "11px 14px", marginBottom: "14px", border: "1px solid var(--border)", background: "var(--ivory-dim)", fontFamily: "inherit" }}
          />
          {sent && <p style={{ color: "var(--sage)" }}>Thank you — we'll get back to you soon.</p>}
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;