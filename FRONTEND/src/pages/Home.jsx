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

  const moveRoom = (roomId, direction) => {
  api.put("/room/reorder", { roomId, direction })
    .then(() => fetchAllRooms())
    .catch((err) => alert(err.response?.data?.error || "Cannot move room"));
};


   const fetchReviews = () => {
     api.get("/review")
       .then((res) => setReviews(res.data))
       .catch((err) => console.log(err));
   };

   useEffect(() => {
    fetchReviews();
   }, []);

  

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
    <div className="hotel-intro">
  <img
    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"
    alt="Ceylon Heights Hotel"
    className="hero-image"
  />
  <div className="hotel-intro-text">
    <p>
      Set on the southern coast of Sri Lanka, steps from Polhena Beach in Matara.
      Ceylon Heights Hotel offers calm, reef-sheltered waters, warm hospitality,
      and easy access to Matara's historic Dutch Fort and local seafood restaurants.
    </p>
  </div>
</div>

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
  <Link to={`/room/${room._id}`}>
    <img src={room.imageUrl} alt={room.type} className="room-photo" />
  </Link>
  <div className="room-body">
    <div>
      <Link to={`/room/${room._id}`} style={{ textDecoration: "none" }}>
        <h3 style={{ margin: "0 0 4px", color: "var(--teal-900)" }}>Room {room.roomNumber} — {room.type}</h3>
      </Link>
      {room.description && <p style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>{room.description}</p>}
      {room.facilities?.length > 0 && (
        <div className="facility-badges" style={{ marginBottom: "8px" }}>
          {room.facilities.map((f, i) => (
            <span className="badge small" key={i}>{f}</span>
          ))}
        </div>
      )}
      <div className="price">Rs. {room.pricePerNight} <span style={{ fontSize: "0.9rem", color: "var(--charcoal-dim)" }}>/ night</span></div>
    </div>
    <div className="actions">
  <Link to={`/room/${room._id}`}>
    <button className="btn-secondary">View Details</button>
  </Link>

  {user && user.role === "admin" && (
    <>
      <button className="btn-secondary" onClick={() => moveRoom(room._id, "up")}>↑</button>
      <button className="btn-secondary" onClick={() => moveRoom(room._id, "down")}>↓</button>
      <Link to={`/update-room/${room._id}`}>
        <button className="btn-secondary">Edit</button>
      </Link>
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