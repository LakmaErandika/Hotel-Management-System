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
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_INFO);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [myMessages, setMyMessages] = useState([]);

  const fetchMyMessages = () => {
    if (user?.role === "guest") {
      api.get("/contact/my-messages")
        .then((res) => setMyMessages(res.data))
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    api.get("/content/contactInfo")
      .then((res) => {
        if (res.data) {
          setInfo(res.data);
          setDraft(res.data);
        }
      })
      .catch((err) => console.log(err));
    fetchMyMessages();
  }, []);

  const handleSaveInfo = () => {
    api.put("/content/contactInfo", draft)
      .then(() => {
        setInfo(draft);
        setEditing(false);
      })
      .catch((err) => alert(err.response?.data?.error || "Error saving contact details"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    api.post("/contact/add", { name, email, message })
      .then(() => {
        setSent(true);
        setMessage("");
        fetchMyMessages();
      })
      .catch((err) => alert(err.response?.data?.error || "Error sending message"));
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <div className="contact-grid">
        <div>
          <h3>Get in touch</h3>

          {editing ? (
            <div>
              <input type="text" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} placeholder="Address" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input type="text" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input type="text" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input type="text" value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} placeholder="Opening hours" style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <button onClick={handleSaveInfo}>Save</button>{" "}
              <button className="btn-secondary" onClick={() => { setDraft(info); setEditing(false); }}>Cancel</button>
            </div>
          ) : (
            <>
              <p>{info.address}</p>
              <p>Phone: {info.phone}</p>
              <p>Email: {info.email}</p>
              <p>{info.hours}</p>
            </>
          )}

          {user?.role === "admin" && !editing && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
              <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Contact Details</button>
              <Link to="/admin/messages"><button className="btn-secondary">View Guest Messages</button></Link>
            </div>
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
            {!user && (
              <p style={{ fontSize: "0.85rem" }}>
                <Link to="/login" style={{ color: "var(--gold)" }}>Log in</Link> before sending to see our reply here.
              </p>
            )}
            <button type="submit">Send Message</button>
          </form>
        )}
      </div>

      {user?.role === "guest" && myMessages.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>Your Messages</h2>
          {myMessages.map((m) => (
            <div className="booking-card" key={m._id}>
              <p><strong>You:</strong> {m.message}</p>
              {m.reply ? (
                <p style={{ color: "var(--teal-900)" }}>
                  <strong>Hotel reply:</strong> {m.reply}
                </p>
              ) : (
                <p style={{ fontStyle: "italic" }}>Awaiting reply...</p>
              )}
              <p style={{ fontSize: "0.8rem", color: "var(--charcoal-dim)" }}>
                Sent {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Contact;