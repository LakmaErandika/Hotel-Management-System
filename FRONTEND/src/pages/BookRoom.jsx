import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function BookRoom() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(searchParams.get("checkIn") || "");
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get("checkOut") || "");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/room/get/${id}`)
      .then((res) => setRoom(res.data.room))
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api.post("/booking/add", {
      room: id,
      checkInDate,
      checkOutDate,
      adults: Number(adults),
      children: Number(children)
    })
      .then((res) => {
        navigate(`/payment/${res.data.booking._id}`);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Booking failed");
      });
  };

  if (!room) return <p className="empty-state">Loading room details...</p>;

  return (
    <div className="form-panel">
      <h2>Book Room {room.roomNumber}</h2>
      <p style={{ marginTop: "-8px" }}>{room.type} · Rs. {room.pricePerNight} / night</p>
      <p style={{ fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>
        Max occupancy: {room.maxOccupancy || 2} guests
      </p>

      <form onSubmit={handleSubmit}>
        <label>Check-in date</label>
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />

        <label>Check-out date</label>
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />

        <label>Adults</label>
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          required
        />

        <label>Children</label>
        <input
          type="number"
          min={0}
          value={children}
          onChange={(e) => setChildren(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}
        <button type="submit">Continue to payment</button>
      </form>
    </div>
  );
}

export default BookRoom;