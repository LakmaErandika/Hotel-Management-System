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
    <div>
      <h1>Available Rooms</h1>
      {rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        rooms.map((room) => (
          <div key={room._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <h3>Room {room.roomNumber}</h3>
            <p>Type: {room.type}</p>
            <p>Price per night: Rs. {room.pricePerNight}</p>
            <p>Available: {room.isAvailable ? "Yes" : "No"}</p>

            {user && user.role === "guest" && room.isAvailable && (
              <Link to={`/book/${room._id}`}>
                <button>Book Now</button>
              </Link>
            )}

            {user && user.role === "admin" && (
              <>
                <Link to={`/update-room/${room._id}`}>Edit</Link>
                {" | "}
                <button onClick={() => handleDelete(room._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
