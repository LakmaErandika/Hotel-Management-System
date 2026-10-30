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

  const today = new Date().toISOString().split("T")[0];
  const roomLabel = (n) => (/^room/i.test(String(n)) ? n : `Room ${n}`);
  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
return (
  <>
    <section
      className="hero"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800)" }}
    >
      <div className="hero-inner">
        <h1>Stay a short walk from Polhena Beach</h1>
        <p>Calm, reef-sheltered water for swimming, Matara's old Dutch Fort nearby, and a room for every budget.</p>
      </div>
    </section>

    <div className="search-wrap">
      <form className="search-card" onSubmit={handleSearch}>
        <div className="field">
          <label>Check-in</label>
          <input type="date" min={today} value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
        </div>
        <div className="field">
          <label>Check-out</label>
          <input type="date" min={checkInDate || today} value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
        </div>
        <button type="submit">Check availability</button>
        {searched && <button type="button" className="btn-secondary" onClick={clearSearch}>Clear</button>}
      </form>
    </div>

    <div className="page wide">
      <div className="section-head">
        <h2>{searched ? "Free for your dates" : "Our rooms"}</h2>
        <p>
          {searched
            ? `Rooms available from ${fmt(checkInDate)} to ${fmt(checkOutDate)}.`
            : "Choose your dates above to see what's free, or browse every room below."}
        </p>
      </div>

      {rooms.length === 0 ? (
        <p className="empty-state">
          {searched ? "No rooms are free on those dates. Try a different range." : "No rooms have been added yet."}
        </p>
      ) : (
        <div className="room-list">
          {rooms.map((room) => (
            <div className="room-row" key={room._id}>
              <Link
                to={`/room/${room._id}`}
                className="room-photo-wrap"
                style={{ backgroundImage: `url(${room.imageUrl})` }}
              >
                <img src={room.imageUrl} alt={room.type} className="room-photo" />
              </Link>

              <div className="room-body">
                <p className="room-number">{roomLabel(room.roomNumber)}</p>
                <h3 className="room-title">
                  <Link to={`/room/${room._id}`}>{room.type}</Link>
                </h3>
                {room.description && <p className="room-desc">{room.description}</p>}

                <div className="facility-badges">
                  {room.facilities?.slice(0, 4).map((f, i) => (
                    <span className="badge small" key={i}>{f}</span>
                  ))}
                  {room.facilities?.length > 4 && (
                    <span className="badge small more">+{room.facilities.length - 4} more</span>
                  )}
                  <span className="badge small">Sleeps {room.maxOccupancy || 2}</span>
                </div>

                <div className="room-foot">
                  <div className="room-price">
                    Rs. {Number(room.pricePerNight).toLocaleString()}<small>per night</small>
                  </div>
                  <div className="room-actions">
                    <Link to={`/room/${room._id}`}><button>View details</button></Link>
                  </div>
                </div>

                {user && user.role === "admin" && (
                  <div className="admin-tools">
                    <button className="btn-secondary btn-sm" onClick={() => moveRoom(room._id, "up")}>Move up</button>
                    <button className="btn-secondary btn-sm" onClick={() => moveRoom(room._id, "down")}>Move down</button>
                    <Link to={`/update-room/${room._id}`}><button className="btn-secondary btn-sm">Edit</button></Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(room._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);
 
}

export default Home;