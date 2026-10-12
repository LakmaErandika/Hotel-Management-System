import { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";

function Home() {
  const [rooms, setRooms] = useState([]);

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
      <h1>All Rooms</h1>
      {rooms.length === 0 ? (
        <p>No rooms found</p>
      ) : (
        rooms.map((room) => (
          <RoomCard key={room._id} room={room} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}

export default Home;