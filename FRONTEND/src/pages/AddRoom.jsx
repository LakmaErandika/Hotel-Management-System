import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddRoom() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/room/add", {
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      isAvailable
    })
      .then(() => {
        alert("Room added");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Add Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Type (e.g. Deluxe)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Price per night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
        <br />
        <label>
          Available:
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;