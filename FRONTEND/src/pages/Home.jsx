import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();

  const fetchAllRooms = () => {
    api.get("/room")
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const handleDelete = (id) => {
    api.delete(`/room/delete/${id}`)
      .then(() => fetchAllRooms())
      .catch((err) => console.log(err));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    api.get(`/room/search?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`)
      .then((res) => {
        setRooms(res.data);
        setSearched(true);
      })
      .catch((err) => console.log(err));
  };

  const clearSearch = () => {
    setSearched(false);
    setCheckInDate("");
    setCheckOutDate("");
    fetchAllRooms();
  };

  return (
    <div className="page">
      <h1>{searched ? "Available Rooms for Your Dates" : "All Rooms"}</h1>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>Check-in</label>
          <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>Check-out</label>
          <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
        </div>
        <button type="submit">Check Availability</button>
        {searched && <button type="button" className="btn-secondary" onClick={clearSearch}>Clear</button>}
      </form>

      {rooms.length === 0 ? (
        <p className="empty-state">No rooms available for these dates.</p>
      ) : (
        rooms.map((room) => (
          <div className="room-row" key={room._id}>
            <div className="room-mark">
              <span className="num">{room.roomNumber}</span>
              <span className="type">{room.type}</span>
            </div>
            <div className="room-body">
              <div>
                <div className="price">Rs. {room.pricePerNight} <span style={{ fontSize: "0.9rem", color: "var(--charcoal-dim)" }}>/ night</span></div>
                <div className="avail">
                  {searched ? "Available for selected dates" : "Open for booking"}
                </div>
              </div>
              <div className="actions">
                {user && user.role === "guest" && searched && (
                  <Link to={`/book/${room._id}?checkIn=${checkInDate}&checkOut=${checkOutDate}`}>
                    <button>Book Now</button>
                  </Link>
                )}
                {user && user.role === "guest" && !searched && (
                  <span style={{ fontSize: "0.85rem", color: "var(--charcoal-dim)" }}>Select dates to book</span>
                )}
                {user && user.role === "admin" && (
                  <>
                    <Link to={`/update-room/${room._id}`}><button className="btn-secondary">Edit</button></Link>
                    <button className="btn-danger" onClick={() => handleDelete(room._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;