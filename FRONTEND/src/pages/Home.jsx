import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [rooms, setRooms] = useState([]);
  const { user } = useAuth();

  const fetchRooms = () => {
    api.get("/room")
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = (id) => {
    api.delete(`/room/delete/${id}`)
      .then(() => fetchRooms())
      .catch((err) => console.log(err));
  };

  return (
    <div className="page">
      <h1>Available Rooms</h1>
      {rooms.length === 0 ? (
        <p className="empty-state">No rooms found.</p>
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
                <div className={`avail ${room.isAvailable ? "" : "full"}`}>
                  {room.isAvailable ? "Available" : "Fully booked"}
                </div>
              </div>
              <div className="actions">
                {user && user.role === "guest" && room.isAvailable && (
                  <Link to={`/book/${room._id}`}><button>Book Now</button></Link>
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