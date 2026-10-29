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
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api.post("/room/add", {
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      isAvailable,
      description,
      facilities: facilities.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl: imageUrl || undefined,
      maxOccupancy: Number(maxOccupancy)
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
        <input
  type="number"
  placeholder="Max occupancy (guests)"
  min={1}
  value={maxOccupancy}
  onChange={(e) => setMaxOccupancy(e.target.value)}
  required
/>

        <textarea
  placeholder="Room description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={3}
  style={{ width: "100%", padding: "11px 14px", marginBottom: "14px", border: "1px solid var(--border)", background: "var(--ivory-dim)", fontFamily: "inherit" }}
/>
<input
  type="text"
  placeholder="Facilities, comma separated (e.g. WiFi, Sea View, AC)"
  value={facilities}
  onChange={(e) => setFacilities(e.target.value)}
/>
<input
  type="text"
  placeholder="Image URL"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
/>
        {error && <p className="form-error">{error}</p>}
        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;