import { useEffect, useState } from "react";
import api from "../services/api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});

  const fetchMessages = () => {
    api.get("/contact")
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = (id) => {
    api.put(`/contact/reply/${id}`, { reply: replyDrafts[id] || "" })
      .then(() => {
        setReplyDrafts({ ...replyDrafts, [id]: "" });
        fetchMessages();
      })
      .catch((err) => alert(err.response?.data?.error || "Error sending reply"));
  };

  const markRead = (id) => {
    api.put(`/contact/read/${id}`)
      .then(() => fetchMessages())
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    api.delete(`/contact/delete/${id}`)
      .then(() => fetchMessages())
      .catch((err) => console.log(err));
  };

  return (
    <div className="page">
      <h1>Guest Messages</h1>
      {messages.length === 0 ? (
        <p className="empty-state">No messages yet.</p>
      ) : (
        messages.map((m) => (
          <div className="booking-card" key={m._id}>
            <p><strong>{m.name}</strong> ({m.email}) {m.guest ? "· registered guest" : "· visitor"}</p>
            <p>{m.message}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--charcoal-dim)" }}>
              {new Date(m.createdAt).toLocaleString()} · {m.read ? "Read" : "Unread"}
            </p>

            {m.reply && (
              <p style={{ color: "var(--sage)" }}>
                <strong>Your reply:</strong> {m.reply}
              </p>
            )}

            <textarea
              placeholder={m.reply ? "Write a new reply..." : "Write a reply..."}
              value={replyDrafts[m._id] || ""}
              onChange={(e) => setReplyDrafts({ ...replyDrafts, [m._id]: e.target.value })}
              rows={2}
              style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid var(--border)", background: "var(--ivory-dim)", fontFamily: "inherit" }}
            />

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => handleReply(m._id)}>{m.reply ? "Update Reply" : "Send Reply"}</button>
              {!m.guest && (
                <a href={`mailto:${m.email}?subject=Re: Your message to Ceylon Heights Hotel`}>
                  <button className="btn-secondary" type="button">Reply by email</button>
                </a>
              )}
              {!m.read && <button className="btn-secondary" onClick={() => markRead(m._id)}>Mark Read</button>}
              <button className="btn-danger" onClick={() => handleDelete(m._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminMessages;