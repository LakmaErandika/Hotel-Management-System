import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    api.get(`/room/get/${id}`)
      .then((res) => setRoom(res.data.room))
      .catch((err) => console.log(err));
  }, [id]);

  const handleBookClick = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates first.");
      return;
    }
    navigate(`/book/${id}?checkIn=${checkInDate}&checkOut=${checkOutDate}`);
  };

  if (!room) return <p className="page empty-state">Loading room details...</p>;

  return (
    <div className="page">
      <Link to="/" style={{ fontSize: "0.9rem", color: "var(--gold)" }}>← Back to all rooms</Link>

      <div className="room-details">
        <img src={room.imageUrl} alt={room.type} className="room-details-img" />

        <div className="room-details-body">
          <h1>Room {room.roomNumber} — {room.type}</h1>
          <p className="price" style={{ fontSize: "1.6rem" }}>
            Rs. {room.pricePerNight} <span style={{ fontSize: "1rem", color: "var(--charcoal-dim)" }}>/ night</span>
          </p>

          {room.description && <p>{room.description}</p>}

          {room.facilities?.length > 0 && (
            <div className="facility-badges" style={{ margin: "16px 0" }}>
              {room.facilities.map((f, i) => (
                <span className="badge" key={i}>{f}</span>
              ))}
            </div>
          )}

          {user && user.role === "guest" && (
            <div className="booking-panel">
              <h3>Check availability</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>Check-in</label>
                  <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>Check-out</label>
                  <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                </div>
              </div>
              <button onClick={handleBookClick}>Book This Room</button>
            </div>
          )}

          {!user && (
            <p className="empty-state">
              <Link to="/login" style={{ color: "var(--gold)" }}>Log in</Link> to book this room.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;