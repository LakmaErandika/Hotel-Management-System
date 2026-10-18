import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
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
      checkOutDate
    })
      .then((res) => {
        navigate(`/payment/${res.data.booking._id}`);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Booking failed");
      });
  };

  if (!room) return <p>Loading room details...</p>;

  return (
    <div>
      <h1>Book Room {room.roomNumber}</h1>
      <p>Type: {room.type}</p>
      <p>Price per night: Rs. {room.pricePerNight}</p>

      <form onSubmit={handleSubmit}>
        <label>Check-in date:</label>
        <br />
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          required
        />
        <br />
        <label>Check-out date:</label>
        <br />
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
        />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

export default BookRoom;