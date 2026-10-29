import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddRoom() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

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
      .catch((err) => {
        setError(err.response?.data?.error || "Error adding room");
      });
  };

  return (
    <div className="form-panel">
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type (e.g. Deluxe)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price per night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          required
        />
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            style={{ width: "auto" }}
          />
          Available
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;