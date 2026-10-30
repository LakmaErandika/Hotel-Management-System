import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState(2);
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/room/get/${id}`)
      .then((res) => {
        const room = res.data.room;
        setRoomNumber(room.roomNumber || "");
        setType(room.type || "");
        setPricePerNight(room.pricePerNight || "");
        setMaxOccupancy(room.maxOccupancy || 2);
        setDescription(room.description || "");
        setFacilities((room.facilities || []).join(", "));
        setImageUrl(room.imageUrl || "");
        setIsAvailable(room.isAvailable);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    api.put(`/room/update/${id}`, {
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      maxOccupancy: Number(maxOccupancy),
      description,
      facilities: facilities.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl,
      isAvailable
    })
      .then(() => {
        alert("Room updated");
        navigate("/");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error updating room");
      });
  };

  return (
    <div className="form-panel">
      <h2>Update Room</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
        <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} required />
        <input type="number" placeholder="Price per night" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required />
        <input type="number" min={1} placeholder="Max occupancy" value={maxOccupancy} onChange={(e) => setMaxOccupancy(e.target.value)} required />
        <textarea
          placeholder="Room description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "11px 14px", marginBottom: "14px", border: "1px solid var(--border)", background: "var(--ivory-dim)", fontFamily: "inherit" }}
        />
        <input type="text" placeholder="Facilities, comma separated" value={facilities} onChange={(e) => setFacilities(e.target.value)} />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} style={{ width: "auto" }} />
          Available
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit">Update Room</button>
      </form>
    </div>
  );
}

export default UpdateRoom;