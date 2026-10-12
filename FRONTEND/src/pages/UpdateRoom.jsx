import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UpdateRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    api.get(`/room/get/${id}`)
      .then((res) => {
        const room = res.data.room;
        setRoomNumber(room.roomNumber);
        setType(room.type);
        setPricePerNight(room.pricePerNight);
        setIsAvailable(room.isAvailable);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/room/update/${id}`, {
      roomNumber,
      type,
      pricePerNight: Number(pricePerNight),
      isAvailable
    })
      .then(() => {
        alert("Room updated");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Update Room</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
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
        <button type="submit">Update Room</button>
      </form>
    </div>
  );
}

export default UpdateRoom;