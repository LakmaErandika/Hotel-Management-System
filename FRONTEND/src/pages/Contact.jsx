import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_INFO = {
  address: "Ceylon Heights Hotel, Polhena, Matara, Sri Lanka",
  phone: "+94 999998765",
  email: "support@ceylonheights.com",
  hours: "Front desk: 24 hours"
};

function Contact() {
  const { user } = useAuth();
  const [info, setInfo] = useState(DEFAULT_INFO);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get("/content/contactInfo")
      .then((res) => {
        if (res.data) setInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/contact/add", { name, email, message })
      .then(() => {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((err) => alert(err.response?.data?.error || "Error sending message"));
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <div className="contact-grid">
        <div>
          <h3>Get in touch</h3>
          <p>{info.address}</p>
          <p>Phone: {info.phone}</p>
          <p>Email: {info.email}</p>
          <p>{info.hours}</p>

          {user?.role === "admin" && (
            <Link to="/admin/messages"><button className="btn-secondary">View Guest Messages</button></Link>
          )}
        </div>

        {user?.role !== "admin" && (
          <form className="form-panel" style={{ margin: 0 }} onSubmit={handleSubmit}>
            <h3>Send a message</h3>
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
        )}
      </div>
    </div>
  );
}

export default Contact;