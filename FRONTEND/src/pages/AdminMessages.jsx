import { useEffect, useState } from "react";
import api from "../services/api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    api.get("/contact")
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
            <p><strong>{m.name}</strong> ({m.email})</p>
            <p>{m.message}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--charcoal-dim)" }}>
              {new Date(m.createdAt).toLocaleString()} · {m.read ? "Read" : "Unread"}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
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