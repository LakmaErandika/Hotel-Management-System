import { Link } from "react-router-dom";

function RoomCard({ room, onDelete }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>Room {room.roomNumber}</h3>
      <p>Type: {room.type}</p>
      <p>Price per night: Rs. {room.pricePerNight}</p>
      <p>Available: {room.isAvailable ? "Yes" : "No"}</p>
      <Link to={`/update-room/${room._id}`}>Edit</Link>
      {" | "}
      <button onClick={() => onDelete(room._id)}>Delete</button>
    </div>
  );
}

export default RoomCard;